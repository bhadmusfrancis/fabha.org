document.querySelectorAll("#year").forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

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
    if (!open) {
      nav.querySelectorAll(".nav-item.is-open").forEach((item) => item.classList.remove("is-open"));
    }
  });
}

nav?.querySelectorAll(".nav-item > .nav-link").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    if (window.matchMedia("(max-width: 980px)").matches) {
      event.preventDefault();
      const item = btn.closest(".nav-item");
      const wasOpen = item.classList.contains("is-open");
      nav.querySelectorAll(".nav-item.is-open").forEach((el) => el.classList.remove("is-open"));
      if (!wasOpen) item.classList.add("is-open");
    }
  });
});

nav?.querySelectorAll("a[href]").forEach((link) => {
  link.addEventListener("click", () => {
    if (!topBar || !navToggle) return;
    if (link.classList.contains("nav-link")) return;
    topBar.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  });
});

const dock = document.querySelector(".connect-dock");
const dockToggle = document.querySelector(".connect-toggle");
if (dock && dockToggle) {
  dockToggle.addEventListener("click", () => {
    const open = dock.classList.toggle("is-open");
    dockToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.addEventListener("click", (event) => {
    if (!dock.contains(event.target)) {
      dock.classList.remove("is-open");
      dockToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const form = document.querySelector(".project-form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const company = String(data.get("company") || "").trim();
    const service = String(data.get("service") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = encodeURIComponent(`Project inquiry${service ? ` — ${service}` : ""}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nService: ${service}\n\n${message}`
    );
    window.location.href = `mailto:hello@fabha.org?subject=${subject}&body=${body}`;
  });
}

const revealTargets = document.querySelectorAll(
  ".section-head, .feature-project, .project, .service-list li, .page-card, .stat-block, .agency-panel > *, .review-card, .steps li, .values-grid article, .contact-inner > *, .detail-list li, .audience-grid > *"
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
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  revealTargets.forEach((el) => io.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("is-visible"));
}
