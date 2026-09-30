const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");
const appointmentForm = document.querySelector("#appointment-form");
const appointmentDialog = document.querySelector("#appointment-dialog");
const statusMessage = document.querySelector("#form-status");
const dateInput = appointmentForm.querySelector('input[name="date"]');
const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector("p");
const whatsappNumber = "923303786289";

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isOpen);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  });
});

document.querySelectorAll("[data-open-appointment]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    if (!appointmentDialog.open) appointmentDialog.showModal();
  });
});

appointmentDialog.querySelector(".appointment-dialog-close").addEventListener("click", () => {
  appointmentDialog.close();
});
appointmentDialog.addEventListener("click", (event) => {
  if (event.target === appointmentDialog) appointmentDialog.close();
});

const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
  .toISOString()
  .slice(0, 10);
dateInput.min = localToday;
document.querySelector("#year").textContent = String(today.getFullYear());

appointmentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!appointmentForm.reportValidity()) return;

  const fields = new FormData(appointmentForm);
  const details = [
    "Appointment request for Dr. Alam Din",
    `Name: ${fields.get("name")}`,
    `Phone: ${fields.get("phone")}`,
    `Preferred date: ${fields.get("date")}`,
    `Preferred time: ${fields.get("time")}`,
    `Reason for visit: ${fields.get("reason")}`,
    `Message: ${fields.get("message") || "None"}`,
    "",
    "Please contact me to confirm an appointment. I understand this request is not confirmed until the clinic replies."
  ];
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(details.join("\n"))}`;
  const openedWindow = window.open(whatsappUrl, "_blank");

  if (openedWindow) {
    openedWindow.opener = null;
    statusMessage.textContent = "Thank you. Your request details are ready in WhatsApp. Tap Send there to deliver your request; the clinic will contact you to confirm your appointment.";
  } else {
    statusMessage.textContent = "Your browser blocked the WhatsApp window. Please use the WhatsApp button below to send your request, or call +92 330 3786289.";
    let whatsappFallback = appointmentForm.querySelector(".whatsapp-fallback");
    if (!whatsappFallback) {
      whatsappFallback = document.createElement("a");
      whatsappFallback.className = "whatsapp-fallback";
      whatsappFallback.target = "_blank";
      whatsappFallback.rel = "noopener noreferrer";
      whatsappFallback.textContent = "Continue to WhatsApp";
      appointmentForm.append(whatsappFallback);
    }
    whatsappFallback.href = whatsappUrl;
    whatsappFallback.hidden = false;
  }
});

document.querySelectorAll("[data-lightbox]").forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    lightboxImage.src = button.dataset.lightbox;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = button.dataset.caption;
    lightbox.showModal();
  });
});

lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("close", () => {
  lightboxImage.removeAttribute("src");
});

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const heroVideo = document.querySelector(".hero-video");
if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.playsInline = true;

  try {
    const videoPlayback = heroVideo.play();
    if (videoPlayback && typeof videoPlayback.catch === "function") {
      videoPlayback.catch((error) => {
        if (error.name !== "NotAllowedError" && error.name !== "AbortError") {
          console.error("Hero video playback failed.", error);
        }
      });
    }
  } catch (error) {
    console.error("Hero video playback failed.", error);
  }
}
