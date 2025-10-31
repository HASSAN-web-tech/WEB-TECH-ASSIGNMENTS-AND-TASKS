// Load testimonial modal HTML into page
fetch("testimonials.html")
  .then(response => response.text())
  .then(html => {
    document.body.insertAdjacentHTML("beforeend", html);
    setupTestimonials();
  });

function setupTestimonials() {
  const modal = document.getElementById("testimonialModal");
  const openBtn = document.getElementById("openTestimonials");
  const closeBtn = document.getElementById("closeTestimonials");

  openBtn.onclick = () => modal.style.display = "flex";
  closeBtn.onclick = () => modal.style.display = "none";
  window.onclick = e => { if (e.target == modal) modal.style.display = "none"; };

  let current = 0;
  const slides = document.querySelectorAll(".testimonial-slide");
  const next = document.querySelector(".next");
  const prev = document.querySelector(".prev");

  function showSlide(i) {
    slides.forEach(s => s.classList.remove("active"));
    slides[i].classList.add("active");
  }

  next.onclick = () => {
    current = (current + 1) % slides.length;
    showSlide(current);
  };

  prev.onclick = () => {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
  };

  // Auto rotate
  setInterval(() => next.click(), 4000);
}
document.getElementById("viewMoreBtn").addEventListener("click", function () {
  document.querySelectorAll(".testimonial.hidden").forEach(t => t.style.display = "block");
  this.style.display = "none";
});
