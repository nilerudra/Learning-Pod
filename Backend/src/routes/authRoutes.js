import express from "express";
import User from "../models/User.js"; // MongoDB User Model

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("hit");
  try {
    const { uid, name, email, photo, role } = req.body;
    console.log("1");
    const userRole = role ? role.toLowerCase() : "student"; // Default to "student" if no role is provided
    console.log("2");

    // Check if user exists
    let user = await User.findOne({ $or: [{ uid }, { email }] });

    if (!user) {
      user = new User({ uid, name, email, photo, role: userRole });
      await user.save();
    } else {
      // Optional: update fields if needed
      user.role = userRole;
      user.name = name;
      user.photo = photo;
      await user.save();
    }

    console.log("DONE", user);

    res.status(200).json({ message: "User authenticated", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
