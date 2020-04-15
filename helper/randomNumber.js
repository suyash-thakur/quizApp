function getRandomNumber(min, max, decimal = 0) {
  min = Math.ceil(min);
  max = Math.floor(max);
  number = Math.random() * (max - min) + min;
  return number.toFixed(decimal);
}



module.exports = getRandomNumber;
