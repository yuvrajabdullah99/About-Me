// Scroll reveal
const reveals = document.querySelectorAll(".pg-reveal");

if (reveals.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach((el) => revealObserver.observe(el));
}

// Page transition — back button
const overlay = document.querySelector(".page-transition");

document.querySelectorAll(".transition-link").forEach((el) => {
  el.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (!href || href === "#") return;
    e.preventDefault();
    if (overlay) overlay.classList.add("is-leaving");
    setTimeout(() => { window.location.href = href; }, 500);
  });
});