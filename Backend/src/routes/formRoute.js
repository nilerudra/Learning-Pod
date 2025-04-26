import express from "express";
import mongoose from "mongoose";
// Assuming you have a User model

const router = express.Router();

// POST route to save education background and career details
router.post("/", async (req, res) => {
  try {
    const {
      educationBackground,
      vocational,
      selfLearning,
      careerInterests,
      skills,
      experience,
      personality,
    } = req.body;

    // Create a new user record (modify based on your schema)
    const newUser = new User({
      educationBackground,
      vocational,
      selfLearning,
      careerInterests,
      skills,
      experience,
      personality,
    });

    // Save to database
    console.log(educationBackground);

    res
      .status(201)
      .json({
        message: "User education background saved successfully",
        user: newUser,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
