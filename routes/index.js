const express = require("express"),
      router = express.Router();
const generateQuestion = require("../helper/questions");
const randomNumber = require("../helper/randomNumber");
const shuffle = require("../helper/arrayShuffle");

const connection = require("../connection");

var sql = "SELECT * FROM users WHERE email = 'test@gmail.com'";
connection.query(sql, function (err, result) {
  if (err) throw err;
  console.log(result);
});

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
  res.render("index", { title: "Quiz Website"  });
});
router.get("/quiz", function (req, res, next) {
  res.render("quiz", { title: "Quiz Website" });
});
router.get("/teacher", function (req, res, next) {
  res.render("teacher", { title: "Quiz Website" });
});
// router.get("/quizquestion", function (req, res, next) {
//   res.render("question", { title: "Quiz Website" });
// });

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


  console.log(arrayOfQuestions);
  console.log(arrayOfChoices);

   return res.render("question", {
     title: 'title',
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

router.post('/auth', function(request, response) {
	var username = request.body.username;
  var password = request.body.password;
  console.log(username +" " + password);
	if (username && password) {
		connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
        const name = results[0].name;
        console.log(name);
        response.cookie('userData', name);
        response.redirect('/');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});
module.exports = router;
