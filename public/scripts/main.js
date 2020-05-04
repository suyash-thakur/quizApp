// document.getElementById("questionType").addEventListener("input", () => {
//     location.href += `question?type=${e.innerText}`;
// }
// );
var questType;
function onInput() {
  this.questType = document.getElementById("questionType").value;
  console.log(this.questType);
  location.href += `question?type=${this.questType}`;

}
