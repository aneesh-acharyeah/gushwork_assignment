// Centralized page data keeps repeated UI controls in sync without hard-coding DOM fragments.
const galleryImages = [
  { id: 1, url: "images/hero_first_image.png", alt: "HDPE Pipes - View 1" },
  { id: 2, url: "images/hero_second_image.jpg", alt: "Pipeline Infrastructure - View 2" },
  { id: 3, url: "images/hero_third_image.jpg", alt: "Industrial Piping - View 3" },
  { id: 4, url: "images/hero_fourth_image.jpg", alt: "Pipeline System - View 4" },
  { id: 5, url: "images/hero_fifth_image.jpg", alt: "Modern Pipes - View 5" }
];

const processSteps = [
  {
    title: "Raw Material",
    heading: "High-Grade Raw Material Selection",
    content: "Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.",
    features: ["PE100 grade material", "Optimal molecular weight distribution"],
    image: "images/hero_first_image.png"
  },
  {
    title: "Extrusion",
    heading: "Advanced Extrusion Process",
    content: "State-of-the-art extrusion technology ensures consistent quality and optimal material properties.",
    features: ["Precision temperature control", "Uniform material flow"],
    image: "images/hero_first_image.png"
  },
  {
    title: "Cooling",
    heading: "Controlled Cooling System",
    content: "Advanced cooling technology maintains structural integrity and dimensional accuracy.",
    features: ["Water bath cooling", "Temperature monitoring"],
    image: "images/hero_first_image.png"
  },
  {
    title: "Sizing",
    heading: "Precision Sizing Process",
    content: "Vacuum sizing ensures exact diameter specifications and wall thickness.",
    features: ["Automated sizing control", "Quality verification"],
    image: "images/hero_first_image.png"
  },
  {
    title: "Quality Control",
    heading: "Comprehensive Quality Testing",
    content: "Multiple quality checkpoints ensure every pipe meets international standards.",
    features: ["Pressure testing", "Dimensional inspection"],
    image: "images/hero_first_image.png"
  },
  {
    title: "Marking",
    heading: "Product Identification",
    content: "Clear marking system for traceability and compliance verification.",
    features: ["Standard markings", "Batch tracking codes"],
    image: "images/hero_first_image.png"
  },
  {
    title: "Cutting",
    heading: "Precision Cutting Process",
    content: "Automated cutting ensures accurate lengths and clean edges.",
    features: ["Length precision", "Clean cut edges"],
    image: "images/hero_first_image.png"
  },
  {
    title: "Packaging",
    heading: "Protective Packaging",
    content: "Careful packaging ensures safe transportation and storage.",
    features: ["Protective wrapping", "Secure bundling"],
    image: "images/hero_first_image.png"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  // Initialize each independent behavior after the static HTML is ready.
  initStickyHeader();
  initMobileMenu();
  initModals();
  initMobileProductSummary();
  initGallery();
  initFaq();
  initHorizontalScroll();
  initProcessStepper();
  initTestimonialAutoScroll();
  initPlaceholderActions();
});

function initStickyHeader() {
  const header = document.querySelector("[data-sticky-header]");
  if (!header) return;

  let lastScrollY = 0;

  // Show the fixed header while scrolling down past the initial fold threshold.
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const shouldShow = currentScrollY > window.innerHeight / 4 && currentScrollY > lastScrollY;

    header.classList.toggle("is-sticky", shouldShow);
    lastScrollY = currentScrollY;
  }, { passive: true });
}

function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger-btn");
  const menu = document.querySelector(".mobile-menu-container");
  const backdrop = document.querySelector("[data-menu-backdrop]");
  const closeButtons = document.querySelectorAll("[data-close-menu]");

  if (!hamburger || !menu || !backdrop) return;

  const setMenuOpen = (isOpen) => {
    hamburger.classList.toggle("is-open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    hamburger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    menu.classList.toggle("is-open", isOpen);
    backdrop.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
  };

  hamburger.addEventListener("click", () => {
    setMenuOpen(!menu.classList.contains("is-open"));
  });

  backdrop.addEventListener("click", () => setMenuOpen(false));
  closeButtons.forEach((button) => button.addEventListener("click", () => setMenuOpen(false)));

  document.addEventListener("mousedown", (event) => {
    if (!menu.classList.contains("is-open")) return;
    if (event.target.closest(".mobile-menu-container") || event.target.closest(".hamburger-btn")) return;
    setMenuOpen(false);
  });
}

function initMobileProductSummary() {
  const summary = document.querySelector(".mobile-product-summary");
  const hero = document.querySelector(".hero-section");
  if (!summary || !hero) return;

  const updateSummary = () => {
    // The supplied mobile fold shows this summary only before the user scrolls.
    const isMobile = window.innerWidth < 768;
    const shouldShow = isMobile && window.scrollY === 0;
    summary.classList.toggle("is-visible", shouldShow);
    document.body.classList.toggle("has-mobile-summary", shouldShow);
  };

  window.addEventListener("scroll", updateSummary, { passive: true });
  window.addEventListener("resize", updateSummary);
  updateSummary();
}

