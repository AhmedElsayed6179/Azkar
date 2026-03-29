// ============================================================
//  SERVICE WORKER — أذكار Prayer Notifications
//  Works in background even when browser tab is closed
//  Strategy: store prayer times in IndexedDB via postMessage,
//  use periodic background sync OR alarm via setTimeout chains
// ============================================================

const SW_VERSION = 'azkar-sw-v1';

// ── Install & Activate ──────────────────────────────────────
self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(self.clients.claim());
});

// ── Prayer data store (in-memory, refreshed via postMessage) ─
let prayerSchedule = null; // { govName, prayers: [{key,arName,icon,ms}] }
let scheduledTimers = [];

const PRAYER_ICONS = {
  fajr:   '🌅',
  dhuhr:  '🌤️',
  asr:    '🌇',
  maghrib:'🌆',
  isha:   '🌙'
};

const PRAYER_NAMES_AR = {
  fajr:   'الفجر',
  dhuhr:  'الظهر',
  asr:    'العصر',
  maghrib:'المغرب',
  isha:   'العشاء'
};

// ── Listen for messages from the page ───────────────────────
self.addEventListener('message', function(e) {
  if (!e.data) return;

  if (e.data.type === 'SCHEDULE_PRAYERS') {
    prayerSchedule = e.data.payload; // { govName, prayers:[{key,ms}] }
    clearAllTimers();
    schedulePrayerAlarms();
  }

  if (e.data.type === 'CANCEL_NOTIFICATIONS') {
    clearAllTimers();
    prayerSchedule = null;
  }

  if (e.data.type === 'PING') {
    e.source && e.source.postMessage({ type: 'PONG', swActive: true });
  }
});

// ── Clear all pending alarms ─────────────────────────────────
function clearAllTimers() {
  scheduledTimers.forEach(function(id) { clearTimeout(id); });
  scheduledTimers = [];
}

// ── Schedule an alarm for each upcoming prayer ───────────────
function schedulePrayerAlarms() {
  if (!prayerSchedule) return;
  const now = Date.now();

  prayerSchedule.prayers.forEach(function(prayer) {
    const diffMs = prayer.ms - now;
    if (diffMs <= 0 || diffMs > 24 * 60 * 60 * 1000) return; // skip passed or >24h

    const tid = setTimeout(function() {
      firePrayerNotification(prayer.key, prayerSchedule.govName);
    }, diffMs);

    scheduledTimers.push(tid);
  });
}

// ── Show the notification ────────────────────────────────────
function firePrayerNotification(prayerKey, govName) {
  const icon  = PRAYER_ICONS[prayerKey]  || '🕌';
  const arName = PRAYER_NAMES_AR[prayerKey] || prayerKey;

  const title = icon + ' حان الآن موعد أذان ' + arName;
  const body  = 'أذكر الله واحرص على الصلاة في وقتها\n' + (govName || '');

  const options = {
    body:             body,
    icon:             '/assets/Background/Azkar-Icon.png',
    badge:            '/assets/Background/Azkar-Icon.png',
    tag:              'prayer-' + prayerKey,
    renotify:         true,
    requireInteraction: true,
    vibrate:          [200, 100, 200, 100, 300],
    dir:              'rtl',
    lang:             'ar',
    data:             { prayerKey, url: '/prayer-times.html' },
    actions: [
      { action: 'open',    title: '📖 فتح الأذكار' },
      { action: 'dismiss', title: 'إغلاق' }
    ]
  };

  self.registration.showNotification(title, options).catch(function(err) {
    console.warn('[SW] showNotification failed:', err);
  });

  // Re-schedule for tomorrow automatically
  setTimeout(function() {
    if (prayerSchedule) {
      // Notify the page to refresh schedule
      self.clients.matchAll().then(function(clients) {
        clients.forEach(function(c) {
          c.postMessage({ type: 'REFRESH_SCHEDULE' });
        });
      });
    }
  }, 1000);
}

// ── Handle notification click ────────────────────────────────
self.addEventListener('notificationclick', function(e) {
  e.notification.close();

  if (e.action === 'dismiss') return;

  const targetUrl = (e.notification.data && e.notification.data.url)
    ? e.notification.data.url
    : '/prayer-times.html';

  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clients) {
        // Focus existing tab if open
        for (let i = 0; i < clients.length; i++) {
          const c = clients[i];
          if (c.url.includes('prayer-times') && 'focus' in c) {
            return c.focus();
          }
        }
        // Otherwise open new tab
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});

// ── Keep SW alive with periodic self-ping ───────────────────
// Service workers can be killed by browsers — we use a
// heartbeat to re-schedule if we wake up and have stored data.
self.addEventListener('periodicsync', function(e) {
  if (e.tag === 'prayer-check') {
    e.waitUntil(
      self.clients.matchAll().then(function(clients) {
        clients.forEach(function(c) {
          c.postMessage({ type: 'REFRESH_SCHEDULE' });
        });
      })
    );
  }
});
