const express = require("express");
const router = express.Router();
const Pod = require("../models/pods");
const User = require("../models/User");

router.post("/", async (req, res) => {
  try {
    const { unique_code, user_id } = req.body;

    console.log(unique_code, user_id);
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!["student", "teacher"].includes(user.role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const pod = await Pod.findOne({ unique_code });

    if (!pod) {
      return res.status(404).json({ message: "Pod not found" });
    }

    const isMember = pod.members.some(
      (member) => member.user_id.toString() === user_id.toString()
    );
    if (isMember) {
      return res
        .status(400)
        .json({ message: "User is already a member of this pod" });
    }

    pod.members.push({
      user_id,
      role: user.role,
      joined_at: new Date(),
    });

    const updatedPod = await pod.save();

    res.status(200).json(updatedPod);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error joining pod", error: error.message });
  }
});

module.exports = router;
