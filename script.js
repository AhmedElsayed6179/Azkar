// ------------------------- المتغيرات العامة -------------------------
let switchBtnDay = document.querySelector(".theSwitshBtnDay");
let switchBtnNight = document.querySelector(".theSwitshBtnNight");
let azkarDay = document.querySelector(".Azkar.Day");
let azkarNight = document.querySelector(".Azkar.Night");

let moreZekr = document.getElementsByClassName("moreAzkar");
let moreZekrArr = [...moreZekr];
let textForMoreAzkar = document.querySelector(".knowMoreAzkar");
let index = new Date().getDate() % moreZekrArr.length;
let moreAzkarLastPage = `هل تعرف <a href="${moreZekrArr[index].href}">${moreZekrArr[index].innerHTML}</a> ؟`;

let timeNow = new Date();
let dayTime = new Date();
dayTime.setHours(5, 0, 0, 0);
let nightTime = new Date();
nightTime.setHours(16, 30, 0, 0);

let allButtons = document.getElementsByClassName("smlNum");
let allButtonsArr = [...allButtons];
let allSpans = document.querySelectorAll("span");
let allSpansArr = [...allSpans];
let lastDayZekr = document.getElementById("last1");
let indexOfLastDayZekr = allButtonsArr.indexOf(lastDayZekr);
let lastNightZekr = document.getElementById("last2");
let indexOfLastNightZekr = allButtonsArr.indexOf(lastNightZekr);
let allBoxDivs = document.querySelectorAll(".box");

let theHead = document.querySelector(".header");
let theFoter = document.querySelector(".footer");
let footerLink = document.querySelector(".footer .link");
let downBtn = document.querySelector(".downBtn");
let upBtn = document.querySelector(".upBtn");
let linksMoreZekr = document.querySelector(".linksMoreZekr");

let menuElementsBtn = document.querySelector(".menuElementsBtn");
let menuElements = document.querySelector(".menuElements");
let menuElementsBtnX = document.querySelector(".menuElementsBtnX");

let infoElementsBtn = document.querySelector(".infoElementsBtn");
let infoElementsBtnX = document.querySelector(".infoElementsBtnX");
const infoBtn = document.querySelector(".infoElementsBtn");
const infoBtnX = document.querySelector(".infoElementsBtnX");
const infoElements = document.querySelector(".infoElements");

let blackMate = document.querySelector(".blackMate");
let getLink = document.querySelector(".getLink");
let alertMsg = document.querySelector(".alert");

// ------------------------- تحديث رابط moreAzkar -------------------------
function updateMoreAzkarLink(mode) {
  let linkClass = `more-azkar-link ${mode}`;
  textForMoreAzkar.innerHTML = `هل تعرف 
        <a class="${linkClass}" href="${moreZekrArr[index].href}">
            ${moreZekrArr[index].innerHTML}
        </a> ؟`;
  window.localStorage.setItem("AzkarMode", mode);
}

// ------------------------- Day & Night Functions -------------------------
function dayAzkar() {
  downBtn.classList.remove("night");
  upBtn.classList.remove("night");
  linksMoreZekr.classList.remove("night");
  downBtn.classList.add("day");
  upBtn.classList.add("day");
  linksMoreZekr.classList.add("day");
  switchBtnNight.classList.add("deactive");
  switchBtnDay.classList.remove("deactive");
  azkarDay.style.display = "";
  azkarNight.style.display = "none";

  theHead.classList.remove("night");
  theFoter.classList.remove("night");

  allBoxDivs.forEach((box) => box.classList.remove("night"));
  window.localStorage.setItem("Azkar Day", "اذكار الصباح");
  window.localStorage.removeItem("Azkar Night");
  menuElements.classList.remove("night");

  updateMoreAzkarLink("day");
}

function nightAzkar() {
  downBtn.classList.remove("day");
  upBtn.classList.remove("day");
  linksMoreZekr.classList.remove("day");
  downBtn.classList.add("night");
  upBtn.classList.add("night");
  linksMoreZekr.classList.add("night");
  switchBtnDay.classList.add("deactive");
  switchBtnNight.classList.remove("deactive");
  azkarDay.style.display = "none";
  azkarNight.style.display = "";

  theHead.classList.add("night");
  theFoter.classList.add("night");

  allBoxDivs.forEach((box) => box.classList.add("night"));
  window.localStorage.setItem("Azkar Night", "اذكار المساء");
  window.localStorage.removeItem("Azkar Day");
  menuElements.classList.add("night");

  updateMoreAzkarLink("night");
}

function updateFooterLinkMode(mode) {
  footerLink.classList.remove("day", "night");
  footerLink.classList.add(mode);
}

let userMode = localStorage.getItem("AzkarMode");

if (userMode) {
  updateFooterLinkMode(userMode);
} else {
  updateFooterLinkMode("day");
}

