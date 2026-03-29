// ============================================================
//  SERVICE WORKER — أذكار PWA v6
//  ✅ Full PWA support: background sync, audio, offline cache
//
//  Audio strategy in PWA (installed on homescreen):
//  - PWA mode = browser treats it like a native app
//  - When user taps notification → app opens as standalone window
//  - That window load triggers autoplay with user-gesture context
//  - Audio IS allowed in this context
//
//  Reliability layers:
//  1. IndexedDB        — schedule persists across SW restarts
//  2. Periodic Sync    — OS wakes SW every ~15min (Android Chrome/Edge)
//  3. Self-heal timers — 12min reschedule loop inside SW
//  4. Missed-prayer    — catch prayers fired while SW was asleep
//  5. Deduplication    — never fire same prayer twice
//  6. Offline cache    — full app works without internet (PWA)
// ============================================================

const SW_VERSION = 'azkar-pwa-v6';
const DB_NAME    = 'azkar-sw-db';
const DB_VERSION = 2;
const STORE      = 'schedule';

const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/prayer-times.html',
  '/azkar-salah.html',
  '/azkar-food.html',
  '/azkar-sleep.html',
  '/azkar-home.html',
  '/azkar-daily.html',
  '/azkar-children.html',
  '/azkar-travel.html',
  '/azkar-sick.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/assets/Background/Azkar-Icon.png'
];

const AR = { fajr: 'الفجر', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' };
const IC = { fajr: '🌅',    dhuhr: '🌤️',    asr: '🌇',    maghrib: '🌆',     isha: '🌙'    };

// ── Install ───────────────────────────────────────────────
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(SW_VERSION).then(function (cache) {
      return Promise.allSettled(
        CACHE_ASSETS.map(function (url) { return cache.add(url); })
      );
    }).then(function () { return self.skipWaiting(); })
  );
});

// ── Activate ──────────────────────────────────────────────
self.addEventListener('activate', function (e) {
  e.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(function (keys) {
        return Promise.all(
          keys.filter(function (k) { return k !== SW_VERSION; })
              .map(function (k) { return caches.delete(k); })
        );
      })
    ]).then(function () { return restoreAndSchedule(); })
  );
});

