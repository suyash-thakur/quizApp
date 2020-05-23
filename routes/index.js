const express = require("express"),
      router = express.Router();
const generateQuestion = require("../helper/questions");
const randomNumber = require("../helper/randomNumber");
const shuffle = require("../helper/arrayShuffle");
const cookieParser = require("cookie-parser");

const connection = require("../connection");

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
      operation,
      quizRow[typeOfQuestion]
    );

    let answer = eval(question);
    let choices = [answer];
    let i = 0;

    while(i < 3) {
      let num = randomNumber(answer - 5, answer + 5) ;
      if(!choices.includes(num - 0) ){
        console.log(choices.includes(num));
        choices.push(num - 0);
        i++
      }
    }

    questionArr.push({ question, answer, choices });

    numOfQuestion -= 1;
  }

  return questionArr;
};
var userData = null;
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.post('/', function(req, res) {
  const {email, password} = req.body;

  if (email && password) {
		connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			if (results.length > 0) {
        const name = results[0].name;
        res.cookie('userData', name);
        res.cookie('profileData', {name: results[0].name, email: results[0].email});
        res.redirect('/');
			} else {
        res.render("index", {error: 'Incorrect email and/or Password!'});
			}			
		});
	} else {
    res.render("index", {error: 'Please enter email and Password!'});
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

router.get("/profile", function (req, res, next) {
  res.render("profile", {profileData: req.cookies.profileData});
});

router.post("/profile", function(req, res) {
  const {username, email, password} = req.body;
  
  connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], function(error, results) {
    if (results.length > 0) {
      const name = results[0].name;
      res.cookie('userData', name);
      res.cookie('profileData', {name: results[0].name, email: results[0].email});
      connection.query('UPDATE users SET name= ? WHERE email = ? AND password = ?',[username, email, password] , function(error, results) {
         res.status(200).redirect("/");
      });
    } else {
      res.render("profile", {profileData: req.cookies.profileData, error: 'Incorrect Password!'});
    }
  })
})

router.get("/quizquestion", function (req, res, next) {
  typeOfQuestion = req.query.type;
  operation = req.query.operation;
  console.log(typeOfQuestion);

  questionArr = questionsGenerate(typeOfQuestion, operation);

  arrayOfQuestions = [];
  arrayOfChoices = [];

  questionArr.forEach((quiz) => {
    arrayOfQuestions.push(quiz.question);
    arrayOfChoices.push(shuffle(quiz.choices));
  });

  userID = randomNumber(1, 1000);

  useVar[userID] = questionArr;
  res.cookie("userID", userID); // options is optional

   return res.render("question", {
    quizQuestion: arrayOfQuestions,
    quizChoices: arrayOfChoices,
    operation: operation
  });

});

router.post("/api", function (req, res, next) {
  result = useVar[req.cookies.userID][req.body.index].answer == req.body.answer;
  res.json({
    result: result,
    answer: useVar[req.cookies.userID][req.body.index].answer,
  });
});

router.post("/clear", function (req,res,next) {
  res.clearCookie('profileData');
  res.clearCookie('userData');
  res.redirect("/");
})

module.exports = router;
