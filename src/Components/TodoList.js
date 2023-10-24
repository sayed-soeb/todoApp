import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Chart } from "chart.js/auto"; // Import Chart.js for the pie chart
import "../Styles/TodoList.css"; // Import your external CSS file

function TodoList(todoss) {
  const [todos, setTodos] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [notCompletedCount, setNotCompletedCount] = useState(0);
  const [editTodo, setEditTodo] = useState({ text: "", id: "" });
  const chartRef = useRef(null);

  const fetchTodos = () => {
    axios
      .get("http://localhost:5000/api/gettodos")
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchPie = () => {
    axios
      .get("http://localhost:5000/api/gettodos")
      .then((response) => {
        const completed = response.data.filter((todo) => todo.completed);
        setCompletedCount(completed.length);
        setNotCompletedCount(response.data.length - completed.length);
        renderPieChart(); // Call the function after fetching data
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTodo,todoss]);

  useEffect(() => {
    fetchPie();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todos]);

  const handleUpdateTodo = (todo) => {
    const updatedStatus = !todo.completed;
    axios
      .put(`http://localhost:5000/api/togglecompleted/${todo._id}`, {
        completed: updatedStatus,
      })
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
    if (editTodo.text.trim() === "") {
      toast.warning("Todo text cannot be empty!");
      return;
    }

    axios
      .put(`http://localhost:5000/api/updatetodo/${editTodo.id}`, {
        text: editTodo.text,
      })
      .then(() => {
        setEditTodo({ text: "", id: "" });
        fetchTodos(); // Refetch todos after editing
        toast.success("Todo edited successfully!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to edit todo!");
      });
  };

  const handleDeleteTodo = (todo) => {
    axios
      .delete(`http://localhost:5000/api/deletetodo/${todo._id}`)
      .then(() => {
        setTodos(todos.filter((item) => item._id !== todo._id));
        toast.success("Todo deleted successfully!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to delete todo!");
      });
  };

  const handleEditInputChange = (event) => {
    setEditTodo({ ...editTodo, text: event.target.value });
  };

  const setEditTodoId = (todo) => {
    setEditTodo({ id: todo._id, text: todo.text });
  };

  const renderPieChart = () => {
    const pieChartCanvas = document.getElementById('pieChart');

    // Check if the Chart exist or not
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create a new Chart instance and store it in the ref
    chartRef.current = new Chart(pieChartCanvas, {
      type: 'pie',
      data: {
        labels: ['Completed', 'Incomplete'],
        datasets: [
          {
            data: [completedCount, notCompletedCount],
            backgroundColor: ['rgb(229, 97, 97)','#842e25'],
          },
        ],
      },
    });
  };
  

  useEffect(() => {
    renderPieChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedCount, notCompletedCount]);

  return (
    <div className="todo-list">
      <div className="pie-chart-container">
        <h1>Progress</h1>
  <canvas id="pieChart" width="200" height="200"></canvas>
</div>
<div className="lists">
      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className="todo-item">
            <div>
              <input
                type="checkbox"
                className="checkbox"
                onChange={() => handleUpdateTodo(todo)}
                checked={todo.completed}
              />
            </div>
            {todo._id === editTodo.id ? (
              <div>
                <input
                  type="text"
                  value={editTodo.text}
                  onChange={handleEditInputChange}
                />
                <button
                  className="edit-button"
                  onClick={handleEditTodo}
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                {todo.text}
                <button
                  className="edit-button"
                  onClick={() => setEditTodoId(todo)}
                >
                  Edit
                </button>
              </div>
            )}
            <button
              className="delete-button"
              onClick={() => handleDeleteTodo(todo)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      </div>
      <ToastContainer />
    </div>
  );
}

export default TodoList;
