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
    <>
      <h2 className="calculator-header">Calculator</h2>
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand"></div>
          <div className="current-operand"></div>
        </div>
        <button className="span-two">AC</button>
        <button>DEL</button>
        <button>/</button>
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>*</button>
        <button>4</button>
        <button>5</button>
        <button>6</button>
        <button>+</button>
        <button>7</button>
        <button>8</button>
        <button>9</button>
        <button>-</button>
        <button>.</button>
        <button>0</button>
        <button className="span-two">=</button>
      </div>
    </>
  );
}