// ════════════════════════════════════════════════════════════
//  IndexedDB helpers
// ════════════════════════════════════════════════════════════
function openDB() {
  return new Promise(function (resolve, reject) {
    var req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = function (e) {
      var db = e.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = function (e) { resolve(e.target.result); };
    req.onerror   = function ()  { reject(req.error); };
  });
}

function dbPut(record) {
  return openDB().then(function (db) {
    return new Promise(function (resolve, reject) {
      var tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(record);
      tx.oncomplete = resolve;
      tx.onerror    = function () { reject(tx.error); };
    });
  });
}

function dbGet(id) {
  return openDB().then(function (db) {
    return new Promise(function (resolve, reject) {
      var req = db.transaction(STORE, 'readonly').objectStore(STORE).get(id);
      req.onsuccess = function () { resolve(req.result || null); };
      req.onerror   = function () { reject(req.error); };
    });
  });
}

function saveSchedule(payload) {
  return dbPut({ id: 'current', payload: payload, savedAt: Date.now() });
}
function loadSchedule() {
  return dbGet('current').then(function (rec) { return rec ? rec.payload : null; });
}
function saveLastFired(key, ms) {
  return dbPut({ id: 'lastFired', key: key, ms: ms, firedAt: Date.now() });
}
function loadLastFired() {
  return dbGet('lastFired').then(function (rec) { return rec || { key: null, ms: 0 }; });
}

// ════════════════════════════════════════════════════════════
//  Timer management — only schedule ≤ 25min alarms
// ════════════════════════════════════════════════════════════
var _timers             = [];
var _rescheduleTimer    = null;
var IMMEDIATE_WINDOW_MS = 25 * 60 * 1000;
var RESCHEDULE_INTERVAL = 12 * 60 * 1000;

function clearAllTimers() {
  _timers.forEach(function (id) { clearTimeout(id); });
  _timers = [];
  if (_rescheduleTimer) { clearTimeout(_rescheduleTimer); _rescheduleTimer = null; }
}

function schedulePrayerAlarms(payload) {
  if (!payload || !payload.prayers || !payload.prayers.length) return;
  var now = Date.now();

  payload.prayers.forEach(function (prayer) {
    var diff = prayer.ms - now;
    if (diff > 0 && diff <= IMMEDIATE_WINDOW_MS) {
      _timers.push(setTimeout(function () {
        checkAndFire(prayer.key, prayer.ms, payload.govName);
      }, diff + 3000));
    }
  });

  _rescheduleTimer = setTimeout(function () {
    loadSchedule().then(function (stored) {
      if (!stored) return;
      clearAllTimers();
      schedulePrayerAlarms(stored);
    }).catch(function () {});
  }, RESCHEDULE_INTERVAL);
}

function checkAndFire(prayerKey, prayerMs, govName) {
  loadLastFired().then(function (last) {
    if (last.key === prayerKey && Math.abs(last.ms - prayerMs) < 5 * 60 * 1000) return;
    return saveLastFired(prayerKey, prayerMs)
      .then(function () { return firePrayerNotification(prayerKey, govName); });
  }).catch(function () { firePrayerNotification(prayerKey, govName); });
}

function restoreAndSchedule() {
  return loadSchedule().then(function (stored) {
    if (!stored || !stored.prayers || !stored.prayers.length) return;
    clearAllTimers();
    schedulePrayerAlarms(stored);
  }).catch(function () {});
}

// ════════════════════════════════════════════════════════════
//  Messages from page
// ════════════════════════════════════════════════════════════
self.addEventListener('message', function (e) {
  if (!e || !e.data) return;
  switch (e.data.type) {
    case 'SCHEDULE_PRAYERS':
      var p = e.data.payload; if (!p) return;
      saveSchedule(p).catch(function () {});
      clearAllTimers();
      schedulePrayerAlarms(p);
      if (e.source) e.source.postMessage({ type: 'SCHEDULE_ACK', count: (p.prayers || []).length, version: SW_VERSION });
      break;
    case 'CANCEL_NOTIFICATIONS':
      clearAllTimers();
      saveSchedule({ prayers: [], govName: '' }).catch(function () {});
      break;
    case 'PING':
      restoreAndSchedule();
      if (e.source) e.source.postMessage({ type: 'PONG', swActive: true, version: SW_VERSION });
      break;
    case 'GET_STATUS':
      loadSchedule().then(function (stored) {
        var pending = stored && stored.prayers ? stored.prayers.filter(function (p) { return p.ms > Date.now(); }).length : 0;
        if (e.source) e.source.postMessage({ type: 'STATUS', version: SW_VERSION, pending: pending });
      });
      break;
    case 'CACHE_URLS':
      if (e.data.urls) {
        caches.open(SW_VERSION).then(function (cache) {
          e.data.urls.forEach(function (url) {
            fetch(url).then(function (resp) { if (resp && resp.status === 200) cache.put(url, resp); }).catch(function () {});
          });
        });
      }
      break;
  }
});

// ════════════════════════════════════════════════════════════
//  Fire notification
// ════════════════════════════════════════════════════════════
function firePrayerNotification(prayerKey, govName) {
  var icon   = IC[prayerKey] || '🕌';
  var arName = AR[prayerKey] || prayerKey;
  var title  = icon + ' حان الآن موعد أذان ' + arName;
  var body   = 'أذكر الله واحرص على الصلاة في وقتها' + (govName ? '\n📍 ' + govName : '');

  return self.registration.showNotification(title, {
    body: body,
    icon: '/assets/Background/Azkar-Icon.png',
    badge: '/assets/Background/Azkar-Icon.png',
    tag: 'prayer-' + prayerKey,
    renotify: true,
    requireInteraction: true,
    vibrate: [400, 150, 400, 150, 600],
    dir: 'rtl', lang: 'ar',
    timestamp: Date.now(),
    silent: false,
    data: { prayerKey: prayerKey, url: '/prayer-times.html', govName: govName },
    actions: [
      { action: 'open',    title: '🔊 فتح الأذكار والأذان' },
      { action: 'dismiss', title: '✕ إغلاق' }
    ]
  }).then(function () {
    return self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(function (clients) {
      clients.forEach(function (c) {
        c.postMessage({ type: 'PLAY_AZAN', prayerKey: prayerKey });
        c.postMessage({ type: 'REFRESH_SCHEDULE' });
      });
    });
  }).catch(function (err) { console.warn('[SW] notification failed:', err); });
}

// ════════════════════════════════════════════════════════════
//  Notification click — open PWA window → audio plays
// ════════════════════════════════════════════════════════════
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  if (e.action === 'dismiss') return;

  var prayerKey = e.notification.data && e.notification.data.prayerKey;
  var targetUrl = '/prayer-times.html';

  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clients) {
      // Focus existing prayer-times window first
      for (var i = 0; i < clients.length; i++) {
        if (clients[i].url.includes('prayer-times') && 'focus' in clients[i]) {
          return clients[i].focus().then(function (win) {
            if (prayerKey) win.postMessage({ type: 'PLAY_AZAN', prayerKey: prayerKey, fromNotification: true });
            return win;
          });
        }
      }
      // Focus any open window
      for (var j = 0; j < clients.length; j++) {
        if ('focus' in clients[j]) {
          return clients[j].navigate(targetUrl).then(function (win) {
            if (win && prayerKey) setTimeout(function () {
              win.postMessage({ type: 'PLAY_AZAN', prayerKey: prayerKey, fromNotification: true });
            }, 1500);
            return win;
          }).catch(function () { return clients[j].focus(); });
        }
      }
      // Open new PWA standalone window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl).then(function (win) {
          if (win && prayerKey) setTimeout(function () {
            win.postMessage({ type: 'PLAY_AZAN', prayerKey: prayerKey, fromNotification: true });
          }, 2000);
        });
      }
    })
  );
});

