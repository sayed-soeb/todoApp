import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../Styles/AddTodo.css";

function AddTodo({ onAddTodo }) {
  const [todoText, setTodoText] = useState("");

  const handleAddTodo = () => {
    axios.post(`http://localhost:5000/api/addtodo`, { text: todoText })
      .then((response) => {
        console.log(response.data);
        toast.success("Todo added successfully");
        setTodoText(""); // Clear the input field
        // Notify the parent component to add the new todo
        onAddTodo(response.data);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to add todo");
      });
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Enter a new todo"
        value={todoText}
        onChange={(e) => setTodoText(e.target.value)}
      />
      <button onClick={handleAddTodo}>Add Todo</button>
    </div>
  );
}

export default AddTodo;
