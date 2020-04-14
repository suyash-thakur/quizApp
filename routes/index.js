const express = require("express"),
  router = express.Router();

const generateQuestion = require("./../questions");
const randomNumber = require("../helper/randomNumber");

const quizFunctionCall = {
  one: 7,
  two: 6,
  three: 5,
  onetwo: 5,
};

const quizTime = {
  one: [90, 60, 45, 30, 15, 10, 5],
  two: [90, 60, 50, 30, 20, 10],
  three: [90, 60, 45, 30, 15],
  onetwo: [90, 60, 45, 30, 15],
};

const quizRow = {
  one: 5,
  two: 10,
  three: 15,
  onetwo: 20,
};

let questionArr = [];

let useVar = {};

questionsGenerate = (typeOfQuestion) => {
  numOfQuestion = quizFunctionCall[typeOfQuestion];
  questionArr = [];

  while (numOfQuestion > 0) {
    let question = generateQuestion(
      typeOfQuestion,
      "subAndAdd",
      quizRow[typeOfQuestion]
    );

    let answer = eval(question);
    let choices = [answer];

    for (let i = 0; i < 3; i++) {
      choices.push(randomNumber(answer - 5, answer + 5) - 0);
    }

    questionArr.push({ question, answer, choices });

    numOfQuestion -= 1;
  }

  return questionArr;
};

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Quiz Website" });
});

router.get("/questions", function (req, res, next) {
  typeOfQuestion = req.query.type;

  questionArr = questionsGenerate(typeOfQuestion);

  arrayOfQuestions = [];
  arrayOfChoices = [];

  questionArr.forEach((quiz) => {
    arrayOfQuestions.push(quiz.question);
    arrayOfChoices.push(quiz.choices);
  });

  userID = randomNumber(1, 1000);

  useVar[userID] = questionArr;
  res.cookie("userID", userID); // options is optional

  res.render("questions", {
    quizQuestion: arrayOfQuestions,
    quizChoices: arrayOfChoices,
  });
});

router.post("/api", function (req, res, next) {
  result = useVar[req.cookies.userID][req.body.index].answer == req.body.answer;
  res.json({
    result: result,
    answer: useVar[req.cookies.userID][req.body.index].answer,
  });
});

module.exports = router;
