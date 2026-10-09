/* ============================================================
   Stiven Deryl Imanuel Pyo, portfolio interactions
   Motion: one-time reveal, restrained hover, manual gallery.
   System: DESIGN.md
   ============================================================ */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- rAF-throttled scroll handler ---------- */

  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateProgress();
      updateNavbar();
      updateBackToTop();
      ticking = false;
    });
  };

  const progress = document.querySelector(".page-progress");
  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = pct + "%";
  };

  /* ---------- navbar scrolled state ---------- */

  const navbar = document.getElementById("navbar");
  const updateNavbar = () => {
    if (!navbar) return;
    navbar.classList.toggle("navbar--scrolled", window.scrollY > 20);
  };

  /* ---------- back to top ---------- */

  const backToTop = document.getElementById("backToTop");
  const updateBackToTop = () => {
    if (!backToTop) return;
    backToTop.classList.toggle("is-visible", window.scrollY > 600);
  };

  /* ---------- mobile menu ---------- */

  const toggle = document.getElementById("navbarToggle");
  const links = document.getElementById("navbarLinks");

  const setMenu = (open) => {
    if (!toggle || !links) return;
    links.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");
    document.body.style.overflow = open ? "hidden" : "";
  };

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      setMenu(!links.classList.contains("is-open"));
    });

    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && links.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 820 && links.classList.contains("is-open")) setMenu(false);
    });
  }

  /* ---------- active nav link ---------- */

  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = links ? links.querySelectorAll("a") : [];

  if (sections.length && navAnchors.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navAnchors.forEach((a) => {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
  }

  /* ---------- one-time scroll reveal ---------- */

  const reveals = document.querySelectorAll(".reveal");

  if (reduceMotion) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else if (reveals.length) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- project gallery (manual only) ---------- */

  const gallery = document.getElementById("projectGallery");
  const images = gallery ? gallery.querySelectorAll(".gallery__image") : [];
  const dotsWrap = document.getElementById("galleryDots");
  const prevBtn = document.getElementById("galleryPrev");
  const nextBtn = document.getElementById("galleryNext");

  if (images.length && dotsWrap) {
    let current = 0;

    const dots = Array.from(images).map((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "gallery__dot";
      dot.setAttribute("aria-label", "Tampilan " + (i + 1));
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
      return dot;
    });

    function goTo(index) {
      images[current].classList.remove("is-active");
      dots[current].classList.remove("is-active");
      dots[current].setAttribute("aria-current", "false");

      current = (index + images.length) % images.length;

      images[current].classList.add("is-active");
      dots[current].classList.add("is-active");
      dots[current].setAttribute("aria-current", "true");
    }

    goTo(0);
    if (prevBtn) prevBtn.addEventListener("click", () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => goTo(current + 1));

    if (gallery) {
      gallery.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") goTo(current - 1);
        if (e.key === "ArrowRight") goTo(current + 1);
      });
    }
  }

  /* ---------- certificate modal ---------- */

  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modalBody");
  const modalTitle = document.getElementById("modalTitle");
  const modalOpen = document.getElementById("modalOpen");
  const modalClose = document.getElementById("modalClose");
  let lastTrigger = null;

  if (modal) {
    const openModal = (trigger) => {
      lastTrigger = trigger;
      modalTitle.textContent = trigger.dataset.certTitle || "Sertifikat";
      modalOpen.href = trigger.dataset.certSrc || "#";

      const type = trigger.dataset.certType;
      const src = trigger.dataset.certSrc;
      const node =
        type === "image"
          ? Object.assign(document.createElement("img"), { src, alt: trigger.dataset.certTitle || "" })
          : Object.assign(document.createElement("iframe"), { src, title: trigger.dataset.certTitle || "" });

      modalBody.replaceChildren(node);
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
      modalClose.focus();
    };

    const closeModal = () => {
      modal.classList.remove("is-open");
      modalBody.replaceChildren();
      document.body.style.overflow = "";
      if (lastTrigger) lastTrigger.focus();
    };

    document.querySelectorAll(".cert-row").forEach((row) => {
      row.addEventListener("click", () => openModal(row));
    });

    modal.querySelector("[data-close]").addEventListener("click", closeModal);
    modalClose.addEventListener("click", closeModal);

    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("is-open")) return;
      if (e.key === "Escape") {
        closeModal();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = modal.querySelectorAll("button, [href]");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* ---------- init ---------- */

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();