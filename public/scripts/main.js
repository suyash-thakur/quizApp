$(document).ready(function () {
  $(".navbar .dropdown-item").on("click", function (e) {
    var $el = $(this).children(".dropdown-toggle");
    var $parent = $el.offsetParent(".dropdown-menu");
    $(this).parent("li").toggleClass("open");
    if (!$parent.parent().hasClass("navbar-nav") && !e.target.classList.contains("dropdown-link")) {
      if ($parent.hasClass("show")) {
        $parent.removeClass("show");
        $el.next().removeClass("show");
        $el.next().css({ top: -999, left: -999 });
      } else {
        $parent.parent().find(".show").removeClass("show");
        $parent.addClass("show");
        $el.next().addClass("show");
        $el
          .next()
          .css({ top: $el[0].offsetTop, left: $parent.outerWidth() - 4 });
      }
      console.log("here");
      e.preventDefault();
      e.stopPropagation();
    }
  });

  $(".navbar .dropdown").on("hidden.bs.dropdown", function () {
    $(this).find("li.dropdown").removeClass("show open");
    $(this).find("ul.dropdown-menu").removeClass("show open");
  });

  var questType;
  var operation;
  var questLength;
  var time;

  function generateTime(timeArr) {
    let selectHTML = `
  <select id="timeField" class="quiz-input">
  <option disabled>Select Time</option>`;

    timeArr.forEach((time) => {
      selectHTML += `<option value=${time}>${time}</option>`;
    });

    selectHTML += `</select>`;

    return selectHTML;
  }

  function time(val) {
    var elementExists = document.getElementById("timeField");
    if (elementExists != null) {
      elementExists.remove();
    }

    let select;

    const timeObj = {
      5: [90, 60, 45, 30, 15, 10, 5],
      10: [90, 60, 45, 30, 15, 10],
      15: [90, 60, 45, 30, 15],
      20: [90, 60, 45, 30, 20],
    };

    select = generateTime(timeObj[val]);

    document.getElementById("container").innerHTML = select;
  }

  function onInput() {
    this.questType = document.getElementById("questionType");
    this.operation = document.getElementById("arithmetic");
    this.questLength = document.getElementById("questionRows");
    this.time = document.getElementById("timeField");
    if (
      this.questType != null &&
      this.operation != null &&
      this.questLength != null &&
      this.time != null
    ) {
      location.href += `question?type=${this.questType.value}&operation=${this.operation.value}&length=${this.questLength.value}&time=${this.time.value}`;
    } else {
      window.alert("Select All Field");
    }
  }

  function getCookie(c_name) {
    var i,
      x,
      y,
      ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
      x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
      y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
      x = x.replace(/^\s+|\s+$/g, "");
      if (x == c_name) {
        return unescape(y);
      }
    }
  }

  var x = getCookie("userData");
  if (x !== undefined) {
    isLoggedin = true;
    document.getElementById("name").style.display = "block";
    document.getElementById("name").innerHTML = `Hello, ${x}`;
    document.getElementById("signout").style.display = "block";
    document.getElementById("login-link").parentElement.style.display = "None";
    document.getElementById("login-button").style.display = "none";
  } else {
    if (document.getElementById("login-button")) {
      document.getElementById("login-button").style.display = "flex";
      document.getElementById("name").parentElement.style.display = "None";
      document.getElementById(
        "signout"
      ).parentElement.parentElement.style.display = "None";
    }
  }
});
