// ====== Unified Azkar Script ======

// ====== DOM Elements ======
const alertToast = document.getElementById('alertToast');
const shareLinkBtn = document.getElementById('shareLinkBtn');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const drawerClose = document.getElementById('drawerClose');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const footerYear = document.getElementById('footerYear');

// Index-page specific
const btnDay = document.getElementById('btnDay');
const btnNight = document.getElementById('btnNight');
const azkarDay = document.querySelector('.Azkar.Day');
const azkarNight = document.querySelector('.Azkar.Night');
const progressFill = document.getElementById('progressFill');
const progressCount = document.getElementById('progressCount');
const progressLabel = document.getElementById('progressLabel');
const resetBtn = document.getElementById('resetBtn');
const resetModal = document.getElementById('resetModal');
const modalCancel = document.getElementById('modalCancel');
const modalConfirm = document.getElementById('modalConfirm');

// ====== State ======
let currentMode = 'day';
const timeNow = new Date();

// ====== Footer Year ======
if (footerYear) footerYear.textContent = new Date().getFullYear();

// ====== Active Nav ======
(function markActiveNav() {
  const links = document.querySelectorAll('.header-nav a, .drawer-nav a');
  const currentFile = location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href && (currentFile === href || currentFile.includes(href.replace('.html', '')))) {
      link.classList.add('active');
    }
  });
})();

// ====== Toast ======
function showToast(msg) {
  alertToast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
  alertToast.classList.add('show');
  setTimeout(() => alertToast.classList.remove('show'), 3000);
}

// ====== Share Link ======
if (shareLinkBtn) {
  shareLinkBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast('تم نسخ الرابط بنجاح!');
    }).catch(() => {
      showToast('تعذر نسخ الرابط');
    });
  });
}

// ====== Mobile Drawer ======
if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', () => mobileDrawer.classList.add('open'));
if (drawerClose) drawerClose.addEventListener('click', () => mobileDrawer.classList.remove('open'));
if (drawerOverlay) drawerOverlay.addEventListener('click', () => mobileDrawer.classList.remove('open'));

// ====== Scroll Top ======
window.addEventListener('scroll', () => {
  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }
});
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ====== Source Info — Fixed Center with Backdrop ======
function setupInfoBtns() {
  // Create backdrop if not exists
  let backdrop = document.getElementById('sourceBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'sourceBackdrop';
    backdrop.className = 'source-backdrop';
    document.body.appendChild(backdrop);
  }

  // Create single floating popup container on body
  let floatingPopup = document.getElementById('floatingSourcePopup');
  if (!floatingPopup) {
    floatingPopup = document.createElement('div');
    floatingPopup.id = 'floatingSourcePopup';
    floatingPopup.className = 'sourceHidden';
    document.body.appendChild(floatingPopup);
  }

  const infoBtns = document.querySelectorAll('.infoBtn');
  const sourceHiddens = document.querySelectorAll('.sourceHidden:not(#floatingSourcePopup)');

  function closeAll() {
    infoBtns.forEach(b => b.classList.remove('deactive'));
    floatingPopup.classList.remove('active');
    floatingPopup.innerHTML = '';
    backdrop.classList.remove('active');
  }

  backdrop.addEventListener('click', closeAll);

  infoBtns.forEach((btn, i) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = floatingPopup.classList.contains('active') && floatingPopup.dataset.index === String(i);
      closeAll();
      if (!isOpen) {
        btn.classList.add('deactive');
        // Clone content from hidden source div into floating popup
        if (sourceHiddens[i]) {
          floatingPopup.innerHTML = sourceHiddens[i].innerHTML;
          floatingPopup.dataset.index = String(i);
          floatingPopup.classList.add('active');
          // Bind doneBtn inside floating popup
          const doneBtn = floatingPopup.querySelector('.doneBtn');
          if (doneBtn) {
            doneBtn.classList.remove('deactive');
            doneBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              closeAll();
            });
          }
        }
        backdrop.classList.add('active');
      }
    });
  });
}

// ====== Mode Functions (Index only) ======
function setDayMode() {
  currentMode = 'day';
  if (azkarDay) azkarDay.style.display = '';
  if (azkarNight) azkarNight.style.display = 'none';
  if (btnDay) {
    btnDay.classList.add('active-day');
    btnDay.classList.remove('active-night');
  }
  if (btnNight) btnNight.classList.remove('active-day', 'active-night');
  document.body.classList.remove('night-mode');
  if (progressLabel) progressLabel.textContent = 'أذكار الصباح';
  localStorage.setItem('AzkarMode', 'day');
  updateProgress();
  updateSelectionColor('day');
}

