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
// Active is already set via hardcoded class="active" in HTML for each page.
// This function is kept as a safety fallback for any missed links.
(function markActiveNav() {
    const links = document.querySelectorAll('.header-nav a, .header-nav-inline a, .drawer-nav a');
    const currentFile = location.pathname.split('/').pop() || 'index.html';
    links.forEach(link => {
        const href = link.getAttribute('href') || '';
        // Exact match only — prevents false positives
        if (href && href !== '#' && currentFile === href) {
            link.classList.add('active');
        }
    });
})();

// ====== Page Transition ======
(function setupPageTransitions() {
    const overlay = document.createElement('div');
    overlay.id = 'pageTransitionOverlay';
    overlay.innerHTML = `
    <div class="pt-overlay-content">
      <div class="pt-overlay-logo">
        <img src="assets/Background/Azkar-Icon.png" alt="أذكار" onerror="this.style.display='none'"/>
        <span class="pt-overlay-brand">أذكار</span>
      </div>
      <div class="pt-overlay-divider"></div>
      <div class="pt-overlay-bismillah">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ</div>
    </div>
  `;
    document.body.appendChild(overlay);

    document.documentElement.classList.add('page-entering');
    requestAnimationFrame(() => {
        setTimeout(() => document.documentElement.classList.remove('page-entering'), 550);
    });

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
        if (link.target === '_blank') return;
        e.preventDefault();
        overlay.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 420);
    });
})();

// ====== Toast ======
function showToast(msg) {
    alertToast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
    alertToast.classList.add('show');
    setTimeout(() => alertToast.classList.remove('show'), 3000);
}

// ====== Global Dark / Light Theme Toggle ======
// Applied to ALL pages. Key: 'ThemeMode' = 'dark' | 'light'
// On azkar-morning page, dark mode is also the "night azkar" mode — handled separately below.
(function setupGlobalTheme() {
    const STORAGE_KEY = 'ThemeMode';

    function applyTheme(mode) {
        // Morning page has its own day/evening mode — skip global theme there
        if (document.body.getAttribute('data-page') === 'morning') return;
        if (mode === 'dark') {
            document.body.classList.add('night-mode');
        } else {
            document.body.classList.remove('night-mode');
        }
        // Update any theme toggle buttons that exist on this page
        document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
            const iconEl = btn.querySelector('i');
            if (!iconEl) return;
            if (mode === 'dark') {
                iconEl.className = 'fa-solid fa-sun';
                btn.title = 'الوضع النهاري';
            } else {
                iconEl.className = 'fa-solid fa-moon';
                btn.title = 'الوضع الليلي';
            }
        });
    }

    function toggleTheme() {
        const current = localStorage.getItem(STORAGE_KEY) || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
        showToast(next === 'dark' ? 'تم التبديل للوضع الليلي 🌙' : 'تم التبديل للوضع النهاري ☀️');
    }

    // Determine initial theme
    function getInitialTheme() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return saved;
        // Auto-detect by time: night = 18:00–06:00
        const h = new Date().getHours();
        return (h >= 18 || h < 6) ? 'dark' : 'light';
    }

    // Apply on load (immediately, before DOMContentLoaded to avoid flash)
    applyTheme(getInitialTheme());

    // Bind toggle buttons after DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        applyTheme(getInitialTheme()); // re-apply after DOM
        document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
            btn.addEventListener('click', toggleTheme);
        });
    });

    // Expose globally so azkar-morning page can also call it
    window.toggleGlobalTheme = toggleTheme;
    window.applyGlobalTheme = applyTheme;
    window.getGlobalTheme = () => localStorage.getItem(STORAGE_KEY) || 'light';
})()

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
    document.body.classList.remove('evening-mode'); document.body.classList.add('morning-day-mode');
    document.documentElement.setAttribute('data-preload-mode', 'day');
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
    document.body.classList.add('evening-mode'); document.body.classList.remove('morning-day-mode');
    document.documentElement.setAttribute('data-preload-mode', 'evening');
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
    { label: 'هل تعرف؟ — أذكار يومية', text: 'من قرأ آية الكرسي دبر كل صلاة مكتوبة لم يمنعه من دخول الجنة إلا أن يموت.', source: 'صحيح النسائي', link: 'azkar-daily.html' },
    { label: 'هل تعرف؟ — أذكار الصلاة', text: 'من قال سبحان الله وبحمده مائة مرة في اليوم حُطَّت خطاياه وإن كانت مثل زبد البحر.', source: 'صحيح البخاري', link: 'azkar-salah.html' },
    { label: 'هل تعرف؟ — أذكار النوم', text: 'من قرأ الآيتين من آخر سورة البقرة في ليلة كفتاه.', source: 'صحيح البخاري', link: 'azkar-sleep.html' },
    { label: 'هل تعرف؟ — أذكار الصباح', text: 'بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء — من قالها ثلاثًا لم تصبه فجأة بلاء حتى يمسي.', source: 'صحيح أبي داود', link: 'azkar-morning.html' },
    { label: 'هل تعرف؟ — أذكار الطعام', text: 'من نسي أن يذكر الله في أول طعامه فليقل: بسم الله أوله وآخره.', source: 'صحيح أبي داود', link: 'azkar-food.html' },
    { label: 'هل تعرف؟ — أذكار المنزل', text: 'إذا دخل الرجل بيته فذكر الله عند دخوله وعند طعامه، قال الشيطان: لا مبيت لكم ولا عشاء.', source: 'صحيح مسلم', link: 'azkar-home.html' },
    { label: 'هل تعرف؟ — أذكار المساء', text: 'اللهم أنت ربي لا إله إلا أنت — سيد الاستغفار، من قاله موقنًا فمات دخل الجنة.', source: 'صحيح البخاري', link: 'azkar-morning.html' },
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

        setTimeout(() => {
            location.reload();
        }, 500);
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

