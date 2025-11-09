import express from "express";
import Roadmap from "../models/GeneratedRoadmap.js";
const router = express.Router();

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  console.log("Received userId:", userId);

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const roadmap = await Roadmap.find({ userId }).sort({ createdAt: -1 });

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    res.json(roadmap);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching roadmap",
      error: error.message,
    });
  }
});

router.get("/get-all/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const roadmaps = await Roadmap.find({ userId }).sort({ createdAt: -1 });
    
    const formattedRoadmaps = roadmaps.map((roadmap) => ({
      id: roadmap._id,
      title: roadmap.roadmap?.title,
      author: roadmap.userName,
      createdAt: roadmap.createdAt,
      keySkills:
        roadmap.roadmap?.phases?.[0]?.actionableSteps?.slice(0, 3) || [],
      industryTrends:
        roadmap.roadmap?.phases?.[0]?.industryTrends || "No data available",
    }));

    res.json({ totalRoadmaps: roadmaps.length, formattedRoadmaps });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user roadmaps",
      error: error.message,
    });
  }
});

router.get("/last-three/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const lastThreeRoadmaps = await Roadmap.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("_id userName roadmap.title roadmap.phases createdAt");

    if (!lastThreeRoadmaps || lastThreeRoadmaps.length === 0) {
      return res
        .status(404)
        .json({ message: "No roadmaps found for this user" });
    }
 

    const formattedRoadmaps = lastThreeRoadmaps.map((roadmap) => ({
      id: roadmap._id,
      title: roadmap.roadmap.title,
      author: roadmap.userName,
      createdAt: roadmap.createdAt,
      keySkills: roadmap.roadmap.phases[0]?.actionableSteps.slice(0, 3) || [], // Take skills from the first phase
      industryTrends:
        roadmap.roadmap.phases[0]?.industryTrends || "No data available",
    }));
    

    res.json(formattedRoadmaps);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching roadmaps",
      error: error.message,
    });
  }
});

router.get("/full/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const roadmap = await Roadmap.findById(id);

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    res.json(roadmap);
  } catch (error) {
    console.error("Error fetching roadmap by ID:", error);
    res.status(500).json({
      message: "Error fetching roadmap",
      error: error.message,
    });
  }
});

router.post("/progress/:roadmapId", async (req, res) => {
  const { roadmapId } = req.params;
  const { phaseIndex, completedSteps, quizCompleted } = req.body;

  try {
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    // Validate phaseIndex
    if (typeof phaseIndex !== "number" || !roadmap.roadmap.phases[phaseIndex]) {
      return res.status(400).json({ message: "Invalid phase index" });
    }

    // Update completed steps and quiz status
    roadmap.roadmap.phases[phaseIndex].completedSteps = completedSteps || [];
    if (typeof quizCompleted === "boolean") {
      roadmap.roadmap.phases[phaseIndex].quizCompleted = quizCompleted;
    }

    await roadmap.save();
    res.json({ message: "Progress updated successfully" });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;