function setNightMode() {
  currentMode = 'night';
  if (azkarDay) azkarDay.style.display = 'none';
  if (azkarNight) azkarNight.style.display = '';
  if (btnNight) {
    btnNight.classList.add('active-night');
    btnNight.classList.remove('active-day');
  }
  if (btnDay) btnDay.classList.remove('active-day', 'active-night');
  document.body.classList.add('night-mode');
  if (progressLabel) progressLabel.textContent = 'أذكار المساء';
  localStorage.setItem('AzkarMode', 'night');
  updateProgress();
  updateSelectionColor('night');
}

// ====== Progress ======
function updateProgress() {
  if (!progressFill || !progressCount) return;
  const container = currentMode === 'day' ? azkarDay : azkarNight;
  if (!container) return;
  const buttons = container.querySelectorAll('.smlNum');
  let completed = 0;
  buttons.forEach(btn => {
    if (btn.disabled || btn.classList.contains('deactive')) completed++;
  });
  const total = buttons.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  progressFill.style.width = pct + '%';
  progressCount.textContent = `${completed} / ${total}`;
}

// ====== Setup Counter Buttons ======
function setupButtons(container, startIdx) {
  if (!container) return;
  const buttons = container.querySelectorAll('.smlNum');
  const boxes = container.querySelectorAll('.box');

  buttons.forEach((btn, i) => {
    const storageKey = `Read Zekr ${startIdx + i}`;
    const totalEl = btn.querySelector('.total');
    const spanEl = btn.querySelector('span:first-child');
    const total = parseInt(totalEl ? totalEl.textContent : '1') || 1;

    let readNum = parseInt(localStorage.getItem(storageKey)) || 0;
    if (spanEl) spanEl.textContent = readNum;

    if (readNum >= total) {
      btn.disabled = true;
      btn.classList.add('deactive');
      if (boxes[i]) boxes[i].classList.add('completed');
    }

    btn.addEventListener('click', function () {
      if (btn.disabled) return;
      if (readNum < total) {
        readNum++;
        if (spanEl) {
          spanEl.style.transform = 'scale(1.3)';
          setTimeout(() => spanEl.style.transform = '', 200);
          spanEl.textContent = readNum;
        }
        localStorage.setItem(storageKey, readNum);
        localStorage.setItem('AzkarDate', timeNow.getDate());
      }

      if (readNum >= total) {
        btn.disabled = true;
        btn.classList.add('deactive');
        if (boxes[i]) boxes[i].classList.add('completed');
        if (boxes[i + 1]) {
          setTimeout(() => {
            boxes[i + 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 250);
        }
      }
      updateProgress();
    });
  });
}

// ====== Sub-page Progress ======
function updateSubProgress() {
  const fill = document.getElementById('subProgressFill');
  const count = document.getElementById('subProgressCount');
  if (!fill || !count) return;
  const container = document.querySelector('.azkar-section');
  if (!container) return;
  const buttons = container.querySelectorAll('.smlNum');
  let completed = 0;
  buttons.forEach(btn => {
    if (btn.disabled || btn.classList.contains('deactive')) completed++;
  });
  const total = buttons.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  fill.style.width = pct + '%';
  count.textContent = `${completed} / ${total}`;
}

// Sub-page counter (no mode switching)
function setupSubPageButtons() {
  const container = document.querySelector('.azkar-section');
  if (!container) return;
  const buttons = container.querySelectorAll('.smlNum');
  const boxes = container.querySelectorAll('.box');
  const pageName = document.title.split('|')[0].trim().replace(/\s+/g, '-');

  buttons.forEach((btn, i) => {
    const storageKey = `SubPage-${pageName}-${i}`;
    const totalEl = btn.querySelector('.total');
    const spanEl = btn.querySelector('span:first-child');
    const total = parseInt(totalEl ? totalEl.textContent : '1') || 1;

    let readNum = parseInt(localStorage.getItem(storageKey)) || 0;
    if (spanEl) spanEl.textContent = readNum;

    if (readNum >= total) {
      btn.disabled = true;
      btn.classList.add('deactive');
      if (boxes[i]) boxes[i].classList.add('completed');
    }

    btn.addEventListener('click', function () {
      if (btn.disabled) return;
      if (readNum < total) {
        readNum++;
        if (spanEl) {
          spanEl.style.transform = 'scale(1.3)';
          setTimeout(() => spanEl.style.transform = '', 200);
          spanEl.textContent = readNum;
        }
        localStorage.setItem(storageKey, readNum);
      }

      if (readNum >= total) {
        btn.disabled = true;
        btn.classList.add('deactive');
        if (boxes[i]) boxes[i].classList.add('completed');
        if (boxes[i + 1]) {
          setTimeout(() => {
            boxes[i + 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 250);
        }
      }
      updateSubProgress();
    });
  });

  // Sub-page reset button
  const subResetBtn = document.getElementById('subResetBtn');
  const subResetModal = document.getElementById('resetModal');
  const subModalCancel = document.getElementById('modalCancel');
  const subModalConfirm = document.getElementById('modalConfirm');

  if (subResetBtn && subResetModal) {
    subResetBtn.addEventListener('click', () => {
      // Check if user has read any zekr at all
      const anyRead = Array.from(buttons).some((btn, i) => {
        const storageKey = `SubPage-${pageName}-${i}`;
        const readNum = parseInt(localStorage.getItem(storageKey)) || 0;
        return readNum > 0;
      });
      if (!anyRead) {
        showToast('أنت لم تقرأ أي ذكر بعد!');
        return;
      }
      subResetModal.classList.add('open');
    });
    if (subModalCancel) subModalCancel.addEventListener('click', () => subResetModal.classList.remove('open'));
    subResetModal.addEventListener('click', (e) => { if (e.target === subResetModal) subResetModal.classList.remove('open'); });
    if (subModalConfirm) {
      subModalConfirm.addEventListener('click', () => {
        const keys = Object.keys(localStorage).filter(k => k.startsWith(`SubPage-${pageName}`));
        keys.forEach(k => localStorage.removeItem(k));
        buttons.forEach((btn, i) => {
          btn.disabled = false;
          btn.classList.remove('deactive');
          const spanEl = btn.querySelector('span:first-child');
          if (spanEl) spanEl.textContent = '0';
          if (boxes[i]) boxes[i].classList.remove('completed');
        });
        subResetModal.classList.remove('open');
        updateSubProgress();
        showToast('تم إعادة تعيين الأذكار!');
        setupSubPageButtons();
      });
    }
  }

  updateSubProgress();
}

// ====== Did You Know Section ======
const dykItems = [
  { label: 'هل تعرف؟ — أذكار يومية', text: 'من قرأ آية الكرسي دبر كل صلاة مكتوبة لم يمنعه من دخول الجنة إلا أن يموت.', source: 'صحيح النسائي', link: 'azkar-salah.html' },
  { label: 'هل تعرف؟ — أذكار الصلاة', text: 'من قال سبحان الله وبحمده مائة مرة في اليوم حُطَّت خطاياه وإن كانت مثل زبد البحر.', source: 'صحيح البخاري', link: 'index.html' },
  { label: 'هل تعرف؟ — أذكار النوم', text: 'من قرأ الآيتين من آخر سورة البقرة في ليلة كفتاه.', source: 'صحيح البخاري', link: 'azkar-sleep.html' },
  { label: 'هل تعرف؟ — أذكار الصباح', text: 'بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء — من قالها ثلاثًا لم تصبه فجأة بلاء حتى يمسي.', source: 'صحيح أبي داود', link: 'index.html' },
  { label: 'هل تعرف؟ — أذكار الطعام', text: 'من نسي أن يذكر الله في أول طعامه فليقل: بسم الله أوله وآخره.', source: 'صحيح أبي داود', link: 'azkar-food.html' },
  { label: 'هل تعرف؟ — أذكار المنزل', text: 'إذا دخل الرجل بيته فذكر الله عند دخوله وعند طعامه، قال الشيطان: لا مبيت لكم ولا عشاء.', source: 'صحيح مسلم', link: 'azkar-home.html' },
  { label: 'هل تعرف؟ — أذكار المساء', text: 'اللهم أنت ربي لا إله إلا أنت — سيد الاستغفار، من قاله موقنًا فمات دخل الجنة.', source: 'صحيح البخاري', link: 'index.html' },
  { label: 'هل تعرف؟ — أذكار السفر', text: 'سبحان الذي سخَّر لنا هذا وما كنا له مقرنين — دعاء السفر المأثور عن النبيﷺ.', source: 'صحيح الترمذي', link: 'azkar-travel.html' },
];

function initDYK() {
  const section = document.getElementById('dykSection');
  if (!section) return;
  const textEl = document.getElementById('dykText');
  const sourceEl = document.getElementById('dykSource');
  const labelEl = document.getElementById('dykLabel');
  const linkEl = document.getElementById('dykLink');
  const dotsContainer = document.getElementById('dykDots');
  const timerEl = document.getElementById('dykTimerText');

  if (!textEl) return;

  const INTERVAL = 15 * 60 * 1000; // 15 minutes
  const startRef = new Date('2024-01-01T00:00:00').getTime();

  function getIndex() {
    const elapsed = Date.now() - startRef;
    return Math.floor(elapsed / INTERVAL) % dykItems.length;
  }

  function getRemaining() {
    const elapsed = Date.now() - startRef;
    return INTERVAL - (elapsed % INTERVAL);
  }

  function formatTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  // Build dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    dykItems.forEach(() => {
      const dot = document.createElement('span');
      dot.className = 'dyk-dot';
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots(idx) {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.dyk-dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  }

  let lastIdx = -1;

  function renderItem(idx) {
    const item = dykItems[idx];
    // Set content directly (no fade delay to avoid blank state)
    if (labelEl) labelEl.textContent = item.label;
    textEl.textContent = item.text;
    if (sourceEl) sourceEl.textContent = item.source;
    if (linkEl) linkEl.href = item.link;
    updateDots(idx);
    lastIdx = idx;
  }

  function tick() {
    const idx = getIndex();
    if (idx !== lastIdx) renderItem(idx);
    if (timerEl) timerEl.textContent = formatTime(getRemaining());
  }

  // Run immediately then every second
  tick();
  setInterval(tick, 1000);
}



// ====== Reset (Index only) ======
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    // Check if user has read any zekr at all
    const anyRead = Object.keys(localStorage).some(k => k.startsWith('Read Zekr') && parseInt(localStorage.getItem(k)) > 0);
    if (!anyRead) {
      showToast('أنت لم تقرأ أي ذكر بعد!');
      return;
    }
    if (resetModal) resetModal.classList.add('open');
  });
}

if (modalCancel) {
  modalCancel.addEventListener('click', () => {
    if (resetModal) resetModal.classList.remove('open');
  });
}

if (resetModal) {
  resetModal.addEventListener('click', (e) => {
    if (e.target === resetModal) resetModal.classList.remove('open');
  });
}

if (modalConfirm) {
  modalConfirm.addEventListener('click', () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('Read Zekr'));
    keys.forEach(k => localStorage.removeItem(k));
    document.querySelectorAll('.smlNum').forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('deactive');
      const spanEl = btn.querySelector('span:first-child');
      if (spanEl) spanEl.textContent = '0';
    });
    document.querySelectorAll('.box').forEach(b => b.classList.remove('completed'));
    if (azkarDay) setupButtons(azkarDay, 1);
    if (azkarNight) setupButtons(azkarNight, 100);
    if (resetModal) resetModal.classList.remove('open');
    updateProgress();
    showToast('تم إعادة تعيين الأذكار!');
  });
}

