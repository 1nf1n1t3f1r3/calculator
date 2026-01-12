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

let history = [];

const MAX_HISTORY = 10; // ← x entries
const MAX_DECIMALS = 5; // ← y decimals

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

// Function for the 'C' Delete All Functionality
function c() {
  currentInput = "";
  firstValue = null;
  secondValue = null;
  currentOperator = null;
  result = null;

  inputField.textContent = "0";
  outputField.textContent = "0";
  updateDisplay();
}

// Limit size of History
function renderHistory() {
  historyField.innerHTML = "";

  history.forEach((entry) => {
    const line = document.createElement("div");
    line.textContent = entry;
    historyField.appendChild(line);
  });
}

// Format Floats
function formatNumber(num) {
  if (!Number.isFinite(num)) return "Error";

  // If it's an integer, return as-is
  if (Number.isInteger(num)) return num;

  // Otherwise, limit decimals and remove trailing zeros
  return parseFloat(num.toFixed(MAX_DECIMALS));
}

// Number Button listeners
numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    // Delete Logic
    if (value === "C") {
      c();

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
      if (result !== null) {
        c();
      }

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

    // What to do if we already have a currentOperator
    if (currentInput !== "" && currentOperator !== null) {
      calculate();
    }

    // Reset
    firstValue = Number(currentInput);
    currentOperator = operator;
    currentInput = "";
    result = null;

    // Show expression context
    updateDisplay();

    // inputField.textContent = "0";
  });
});

// Clicky Buttons for =
equalsButton.addEventListener("click", () => {
  // Only run if we have an operator and something in currentInput
  if (currentOperator && currentInput !== "") {
    const secondValue = Number(currentInput);
    result = operate(currentOperator, firstValue, secondValue);

    // Save to history
    const expression = `${formatNumber(
      firstValue
    )} ${currentOperator} ${formatNumber(secondValue)} = ${formatNumber(
      result
    )}`;
    history.push(expression);
    if (history.length > MAX_HISTORY) {
      history.shift(); // remove oldest entry
    }
    renderHistory();

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

// Keyboard Controls
document.addEventListener("keydown", (event) => {
  const key = event.key;

  // Digits
  if (key >= "0" && key <= "9") {
    clickButtonByText(key);
  }

  // Operators
  if (["+", "-", "*", "/"].includes(key)) {
    clickButtonByText(key);
  }

  // Equals
  if (key === "Enter" || key === "=") {
    equalsButton.click();
  }

  // Backspace
  if (key === "Backspace") {
    clickButtonByText("Backspace");
  }

  // Clear (C)
  if (key === "Escape") {
    clickButtonByText("C");
  }

  // Decimal
  if (key === ".") {
    clickButtonByText(".");
  }
});

// Keyboard Functionality Helper
function clickButtonByText(text) {
  const buttons = document.querySelectorAll("#buttons button");

  buttons.forEach((button) => {
    if (button.textContent === text) {
      button.focus(); // 👈 THIS is the missing piece
      button.click();
    }
  });
}

// Last Minute Helper to allow 2 + 2 + 2 - style operations
function calculate() {
  if (!currentOperator || currentInput === "") return;

  const secondValue = Number(currentInput);
  result = operate(currentOperator, firstValue, secondValue);

  // Save to history
  const expression = `${firstValue} ${currentOperator} ${secondValue} = ${result}`;
  history.push(expression);

  if (history.length > MAX_HISTORY) history.shift();
  renderHistory();

  firstValue = result;
  currentInput = result;
  currentOperator = null;

  inputField.textContent = result;
}

// Disable Enter Default Behaviour
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
  }
});