// ------------------------- Event Listeners -------------------------
switchBtnDay.addEventListener("click", () => {
  dayAzkar();
  window.localStorage.setItem("User Choice", "اذكار الصباح");
  window.localStorage.setItem("Hours", timeNow.getHours());
});

switchBtnNight.addEventListener("click", () => {
  nightAzkar();
  window.localStorage.setItem("User Choice", "اذكار المساء");
  window.localStorage.setItem("Hours", timeNow.getHours());
});

switchBtnDay.addEventListener("click", () => {
  updateFooterLinkMode("day");
  localStorage.setItem("AzkarMode", "day");
});

switchBtnNight.addEventListener("click", () => {
  updateFooterLinkMode("night");
  localStorage.setItem("AzkarMode", "night");
});

// ------------------------- Onload Window -------------------------
window.addEventListener("DOMContentLoaded", () => {
  addBlack();
  setTimeout(() => closeBlack(), 100);
  // remove addBlack() and closeBlack() If You Want It

  // حفظ الاختيار السابق
  let savedMode = window.localStorage.getItem("AzkarMode");
  if (savedMode) {
    updateMoreAzkarLink(savedMode);
    if (savedMode === "day") dayAzkar();
    else nightAzkar();
  } else {
    let hour = new Date().getHours();
    if (hour >= 5 && hour < 16.5) dayAzkar();
    else nightAzkar();
  }

  // Reset Azkar Values daily
  if (window.localStorage.getItem("Date")) {
    if (Number(window.localStorage.getItem("Date")) !== timeNow.getDate()) {
      for (r = 0; r < allButtonsArr.length; r++) {
        window.localStorage.removeItem(`Read Zekr ${r + 1}`);
      }
      window.localStorage.removeItem("Azkar Day");
      window.localStorage.removeItem("Azkar Night");
      window.localStorage.setItem("Date", timeNow.getDate());
    }
  } else {
    window.localStorage.setItem("Date", timeNow.getDate());
  }

  // تحديث رابط moreAzkar عند البداية
  if (!window.localStorage.getItem("Page Is Ready")) {
    textForMoreAzkar.innerHTML = moreAzkarLastPage;
    window.localStorage.setItem("Page Is Ready", "Done");
  }
});

// ------------------------- Buttons Read Numbers -------------------------
function setupZekrButtons(startIndex, endIndex) {
  for (let i = startIndex; i <= endIndex; i++) {
    let myReadNum = Number(allButtons[i].innerText.split("/")[0].trim());
    let myFullNum = Number(allButtons[i].innerText.split("/")[1].trim());
    let getReadNum = window.localStorage.getItem(`Read Zekr ${i + 1}`);
    if (getReadNum) myReadNum = Number(getReadNum);
    allSpans[i].innerText = myReadNum;

    if (myReadNum === myFullNum) {
      allButtonsArr[i].disabled = true;
      allButtonsArr[i].classList.add("deactive");
      allSpansArr[i].classList.add("deactive");
    }

    allButtonsArr[i].addEventListener("click", function () {
      if (myReadNum < myFullNum) {
        myReadNum++;
        allSpans[i].innerText = myReadNum;
      }

      if (myReadNum === myFullNum) {
        allButtonsArr[i].disabled = true;
        allButtonsArr[i].classList.add("deactive");
        allSpansArr[i].classList.add("deactive");
        if (allButtonsArr[i + 1])
          setTimeout(() => {
            allBoxDivs[i + 1].scrollIntoView({
              block: "center",
              behavior: "smooth",
            });
          }, 50);
      }
      window.localStorage.setItem(`Read Zekr ${i + 1}`, myReadNum);
      window.localStorage.setItem("Date", timeNow.getDate());
    });
  }
}

setupZekrButtons(0, indexOfLastDayZekr + 1);
setupZekrButtons(0, indexOfLastNightZekr);

// ------------------------- Menu & Info Functions -------------------------
function openMenuElements() {
  menuElements.classList.add("show");
  menuElementsBtn.classList.add("close");
  menuElementsBtnX.classList.add("show");
}
function closeMenuElements() {
  menuElements.classList.remove("show");
  menuElementsBtn.classList.remove("close");
  menuElementsBtnX.classList.remove("show");
}
function openInfoMenu() {
  infoElements.classList.add("show");
  infoElementsBtn.classList.add("close");
  infoElementsBtnX.classList.add("show");
}
function closeInfoMenu() {
  infoElements.classList.remove("show");
  infoElementsBtn.classList.remove("close");
  infoElementsBtnX.classList.remove("show");
}
function addBlack() {
  blackMate.classList.remove("close");
}
function closeBlack() {
  blackMate.classList.add("close");
}

