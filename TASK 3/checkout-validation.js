// checkout-validation.js

$(document).ready(function () {
  $("#checkoutForm").submit(function (e) {
    let valid = true;

    
    const name = $("#fullName").val();
    if (!name || name.length < 3) {
      valid = false;
      $("#fullName").addClass("is-invalid");
    } else {
      $("#fullName").removeClass("is-invalid");
    }

    // Email validation
    const email = $("#email").val();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      valid = false;
      $("#email").addClass("is-invalid");
    } else {
      $("#email").removeClass("is-invalid");
    }

    if (!valid) {
      e.preventDefault(); // prevent form submission
      $("html, body").animate({ scrollTop: $(".is-invalid").first().offset().top - 50 }, 500);
    }
  });
});