// ====== Web Content Protection and DevTools Disabling Script ======
(function () {
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    document.onkeydown = function (e) {
        if (e.keyCode == 123) {
            return false;
        }
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
            return false;
        }
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
            return false;
        }
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
            return false;
        }
        if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
            return false;
        }
        if (e.ctrlKey && e.keyCode == 'S'.charCodeAt(0)) {
            return false;
        }
    };

    const checkStatus = () => {
        const start = new Date();
        debugger;
        const end = new Date();
        if (end - start > 100) {
            document.body.innerHTML = "Access Denied";
        }
    };

    setInterval(checkStatus, 1000);

    document.addEventListener('dragstart', function (e) {
        if (e.target.nodeName === 'IMG') {
            e.preventDefault();
        }
    });
})();

// ====== PWA — Service Worker Registration + Install Prompt ======
(function initPWA() {
    'use strict';

    // ── 1. Register Service Worker ────────────────────────────────
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('/sw-prayer.js', { scope: '/' })
                .then(function (reg) {
                    console.log('[PWA] SW registered, scope:', reg.scope);

                    // Keep SW alive with periodic pings every 10 minutes
                    // (helps reschedule prayer alarms while page is open)
                    setInterval(function () {
                        if (reg.active) reg.active.postMessage({ type: 'PING' });
                    }, 10 * 60 * 1000);
                })
                .catch(function (err) {
                    console.warn('[PWA] SW registration failed:', err);
                });
        });
    }

    // ── 2. PWA Install Prompt ──────────────────────────────────────
    // Capture the browser's beforeinstallprompt event
    var _installPrompt = null;

    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault(); // prevent automatic mini-bar
        _installPrompt = e;
        showInstallBanner();
    });

    function showInstallBanner() {
        // Don't show if already installed or already dismissed
        if (localStorage.getItem('azkarPWAInstalled') === '1') return;
        if (localStorage.getItem('azkarPWADismissed') === '1') return;
        if (document.getElementById('pwaInstallBanner')) return;

        var banner = document.createElement('div');
        banner.id = 'pwaInstallBanner';
        banner.style.cssText = [
            'position:fixed;bottom:80px;left:50%;transform:translateX(-50%)',
            'background:linear-gradient(135deg,#0a2318,#1a4731)',
            'border:1px solid rgba(201,168,76,0.45)',
            'border-radius:22px;padding:14px 18px',
            'display:flex;align-items:center;gap:12px',
            'box-shadow:0 12px 40px rgba(0,0,0,0.55),0 0 0 1px rgba(201,168,76,0.08)',
            'z-index:99998;max-width:420px;width:calc(100% - 32px)',
            "font-family:'Cairo',sans-serif;color:#fff",
            'animation:pwaSlideUp 0.45s cubic-bezier(0.34,1.56,0.64,1)'
        ].join(';');

        banner.innerHTML = [
            '<div style="font-size:2rem;flex-shrink:0">📲</div>',
            '<div style="flex:1;min-width:0">',
            '<div style="font-weight:700;font-size:0.92rem;margin-bottom:2px">ثبّت تطبيق أذكار</div>',
            '<div style="font-size:0.74rem;opacity:0.65;line-height:1.4">',
            'ثبّته على شاشتك الرئيسية للحصول على إشعارات الصلاة مع الأذان حتى لو أغلقت المتصفح',
            '</div>',
            '</div>',
            '<div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0">',
            '<button id="pwaBtnInstall" style="',
            'background:linear-gradient(135deg,#c9a84c,#e0c070);',
            'color:#0a1f14;border:none;border-radius:12px;',
            'padding:8px 14px;font-family:inherit;font-size:0.8rem;',
            'font-weight:800;cursor:pointer;white-space:nowrap;',
            'box-shadow:0 4px 12px rgba(201,168,76,0.3)',
            '">تثبيت</button>',
            '<button id="pwaBtnDismiss" style="',
            'background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.6);',
            'border:1px solid rgba(255,255,255,0.1);border-radius:12px;',
            'padding:6px 14px;font-family:inherit;font-size:0.75rem;cursor:pointer',
            '">لاحقاً</button>',
            '</div>'
        ].join('');

        // Add animation keyframe once
        if (!document.getElementById('pwaStyles')) {
            var st = document.createElement('style');
            st.id = 'pwaStyles';
            st.textContent = '@keyframes pwaSlideUp{from{opacity:0;transform:translateX(-50%) translateY(30px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
            document.head.appendChild(st);
        }

        document.body.appendChild(banner);

        document.getElementById('pwaBtnInstall').onclick = function () {
            if (!_installPrompt) return;
            _installPrompt.prompt();
            _installPrompt.userChoice.then(function (result) {
                if (result.outcome === 'accepted') {
                    localStorage.setItem('azkarPWAInstalled', '1');
                    console.log('[PWA] User accepted install');
                } else {
                    localStorage.setItem('azkarPWADismissed', '1');
                }
                _installPrompt = null;
                banner.remove();
            });
        };

        document.getElementById('pwaBtnDismiss').onclick = function () {
            localStorage.setItem('azkarPWADismissed', '1');
            banner.style.opacity = '0';
            banner.style.transform = 'translateX(-50%) translateY(20px)';
            banner.style.transition = 'all 0.3s ease';
            setTimeout(function () { banner.remove(); }, 300);
        };

        // Auto-hide after 15 seconds
        setTimeout(function () {
            if (banner.parentNode) {
                banner.style.opacity = '0';
                banner.style.transition = 'opacity 0.4s ease';
                setTimeout(function () { if (banner.parentNode) banner.remove(); }, 400);
            }
        }, 15000);
    }

    // ── 3. Detect when PWA is installed ───────────────────────────
    window.addEventListener('appinstalled', function () {
        localStorage.setItem('azkarPWAInstalled', '1');
        var b = document.getElementById('pwaInstallBanner');
        if (b) b.remove();

        // Show success toast
        var toast = document.createElement('div');
        toast.style.cssText = [
            'position:fixed;bottom:80px;left:50%;transform:translateX(-50%)',
            'background:linear-gradient(135deg,#0f4a3a,#1a6b5a)',
            'border:1px solid rgba(201,168,76,0.4)',
            'border-radius:18px;padding:12px 22px',
            'display:flex;align-items:center;gap:10px',
            'box-shadow:0 8px 30px rgba(0,0,0,0.4)',
            "z-index:99999;font-family:'Cairo',sans-serif;color:#fff;font-size:0.88rem"
        ].join(';');
        toast.innerHTML = '<span style="font-size:1.4rem">✅</span> <span>تم تثبيت تطبيق أذكار بنجاح! ستصلك إشعارات الصلاة مع الأذان 🎉</span>';
        document.body.appendChild(toast);
        setTimeout(function () {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.4s ease';
            setTimeout(function () { toast.remove(); }, 400);
        }, 5000);

        console.log('[PWA] App installed successfully');
    });

    // ── 4. Detect if running as installed PWA ─────────────────────
    var isPWA = window.matchMedia('(display-mode: standalone)').matches
        || window.navigator.standalone === true;
    if (isPWA) {
        document.documentElement.classList.add('pwa-mode');
        localStorage.setItem('azkarPWAInstalled', '1');
        console.log('[PWA] Running as installed PWA');
    }

})();


