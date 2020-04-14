lengthOfDigits = {
  one: [1, 10],
  two: [10, 100],
  three: [100, 1000],
};

expression = {
  subAndAdd: [45, 43],
  mulAndDiv: [47, 42],
};

function getRandomNumber(min, max, decimal = 0) {
  min = Math.ceil(min);
  max = Math.floor(max);
  number = Math.random() * (max - min) + min;
  return number.toFixed(decimal);
}

function getRandomSymbol(type) {
  return String.fromCharCode(
    expression[type][Math.floor(Math.random() * 2)].toString()
  );
}

function generateQuestion(digit, type = "subAndAdd", length = 5, decimal = 0) {
  let arithmeticExpression = "";
  let oneTwoArr = ["one", "two"];

  if (digit !== "onetwo") {
    min = lengthOfDigits[digit][0];
    max = lengthOfDigits[digit][1];
  }

  while (length > 0) {
    if (digit === "onetwo") {
      index = oneTwoArr[Math.floor(Math.random() * 2)];
      min = lengthOfDigits[index][0];
      max = lengthOfDigits[index][1];
    }

    arithmeticExpression +=
      getRandomNumber(min, max, decimal) +
      (length > 1 ? getRandomSymbol(type) : "");
    length -= 1;
  }

  return arithmeticExpression;
}

module.exports = generateQuestion;

// console.log(generateQuestion("one"));

// console.log(generateQuestion("two"));

// console.log(generateQuestion("two", "mulAndDiv"));

// console.log(generateQuestion("three"));

// console.log(generateQuestion("onetwo", "mulAndDiv", 7));