// ====== Selection Color ======
function updateSelectionColor(mode) {
  let s = document.getElementById('selectionStyle');
  if (!s) { s = document.createElement('style'); s.id = 'selectionStyle'; document.head.appendChild(s); }
  s.textContent = mode === 'night'
    ? '::selection{background:#1a3a5c;color:#fff}'
    : '::selection{background:#1a6b5a;color:#fff}';
}

// ====== Daily Reset ======
function dailyReset() {
  const savedDate = localStorage.getItem('AzkarDate');
  if (savedDate && Number(savedDate) !== timeNow.getDate()) {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('Read Zekr'));
    keys.forEach(k => localStorage.removeItem(k));
    localStorage.setItem('AzkarDate', timeNow.getDate());
  } else if (!savedDate) {
    localStorage.setItem('AzkarDate', timeNow.getDate());
  }
}

// ====== Init ======
document.addEventListener('DOMContentLoaded', () => {
  dailyReset();
  setupInfoBtns();
  initDYK();

  if (azkarDay && azkarNight) {
    // Index page
    if (btnDay) btnDay.addEventListener('click', setDayMode);
    if (btnNight) btnNight.addEventListener('click', setNightMode);
    setupButtons(azkarDay, 1);
    setupButtons(azkarNight, 100);

    const savedMode = localStorage.getItem('AzkarMode');
    if (savedMode === 'night') {
      setNightMode();
    } else if (savedMode === 'day') {
      setDayMode();
    } else {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 16) setDayMode();
      else setNightMode();
    }
  } else {
    // Sub-page
    setupSubPageButtons();
    updateSelectionColor('day');
  }
});

// ====== Preloader ======
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('hide');
      setTimeout(() => preloader.style.display = 'none', 700);
    }
  }, 500);
});