// ════════════════════════════════════════════════════════════
//  Periodic Background Sync — Chrome/Edge Android
// ════════════════════════════════════════════════════════════
self.addEventListener('periodicsync', function (e) {
  if (e.tag !== 'prayer-check') return;
  e.waitUntil(
    loadSchedule().then(function (stored) {
      if (!stored || !stored.prayers || !stored.prayers.length) return;
      clearAllTimers();
      schedulePrayerAlarms(stored);

      var now     = Date.now();
      var overdue = stored.prayers.filter(function (p) {
        return p.ms < now && p.ms > now - 20 * 60 * 1000;
      });
      if (overdue.length > 0) {
        var latest = overdue.reduce(function (a, b) { return a.ms > b.ms ? a : b; });
        return checkAndFire(latest.key, latest.ms, stored.govName);
      }
      return self.clients.matchAll({ includeUncontrolled: true }).then(function (clients) {
        clients.forEach(function (c) { c.postMessage({ type: 'REFRESH_SCHEDULE' }); });
      });
    }).catch(function () {})
  );
});

// ════════════════════════════════════════════════════════════
//  Push API
// ════════════════════════════════════════════════════════════
self.addEventListener('push', function (e) {
  if (!e.data) return;
  var data;
  try { data = e.data.json(); } catch (x) { data = { title: e.data.text() }; }
  var prayerKey = data.prayerKey || 'dhuhr';
  e.waitUntil(
    self.registration.showNotification(data.title || (IC[prayerKey] + ' أذكار'), {
      body: data.body || 'حان وقت الصلاة',
      icon: '/assets/Background/Azkar-Icon.png',
      badge: '/assets/Background/Azkar-Icon.png',
      tag: 'prayer-push-' + prayerKey,
      renotify: true, requireInteraction: true,
      vibrate: [400, 150, 400],
      dir: 'rtl', lang: 'ar',
      data: { prayerKey: prayerKey, url: '/prayer-times.html' }
    })
  );
});

// ════════════════════════════════════════════════════════════
//  Fetch — Offline-first PWA cache
// ════════════════════════════════════════════════════════════
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  // Don't intercept CDN audio — too large to cache
  if (url.hostname.includes('islamic.network') || url.hostname.includes('cdnjs')) return;

  var isHTML   = /\.(html)$/.test(url.pathname) || url.pathname === '/';
  var isStatic = /\.(css|js|png|ico|svg|webp|woff2?|jpg|jpeg|json)$/.test(url.pathname);
  if (!isHTML && !isStatic) return;

  e.respondWith(
    caches.open(SW_VERSION).then(function (cache) {
      return cache.match(e.request).then(function (cached) {
        if (isHTML) {
          // Network-first for HTML
          return fetch(e.request)
            .then(function (resp) {
              if (resp && resp.status === 200) cache.put(e.request, resp.clone());
              return resp;
            })
            .catch(function () { return cached; });
        }
        // Cache-first for assets
        if (cached) {
          fetch(e.request).then(function (resp) {
            if (resp && resp.status === 200) cache.put(e.request, resp.clone());
          }).catch(function () {});
          return cached;
        }
        return fetch(e.request).then(function (resp) {
          if (resp && resp.status === 200) cache.put(e.request, resp.clone());
          return resp;
        });
      });
    }).catch(function () { return fetch(e.request); })
  );
});