// ------------------------- Menu Event Listeners -------------------------
menuElementsBtn.addEventListener("click", () => {
  if (infoElements.classList.contains("show")) closeInfoMenu();
  openMenuElements();
  addBlack();
});
menuElementsBtnX.addEventListener("click", () => {
  closeMenuElements();
  closeBlack();
});
infoElementsBtn.addEventListener("click", () => {
  if (menuElements.classList.contains("show")) closeMenuElements();
  openInfoMenu();
  addBlack();
});
infoElementsBtnX.addEventListener("click", () => {
  closeInfoMenu();
  closeBlack();
});

window.addEventListener("click", (e) => {
  if (
    infoElements.classList.contains("show") &&
    !infoElements.contains(e.target) &&
    !infoElementsBtn.contains(e.target)
  )
    closeInfoMenu(), closeBlack();
  if (
    menuElements.classList.contains("show") &&
    !menuElements.contains(e.target) &&
    !menuElementsBtn.contains(e.target)
  )
    closeMenuElements(), closeBlack();
  if (
    linksMoreZekr.classList.contains("active") &&
    !theHead.contains(e.target) &&
    !downBtn.contains(e.target) &&
    !upBtn.contains(e.target)
  ) {
    downBtn.classList.remove("deactive");
    linksMoreZekr.classList.remove("active");
    upBtn.classList.remove("active");
  }
});

window.addEventListener("scroll", () => {
  if (window.scrollY >= 400 && menuElements.classList.contains("show"))
    closeMenuElements(), closeBlack();
  if (window.scrollY >= 500 && infoElements.classList.contains("show"))
    closeInfoMenu(), closeBlack();
});

// ------------------------- More Azkar Buttons -------------------------
downBtn.addEventListener("click", () => {
  downBtn.classList.add("deactive");
  linksMoreZekr.classList.add("active");
  upBtn.classList.add("active");
});
upBtn.addEventListener("click", () => {
  downBtn.classList.remove("deactive");
  linksMoreZekr.classList.remove("active");
  upBtn.classList.remove("active");
});

// ------------------------- Copy Link Alert -------------------------
getLink.addEventListener("click", (e) => {
  e.preventDefault();
  navigator.clipboard.writeText(window.location.href);
  alertMsg.classList.remove("close");
  setTimeout(() => alertMsg.classList.add("close"), 5000);
});

// ------------------------- Footer Year -------------------------
let yearParagraph = document.createElement("h3");
yearParagraph.textContent = `Copyright © ${new Date().getFullYear()}`;
theFoter.appendChild(yearParagraph);

// Preloader hide after page load
window.addEventListener("load", () => {
  setTimeout(() => {
    const preloader = document.getElementById("preloader");
    preloader.style.opacity = "0";
    preloader.style.transition = "opacity 0.5s ease";
    setTimeout(() => (preloader.style.display = "none"), 500);
  }, 500);
});

infoBtn.addEventListener("click", (e) => {
  e.preventDefault();
  infoElements.classList.add("show");
});

infoBtnX.addEventListener("click", (e) => {
  e.preventDefault();
  infoElements.classList.remove("show");
});

function toggleMenuElements() {
  menuElements.classList.toggle("show");
  menuBtn.classList.toggle("close");
  menuBtnX.classList.toggle("show");
  blackMate.classList.toggle("close");
}

let infoBtns = document.querySelectorAll(".infoBtn");
let sourceHiddens = document.querySelectorAll(".sourceHidden");
let doneBtns = document.querySelectorAll(".doneBtn");

infoBtns.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    btn.classList.add("deactive");
    sourceHiddens[i].classList.add("active");
    setTimeout(() => doneBtns[i].classList.remove("deactive"), 300);
  });

  doneBtns[i].addEventListener("click", () => {
    btn.classList.remove("deactive");
    sourceHiddens[i].classList.remove("active");
    doneBtns[i].classList.add("deactive");
  });

  window.addEventListener("click", (e) => {
    if (e.target !== btn && e.target !== doneBtns[i]) {
      btn.classList.remove("deactive");
      sourceHiddens[i].classList.remove("active");
      doneBtns[i].classList.add("deactive");
    }
  });
});

let selectionStyle = document.createElement("style");
document.head.appendChild(selectionStyle);

function updateSelectionColor(mode) {
  if (mode === "night") {
    selectionStyle.textContent = `
            ::selection {
                background-color: #214e69;
                color: #fff;
            }
        `;
  } else {
    selectionStyle.textContent = `
            ::selection {
                background-color: #256358;
                color: #fff;
            }
        `;
  }
}

// عند اختيار النهار
switchBtnDay.addEventListener("click", () => {
  updateSelectionColor("day");
});

// عند اختيار الليل
switchBtnNight.addEventListener("click", () => {
  updateSelectionColor("night");
});

// تفعيل الوضع المحفوظ عند تحميل الصفحة
window.addEventListener("DOMContentLoaded", () => {
  let savedMode = localStorage.getItem("AzkarMode") || "day";
  updateSelectionColor(savedMode);
});
