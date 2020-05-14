// document.getElementById("questionType").addEventListener("input", () => {
//     location.href += `question?type=${e.innerText}`;
// }
// );
var questType;
var operation;
function onInput() {
  this.questType = document.getElementById("questionType").value;
  this.operation = document.getElementById("arithmetic").value;
  console.log(this.questType);
  location.href += `question?type=${this.questType}&operation=${this.operation}`;

}
