// Grab HTML
const inputField = document.getElementById("inputField");
const outputField = document.getElementById("outputField");

const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const equalsButton = document.querySelector(".equals");

// Variables
let currentInput = "";
let firstValue = null;
let secondValue = null;
let currentOperator = null;
let result = null;

// let shouldResetInput = false;

// Input Field
inputField.textContent = "0";

// Basic Functions
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

// Pick which one we need
function operate(operator, a, b) {
  if (operator === "+") {
    return add(a, b);
  } else if (operator === "-") {
    return subtract(a, b);
  } else if (operator === "*") {
    return multiply(a, b);
  } else if (operator === "/") {
    return divide(a, b);
  }
}

// Display Function
function updateDisplay() {
  // Input field (what user is typing or result)
  inputField.textContent = currentInput || currentOperator || "0";

  if (currentInput !== null) {
    if (currentOperator === null) {
      // Only a committed value
      outputField.textContent = currentInput;
    } else {
      // Operator exists → show expression
      outputField.textContent =
        currentInput !== ""
          ? `${firstValue} ${currentOperator} ${currentInput}`
          : `${firstValue} ${currentOperator}`;
    }
    if (result !== null) {
      outputField.textContent = `${firstValue} ${currentOperator} ${currentInput} = ${result}`;
    }
  } else {
    // Nothing committed yet
    outputField.textContent = "";
  }
}

// Number Button listeners
numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    // Delete Logic
    if (value === "C") {
      currentInput = "";
      inputField.textContent = "0";
      updateDisplay();
      return;
    }

    // Backspace Logic
    if (value === "Backspace") {
      currentInput = currentInput.slice(0, -1);
      inputField.textContent = currentInput || "0";
      updateDisplay();
      return;
    }

    // Decimal logic. Skip, or add a Zero if needed
    if (value === ".") {
      if (currentInput.includes(".")) return;

      if (currentInput === "") {
        currentInput = "0.";
      } else {
        currentInput += ".";
      }
    }

    // Digit logic
    else {
      if (currentInput === "0") {
        currentInput = value;
      } else {
        currentInput += value;
      }
    }

    // Display
    updateDisplay();
  });
});

// Operator Button Listeners
operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const operator = button.textContent;

    // Only commit if there's something to commit
    if (currentInput === "") return;

    firstValue = Number(currentInput);
    currentOperator = operator;

    currentInput = "";
    result = null;

    // Show expression context
    updateDisplay();

    // inputField.textContent = "0";
  });
});

equalsButton.addEventListener("click", () => {
  // Only run if we have an operator and something in currentInput
  if (currentOperator && currentInput !== "") {
    const secondValue = Number(currentInput);
    result = operate(currentOperator, firstValue, secondValue);

    // Show full expression
    updateDisplay();

    // Display the result
    inputField.textContent = result;

    // Prepare for chaining
    firstValue = result;
    currentInput = result;
    currentOperator = null;
  }
});
