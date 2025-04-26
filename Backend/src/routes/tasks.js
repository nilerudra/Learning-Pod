const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const router = express.Router();
const Task = require("../models/taskSchema");
const Pods = require("../models/pods");

const Submission = require("../models/submission");

router.get("/get-files", async (req, res) => {
  try {
    const files = await Submission.find();
    res.status(200).json({ status: "ok", data: files });
  } catch (err) {
    console.error("Error fetching files:", err);
    res.status(500).json({ message: "Error fetching files", error: err });
  }
});

router.post("/create", async (req, res) => {
  const { taskName, taskDescription, createdBy, podId } = req.body;

  try {
    if (!taskName || !taskDescription || !podId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create the new task
    const newTask = new Task({
      taskName,
      taskDescription,
      createdBy,
      podId,
    });

    await newTask.save();

    // Fetch all members of the pod
    const members = await User.find({ Pods: podId }); // Assuming `pods` is an array in the User schema that stores pod memberships

    console.log(members);
    // Generate notifications for all members
    const notifications = members.map((member) => ({
      userId: member._id,
      message: `New task "${taskName}" has been assigned to you.`,
      taskId: newTask._id,
      podId,
    }));

    // Save notifications in bulk
    await Notification.insertMany(notifications);

    res.status(201).json({
      message: "Task created successfully, notifications sent!",
      task: newTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const tasks = await Task.find({ createdBy: userId });
    console.log(tasks);
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/pods/:podId/check-admin/:userId", async (req, res) => {
  console.log("first");
  try {
    const { podId, userId } = req.params;
    const pod = await Pods.findById(podId);
    if (!pod) {
      return res.status(404).json({ message: "Pod not found" });
    }

    const isAdmin = String(pod.created_by) == String(userId);

    res.json({ isAdmin });
  } catch (error) {
    console.error("Error checking admin status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
