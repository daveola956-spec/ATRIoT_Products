const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".site-nav a");
const sections = document.querySelectorAll("main section[id]");
const header = document.querySelector(".site-header");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealItems.forEach((item, index) => {
  const explicitDelay = Number(item.dataset.delay || 0);
  const fallbackDelay = Math.min(index * 30, 180);
  item.style.transitionDelay = `${explicitDelay || fallbackDelay}ms`;
  revealObserver.observe(item);
});

const setActiveLink = () => {
  const scrollMarker = window.scrollY + 180;
  let activeId = "";

  sections.forEach((section) => {
    if (scrollMarker >= section.offsetTop) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("is-active", isActive);
  });
};

const syncHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 18);
  setActiveLink();
};

window.addEventListener("scroll", syncHeaderState, { passive: true });
window.addEventListener("load", syncHeaderState);
syncHeaderState();
