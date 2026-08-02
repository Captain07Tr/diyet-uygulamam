(() => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const nodes = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && nodes.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -40px 0px" },
    );

    nodes.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 6, 5) * 0.07}s`;
      io.observe(el);
    });
  } else {
    nodes.forEach((el) => el.classList.add("in"));
  }

  const root = document.querySelector("[data-carousel]");
  if (!root) return;

  const slides = [...root.querySelectorAll(".carousel-slide")];
  const prevBtn = root.querySelector(".carousel-btn.prev");
  const nextBtn = root.querySelector(".carousel-btn.next");
  const caption = root.querySelector("[data-carousel-caption]");
  const dotsWrap = root.querySelector("[data-carousel-dots]");
  const progressBar = root.querySelector("[data-carousel-progress]");
  const stack = root.querySelector(".carousel-stack");
  if (!slides.length) return;

  let index = 0;
  let timer = null;
  let progressRaf = null;
  let startedAt = 0;
  let paused = false;
  const AUTO_MS = 4000;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Ekran ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = [...dotsWrap.querySelectorAll(".carousel-dot")];

  function setProgress(pct) {
    if (!progressBar) return;
    progressBar.style.width = `${Math.max(0, Math.min(100, pct))}%`;
  }

  function tickProgress(now) {
    if (paused || reduceMotion) {
      progressRaf = null;
      return;
    }
    const pct = ((now - startedAt) / AUTO_MS) * 100;
    setProgress(pct);
    if (pct >= 100) {
      next();
      return;
    }
    progressRaf = requestAnimationFrame(tickProgress);
  }

  function paint() {
    const nextIdx = (index + 1) % slides.length;
    const prevIdx = (index - 1 + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.remove("is-active", "is-next", "is-prev");
      if (i === index) slide.classList.add("is-active");
      else if (i === nextIdx) slide.classList.add("is-next");
      else if (i === prevIdx) slide.classList.add("is-prev");
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
      dot.setAttribute("aria-current", i === index ? "true" : "false");
    });

    if (caption) {
      caption.style.opacity = "0";
      window.setTimeout(() => {
        caption.textContent = slides[index].dataset.caption || "";
        caption.style.opacity = "1";
      }, 160);
    }
  }

  function goTo(nextIndex) {
    nextIndex = ((nextIndex % slides.length) + slides.length) % slides.length;
    if (nextIndex === index) return;
    index = nextIndex;
    paint();
    restart();
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  function stopAuto() {
    paused = true;
    window.clearInterval(timer);
    timer = null;
    if (progressRaf) cancelAnimationFrame(progressRaf);
    progressRaf = null;
  }

  function restart() {
    if (reduceMotion) {
      stopAuto();
      setProgress(0);
      return;
    }
    paused = false;
    window.clearInterval(timer);
    timer = null;
    if (progressRaf) cancelAnimationFrame(progressRaf);
    startedAt = performance.now();
    setProgress(0);
    progressRaf = requestAnimationFrame(tickProgress);
  }

  prevBtn?.addEventListener("click", prev);
  nextBtn?.addEventListener("click", next);

  root.addEventListener("mouseenter", stopAuto);
  root.addEventListener("mouseleave", restart);
  root.addEventListener("focusin", stopAuto);
  root.addEventListener("focusout", (e) => {
    if (!root.contains(e.relatedTarget)) restart();
  });

  root.tabIndex = 0;
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  });

  let touchX = null;
  stack?.addEventListener(
    "touchstart",
    (e) => {
      touchX = e.changedTouches[0].clientX;
      stopAuto();
    },
    { passive: true },
  );
  stack?.addEventListener(
    "touchend",
    (e) => {
      if (touchX == null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) < 40) {
        restart();
        return;
      }
      if (dx < 0) next();
      else prev();
    },
    { passive: true },
  );

  paint();
  restart();
})();
