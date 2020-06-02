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

let userID;

const questionsGenerate = (typeOfQuestion) => {
  numOfQuestion = quizFunctionCall[typeOfQuestion];
  questionArr = [];

  while (numOfQuestion > 0) {
    let question = generateQuestion(typeOfQuestion, operation, lengthNum);

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
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/onboard", (req, res, next) => {
  res.render("onboard");
});

router.get("/quiz", (req, res, next) => {
  res.render("quiz");
});

router.get("/teacher", (req, res, next) => {
  res.render("teacher");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    connection.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password],
      (error, results, fields) => {
        if (results.length > 0) {
          const userObj = results[0];
          const name = userObj.name;
          res.cookie("userData", name);
          res.cookie("profileData", {
            name: userObj.name,
            email: userObj.email,
          });
          userID = userObj.password;
          
          if(userObj.onboarded){
            res.redirect("/");
          }
          else{
            res.redirect("/profile");
          }

        } else {
          res.render("index", { error: "Incorrect email and/or Password!" });
        }
      }
    );
  } else {
    res.render("index", { error: "Please enter email and Password!" });
  }
});

router.get("/DemoQuiz", (req, res, next) => {
  res.render("DemoQuiz");
});

router.get("/WordStart", (req, res, next) => {
  res.render("WordStart");
});

router.get("/flashStart", (req, res, next) => {
  res.render("flashStart");
});

router.get("/DemoWord", (req, res, next) => {
  let isDemo;
  let problemsJSON;
  let problemQuestions = [];
  let problemChoices = [];

      problemsJSON =  JSON.parse(problem);

      problemsJSON.forEach((e) => {
        problemQuestions.push(e.question);
        problemChoices.push(e.options);
      });

      useVar[userID] = { problem: problemsJSON };
      isDemo = true;
      res.render("wordProblem", {
        problemQuestions,
        problemChoices,
        isDemo
      });
});

router.get("/DemoFlash", async (req, res, next) => {
  let flashJSON;
  let flashChoices = [];
  let flashQuestion = [];


    flashJSON = JSON.parse(flash);

    flashJSON.forEach((e) => {
      flashQuestion.push(e.question);
      flashChoices.push(e.options);
    });
    
    useVar[userID] = { flash: flashJSON };
    isDemo = true;

    res.render("flashCard", {
      flashQuestion,
      flashChoices,
      isDemo
    });

});

router.get("/profile", (req, res, next) => {
  res.render("profile", { profileData: req.cookies.profileData });
});

router.post("/profile", (req, res) => {
  const { username, email, password } = req.body;

  connection.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (error, results) => {
      if (results.length > 0) {
        const name = results[0].name;
        res.cookie("userData", name);
        res.cookie("profileData", {
          name: results[0].name,
          email: results[0].email,
        });
        console.log(results)
        connection.query(
          "UPDATE users SET name= ?, onboarded = 1 WHERE email = ? AND password = ?",
          [username, email, password],
          (error, results) => {
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

router.get("/wordProblem", async (req, res, next) => {
  let problemsJSON;
  let problemQuestions = [];
  let problemChoices = [];

  await connection.query("select * from wordProblems", (
    error,
    results,
    fields) => {
      problemsJSON = shuffle(results);

      problemsJSON.forEach((e) => {
        problemQuestions.push(e.question);
        problemChoices.push(shuffle([e.first, e.second, e.third, e.fourth]));
      });

      useVar[userID] = { problem: problemsJSON };
      isDemo = false;
      res.render("wordProblem", {
        problemQuestions,
        problemChoices,
        isDemo
      });
  });
});

router.post("/wordProblem", (req, res, next) => {
  let flashJSON = useVar[userID]["problem"];

  const arr = req.body;
  let points = 0;

  flashJSON.forEach((e, i) => {
    if (e.answer == arr[i]) {
      points += 1;
    }
  });

  res.send({ points });
});

router.get("/flashCard", async (req, res, next) => {
  let flashJSON;
  let flashChoices = [];
  let flashQuestion = [];

  await connection.query("select * from flashCards", (
    error,
    results,
    fields
  ) => {
    flashJSON = shuffle(results);

    flashJSON.forEach((e) => {
      flashQuestion.push(e.question);
      flashChoices.push(shuffle([e.first, e.second, e.third, e.fourth]));
    });
    
    useVar[userID] = { flash: flashJSON };
    isDemo = false;

    res.render("flashCard", {
      flashQuestion,
      flashChoices,
      isDemo
    });

  });
});

router.post("/flashCard", (req, res, next) => {
  let flashJSON = useVar[userID]["flash"];

  const arr = req.body;
  let points = 0;

  flashJSON.forEach((e, i) => {
    if (e.answer == arr[i]) {
      points += 1;
    }
  });

  res.send({ points });
});

router.get("/quizquestion", (req, res, next) => {
  typeOfQuestion = req.query.type;
  operation = req.query.operation;
  lengthNum = req.query.length;
  time = req.query.time;

  questionArr = questionsGenerate(typeOfQuestion, operation, lengthNum);

  arrayOfQuestions = [];
  arrayOfChoices = [];

  questionArr.forEach((quiz) => {
    arrayOfQuestions.push(quiz.question);
    arrayOfChoices.push(shuffle(quiz.choices));
  });

  useVar[userID] = { quiz: questionArr };
  res.cookie("userID", userID); // options is optional

  res.render("question", {
    quizQuestion: arrayOfQuestions,
    quizChoices: arrayOfChoices,
    operation,
    time,
  });
});

router.post("/quizquestion", (req, res, next) => {
  result =
    useVar[req.cookies.userID]["quiz"][req.body.index].answer ==
    req.body.answer;
  res.json({
    result: result,
    answer: useVar[req.cookies.userID]["quiz"][req.body.index].answer,
  });
});

router.post("/clear", (req, res, next) => {
  res.clearCookie("profileData");
  res.clearCookie("userData");
  res.redirect("/");
});

module.exports = router;
