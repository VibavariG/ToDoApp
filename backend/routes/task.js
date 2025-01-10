const express = require("express");
const Task = require("../models/task");
const { verifyToken } = require("../utils/jwtHelper");
const router = express.Router();

// Middleware to authenticate user
const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token)
  if (!token) return res.status(401).send("Access denied.");
  try {
    const decoded = verifyToken(token);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(400).send("Invalid token.");
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

const today = getLocalDate()
console.log(today)

// Create a new task
router.post("/", authenticate, async (req, res) => {
  try {
    const { title, dueDate } = req.body;
    // Validate dueDate format (basic check)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      return res.status(400).send("Invalid due date format. Use YYYY-MM-DD.");
    }
    const task = new Task({ title, dueDate, userId: req.userId });
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(500).send("Error creating task.");
  }
});

// Get pending & future tasks for a user
router.get("/", authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.userId,
      $or: [
        { dueDate: { $gte: today } }, // Future and today complete & incomplete tasks
        { isComplete: false, dueDate: { $lt: today } }, // Overdue incomplete tasks
      ],
    }).sort({ dueDate: 1 });

    res.send(tasks);
  } catch (err) {
    res.status(500).send("Error fetching tasks.");
  }
});

// get all tasks for a user
router.get("/all", authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.userId,
      $or: [
        { dueDate: { $gte: today } }, // Future and today complete & incomplete tasks
        { dueDate: { $lt: today } }, // Overdue incomplete tasks
      ],
    }).sort({ dueDate: 1 });
    res.send(tasks);
  } catch (err) {
    res.status(500).send("Error fetching tasks.");
  }
});

//get completed past tasks
router.get("/past", authenticate, async (req, res) => {
  try{
    const completedAndPastTasks = await Task.find({
      userId: req.userId,
      $or: [
        { isComplete: true, dueDate: { $lt: today } },
      ],
    }).sort({ dueDate: 1 });
    res.send(completedAndPastTasks);
  } catch (err) {
    res.status(500).send("Error fetching tasks.");
  }
});


// Update a task
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { title, dueDate, isComplete } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, dueDate, isComplete },
      { new: true }
    );
    if (!task) return res.status(404).send("Task not found.");
    res.send(task);
  } catch (err) {
    res.status(500).send("Error updating task.");
  }
});

// Delete a task
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).send("Task not found.");
    res.send(task);
  } catch (err) {
    res.status(500).send("Error deleting task.");
  }
});

module.exports = router;
