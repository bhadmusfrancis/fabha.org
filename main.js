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

const CONTACT_EMAIL = "francis@fabha.org";
const MIN_SUBMIT_MS = 2800;
const TOKEN_PREFIX = "fabha";

function makeFormToken() {
  const rand = Math.random().toString(36).slice(2, 10);
  return `${TOKEN_PREFIX}-${Date.now().toString(36)}-${rand}`;
}

function botSignals(data, startedAt, expectedToken) {
  const honey = String(data.get("website") || "").trim();
  const token = String(data.get("form_token") || "").trim();
  const human = data.get("human");
  const elapsed = Date.now() - startedAt;
  return {
    honey: Boolean(honey),
    noHuman: !human,
    badToken: !token || token !== expectedToken || !token.startsWith(`${TOKEN_PREFIX}-`),
    tooFast: !Number.isFinite(startedAt) || elapsed < MIN_SUBMIT_MS,
  };
}

function setFormStatus(form, message, type) {
  const status = form.querySelector(".form-status");
  if (!status) return;
  status.hidden = !message;
  status.textContent = message || "";
  status.classList.toggle("is-error", type === "error");
  status.classList.toggle("is-ok", type === "ok");
}

document.querySelectorAll("form[data-bot-guard], .project-form").forEach((form) => {
  const tokenInput = form.querySelector('input[name="form_token"]');
  const startedInput = form.querySelector('input[name="form_started"]');
  const submitBtn = form.querySelector('button[type="submit"]');
  let startedAt = Date.now();
  let token = makeFormToken();

  const armGuard = () => {
    startedAt = Date.now();
    token = makeFormToken();
    if (tokenInput) tokenInput.value = token;
    if (startedInput) startedInput.value = String(startedAt);
  };

  armGuard();
  if (submitBtn) submitBtn.disabled = false;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setFormStatus(form, "", null);

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const company = String(data.get("company") || "").trim();
    const service = String(data.get("service") || "").trim();
    const message = String(data.get("message") || "").trim();

    const signals = botSignals(data, startedAt, token);
    if (signals.honey || signals.badToken) {
      // Silent decoy for automated spam — do not open mail.
      form.reset();
      armGuard();
      setFormStatus(form, "Thanks — if everything looks right, your email client will open next.", "ok");
      return;
    }

    if (signals.noHuman) {
      setFormStatus(form, "Confirm you are a real person before sending.", "error");
      return;
    }

    if (signals.tooFast) {
      setFormStatus(form, "Please review your message for a moment, then try sending again.", "error");
      return;
    }

    if (!name || !email || !message) {
      setFormStatus(form, "Please complete the required fields before sending.", "error");
      return;
    }

    if (message.length < 20) {
      setFormStatus(form, "Add a bit more detail (at least a couple of sentences) so we can respond usefully.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormStatus(form, "Enter a valid email address so we can reply.", "error");
      return;
    }

    const subject = encodeURIComponent(`Project inquiry${service ? ` — ${service}` : ""}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nService: ${service}\n\n${message}`
    );
    setFormStatus(form, "Opening your email client…", "ok");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  });
});

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
