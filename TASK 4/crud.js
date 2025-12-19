$(document).ready(function () {
  const apiURL = "https://jsonplaceholder.typicode.com/posts";

  // 🔹 READ — Fetch & Display Items
  function fetchItems() {
    $("#product-list").html("<p>Loading...</p>");
    $.get(apiURL, function (data) {
      $("#product-list").empty();
      data.slice(0, 6).forEach((item) => {
        $("#product-list").append(`
          <div class="col-md-4 mb-3">
            <div class="card p-3 shadow-sm">
              <h5>${item.title}</h5>
              <p>${item.body}</p>
              <button class="btn btn-warning btn-sm edit" data-id="${item.id}">Edit</button>
              <button class="btn btn-danger btn-sm delete" data-id="${item.id}">Delete</button>
            </div>
          </div>
        `);
      });
    });
  }

  // 🔹 CREATE — Add New Item
  $("#addForm").submit(function (e) {
    e.preventDefault();
    const newItem = {
      title: $("#title").val(),
      body: $("#body").val(),
      userId: 1,
    };

    $.post(apiURL, newItem, function (data) {
      alert("Item added!");
      fetchItems();
      $("#addForm")[0].reset();
    });
  });

  // 🔹 UPDATE — Edit an Item
  $(document).on("click", ".edit", function () {
    const id = $(this).data("id");
    const newTitle = prompt("Enter new title:");
    const newBody = prompt("Enter new description:");
    if (newTitle && newBody) {
      $.ajax({
        url: `${apiURL}/${id}`,
        method: "PUT",
        data: { title: newTitle, body: newBody },
        success: function () {
          alert("Item updated!");
          fetchItems();
        },
      });
    }
  });

  // 🔹 DELETE — Remove an Item
  $(document).on("click", ".delete", function () {
    const id = $(this).data("id");
    if (confirm("Are you sure you want to delete this item?")) {
      $.ajax({
        url: `${apiURL}/${id}`,
        method: "DELETE",
        success: function () {
          alert("Item deleted!");
          fetchItems();
        },
      });
    }
  });

  // 🔹 Initial Load
  fetchItems();
});