function initModals() {
  const layer = document.querySelector("[data-modal-layer]");
  const dialogs = Array.from(document.querySelectorAll("[data-modal]"));
  const openButtons = document.querySelectorAll("[data-open-modal]");
  const callbackButton = document.querySelector("[data-open-callback-modal]");
  const catalogueButton = document.querySelector("[data-open-catalogue-modal]");
  const closeButtons = document.querySelectorAll("[data-modal-close]");
  let activeTrigger = null;

  if (!layer || dialogs.length === 0) return;

  const closeModal = () => {
    layer.classList.remove("is-open");
    layer.setAttribute("aria-hidden", "true");
    dialogs.forEach((dialog) => dialog.classList.remove("is-active"));
    document.body.classList.remove("menu-open");

    if (activeTrigger) {
      activeTrigger.focus();
      activeTrigger = null;
    }
  };

  const openModal = (modalName, trigger) => {
    const dialog = dialogs.find((item) => item.dataset.modal === modalName);
    if (!dialog) return;

    activeTrigger = trigger;
    layer.classList.add("is-open");
    layer.setAttribute("aria-hidden", "false");
    dialogs.forEach((item) => item.classList.toggle("is-active", item === dialog));
    document.body.classList.add("menu-open");

    const firstField = dialog.querySelector(".modal-form input, .modal-form select, .modal-form button");
    if (firstField) firstField.focus();
  };

  // Only explicitly wired buttons open modals, matching the assignment references.
  openButtons.forEach((button) => {
    if (button.dataset.openModal === "callback" || button.dataset.openModal === "catalogue") return;
    button.addEventListener("click", () => openModal(button.dataset.openModal, button));
  });

  if (callbackButton) {
    callbackButton.addEventListener("click", () => openModal("callback", callbackButton));
  }

  if (catalogueButton) {
    catalogueButton.addEventListener("click", () => openModal("catalogue", catalogueButton));
  }

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && layer.classList.contains("is-open")) {
      closeModal();
    }
  });
}

function initGallery() {
  const image = document.querySelector("[data-hero-image]");
  const thumbnailRow = document.querySelector("[data-thumbnail-row]");
  const prevButton = document.querySelector("[data-gallery-prev]");
  const nextButton = document.querySelector("[data-gallery-next]");
  const zoomPreview = document.querySelector("[data-zoom-preview]");
  const magnifier = document.querySelector("[data-magnifier]");

  if (!image || !thumbnailRow || !prevButton || !nextButton || !zoomPreview || !magnifier) return;

  let currentIndex = 0;

  // Thumbnails are generated from the same data source as the main image carousel.
  galleryImages.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "thumbnail-button";
    button.setAttribute("aria-label", `View ${item.alt}`);

    const thumbnail = document.createElement("img");
    thumbnail.src = item.url;
    thumbnail.alt = item.alt;
    button.append(thumbnail);

    button.addEventListener("click", () => {
      currentIndex = index;
      renderGallery();
    });

    thumbnailRow.append(button);
  });

  const renderGallery = () => {
    const current = galleryImages[currentIndex];
    image.src = current.url;
    image.alt = current.alt;
    zoomPreview.style.backgroundImage = `url("${current.url}")`;

    thumbnailRow.querySelectorAll(".thumbnail-button").forEach((button, index) => {
      const isActive = index === currentIndex;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  prevButton.addEventListener("click", () => {
    currentIndex = currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1;
    renderGallery();
  });

  nextButton.addEventListener("click", () => {
    currentIndex = currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1;
    renderGallery();
  });

  image.addEventListener("mouseenter", () => {
    zoomPreview.style.display = "block";
    magnifier.style.display = "flex";
  });

  image.addEventListener("mousemove", (event) => {
    const rect = image.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / image.width) * 100;
    const y = ((event.clientY - rect.top) / image.height) * 100;

    // Move the zoomed background to match the pointer position over the current image.
    zoomPreview.style.backgroundPosition = `${x}% ${y}%`;
    magnifier.style.top = `${event.clientY - 50}px`;
    magnifier.style.left = `${event.clientX - 50}px`;
  });

  image.addEventListener("mouseleave", () => {
    zoomPreview.style.display = "none";
    magnifier.style.display = "none";
    zoomPreview.style.backgroundPosition = "center";
  });

  renderGallery();
}

function initFaq() {
  const faqItems = Array.from(document.querySelectorAll(".faq-item"));

  faqItems.forEach((item) => {
    const button = item.querySelector("button");
    const icon = item.querySelector("img");

    button.addEventListener("click", () => {
      const willOpen = !item.classList.contains("is-open");

      // Keep the accordion single-open so the section remains compact on mobile.
      faqItems.forEach((faq) => {
        faq.classList.remove("is-open");
        faq.querySelector("button").setAttribute("aria-expanded", "false");
        faq.querySelector("img").src = "images/accordian-close.svg";
      });

      item.classList.toggle("is-open", willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
      icon.src = willOpen ? "images/accordian-open.svg" : "images/accordian-close.svg";
    });
  });
}

function initHorizontalScroll() {
  document.querySelectorAll("[data-scroll-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.scrollTarget;
      const direction = button.dataset.scrollDirection === "right" ? 1 : -1;
      const row = document.querySelector(`[data-scroll-row="${target}"]`);

      if (row) {
        row.scrollBy({ left: direction * 340, behavior: "smooth" });
      }
    });
  });
}

