// ============================================================
//  SERVICE WORKER — أذكار Prayer Notifications v2
//  Reliable background notifications using:
//  1. IndexedDB: persist schedule across SW restarts
//  2. Periodic Background Sync — Chrome Android wake-up
//  3. Self-rescheduling timers every 5min
//  4. Cache-first offline support
// ============================================================

const SW_VERSION = 'azkar-sw-v2';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Clean old caches
      caches.keys().then(function(keys) {
        return Promise.all(keys.filter(k => k !== SW_VERSION).map(k => caches.delete(k)));
      })
    ]).then(function() {
      return restoreAndSchedule();
    })
  );
});

// ════════════════════════════════════════════════════════════
//  IndexedDB — persist schedule so SW survives restart
// ════════════════════════════════════════════════════════════
function openDB() {
  return new Promise(function(resolve, reject) {
    const req = indexedDB.open('azkar-sw-db', 1);
    req.onupgradeneeded = function(e) {
      e.target.result.createObjectStore('schedule', { keyPath: 'id' });
    };
    req.onsuccess = function(e) { resolve(e.target.result); };
    req.onerror   = function()  { reject(req.error); };
  });
}

function saveSchedule(payload) {
  return openDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      const tx = db.transaction('schedule', 'readwrite');
      tx.objectStore('schedule').put({ id: 'current', payload: payload });
      tx.oncomplete = resolve;
      tx.onerror    = function() { reject(tx.error); };
    });
  });
}

function loadSchedule() {
  return openDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      const req = db.transaction('schedule', 'readonly').objectStore('schedule').get('current');
      req.onsuccess = function() { resolve(req.result ? req.result.payload : null); };
      req.onerror   = function() { reject(req.error); };
    });
  });
}

// ════════════════════════════════════════════════════════════
//  Timer management
// ════════════════════════════════════════════════════════════
let scheduledTimers = [];

const ICONS  = { fajr:'🌅', dhuhr:'🌤️', asr:'🌇', maghrib:'🌆', isha:'🌙' };
const NAMES  = { fajr:'الفجر', dhuhr:'الظهر', asr:'العصر', maghrib:'المغرب', isha:'العشاء' };

function clearAllTimers() {
  scheduledTimers.forEach(function(id) { clearTimeout(id); });
  scheduledTimers = [];
}

// Re-evaluate schedule every 4 minutes to catch prayers within the next window
const WAKE_INTERVAL = 4 * 60 * 1000;

function schedulePrayerAlarms(payload) {
  if (!payload || !payload.prayers) return;
  const now = Date.now();

  payload.prayers.forEach(function(prayer) {
    const diff = prayer.ms - now;
    if (diff <= 0 || diff > 24 * 3600 * 1000) return;

    // Only set direct timer for prayers within the next 5 minutes
    // (SW timers are unreliable beyond ~5min when browser is in background)
    if (diff <= 5 * 60 * 1000) {
      const tid = setTimeout(function() {
        firePrayerNotification(prayer.key, payload.govName);
      }, diff);
      scheduledTimers.push(tid);
    }
  });

  // Self-wake to reschedule: runs every 4min inside the SW
  const wakeId = setTimeout(function() {
    loadSchedule().then(function(stored) {
      if (!stored) return;
      clearAllTimers();
      schedulePrayerAlarms(stored);
    }).catch(console.warn);
  }, WAKE_INTERVAL);
  scheduledTimers.push(wakeId);
}

function restoreAndSchedule() {
  return loadSchedule().then(function(stored) {
    if (!stored || !stored.prayers || !stored.prayers.length) return;
    clearAllTimers();
    schedulePrayerAlarms(stored);
  }).catch(console.warn);
}

// ════════════════════════════════════════════════════════════
//  Messages from page
// ════════════════════════════════════════════════════════════
self.addEventListener('message', function(e) {
  if (!e.data) return;

  if (e.data.type === 'SCHEDULE_PRAYERS') {
    const payload = e.data.payload;
    saveSchedule(payload).catch(console.warn);
    clearAllTimers();
    schedulePrayerAlarms(payload);
  }

  if (e.data.type === 'CANCEL_NOTIFICATIONS') {
    clearAllTimers();
    saveSchedule({ prayers: [], govName: '' }).catch(console.warn);
  }

  if (e.data.type === 'PING') {
    if (e.source) e.source.postMessage({ type: 'PONG', swActive: true, version: SW_VERSION });
  }
});

