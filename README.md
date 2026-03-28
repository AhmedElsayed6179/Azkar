<div align="center">

<img src="assets/Background/Azkar-Icon.png" alt="أذكار" width="110" />

# 📿 موقع أذكار — Azkar Website

**منصة إسلامية شاملة للأذكار اليومية الصحيحة الثابتة عن النبيﷺ**
<br/>
*A comprehensive Islamic platform for authentic daily Dhikr from the Prophet ﷺ*

[![Live Demo](https://img.shields.io/badge/🌐_Demo_مباشر-GitHub_Pages-1a6b5a?style=for-the-badge)](https://ahmedelsayed6179.github.io/Azkar)
[![Version](https://img.shields.io/badge/الإصدار-v4.0-c9a84c?style=for-the-badge)](#)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-Free_غير_ربحي-c9a84c?style=for-the-badge)](#)

</div>

---

<div dir="rtl">

> **العربية** | [English ↓](#english)

## 📖 نبذة عن المشروع

**موقع أذكار** هو منصة إسلامية مجانية وغير ربحية، تهدف إلى تذكير المسلمين بالأذكار اليومية الصحيحة المأثورة عن النبي محمد ﷺ، مع مواقيت صلاة دقيقة لجميع محافظات مصر الـ27.

> *"وَالذَّاكِرِينَ اللَّهَ كَثِيرًا وَالذَّاكِرَاتِ أَعَدَّ اللَّهُ لَهُم مَّغْفِرَةً وَأَجْرًا عَظِيمًا"*
> — سورة الأحزاب: ٣٥

## ✨ الصفحات والمحتوى

| الصفحة | المحتوى |
|--------|---------|
| 🌅 الصفحة الرئيسية | أذكار الصباح والمساء مع عداد تفاعلي |
| 🕌 أذكار الصلاة | الأذكار الثابتة قبل الصلاة وبعدها |
| 🍽️ أذكار الطعام | أذكار الأكل والشرب |
| 😴 أذكار النوم | أذكار ما قبل النوم والاستيقاظ |
| 🏠 أذكار المنزل | أذكار الدخول والخروج |
| 📆 أذكار يومية | مجموعة متنوعة من الأذكار اليومية |
| 👶 أذكار الأطفال | أذكار مبسطة مناسبة للأطفال |
| ✈️ أذكار السفر | أذكار المسافر |
| 🤒 أذكار المرض | أدعية الشفاء والعافية |
| 🕐 مواقيت الصلاة | مواقيت دقيقة لـ 27 محافظة مع عداد تنازلي واتجاه القبلة |

## ⚙️ المزايا التقنية

- 🌙 وضع ليلي / نهاري — تبديل تلقائي حسب الوقت
- 💾 حفظ التقدم تلقائياً عبر LocalStorage يومياً
- 🔄 إعادة تعيين يومي — مع رسالة تنبيه إن لم يُقرأ أي ذكر
- 📱 تصميم متجاوب يعمل على جميع الأجهزة والشاشات
- 🔗 نسخ رابط الصفحة بضغطة واحدة
- 🧭 نافبار من صفين — شريط تنقل قابل للتمرير مع أيقونات
- 🕋 بوصلة قبلة حية — الكعبة ثابتة والإبرة تشير نحوها تلقائياً بالـ GPS وجيروسكوب الجهاز
- 📅 التاريخ الهجري بجانب الميلادي
- ⏰ التوقيت الصيفي والشتوي يُطبق تلقائياً

## 🗂️ هيكل المشروع

```
Azkar/
├── index.html              ← الصفحة الرئيسية — أذكار الصباح والمساء
├── azkar-salah.html        ← أذكار الصلاة
├── azkar-food.html         ← أذكار الطعام
├── azkar-sleep.html        ← أذكار النوم
├── azkar-home.html         ← أذكار المنزل
├── azkar-daily.html        ← أذكار يومية
├── azkar-children.html     ← أذكار الأطفال
├── azkar-travel.html       ← أذكار السفر
├── azkar-sick.html         ← أذكار المرض
├── prayer-times.html       ← مواقيت الصلاة — 27 محافظة
├── style.css               ← نظام التصميم الموحد
├── script.js               ← المنطق التفاعلي وإدارة الحالة
└── assets/
    ├── Background/         ← خلفيات وأيقونات
    └── png/                ← صور إضافية
```

## 🛠️ التقنيات المستخدمة

| التقنية | الاستخدام |
|---------|-----------|
| **HTML5** | هيكل دلالي مع دعم RTL كامل |
| **CSS3** | متغيرات، Flexbox/Grid، انتقالات سلسة |
| **Vanilla JavaScript** | منطق تفاعلي بدون مكتبات خارجية |
| **Adhan.js** | حسابات مواقيت الصلاة الفلكية |
| **LocalStorage API** | حفظ التقدم اليومي |
| **Font Awesome 6** | أيقونات احترافية |
| **Google Fonts** | Amiri · Cairo · Noto Kufi Arabic |

## 🚀 تشغيل المشروع محلياً

```bash
# استنساخ المستودع
git clone https://github.com/ahmedelsayed6179/Azkar.git
cd Azkar

# فتح الصفحة مباشرة — لا يحتاج خادم
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

## 📐 حساب مواقيت الصلاة

- **Adhan.js** — مكتبة حسابات فلكية دقيقة ومعتمدة
- **إحداثيات GPS** لعواصم المحافظات الـ27
- **معيار رابطة العالم الإسلامي (MWL)** للفجر والعشاء
- **التوقيت الصيفي** يُطبق تلقائياً: آخر جمعة أبريل ← آخر جمعة أكتوبر `(UTC+3)`
- **التوقيت الشتوي**: `UTC+2`


## 📋 سجل التغييرات — v4.0

### ✅ تحديثات هذا الإصدار

#### 🧭 النافبار — تصميم جديد
- **نظام صفّين**: الشعار منفصل في الأعلى، والروابط في شريط أسفله
- **تمرير أفقي** — لا ضغط أو تكديس مهما كان عدد الروابط
- أيقونة FontAwesome مع كل رابط لتمييزه بصرياً
- الرابط النشط يُبرز بحد ذهبي وخلفية شفافة

#### 🕋 بوصلة القبلة — منطق عالمي صحيح
| | قبل v4 | v4 ✅ |
|---|---|---|
| الكعبة 🕋 | إبرة تتحرك مع الجهاز | **ثابتة فوق البوصلة** مع توهج ذهبي |
| الإبرة | الكعبة نفسها | إبرة ذهبية منفصلة تشير للقبلة |
| الجيروسكوب | الكعبة تدور | **حلقة N/S/E/W** تدور ليبقى الشمال صحيحاً |
| التعليمات | لا يوجد | رسالة توجيه تختفي بعد تفعيل الجيروسكوب |

## 📜 الترخيص

© 2026 **أحمد محمد** — جميع الحقوق محفوظة.
هذا المشروع مجاني تماماً وغير ربحي.

</div>

---

<a name="english"></a>

> [العربية ↑](#) | **English**

## 📖 About

**Azkar Website** is a free, non-profit Islamic platform providing authentic daily Dhikr from the Prophet Muhammad ﷺ, along with precise prayer times for all 27 Egyptian governorates.

> *"And the men who remember Allah often and the women who do so — for them Allah has prepared forgiveness and a great reward."*
> — Quran 33:35

## ✨ Pages & Content

| Page | Content |
|------|---------|
| 🌅 Home | Morning & Evening Adhkar with interactive counter |
| 🕌 Prayer Adhkar | Authentic Dhikr before and after Salah |
| 🍽️ Food Adhkar | Eating and drinking supplications |
| 😴 Sleep Adhkar | Before sleep and upon waking |
| 🏠 Home Adhkar | Entering and leaving the house |
| 📆 Daily Adhkar | General daily remembrance collection |
| 👶 Children Adhkar | Simple Adhkar for children |
| ✈️ Travel Adhkar | Traveler's supplications |
| 🤒 Illness Adhkar | Healing and wellness duas |
| 🕐 Prayer Times | Accurate times for 27 Egyptian governorates with countdown & Qibla |

## ⚙️ Technical Features

- 🌙 Dark / Light mode — auto-switches by time of day
- 💾 Daily progress auto-saved via LocalStorage
- 🔄 Smart reset — shows alert if no Dhikr has been read
- 📱 Fully responsive on all screen sizes and devices
- 🔗 One-tap link sharing
- 🧭 Two-row navbar — horizontally scrollable navigation strip with icons
- 🕋 Live Qibla compass — Kaaba icon fixed at top, needle points toward it via GPS + gyroscope
- 📅 Hijri date alongside Gregorian
- ⏰ Summer / Winter DST applied automatically

## 🗂️ Project Structure

```
Azkar/
├── index.html              ← Home — Morning & Evening Adhkar
├── azkar-salah.html        ← Prayer Adhkar
├── azkar-food.html         ← Food Adhkar
├── azkar-sleep.html        ← Sleep Adhkar
├── azkar-home.html         ← Home Adhkar
├── azkar-daily.html        ← Daily Adhkar
├── azkar-children.html     ← Children Adhkar
├── azkar-travel.html       ← Travel Adhkar
├── azkar-sick.html         ← Illness Adhkar
├── prayer-times.html       ← Prayer Times (27 Governorates)
├── style.css               ← Unified Design System
├── script.js               ← Interactive Logic & State Management
└── assets/
    ├── Background/         ← Backgrounds & Icons
    └── png/                ← Additional Images
```

## 🛠️ Technologies

| Technology | Usage |
|------------|-------|
| **HTML5** | Semantic markup with full RTL support |
| **CSS3** | Variables, Flexbox/Grid, smooth transitions |
| **Vanilla JavaScript** | Interactive logic, zero dependencies |
| **Adhan.js** | Astronomical prayer time calculations |
| **LocalStorage API** | Daily progress persistence |
| **Font Awesome 6** | Professional icons |
| **Google Fonts** | Amiri · Cairo · Noto Kufi Arabic |

## 🚀 Getting Started

```bash
git clone https://github.com/ahmedelsayed6179/Azkar.git
cd Azkar
# Open index.html directly — no server required
```

## 📐 Prayer Time Calculation

- **Adhan.js** for precise astronomical calculations
- **GPS coordinates** for capital cities of all 27 governorates
- **Muslim World League (MWL)** calculation method
- **Summer DST** auto-applied: last Friday of April → last Friday of October `(UTC+3)`
- **Winter standard time**: `UTC+2`

## 🤝 Contributing

```bash
git checkout -b feature/your-feature-name
git commit -m "Add: description of change"
git push origin feature/your-feature-name
# Then open a Pull Request
```


## 📋 Changelog — v4.0

### ✅ What's New

#### 🧭 Navbar — New two-row design
- Logo row separated from navigation strip
- Horizontally scrollable nav — no more cramped links
- FontAwesome icon beside each nav link
- Active link highlighted with gold underline + subtle background

#### 🕋 Qibla Compass — Correct global-standard logic
| | Before v4 | v4 ✅ |
|---|---|---|
| Kaaba 🕋 | Needle tip (moves) | **Fixed above compass** with gold glow |
| Needle | Was the Kaaba emoji | Separate gold needle pointing to Qibla |
| Gyroscope | Kaaba rotated | **N/S/E/W ring rotates** — North always correct |
| User hint | None | Guidance message hides once gyro activates |

## 📜 License

© 2026 **أحمد محمد (Ahmed Mohamed)** — All rights reserved.
Free for personal and educational use. Non-commercial project.

---

<div align="center">

**تقبل الله منا ومنكم صالح الأعمال** 🤲
<br/>
*May Allah accept our good deeds*

Made with ❤️ in Egypt &nbsp;|&nbsp; **أحمد محمد**

</div>
