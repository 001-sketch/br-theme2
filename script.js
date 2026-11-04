// --- Hero Slideshow ---
const hero = document.querySelector(".hero");
const dots = document.querySelectorAll(".dots button");
const heroSlides = [
  "public/lazulilogo.jpg",
  "public/lazuli8.jpg",
  "public/lazuli9.jpg",
];

let currentSlide = 0;
let slideInterval = null;
const SLIDE_DURATION = 3200; // Increased slide speed (was 5000ms)

function showSlide(index) {
  currentSlide = (index + heroSlides.length) % heroSlides.length;
  if (hero) {
    hero.style.setProperty("--hero-image", `url("${heroSlides[currentSlide]}")`);
  }
  dots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === currentSlide;
    dot.classList.toggle("active", isActive);
    dot.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

function startAutoSlide() {
  stopAutoSlide();
  slideInterval = setInterval(nextSlide, SLIDE_DURATION);
}

function stopAutoSlide() {
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = null;
  }
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showSlide(index);
    startAutoSlide();
  });
});

// Pause on hover, keyboard, and touch controls
if (hero) {
  hero.addEventListener("mouseenter", stopAutoSlide);
  hero.addEventListener("mouseleave", startAutoSlide);

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.target && ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) {
      return;
    }
    if (e.key === "ArrowLeft") {
      prevSlide();
      startAutoSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
      startAutoSlide();
    }
  });

  // Touch Swipe on mobile
  let touchStartX = 0;
  let touchEndX = 0;

  hero.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoSlide();
    },
    { passive: true }
  );

  hero.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 40) {
        if (swipeDistance < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      startAutoSlide();
    },
    { passive: true }
  );
}

showSlide(0);
startAutoSlide();

// --- Mobile Navigation Drawer ---
const siteHeader = document.querySelector(".site-header");
const menuBtn = document.querySelector(".mobile-menu-btn");
const siteNav = document.getElementById("site-nav");

function toggleMenu(forceClose = false) {
  if (!menuBtn || !siteNav) return;
  const shouldOpen = forceClose ? false : !siteNav.classList.contains("open");
  siteNav.classList.toggle("open", shouldOpen);
  menuBtn.classList.toggle("open", shouldOpen);
  menuBtn.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
  if (siteHeader) {
    siteHeader.classList.toggle("menu-active", shouldOpen);
  }
}

if (menuBtn) {
  menuBtn.addEventListener("click", () => toggleMenu());
}

// Close menu on click outside
document.addEventListener("click", (e) => {
  if (
    siteNav &&
    siteNav.classList.contains("open") &&
    !siteNav.contains(e.target) &&
    !menuBtn.contains(e.target)
  ) {
    toggleMenu(true);
  }
});

// Close menu on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && siteNav && siteNav.classList.contains("open")) {
    toggleMenu(true);
  }
});

// --- Smooth Scrolling for Navigation & Footer Links ---
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href").substring(1);
    if (!targetId) return;
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      event.preventDefault();
      toggleMenu(true); // Close mobile drawer if open
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.history.replaceState(null, "", `#${targetId}`);

      // Visual focus feedback for target service cards
      if (targetElement.classList.contains("service-card")) {
        targetElement.classList.remove("target-highlight");
        void targetElement.offsetWidth;
        targetElement.classList.add("target-highlight");
        setTimeout(() => {
          targetElement.classList.remove("target-highlight");
        }, 1600);
      }
    }
  });
});

// --- Appointment Form Submission with EmailJS ---
const appointmentForm = document.getElementById("appointment-form");
const formStatus = document.getElementById("form-status");

if (appointmentForm) {
  appointmentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("client-name");
    const emailInput = document.getElementById("client-email");
    const serviceInput = document.getElementById("client-service");
    const messageInput = document.getElementById("client-message");
    const submitBtn = appointmentForm.querySelector('button[type="submit"]');

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const service = serviceInput && serviceInput.value ? serviceInput.value : "General Consultation";
    const message = messageInput ? messageInput.value.trim() : "";

    if (!name || !email) {
      if (formStatus) {
        formStatus.className = "form-status error";
        formStatus.innerHTML = "<p>Please provide your name and email address so we can reach you.</p>";
      }
      return;
    }

    // Set loading state
    const originalBtnText = submitBtn ? submitBtn.innerText : "Send Message";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = "Sending...";
    }
    if (formStatus) {
      formStatus.className = "form-status loading";
      formStatus.innerHTML = "<p>Sending your appointment request...</p>";
    }

    const templateParams = {
      from_name: name,
      name: name,
      reply_to: email,
      email: email,
      service: service,
      message: message,
      to_email: "webloomstudio4@gmail.com",
    };

    emailjs
      .send("service_tb04eug", "template_vju6fm9", templateParams)
      .then(function () {
        if (formStatus) {
          formStatus.className = "form-status success";
          formStatus.innerHTML = `
            <div class="status-content">
              <span class="status-icon">&#10003;</span>
              <div>
                <strong>Thank you, ${name}!</strong>
                <p>Your appointment request for <em>${service}</em> has been sent successfully. We will reach out to you at <strong>${email}</strong> shortly.</p>
              </div>
            </div>
          `;
        }
        appointmentForm.reset();
      })
      .catch(function (error) {
        console.error("EmailJS error:", error);
        if (formStatus) {
          formStatus.className = "form-status error";
          formStatus.innerHTML = `
            <p>Sorry, we could not send your request right now. Please call us directly at <strong>0795039452</strong> or email <strong>lazulisalon51@gmail.com</strong>.</p>
          `;
        }
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalBtnText;
        }
      });
  });
}

// --- Reviews Right-to-Left Continuous Marquee ---
const testimonialTrack = document.getElementById("testimonial-track");
const marqueePauseBtn = document.getElementById("marquee-pause-btn");

if (testimonialTrack) {
  // Seamless clone of cards for infinite loop
  testimonialTrack.innerHTML += testimonialTrack.innerHTML;

  let isMarqueePaused = false;

  function toggleMarqueePause() {
    isMarqueePaused = !isMarqueePaused;
    testimonialTrack.classList.toggle("is-paused", isMarqueePaused);
    if (marqueePauseBtn) {
      marqueePauseBtn.innerHTML = isMarqueePaused
        ? '<span class="ctrl-icon">&#9654;</span> Resume'
        : '<span class="ctrl-icon">&#9208;</span> Pause';
      marqueePauseBtn.setAttribute(
        "aria-label",
        isMarqueePaused ? "Resume reviews auto-scroll" : "Pause reviews auto-scroll"
      );
    }
  }

  if (marqueePauseBtn) {
    marqueePauseBtn.addEventListener("click", toggleMarqueePause);
  }

  // Touch pause on mobile
  testimonialTrack.addEventListener(
    "touchstart",
    () => {
      testimonialTrack.classList.add("is-paused");
    },
    { passive: true }
  );

  testimonialTrack.addEventListener(
    "touchend",
    () => {
      if (!isMarqueePaused) {
        testimonialTrack.classList.remove("is-paused");
      }
    },
    { passive: true }
  );
}
