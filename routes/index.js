const express = require("express"),
  router = express.Router();
const generateQuestion = require("../helper/questions");
const randomNumber = require("../helper/randomNumber");
const shuffle = require("../helper/arrayShuffle");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const connection = require("../connection");
const problem = fs.readFileSync(__dirname + "/wordproblem.json");
const flash = fs.readFileSync(__dirname + "/flashCard.json");

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

let userID = 440 || randomNumber(1, 10000);

const questionsGenerate = (typeOfQuestion) => {
  numOfQuestion = quizFunctionCall[typeOfQuestion];
  questionArr = [];

  while (numOfQuestion > 0) {
    let question = generateQuestion(
      typeOfQuestion,
      operation,
      lengthNum
    );

    let answer = eval(question);
    let choices = [answer];
    let i = 0;

    while (i < 3) {
      let num = randomNumber(answer - 5, answer + 5);
      if (!choices.includes(num - 0)) {
        choices.push(num - 0);
        i++;
      }
    }

    questionArr.push({ question, answer, choices });

    numOfQuestion -= 1;
  }

  return questionArr;
};

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.post("/", function (req, res) {
  const { email, password } = req.body;

  if (email && password) {
    connection.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password],
      function (error, results, fields) {
        if (results.length > 0) {
          const name = results[0].name;
          res.cookie("userData", name);
          res.cookie("profileData", {
            name: results[0].name,
            email: results[0].email,
          });
          res.redirect("/");
        } else {
          res.render("index", { error: "Incorrect email and/or Password!" });
        }
      }
    );
  } else {
    res.render("index", { error: "Please enter email and Password!" });
  }
});

router.get("/quiz", function (req, res, next) {
  res.render("quiz");
});
router.get("/teacher", function (req, res, next) {
  res.render("teacher");
});
router.get("/login", function (req, res, next) {
  res.render("login");
});
router.get("/DemoQuiz", function (req, res, next) {
  res.render("DemoQuiz");
});

router.get("/profile", function (req, res, next) {
  res.render("profile", { profileData: req.cookies.profileData });
});

router.get("/wordProblem", function (req, res, next) {
  let problems = JSON.parse(problem);
  arrayOfQuestions = [];
  arrayOfChoices = [];

  problems.forEach((problem) => {
    arrayOfQuestions.push(problem.question);
    arrayOfChoices.push(shuffle(problem.options));
  });

  useVar[userID] = {"problem" :problems};

  res.render("wordProblem", {
    questions: arrayOfQuestions,
    choices: arrayOfChoices,
  });
});

router.post("/wordProblem", function (req, res, next) {
  let flashJSON = useVar[userID]["problem"];
  
  const arr = req.body;
  let points = 0;
  
  flashJSON.forEach((e, i) => {
    if(e.answer == arr[i]){
      points += 1;
    }
  })

  res.send({points})
})

router.get("/flashCard", function (req, res, next) {
  let flashJSON = JSON.parse(flash);
  let flashChoices = [];
  let flashQuestion = [];

  flashJSON.forEach((e) => {
    flashQuestion.push(e.question);
    flashChoices.push(e.options);
  })
  
  useVar[userID] = {"flash" :flashJSON};
  res.render("flashCard", {
    flashQuestion,
    flashChoices,
  });

});

router.post("/flashCard", function (req, res, next) {
  let flashJSON = useVar[userID]["flash"];
  
  const arr = req.body;
  let points = 0;
  
  flashJSON.forEach((e, i) => {
    if(e.answer == arr[i]){
      points += 1;
    }
  })

  res.send({points})
})

router.post("/profile", function (req, res) {
  const { username, email, password } = req.body;

  connection.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    function (error, results) {
      if (results.length > 0) {
        const name = results[0].name;
        res.cookie("userData", name);
        res.cookie("profileData", {
          name: results[0].name,
          email: results[0].email,
        });
        connection.query(
          "UPDATE users SET name= ? WHERE email = ? AND password = ?",
          [username, email, password],
          function (error, results) {
            res.status(200).redirect("/");
          }
        );
      } else {
        res.render("profile", {
          profileData: req.cookies.profileData,
          error: "Incorrect Password!",
        });
      }
    }
  );
});

router.get("/quizquestion", function (req, res, next) {
  typeOfQuestion = req.query.type;
  operation = req.query.operation;
  lengthNum = req.query.length;
  time = req.query.time;
  console.log(lengthNum)

  questionArr = questionsGenerate(typeOfQuestion, operation, lengthNum);

  arrayOfQuestions = [];
  arrayOfChoices = [];

  questionArr.forEach((quiz) => {
    arrayOfQuestions.push(quiz.question);
    arrayOfChoices.push(shuffle(quiz.choices));
  });

  useVar[userID] = {"quiz" :questionArr};
  res.cookie("userID", userID); // options is optional

  res.render("question", {
    quizQuestion: arrayOfQuestions,
    quizChoices: arrayOfChoices,
    operation: operation,
    time: time
  });
});

router.post("/quizquestion", function (req, res, next) {
  result = useVar[req.cookies.userID]["quiz"][req.body.index].answer == req.body.answer;
  res.json({
    result: result,
    answer: useVar[req.cookies.userID]["quiz"][req.body.index].answer,
  });
});

router.post("/check", function (req, res, next) {
  let isCorrect;
  if (req.body.result === arrayofAnswers[req.body.id]) {
    isCorrect = true;
  } else {
    isCorrect = false;
  }
  res.json({
    check: isCorrect,
    answer: arrayofAnswers[req.body.id],
  });
});

router.post("/clear", function (req, res, next) {
  res.clearCookie("profileData");
  res.clearCookie("userData");
  res.redirect("/");
});

module.exports = router;