function initTestimonialAutoScroll() {
  const row = document.querySelector(".testimonial-row");
  if (!row || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const originalCards = Array.from(row.children);
  if (originalCards.length === 0) return;

  // Clone the cards once to create a seamless loop without visual indicators.
  originalCards.forEach((card) => {
    row.append(card.cloneNode(true));
  });

  let isPaused = false;
  let lastTimestamp = 0;
  let originalScrollWidth = 0;

  const updateOriginalWidth = () => {
    originalScrollWidth = row.scrollWidth / 2;
  };

  const scroll = (timestamp) => {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    if (!isPaused && originalScrollWidth > 0) {
      row.scrollLeft += delta * 0.035;

      if (row.scrollLeft >= originalScrollWidth) {
        row.scrollLeft -= originalScrollWidth;
      }
    }

    requestAnimationFrame(scroll);
  };

  row.addEventListener("mouseenter", () => {
    isPaused = true;
  });

  row.addEventListener("mouseleave", () => {
    isPaused = false;
  });

  row.addEventListener("focusin", () => {
    isPaused = true;
  });

  row.addEventListener("focusout", () => {
    isPaused = false;
  });

  updateOriginalWidth();
  window.addEventListener("resize", updateOriginalWidth);
  requestAnimationFrame(scroll);
}

function initProcessStepper() {
  const chip = document.querySelector("[data-mobile-step-chip]");
  const stepRow = document.querySelector("[data-step-row]");
  const heading = document.querySelector("[data-step-heading]");
  const content = document.querySelector("[data-step-content]");
  const features = document.querySelector("[data-step-features]");
  const image = document.querySelector("[data-step-image]");
  const prevButtons = document.querySelectorAll("[data-step-prev], [data-mobile-step-prev]");
  const nextButtons = document.querySelectorAll("[data-step-next], [data-mobile-step-next]");

  if (!chip || !stepRow || !heading || !content || !features || !image || !prevButtons.length || !nextButtons.length) return;

  let currentStep = 0;

  // Desktop step buttons are generated from the process data so labels and content stay aligned.
  processSteps.forEach((step, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = step.title;
    button.addEventListener("click", () => {
      currentStep = index;
      renderStep();
    });
    stepRow.append(button);

    if (index < processSteps.length - 1) {
      stepRow.append(document.createElement("span"));
    }
  });

  const renderStep = () => {
    const step = processSteps[currentStep];
    chip.textContent = `Step ${currentStep + 1}/${processSteps.length}: ${step.title}`;
    heading.textContent = step.heading;
    content.textContent = step.content;
    image.src = step.image;
    image.alt = step.title;

    features.replaceChildren(...step.features.map((feature) => {
      const item = document.createElement("li");
      const icon = document.createElement("img");
      icon.src = "images/CheckCircle.svg";
      icon.alt = "";
      item.append(icon, feature);
      return item;
    }));

    Array.from(stepRow.querySelectorAll("button")).forEach((button, index) => {
      button.classList.toggle("is-active", index === currentStep);
    });
  };

  const goPrevious = () => {
    currentStep = currentStep > 0 ? currentStep - 1 : processSteps.length - 1;
    renderStep();
  };

  const goNext = () => {
    currentStep = currentStep < processSteps.length - 1 ? currentStep + 1 : 0;
    renderStep();
  };

  prevButtons.forEach((button) => button.addEventListener("click", goPrevious));
  nextButtons.forEach((button) => button.addEventListener("click", goNext));

  renderStep();
}

function initPlaceholderActions() {
  // Forms and non-navigating buttons keep the prototype interactive without backend dependencies.
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      console.log("Form submitted");
    });
  });

  document.querySelectorAll("[data-placeholder]").forEach((button) => {
    button.addEventListener("click", () => {
      console.log(`Learn more about: ${button.dataset.placeholder}`);
    });
  });

  document.querySelectorAll("[data-download]").forEach((button) => {
    button.addEventListener("click", () => {
      console.log(`Downloading: ${button.dataset.download}`);
    });
  });

  const talkToExpert = document.querySelector("[data-talk-expert]");
  if (talkToExpert) {
    talkToExpert.addEventListener("click", () => {
      console.log("Talk to an expert clicked");
    });
  }
}
