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
document.querySelectorAll(".choices").forEach((e) => {
  e.addEventListener("click", () => {
    const data = {
      answer: e.innerText,
      index: e.parentElement.dataset.index,
      question: e.parentElement.children[0].innerText,
    };

    const url = "/api";

    const param = {
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(data),
      method: "post",
    };
    fetch(url, param)
      .then((response) => {
        response = response.json();
        return response;
      })
      .then((data) => {
        if (data.result) {
          e.style.color = "Green";
        } else {
          e.style.color = "Red";
        }
      })
      .catch((err) => {
        console.log("Err", err);
      });
  });
});
