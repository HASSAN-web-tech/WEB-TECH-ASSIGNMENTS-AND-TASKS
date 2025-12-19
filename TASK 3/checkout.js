// checkout.js


document.addEventListener("DOMContentLoaded", function () {
  const checkbox = document.querySelector("#billingSame");
  const billingFields = document.querySelector("#billingFields");

  if (checkbox && billingFields) {
    checkbox.addEventListener("change", () => {
      billingFields.style.display = checkbox.checked ? "none" : "block";
    });
  }
});
