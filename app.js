let number1 = null;
let number2 = null;
let operator = null;

function affiche(value) {
    const inputElement = document.getElementById('input');
    if (inputElement.textContent === '0' || (operator && number2 === null)) {
        inputElement.textContent = value;
    } else {
        inputElement.textContent += value;
    }

    if (operator === null) {
        number1 = parseFloat(inputElement.textContent);
    } else {
        number2 = parseFloat(inputElement.textContent);
    }
}

function clearInput() {
    number1 = null;
    number2 = null;
    operator = null;
    document.getElementById('input').textContent = '0';
}

function setOperator(op) {
    if (number1 === null) return; // No number to operate on
    operator = op;
    document.getElementById('input').textContent = '';
}

function calculate() {
    const inputElement = document.getElementById('input');
    let resultValue;

    if (number1 === null || operator === null || number2 === null) {
        inputElement.textContent = "Error";
        return;
    }

    switch (operator) {
        case "+":
            resultValue = number1 + number2;
            break;
        case "-":
            resultValue = number1 - number2;
            break;
        case "×":
            resultValue = number1 * number2;
            break;
        case "÷":
            resultValue = number2 !== 0 ? number1 / number2 : "Error";
            break;
        default:
            resultValue = number1;
            break;
    }

    inputElement.textContent = resultValue;
    number1 = resultValue;
    number2 = null;
    operator = null;
}