import { useEffect, useState } from "react";
import "./style.css";
import { TodoForm } from "./components/TodoForm";
import { TodoList } from "./components/TodoList";
import { Calculator } from "./components/Calculator";
import { Navbar } from "./components/Navbar";
import { Home } from "./components/Home";
import { Route, Routes } from "react-router-dom";

export default function App() {
  const [todos, setTodos] = useState(() => {
    const localValue = localStorage.getItem("ITEMS");
    if (localValue == null) return [];

    return JSON.parse(localValue);
  });
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    localStorage.setItem("ITEMS", JSON.stringify(todos));
  }, [todos]);

  function addTodo(title, description) {
    setTodos((currentTodos) => {
      return [
        ...currentTodos,
        { id: crypto.randomUUID(), title, description, completed: false },
      ];
    });
    setNewItem("");
  }

  function toggleTodo(id, completed) {
    setTodos((currentTodos) => {
      return currentTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed };
        }

        return todo;
      });
    });
  }

  function deleteTodo(id) {
    setTodos((currentTodos) => {
      return currentTodos.filter((todo) => todo.id !== id);
    });
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route
          path="/todoform"
          element={
            <>
              <TodoForm onSubmit={addTodo} />
              <h1 className="header">Todo List</h1>
              <TodoList
                todos={todos}
                toggleTodo={toggleTodo}
                deleteTodo={deleteTodo}
              />
            </>
          }
        />
      </Routes>
    </>
  );
}
