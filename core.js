// Zekr Info
let infoBtn = document.querySelectorAll(".infoBtn");
let sourceHidden = document.querySelectorAll(".sourceHidden");
let doneBtn = document.querySelectorAll(".doneBtn");

for (let g = 0; g < infoBtn.length; g++) {
  infoBtn[g].onclick = function () {
    infoBtn[g].classList.toggle("deactive");
    sourceHidden[g].classList.toggle("active");

    setTimeout(() => {
      doneBtn[g].classList.remove("deactive");
    }, 300);
  };

  doneBtn[g].onclick = function () {
    infoBtn[g].classList.toggle("deactive");
    sourceHidden[g].classList.toggle("active");
    doneBtn[g].classList.add("deactive");
  };

  // Close Info When Clicked On Anywhere On Site
  window.addEventListener("click", (e) => {
    if (e.target !== doneBtn[g] && e.target !== infoBtn[g]) {
      infoBtn[g].classList.remove("deactive");
      sourceHidden[g].classList.remove("active");
      doneBtn[g].classList.add("deactive");
    }
  });
}

// ------------------------------------------------------------- FUNCTIONS

function toggleMenuElements() {
  menuElements.classList.toggle("show");
  menuBtn.classList.toggle("close");
  menuBtnX.classList.toggle("show");
  blackMate.classList.toggle("close");
}

// ------------------------------------------------------------- FUNCTIONS

// MENU
const menuElementsBtn = document.querySelector(".menu a"); // زر القائمة
const menuElements = document.querySelector(".menuElements"); // القائمة

let menuBtn = document.querySelector(".menu");
let menuBtnX = document.querySelector(".menuX");
let blackMate = document.querySelector(".blackMate");

menuElementsBtn.addEventListener("click", () => {
  toggleMenuElements();
});

menuBtnX.addEventListener("click", () => {
  toggleMenuElements();
});

// -------------------------------------------------------------

// Close Menu Elements If Clicked Outside Menu
window.addEventListener("click", (e) => {
  if (menuElements.classList.contains("show")) {
    if (!menuElements.contains(e.target) && !menuBtn.contains(e.target)) {
      toggleMenuElements();
    }
  }
});

// -------------------------------------------------------------

// Close Menu Elements If Scorll
window.addEventListener("scroll", () => {
  if (window.scrollY >= 400) {
    if (menuElements.classList.contains("show")) {
      toggleMenuElements();
    }
  }
});

// ----------------------------------------------------------

// Write Year On Footer
let myFooter = document.querySelector(".footer");
let yearParagraph = document.createElement("h3");

yearParagraph.textContent = `Copyright © ${new Date().getFullYear()}`;
myFooter.appendChild(yearParagraph);

// ----------------------------------------------------------

// Preloader hide after page load
window.addEventListener("load", () => {
  setTimeout(() => {
    const preloader = document.getElementById("preloader");
    preloader.style.opacity = "0";
    preloader.style.transition = "opacity 0.5s ease";
    setTimeout(() => (preloader.style.display = "none"), 500);
  }, 500);
});
