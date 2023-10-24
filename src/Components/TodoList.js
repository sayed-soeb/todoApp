import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [editTodo, setEditTodo] = useState({ text: "", id: "" });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/gettodos`)
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to fetch todos!"); // Display an error notification
      });
  }, [editTodo]);

  const handleUpdateTodo = (todo) => {
    // Implement the logic to update a todo's completion status
    axios.put(`http://localhost:5000/api/updatetodo/${todo._id}`, { completed: !todo.completed })
      .then(() => {
        // Update the completion status of the todo in the local state
        setTodos((prevTodos) =>
          prevTodos.map((item) =>
            item._id === todo._id ? { ...item, completed: !item.completed } : item
          )
        );
        toast.success("Todo updated successfully!"); // Display a success notification
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to update todo!"); // Display an error notification
      });
  };

  const handleEditTodo = () => {
    // Implement the logic to edit a todo's text
    if (editTodo.text.trim() === "") {
      toast.warning("Todo text cannot be empty!"); // Display a warning notification
      return;
    }

    axios.put(`http://localhost:5000/api/updatetodo/${editTodo.id}`, { text: editTodo.text })
      .then(() => {
        // Clear the editTodo state
        setEditTodo({ text: "", id: "" });
        toast.success("Todo edited successfully!"); // Display a success notification
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to edit todo!"); // Display an error notification
      });
  };

  const handleDeleteTodo = (todo) => {
    axios.delete(`http://localhost:5000/api/deletetodo/${todo._id}`)
      .then(() => {
        setTodos(todos.filter((item) => item._id !== todo._id));
        toast.success("Todo deleted successfully!"); // Display a success notification
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to delete todo!"); // Display an error notification
      });
  };

  const handleEditInputChange = (event) => {
    setEditTodo({ ...editTodo, text: event.target.value });
  };

  const setEditTodoId = (todo) => {
    setEditTodo({ id: todo._id, text: todo.text });
  };

  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleUpdateTodo(todo)}
            />
            {todo._id === editTodo.id ? (
              <div>
                <input
                  type="text"
                  value={editTodo.text}
                  onChange={handleEditInputChange}
                />
                <button onClick={handleEditTodo}>Save</button>
              </div>
            ) : (
              <div>
                {todo.text}
                <button onClick={() => setEditTodoId(todo)}>Edit</button>
              </div>
            )}
            <button onClick={() => handleDeleteTodo(todo)}>Delete</button>
          </li>
        ))}
      </ul>
      <ToastContainer /> {/* Add ToastContainer for notifications */}
    </div>
  );
}

export default TodoList;