// ════════════════════════════════════════════════════════════
//  Fire notification
// ════════════════════════════════════════════════════════════
function firePrayerNotification(prayerKey, govName) {
  const icon   = ICONS[prayerKey]  || '🕌';
  const arName = NAMES[prayerKey]  || prayerKey;
  const title  = icon + ' حان الآن موعد أذان ' + arName;
  const body   = 'أذكر الله واحرص على الصلاة في وقتها' + (govName ? '\n' + govName : '');

  return self.registration.showNotification(title, {
    body, icon: '/assets/Background/Azkar-Icon.png',
    badge: '/assets/Background/Azkar-Icon.png',
    tag: 'prayer-' + prayerKey, renotify: true,
    requireInteraction: true, vibrate: [200,100,200,100,300],
    dir: 'rtl', lang: 'ar', timestamp: Date.now(),
    data: { prayerKey, url: '/prayer-times.html' },
    actions: [
      { action: 'open',    title: '📖 فتح الأذكار' },
      { action: 'dismiss', title: 'إغلاق' }
    ]
  }).then(function() {
    // Ask page to refresh tomorrow's schedule
    return self.clients.matchAll({ includeUncontrolled: true }).then(function(clients) {
      clients.forEach(function(c) { c.postMessage({ type: 'REFRESH_SCHEDULE' }); });
    });
  }).catch(function(err) { console.warn('[SW] notification failed:', err); });
}

// ════════════════════════════════════════════════════════════
//  Notification click
// ════════════════════════════════════════════════════════════
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  if (e.action === 'dismiss') return;
  const url = (e.notification.data && e.notification.data.url) || '/prayer-times.html';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clients) {
      for (let i = 0; i < clients.length; i++) {
        if (clients[i].url.includes('prayer-times') && 'focus' in clients[i]) return clients[i].focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});

// ════════════════════════════════════════════════════════════
//  Periodic Background Sync — Chrome Android wakes SW every ~15min
// ════════════════════════════════════════════════════════════
self.addEventListener('periodicsync', function(e) {
  if (e.tag === 'prayer-check') {
    e.waitUntil(
      loadSchedule().then(function(stored) {
        if (stored && stored.prayers && stored.prayers.length) {
          clearAllTimers();
          schedulePrayerAlarms(stored);
        }
        return self.clients.matchAll({ includeUncontrolled: true }).then(function(clients) {
          clients.forEach(function(c) { c.postMessage({ type: 'REFRESH_SCHEDULE' }); });
        });
      }).catch(console.warn)
    );
  }
});

// ════════════════════════════════════════════════════════════
//  Push API — future server-side support
// ════════════════════════════════════════════════════════════
self.addEventListener('push', function(e) {
  if (!e.data) return;
  try {
    const data = e.data.json();
    e.waitUntil(
      self.registration.showNotification(data.title || '🕌 أذكار', {
        body: data.body || '', icon: '/assets/Background/Azkar-Icon.png',
        badge: '/assets/Background/Azkar-Icon.png', dir: 'rtl', lang: 'ar',
        vibrate: [200,100,200], requireInteraction: true,
        data: { url: '/prayer-times.html' }
      })
    );
  } catch(err) { console.warn('[SW] push parse error:', err); }
});

// ════════════════════════════════════════════════════════════
//  Fetch — Cache-first offline support
// ════════════════════════════════════════════════════════════
self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (!url.pathname.match(/\.(html|css|js|png|ico|svg|woff2?)$/)) return;

  e.respondWith(
    caches.open(SW_VERSION).then(function(cache) {
      return cache.match(e.request).then(function(cached) {
        const net = fetch(e.request).then(function(resp) {
          if (resp && resp.status === 200) cache.put(e.request, resp.clone());
          return resp;
        }).catch(function() { return cached; });
        return cached || net;
      });
    })
  );
});
