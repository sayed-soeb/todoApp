import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling

function AddTodo() {
  const [todoText, setTodoText] = useState("");

  const handleAddTodo = () => {
    axios
      .post("/api/addtodo", { text: todoText })
      .then((response) => {
        console.log(response.data);
        toast.success("Todo added successfully!"); // Display a success notification
        setTodoText(""); // Clear the input field
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to add todo!"); // Display an error notification
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
      <ToastContainer /> {/* Add ToastContainer for notifications */}
    </div>
  );
}

export default AddTodo;
