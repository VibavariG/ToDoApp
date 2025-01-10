import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const TaskList = () => {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", dueDate: "" });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, [token]);

  const createTask = async () => {
    try {
      const response = await axios.post("/api/tasks", newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => [...prev, response.data]);
      setNewTask({ title: "", dueDate: "" });
      console.log(newTask)
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const response = await axios.put(`/api/tasks/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? response.data : task))
      );
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

const getLocalDate = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set time to midnight local time
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
  
console.log(getLocalDate()); // Correct local date in YYYY-MM-DD
const today = getLocalDate()

// Mark overdue tasks and group them by due date
const groupedTasks = tasks
.map((task) => {
    if (task.dueDate < today && !task.isComplete) {
      task.isOverdue = true; // Mark overdue tasks
    } else {
        task.isOverdue = false
    }
    return task;
}).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)) // Sort tasks by due date
.reduce((acc, task) => {
    // Use today for overdue tasks, otherwise use the task's due date
    const taskDate = task.isOverdue ? today : task.dueDate
    // Initialize the array if the key doesn't exist, then push the task
    acc[taskDate] = acc[taskDate] || [];
    acc[taskDate].push(task);
    return acc;
}, {});

console.log(groupedTasks);

return (
    <div>
      <h1>To-Do Calendar</h1>
      <div>
        <input
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />
        <button onClick={createTask}>Add Task</button>
      </div>
      {Object.entries(groupedTasks).map(([date, tasks]) => (
        <div key={date}>
          <h2>{date}</h2>
          {tasks.map((task) => (
            <div key={task._id} style={{ color: task.isOverdue ? "red" : "black" }}>
              <input
                value={task.title}
                onChange={(e) =>
                  updateTask(task._id, { ...task, title: e.target.value })
                }
              />
              <input
                type="date"
                value={task.dueDate.slice(0, 10)}
                onChange={(e) =>
                  updateTask(task._id, { ...task, dueDate: e.target.value })
                }
              />
              <input
                type="checkbox"
                checked={task.isComplete}
                onChange={(e) =>
                  updateTask(task._id, { ...task, isComplete: e.target.checked })
                }
              />
              <span>{task.isOverdue ? ` (Original due: ${new Date(task.dueDate.split("-")[0], task.dueDate.split("-")[1] - 1, task.dueDate.split("-")[2].substring(0, 2)).toDateString()})` : ""}</span>
              <button onClick={() => deleteTask(task._id)}>Delete</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );  
};

export default TaskList;
