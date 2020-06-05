const express = require("express"),
  router = express.Router();
const fs = require("fs");
const moment = require("moment");
const generateQuestion = require("../helper/questions");
const randomNumber = require("../helper/randomNumber");
const shuffle = require("../helper/arrayShuffle");
const connection = require("../connection");
const problem = fs.readFileSync(__dirname + "/wordproblem.json");
const flash = fs.readFileSync(__dirname + "/flashCard.json");

const quizFunctionCall = {
  one: 1,
  two: 6,
  three: 5,
  onetwo: 5,
};

let questionArr = [];
let useVar = {};

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

router.use(async (req, res, next) => {
  if (Object.keys(req.cookies).length !== 0) {
    var email = req.cookies.profileData;
    await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (error, results, fields) => {
        if (results.length > 0) {
          if (useVar[email] === undefined) {
            useVar[email] = results[0];
          }
          useVar[email].loggedIn = true;
          next();
        } else {
          useVar[email].loggedIn = false;
          next();
        }
      }
    );
  }
});

const verifyQuestion = (questionObj, selectedAnswers) => {
  let arrayOfAnswers = [],
    points = 0;

  questionObj.forEach((e, i) => {
    let answers = {
      question: e.question,
      selected: selectedAnswers[i],
      answer: e.answer,
    };

    arrayOfAnswers.push(answers);

    if (e.answer == selectedAnswers[i]) {
      points += 1;
    }
  });
  return { points, arrayOfAnswers };
};

const insertData = (email, type, points) => {
  connection.query("INSERT INTO score values (?,?,?,?)", [email, type, points, moment().format('YYYY-MM-DD HH:mm:ss')], (error, results) => {
    if (error) {
      console.log(error);
    }
    else {
      console.log(results);
    }
  });
}

/* GET home page. */

router.get("/", async (req, res, next) => {
  if (Object.keys(req.cookies).length === 0) {
    res.redirect("/");
  } else if (req.cookies.profileData === undefined) {
    res.redirect("/");
  } else if (!useVar[req.cookies.profileData].loggedIn) {
    res.redirect("/");
  } else if (!useVar[req.cookies.profileData].onboarded) {
    res.redirect("/profile");
  } else {
    res.redirect("/onboard");
  }
});

router.get("/onboard", async (req, res, next) => {
  if (Object.keys(req.cookies).length === 0) {
    res.redirect("/login");
  } else {

    let resultArr = [];
    let profileData;

    await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [req.cookies.profileData],
      (error, results) => {
        if (results.length > 0) {
          profileData = results[0];
          delete profileData["password"];
        }
      }
    );

    await connection.query(
      "SELECT * FROM score WHERE email = ?",
      [req.cookies.profileData],
      (error, results) => {
        if (results.length > 0) {
          results.forEach((result, index) => {
            resultArr.push({"Score": result.points, "Type": result.questionType, "Date": moment(result.date).format("LLL")})
            if(index >= results.length - 1){
              res.render("onboard", { profileData, resultArr});
            }
          })
        }
      }
    )
  }
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
        if (error) {
          res.redirect("error");
        }
        if (results.length > 0) {
          const userObj = results[0];
          res.cookie("userData", userObj.name);
          res.cookie("profileData", userObj.email);
          useVar[userObj.email] = userObj;

          if (userObj.onboarded) {
            res.redirect("/");
          } else {
            res.redirect("/profile");
          }
        } else {
          res.render("login", { error: "Incorrect email and/or Password!" });
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
  let problemsJSON;
  let problemQuestions = [];
  let problemChoices = [];

  problemsJSON = JSON.parse(problem);

  problemsJSON.forEach((e) => {
    problemQuestions.push(e.question);
    problemChoices.push(e.options);
  });

  useVar[404] = { problem: problemsJSON };

  res.render("wordProblem", {
    problemQuestions,
    problemChoices,
    isDemo: true,
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

  useVar[404] = { flash: flashJSON };

  res.render("flashCard", {
    flashQuestion,
    flashChoices,
    isDemo: true,
  });
});

router.get("/profile", (req, res, next) => {
  if (Object.keys(req.cookies).length === 0) {
    res.redirect("/");
  } else {
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [req.cookies.profileData],
      (error, results) => {
        if (error) {
          res.redirect("error");
        }
        if (results.length > 0) {
          let profileData = results[0];
          delete profileData["password"];
          res.render("profile", { profileData });
        }
      }
    );
  }
});

router.post("/profile", (req, res) => {
  const { username, email, number, address, age, password } = req.body;

  connection.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (error, results) => {
      if (error) {
        res.redirect("error");
      }

      if (results.length > 0) {
        const name = results[0].name;
        res.cookie("userData", name);
        connection.query(
          "UPDATE users SET name= ?,number= ?,address= ?,age= ?, onboarded = 1 WHERE email = ? AND password = ?",
          [username, number, address, age, email, password],
          (error, results) => {
            if (error) {
              res.redirect("error");
            }
            res.status(200).redirect("/");
          }
        );
      } else {
        connection.query(
          "SELECT * FROM users WHERE email = ?",
          [req.cookies.profileData],
          (error, results) => {
            if (results.length > 0) {
              let profileData = results[0];
              delete profileData["password"];
              res.render("profile", {
                profileData,
                error: "Incorrect Password!",
              });
            }
          }
        );
      }
    }
  );
});