/* ============================================================
   AZKAR v4.1 — ENHANCED THEME & MODE SYSTEM
   ============================================================ */

/* ── Morning Page: Enhanced Day/Evening visual mode ── */
(function enhanceMorningPage() {
    if (document.body.getAttribute('data-page') !== 'morning') return;

    /* Ripple keyframe injection */
    if (!document.getElementById('azkarRippleStyle')) {
        const st = document.createElement('style');
        st.id = 'azkarRippleStyle';
        st.textContent = '@keyframes azkarModeRipple { to { transform: translate(-50%,-50%) scale(22); opacity:0; } }';
        document.head.appendChild(st);
    }

    function createRipple(btn) {
        const r = document.createElement('span');
        r.style.cssText = [
            'position:absolute; border-radius:50%; pointer-events:none',
            'background:rgba(255,255,255,0.22); width:12px; height:12px',
            'top:50%; left:50%; transform:translate(-50%,-50%) scale(0)',
            'animation:azkarModeRipple 0.55s ease-out forwards'
        ].join(';');
        const prev = btn.style.position;
        const prevOv = btn.style.overflow;
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(r);
        setTimeout(() => {
            r.remove();
            btn.style.position = prev;
            btn.style.overflow = prevOv;
        }, 560);
    }

    function applyDayVisuals() {
        document.body.classList.remove('evening-mode');
        document.body.classList.add('morning-day-mode');
        /* Update page title meta theme-color */
        const tm = document.querySelector('meta[name="theme-color"]');
        if (tm) tm.content = '#1a4731';
    }

    function applyEveningVisuals() {
        document.body.classList.add('evening-mode');
        document.body.classList.remove('morning-day-mode');
        const tm = document.querySelector('meta[name="theme-color"]');
        if (tm) tm.content = '#060d1c';
    }

    document.addEventListener('DOMContentLoaded', function () {
        const btnDay = document.getElementById('btnDay');
        const btnNight = document.getElementById('btnNight');

        if (btnDay) {
            btnDay.addEventListener('click', function () {
                createRipple(this);
                setTimeout(applyDayVisuals, 40);
            });
        }
        if (btnNight) {
            btnNight.addEventListener('click', function () {
                createRipple(this);
                setTimeout(applyEveningVisuals, 40);
            });
        }

        /* Initial mode — synced with setDayMode/setNightMode in script.js */
        const saved = localStorage.getItem('AzkarMode');
        const hour = new Date().getHours();
        const isEvening = saved === 'night' || (!saved && (hour >= 16 || hour < 5));
        if (isEvening) applyEveningVisuals();
        else applyDayVisuals();
    });
})();

/* ── Global theme toggle icon animation ── */
(function enhanceThemeToggleIcon() {
    document.addEventListener('DOMContentLoaded', function () {
        /* Whenever the theme changes, animate the icon */
        const originalToggle = window.toggleGlobalTheme;
        if (!originalToggle) return;
        window.toggleGlobalTheme = function () {
            const btns = document.querySelectorAll('.theme-toggle-btn');
            btns.forEach(btn => {
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.style.transform = 'rotate(180deg) scale(0)';
                    icon.style.opacity = '0';
                    setTimeout(() => {
                        icon.style.transform = '';
                        icon.style.opacity = '';
                    }, 420);
                }
            });
            originalToggle();
        };
    });
})();

/* ── Initial theme application before DOMContentLoaded to prevent flash ── */
(function preventThemeFlash() {
    if (document.body.getAttribute('data-page') === 'morning') return;
    const saved = localStorage.getItem('ThemeMode');
    const hour = new Date().getHours();
    const isDark = saved === 'dark' || (!saved && (hour >= 18 || hour < 6));
    if (isDark) {
        document.body.classList.add('night-mode');
    } else {
        document.body.classList.remove('night-mode');
    }
})();