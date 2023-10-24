// Parent component that holds the state
import React, { useState } from "react";
import AddTodo from "./Components/AddTodo";
import TodoList from "./Components/TodoList";

function App() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = (newTodo) => {
    // Update the todos state with the new todo
    setTodos([...todos, newTodo]);
  }

  return (
    <div className="app-container">
    <AddTodo onAddTodo={handleAddTodo} />
    <TodoList todoss={todos} />
  </div>
  );
}

export default App;
