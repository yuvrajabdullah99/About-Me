// Hamburger menu
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger) {
  hamburger.addEventListener("click", mobileMenu);

  function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  }

  const navLink = document.querySelectorAll(".nav-link");
  navLink.forEach((n) => n.addEventListener("click", closeMenu));

  function closeMenu() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  }
}

// Theme is permanently dark
document.documentElement.setAttribute("data-theme", "dark");

// Footer year
const datee = document.querySelector("#datee");
if (datee) datee.innerHTML = new Date().getFullYear();

// Typing effect
const line1El = document.getElementById("typing-line-1");
const line2El = document.getElementById("typing-line-2");

if (line1El && line2El) {
  const line1Text = "Transforming Data Into";
  const line2Text = "Business Value Through Analytics & Insights.";

  function typeText(element, text, callback) {
    let i = 0;
    const cursor = document.createElement("span");
    cursor.classList.add("typing-cursor");
    element.appendChild(cursor);

    const interval = setInterval(() => {
      cursor.before(document.createTextNode(text[i]));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        cursor.remove();
        if (callback) callback();
      }
    }, 50);
  }

  window.addEventListener("load", () => {
    setTimeout(() => {
      typeText(line1El, line1Text, () => {
        setTimeout(() => typeText(line2El, line2Text), 200);
      });
    }, 400);
  });
}

// Fade-in on scroll
const fadeEls = document.querySelectorAll(".fade-up");

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach((el) => fadeObserver.observe(el));

// Page transition — outgoing (index page only)
const overlay = document.querySelector(".page-transition");

document.querySelectorAll(".transition-link, .project-link-card").forEach((el) => {
  el.addEventListener("click", function (e) {
    const href = this.getAttribute("href") || this.dataset.href;
    if (!href || href === "#") return;
    e.preventDefault();
    if (overlay) overlay.classList.add("is-leaving");
    setTimeout(() => { window.location.href = href; }, 500);
  });
});
