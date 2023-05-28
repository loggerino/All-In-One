import { useReducer, useState } from "react";

const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_DIGIT:
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${action.payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      return {
        ...state,
        previousOperand: state.currentOperand,
        currentOperand: "",
        operation: action.payload.operation,
      };
    case ACTIONS.CLEAR:
      return {
        currentOperand: "",
        previousOperand: "",
        operation: null,
      };
    case ACTIONS.DELETE_DIGIT:
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTIONS.EVALUATE:
      try {
        const result = eval(`${state.previousOperand} ${state.operation} ${state.currentOperand}`);
        return {
          currentOperand: result.toString(),
          previousOperand: "",
          operation: null,
        };
      } catch (error) {
        return state;
      }
    default:
      return state;
  }
}

export function Calculator() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {
    currentOperand: "",
    previousOperand: "",
    operation: null,
  });
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");

  function handleButtonClick(value) {
    dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: value } });
    setExpression((prevExpression) => prevExpression + value);
  }

  function handleOperatorClick(selectedOperator) {
    if (currentOperand !== "") {
      dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: selectedOperator } });
      setExpression((prevExpression) => prevExpression + selectedOperator);
    }
  }

  function handleCalculate() {
    if (previousOperand !== "" && currentOperand !== "" && operation !== null) {
      dispatch({ type: ACTIONS.EVALUATE });
      setExpression("");
    }
  }

  function handleClear() {
    dispatch({ type: ACTIONS.CLEAR });
    setExpression("");
    setResult("");
  }

  return (
    <>
      <h2 className="calculator-header">Calculator</h2>
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">{previousOperand} {operation}</div>
          <div className="current-operand">{currentOperand}</div>
          <div className="result">{result}</div>
        </div>
        <button className="span-two" onClick={handleClear}>
          AC
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
          DEL
        </button>
        <button onClick={() => handleOperatorClick("/")}>/</button>
        <button onClick={() => handleButtonClick("1")}>1</button>
        <button onClick={() => handleButtonClick("2")}>2</button>
        <button onClick={() => handleButtonClick("3")}>3</button>
        <button onClick={() => handleOperatorClick("*")}>*</button>
        <button onClick={() => handleButtonClick("4")}>4</button>
        <button onClick={() => handleButtonClick("5")}>5</button>
        <button onClick={() => handleButtonClick("6")}>6</button>
        <button onClick={() => handleOperatorClick("+")}>+</button>
        <button onClick={() => handleButtonClick("7")}>7</button>
        <button onClick={() => handleButtonClick("8")}>8</button>
        <button onClick={() => handleButtonClick("9")}>9</button>
        <button onClick={() => handleOperatorClick("-")}>-</button>
        <button onClick={() => handleButtonClick(".")}>.</button>
        <button onClick={() => handleButtonClick("0")}>0</button>
        <button className="span-two" onClick={handleCalculate}>=</button>
      </div>
    </>
  );
}
