$(document).ready(function () {
  $(".navbar .dropdown-item").on("click", function (e) {
    var $el = $(this).children(".dropdown-toggle");
    var $parent = $el.offsetParent(".dropdown-menu");
    $(this).parent("li").toggleClass("open");
    if (
      !$parent.parent().hasClass("navbar-nav") &&
      !e.target.classList.contains("dropdown-link")
    ) {
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


  
  


  function getCookie(c_name) {
    var i,x,y,ARRcookies = document.cookie.split(";");
    
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
    document.querySelector(".userName").style.display = "block";
    document.getElementById("signout").style.display = "block";
    document.getElementById("login-link").parentElement.style.display = "none";
    document.getElementById("login-button").style.display = "none";
  } else {
      document.querySelector(".userName").style.display = "none";
      document.getElementById("login-button").style.display = "flex";
      document.getElementById("signout").parentElement.parentElement.style.display = "none";
  }
});
function time(val) {
  var elementExists = document.getElementById("timeField");
  if( elementExists != null) {
    elementExists.remove();
  }
  console.log(val);
  if(val == 10) {
    console.log('10');
  }
  var select = document.createElement("select");
  select.id = 'timeField';
  select.classList.add("quiz-input");

var timeTen = [90, 60, 45, 30, 15, 10];
var timeFive = [90, 60, 45, 30, 15, 10, 5];
var timeFifteen = [90, 60, 45, 30, 15];
var timeTwenty = [90, 60, 45, 30, 20];

var option = document.createElement("option");
option.value = null;
option.text = 'Select time in second'
option.selected = true;
option.disabled = true;
select.appendChild(option);


switch(val) {
  case '5':
    for (const val of timeFive) {
      var option = document.createElement("option");
      option.value = val;
      option.text = val;
      select.appendChild(option);
    }
    break;
    case '10':
      for (const val of timeTen) {
        var option = document.createElement("option");
        option.value = val;
        option.text = val;
        select.appendChild(option);
      }
      console.log('yes');

      break;
      case '15':
        for (const val of timeFifteen) {
          var option = document.createElement("option");
          option.value = val;
          option.text = val;
          select.appendChild(option);
        }
        console.log('yes');

        break;
        case '20':
          for (const val of timeTwenty) {
            var option = document.createElement("option");
            option.value = val;
            option.text = val;
            select.appendChild(option);
          }
          console.log('yes');
          break;

}
document.getElementById("container").appendChild(select);
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
