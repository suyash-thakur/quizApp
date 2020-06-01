// document.getElementById("questionType").addEventListener("input", () => {
//     location.href += `question?type=${e.innerText}`;
// }
// );
var questType;
var operation;
var questLength;
var time;


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

var optiondef = document.createElement("option");
optiondef.text = "Select Time";
optiondef.selected = true;
optiondef.disabled = true;
select.appendChild(optiondef);

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
  this.questType = document.getElementById("questionType").value;
  this.operation = document.getElementById("arithmetic").value;
  this.questLength = document.getElementById("questionRows").value;
  this.time = document.getElementById("timeField").value;
  location.href += `question?type=${this.questType}&operation=${this.operation}&length=${this.questLength}&time=${this.time}`;

}
var isLoggedin = false;
function getCookie(c_name) {
var i, x, y, ARRcookies = document.cookie.split(";");
for (i = 0; i < ARRcookies.length; i++) {
x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
x = x.replace(/^\s+|\s+$/g, "");
if (x == c_name) {
    return unescape(y);
}
}
}
function delete_cookie(name) {
document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
document.getElementById('name').style.display = 'none';
document.getElementById('signout').style.display = 'none';
document.getElementById('login').style.display = 'block';
document.getElementById('login-button').style.display = 'block';



}
function quizUrl() {
if(isLoggedin == true) {
window.location.href = "/quiz";
} else {
  window.location.href = "/DemoQuiz";
  
}
}
var x = getCookie("userData");
if(x !== undefined) {
  isLoggedin = true;
  document.getElementById('name').style.display = 'block';
  document.getElementById('name').innerHTML = `Hello, ${x}`;
  document.getElementById('signout').style.display = 'block';
  document.getElementById('login-link').parentElement.style.display = 'None';
  document.getElementById('login-button').style.display = 'none';
} else {
  document.getElementById('login-button').style.display = 'flex';
  document.getElementById('name').parentElement.style.display = 'None';
  document.getElementById('signout').parentElement.parentElement.style.display = 'None';
}