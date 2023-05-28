import { useState } from "react";

export function Calculator() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [operator, setOperator] = useState("");
  const [result, setResult] = useState("");

  function handleNumberClick(number) {
    if (operator === "") {
      setNum1(num1 + number);
    } else {
      setNum2(num2 + number);
    }
  }

  function handleOperatorClick(selectedOperator) {
    setOperator(selectedOperator);
  }

  function handleCalculate() {
    const number1 = parseInt(num1);
    const number2 = parseInt(num2);

    let calculatedResult;
    switch (operator) {
      case "+":
        calculatedResult = number1 + number2;
        break;
      case "-":
        calculatedResult = number1 - number2;
        break;
      case "*":
        calculatedResult = number1 * number2;
        break;
      case "/":
        calculatedResult = number1 / number2;
        break;
      default:
        calculatedResult = "";
    }

    setResult(calculatedResult.toString());
  }

  function handleClear() {
    setNum1("");
    setNum2("");
    setOperator("");
    setResult("");
  }

  return (
    <div className="calculator">
      <h2>Calculator</h2>
      <div>
        <input type="text" value={num1} readOnly className="operand" />
        <input type="text" value={operator} readOnly className="operator" />
        <input type="text" value={num2} readOnly className="operand" />
        <button onClick={handleCalculate}>=</button>
        <input type="text" value={result} readOnly className="result" />
        <button onClick={handleClear} className="clear-button">Clear</button>
      </div>
      <div className="row">
        <button onClick={() => handleNumberClick("1")}>1</button>
        <button onClick={() => handleNumberClick("2")}>2</button>
        <button onClick={() => handleNumberClick("3")}>3</button>
        <button onClick={() => handleOperatorClick("+")}>+</button>
      </div>
      <div className="row">
        <button onClick={() => handleNumberClick("4")}>4</button>
        <button onClick={() => handleNumberClick("5")}>5</button>
        <button onClick={() => handleNumberClick("6")}>6</button>
        <button onClick={() => handleOperatorClick("-")}>-</button>
      </div>
      <div className="row">
        <button onClick={() => handleNumberClick("7")}>7</button>
        <button onClick={() => handleNumberClick("8")}>8</button>
        <button onClick={() => handleNumberClick("9")}>9</button>
        <button onClick={() => handleOperatorClick("*")}>*</button>
      </div>
      <div className="row">
        <button onClick={() => handleNumberClick("0")}>0</button>
        <button onClick={() => handleOperatorClick("/")}>/</button>
      </div>
    </div>
  );
}
