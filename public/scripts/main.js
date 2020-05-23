// document.getElementById("questionType").addEventListener("input", () => {
//     location.href += `question?type=${e.innerText}`;
// }
// );
var questType;
var operation;
function onInput() {
  this.questType = document.getElementById("questionType").value;
  this.operation = document.getElementById("arithmetic").value;
  location.href += `question?type=${this.questType}&operation=${this.operation}`;

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
window.alert("Please log-in to continue");
}
}
var x = getCookie("userData");
if(x !== undefined) {
  isLoggedin = true;
  document.getElementById('name').style.display = 'block';
  document.getElementById('name').innerHTML = x;
  document.getElementById('signout').style.display = 'block';
  document.getElementById('login').style.display = 'none';
  document.getElementById('login-button').style.display = 'none';
} else {
  document.getElementById('login-button').style.display = 'flex';

}