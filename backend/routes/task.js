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

// Create a new task
router.post("/", authenticate, async (req, res) => {
  try {
    const { title, dueDate } = req.body;
    const task = new Task({ title, dueDate, userId: req.userId });
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(500).send("Error creating task.");
  }
});

// Get all tasks for a user
router.get("/", authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ dueDate: 1 });
    res.send(tasks);
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
