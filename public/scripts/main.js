var questType;
var operation;
var questLength;
var time;

function generateTime(timeArr) {
  let selectHTML = `
  <select id="timeField" class="quiz-input">
  <option disabled>Select Time</option>`

  timeArr.forEach((time) => {
    selectHTML += `<option value=${time}>${time}</option>`
  });
  
  selectHTML += `</select>`

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
  }

  select = generateTime(timeObj[val])

  document.getElementById("container").innerHTML = select;
}

function onInput() {
  this.questType = document.getElementById("questionType").value;
  this.operation = document.getElementById("arithmetic").value;
  this.questLength = document.getElementById("questionRows").value;
  this.time = document.getElementById("timeField").value;
  location.href += `question?type=${this.questType}&operation=${this.operation}&length=${this.questLength}&time=${this.time}`;
}
var isLoggedin = false;
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

function wordProbStart() {
  window.location.href = "/wordProblem";
}
function flashStart() {
  window.location.href = "/flashCard";
}
function quizUrl() {
  if (isLoggedin == true) {
    window.location.href = "/quiz";
  } else {
    window.location.href = "/DemoQuiz";
  }
}
function profileVisit() {
  window.location.href = "/profile";

}
function wordprobUrl() {
  if (isLoggedin == true) {
    window.location.href = "/WordStart";
  } else {
    window.location.href = "/DemoWord";
  }
}
function flashUrl() {
  if (isLoggedin == true) {
    window.location.href = "/flashStart";
  } else {
    window.location.href = "/DemoFlash";
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
  document.getElementById("login-button").style.display = "flex";
  document.getElementById("name").parentElement.style.display = "None";
  document.getElementById("signout").parentElement.parentElement.style.display =
    "None";
}
