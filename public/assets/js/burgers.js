// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
  $.ajax("/burgers", {
    type: "GET"
  }).then(function(data) {
    var sleepyElem = $("#sleepyBurgers");
    var nosleepyElem = $("#notSleepyBurgers");

    var burgers = data.burgers;
    var len = burgers.length;

    for (var i = 0; i < len; i++) {
      var new_elem =
        "<li>" +
        burgers[i].id +
        ". "+burgers[i].name +
        "<button class='change-sleep' data-id='" +
        burgers[i].id +
        "' data-newsleep='" +
        !burgers[i].sleepy +
        "'>";

      if (burgers[i].sleepy) {
        new_elem += "SLEEP TIME!";
      } else {
        new_elem += "WAKE UP!";
      }

      new_elem += "</button>";

      new_elem +=
        "<button class='delete-burger' data-id='" +
        burgers[i].id +
        "'>DELETE!</button></li>";

      if (burgers[i].sleepy) {
        sleepyElem.append(new_elem);
      } else {
        nosleepyElem.append(new_elem);
      }
    }
  });

  $(document).on("click", ".change-sleep", function(event) {
    var id = $(this).data("id");
    var newSleep = $(this).data("newsleep")===true;

    var newSleepState = {
      sleepy: newSleep
    };

    // Send the PUT request.
    $.ajax("/burgers/" + id, {
      type: "PUT",
      data: JSON.stringify(newSleepState),
      dataType:'json',
      contentType: 'application/json'
    }).then(function() {
      console.log("changed sleep to", newSleep);
      // Reload the page to get the updated list
      location.reload();
    });
  });

  $(".create-form").on("submit", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var newBurger = {
      name: $("#ca")
        .val()
        .trim(),
      sleepy: $("[name=sleepy]:checked")
        .val()
        .trim()
    };

    // Send the POST request.
    $.ajax("/burgers", {
      type: "POST",
      data: JSON.stringify(newBurger),
      dataType:'json',
      contentType: 'application/json'
    }).then(function() {
      console.log("created new burger");
      // Reload the page to get the updated list
      location.reload();
    });
  });

  $(document).on("click", ".delete-burger", function(event) {
    var id = $(this).data("id");

    // Send the DELETE request.
    $.ajax("/burgers/" + id, {
      type: "DELETE"
    }).then(function() {
      console.log("deleted burger", id);
      // Reload the page to get the updated list
      location.reload();
    });
  });
});