router.get("/wordProblem", async (req, res, next) => {
  let problemsJSON;
  let problemQuestions = [];
  let problemChoices = [];

  if (Object.keys(req.cookies).length === 0) {
    res.redirect("/DemoWord");
  } else if (req.cookies.profileData === undefined) {
    res.redirect("/DemoWord");
  } else if (!useVar[req.cookies.profileData].loggedIn) {
    res.redirect("/DemoWord");
  } else {
    await connection.query(
      "select * from wordProblems",
      (error, results, fields) => {
        if (error) {
          res.redirect("error");
        }

        problemsJSON = shuffle(results);

        problemsJSON.forEach((e) => {
          problemQuestions.push(e.question);
          problemChoices.push(shuffle([e.first, e.second, e.third, e.fourth]));
        });

        useVar[req.cookies.profileData] = { problem: problemsJSON };
        isDemo = false;
        res.render("wordProblem", {
          problemQuestions,
          problemChoices,
          isDemo,
        });
      }
    );
  }
});

router.post("/wordProblem", async (req, res, next) => {
  let wordJSON = useVar[req.cookies.profileData || 404]["problem"];

  const arr = req.body;

  const { points, arrayOfAnswers } = await verifyQuestion(wordJSON, arr);

  await insertData(req.cookies.profileData, "Word Problem", points);

  res.send({ points, arrayOfAnswers });
});

router.get("/flashCard", async (req, res, next) => {
  let flashJSON;
  let flashChoices = [];
  let flashQuestion = [];

  if (Object.keys(req.cookies).length === 0) {
    res.redirect("/DemoFlash");
  } else if (req.cookies.profileData === undefined) {
    res.redirect("/DemoFlash");
  } else if (!useVar[req.cookies.profileData].loggedIn) {
    res.redirect("/DemoFlash");
  } else {
    await connection.query(
      "select * from flashCards",
      (error, results, fields) => {
        if (error) {
          res.redirect("error");
        }

        flashJSON = shuffle(results);

        flashJSON.forEach((e) => {
          flashQuestion.push(e.question);
          flashChoices.push(shuffle([e.first, e.second, e.third, e.fourth]));
        });

        useVar[req.cookies.profileData] = { flash: flashJSON };
        isDemo = false;

        res.render("flashCard", {
          flashQuestion,
          flashChoices,
          isDemo,
        });
      }
    );
  }
});

router.post("/flashCard", async (req, res, next) => {
  let flashJSON = useVar[req.cookies.profileData || 404]["flash"];

  const arr = req.body;

  const { points, arrayOfAnswers } = await verifyQuestion(flashJSON, arr);

  await insertData(req.cookies.profileData, "Flash Card", points);

  res.send({ points, arrayOfAnswers });
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

  useVar[req.cookies.profileData] = { quiz: questionArr };

  res.render("question", {
    quizQuestion: arrayOfQuestions,
    quizChoices: arrayOfChoices,
    operation,
    time,
  });
});

router.post("/quizquestion", (req, res, next) => {
  result =
    useVar[req.cookies.profileData]["quiz"][req.body.index].answer ==
    req.body.answer;

  res.json({
    result: result,
    answer: useVar[req.cookies.profileData]["quiz"][req.body.index].answer,
  });
});

router.post("/finalQuiz", async (req, res, next) => {
  let {points, type, operation, screens, time} = req.body;
  if(operation == "subAndAdd"){
    operation = "+"; 
  }
  else{
    operation = "*";
  }

  switch(type){
    case "one":
      type = "1"
      break;
    case "two":
      type = "2"
      break;
    case "three":
      type = "3"
      break;
    case "onetwo":
      type = "1+2"
      break;
  }

  await insertData(req.cookies.profileData, `Quiz - (Operation: ${operation}, Digits: ${type}, Rows: ${screens}, Time: ${time})`, points);
})

router.post("/clear", (req, res, next) => {
  useVar[req.cookies.profileData] = { loggedIn: false };
  res.clearCookie("profileData");
  res.clearCookie("userData");
  res.redirect("/");
});

router.get("/:", (req, res, next) => {
  res.render("error");
});

module.exports = router;
