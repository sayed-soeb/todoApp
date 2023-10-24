import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/TodoList.css";

function TodoList(todoss) {
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
  }, [editTodo,todoss]);

  const handleUpdateTodo = (todo) => {
    const updatedStatus = !todo.completed;
    axios.put(`http://localhost:5000/api/togglecompleted/${todo._id}`, { completed: updatedStatus })
      .then(() => {
        setTodos((prevTodos) =>
          prevTodos.map((item) =>
            item._id === todo._id ? { ...item, completed: updatedStatus } : item
          )
        );
        toast.success("Todo completion status updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to update todo completion status!");
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
    <div className="todo-list"> {/* Use the class name defined in the external CSS */}
      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className="todo-item"> {/* Use the class name for each item */}
            <div>
              <input type="checkbox" className="checkbox" onChange={() => handleUpdateTodo(todo)} />
            </div>
            {todo._id === editTodo.id ? (
              <div>
                <input type="text" value={editTodo.text} onChange={handleEditInputChange} />
                <button className="edit-button" onClick={handleEditTodo} />
              </div>
            ) : (
              <div>
                {todo.text}
                <button className="edit-button" onClick={() => setEditTodoId(todo)} />
              </div>
            )}
            <button className="delete-button" onClick={() => handleDeleteTodo(todo)} />
          </li>
        ))}
      </ul>
      <ToastContainer />
    </div>
  );
}

export default TodoList;