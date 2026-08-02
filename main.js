document.getElementById("year").textContent = String(new Date().getFullYear());

const topBar = document.querySelector(".top");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("primary-nav");

const onScroll = () => {
  if (!topBar) return;
  topBar.classList.toggle("is-scrolled", window.scrollY > 8);
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

if (navToggle && topBar && nav) {
  navToggle.addEventListener("click", () => {
    const open = topBar.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      topBar.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    });
  });
}

const revealTargets = document.querySelectorAll(
  ".section-head, .feature-project, .project, .service-list li, .solutions-split, .agency-band, .steps li, .contact-inner > *"
);
revealTargets.forEach((el) => el.classList.add("reveal"));

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
  );
  revealTargets.forEach((el) => io.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("is-visible"));
}
