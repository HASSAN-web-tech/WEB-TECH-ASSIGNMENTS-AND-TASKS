// main.js

document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelector(".nav-links");
  const toggleBtn = document.createElement("button");
  toggleBtn.innerText = "Menu";
  toggleBtn.classList.add("menu-toggle");
  document.querySelector("nav.container").prepend(toggleBtn);

  toggleBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
});
