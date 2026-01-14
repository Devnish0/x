function add(a, b) {
  return a + b;
}
function subtract(a, b) {
  return a - b;
}
function multiply(a, b) {
  return a * b;
}
function divide(a, b) {
  return a / b;
}
function calculator(a, b, operation) {
  if (!Number.isNaN(Number(a)) && !Number.isNaN(Number(b))) {
    return operation(a, b);
  }

  return NaN;
}

console.log(calculator(5, 7, add));
console.log(calculator(12, 12, multiply));
