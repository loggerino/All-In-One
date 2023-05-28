import { useState } from "react";

export function Calculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");

  function handleButtonClick(value) {
    setExpression((prevExpression) => prevExpression + value);
  }

  function handleCalculate() {
    try {
      const calculatedResult = eval(expression);
      setResult(calculatedResult.toString());
    } catch (error) {
      setResult("Error");
    }
  }

  function handleClear() {
    setExpression("");
    setResult("");
  }

  return (
    <>
      <h2 className="calculator-header">Calculator</h2>
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand"></div>
          <div className="current-operand">{expression}</div>
          <div className="result">{result}</div>
        </div>
        <button className="span-two" onClick={handleClear}>
          AC
        </button>
        <button onClick={() => setExpression((prev) => prev.slice(0, -1))}>
          DEL
        </button>
        <button onClick={() => handleButtonClick("/")}>/</button>
        <button onClick={() => handleButtonClick("1")}>1</button>
        <button onClick={() => handleButtonClick("2")}>2</button>
        <button onClick={() => handleButtonClick("3")}>3</button>
        <button onClick={() => handleButtonClick("*")}>*</button>
        <button onClick={() => handleButtonClick("4")}>4</button>
        <button onClick={() => handleButtonClick("5")}>5</button>
        <button onClick={() => handleButtonClick("6")}>6</button>
        <button onClick={() => handleButtonClick("+")}>+</button>
        <button onClick={() => handleButtonClick("7")}>7</button>
        <button onClick={() => handleButtonClick("8")}>8</button>
        <button onClick={() => handleButtonClick("9")}>9</button>
        <button onClick={() => handleButtonClick("-")}>-</button>
        <button onClick={() => handleButtonClick(".")}>.</button>
        <button onClick={() => handleButtonClick("0")}>0</button>
        <button className="span-two" onClick={handleCalculate}>=</button>
      </div>
    </>
  );
}
