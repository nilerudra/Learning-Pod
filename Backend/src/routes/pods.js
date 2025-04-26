const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Pod = require("../models/pods");
const User = require("../models/User");

// ✅ Create a Pod with role validation
router.post("/", async (req, res) => {
  console.log("hit");
  try {
    const {
      pod_name,
      pod_description,
      is_public,
      created_by,
      members,
      resources,
    } = req.body;
    console.log(req.body);

    // Check if the creator ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(created_by)) {
      return res
        .status(400)
        .json({ message: "Invalid user ID format for creator" });
    }

    // Validate members
    for (const member of members) {
      if (!mongoose.Types.ObjectId.isValid(member.user_id)) {
        return res
          .status(400)
          .json({ message: "Invalid user ID format in members" });
      }
      if (!member.role || !["student", "teacher"].includes(member.role)) {
        return res.status(400).json({
          message: `Invalid role: ${member.role}. Allowed values: student, teacher`,
        });
      }
    }

    // Create a new pod
    const pod = new Pod({
      pod_name,
      pod_description,
      is_public,
      created_by,
      unique_code: Math.random().toString(36).substr(2, 8),
      members,
      resources,
    });

    // Save the pod
    const savedPod = await pod.save();
    res.status(201).json(savedPod);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating pod", error: error.message });
  }
});

// ✅ Get all pods (filter by is_public if needed)
router.get("/get-pods", async (req, res) => {
  try {
    const isPublic = req.query.is_public === "true";
    const pods = await Pod.find(isPublic ? { is_public: true } : {});
    res.status(200).json(pods);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pods", error: error.message });
  }
});

// ✅ Get a single pod by ID
router.get("/get-resource/:id", async (req, res) => {
  try {
    const podId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(podId)) {
      return res.status(400).json({ message: "Invalid pod ID format" });
    }

    const pod = await Pod.findById(podId);
    if (!pod) {
      return res.status(404).json({ message: "Pod not found" });
    }

    res.status(200).json(pod);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pod", error: error.message });
  }
});

// Fetching all pods for a specific user
router.get("/userPods/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const pods = await Pod.find({
      "members.user_id": new mongoose.Types.ObjectId(userId),
    });

    if (pods.length === 0) {
      return res.status(404).json({ message: "No pods found for this user." });
    }

    return res.status(200).json(pods);
  } catch (error) {
    console.error("Error fetching pods:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ✅ Get the role of a user in any pod
router.get("/user-role/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    console.log(userId);
    // Find the user's role in any pod they are a member of
    const userPod = await Pod.findOne(
      { "members.user_id": userId },
      { "members.$": 1 }
    );

    console.log(userPod);

    if (!userPod) {
      return res.status(404).json({ message: "User not found in any pod" });
    }

    return res.status(200).json({ role: userPod.members[0].role });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user role", error: error.message });
  }
});

module.exports = router;
