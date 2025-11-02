import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import GeneratedRoadmap from "../models/GeneratedRoadmap.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const router = express.Router();

// GET route to generate a 10-question quiz for a specific phase
router.get("/:phaseId", async (req, res) => {
  console.log("Quiz route reached");
  try {
    const { phaseId } = req.params;
    const { phaseName, userId } = req.query;

    // Validate input parameters
    if (!phaseId || !phaseName || !userId) {
      return res
        .status(400)
        .json({ error: "phaseId, phaseName, and userId are required" });
    }

    // Validate and convert userId to ObjectId
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }
    const objectId = new mongoose.Types.ObjectId(userId);

    console.log(`Querying roadmap for userId: ${objectId}`);

    // Fetch the user's roadmap from the database
    const roadmap = await GeneratedRoadmap.findOne({ userId: objectId })
      .sort({ createdAt: -1 })
      .exec();
    if (!roadmap) {
      console.log(`No roadmap found for userId: ${objectId}`);
      return res
        .status(404)
        .json({ error: "Roadmap not found for the provided userId" });
    }

    // Find the phase in the roadmap that matches the phaseName
    const phase = roadmap.roadmap.phases.find((p) =>
      p.phaseName.includes(phaseName)
    );
    if (!phase) {
      return res
        .status(404)
        .json({ error: `Phase '${phaseName}' not found in the roadmap` });
    }

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLEAPI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Construct the prompt for generating a 10-question quiz
    const prompt = `
      You are an AI-based quiz generator for a personalized learning platform. Generate a quiz consisting of exactly 10 multiple-choice questions (each with 4 answer options and one correct answer) based on the content of a specific phase of a user's career roadmap. The quiz should test the user's understanding of the phase's key topics and concepts.

      **User and Phase Context:**
      - User ID: ${userId}
      - Roadmap Title: ${roadmap.roadmap.title}
      - Phase Name: ${phase.phaseName}
      - Phase Description: ${phase.description}
      - Actionable Steps: ${JSON.stringify(phase.actionableSteps, null, 2)}
      - Recommended Courses: ${JSON.stringify(
        phase.recommendedCourses,
        null,
        2
      )}
      - Industry Trends: ${phase.industryTrends || "Not specified"}

      **Task:**
      Generate 10 multiple-choice questions for the '${phaseName}' phase, tailored to the user's career path and phase context. The questions should cover all key topics related to the phase title (e.g., for "Beginner: Foundations of Web Development," include HTML, CSS, JavaScript, responsive design, Git, VS Code). Each question must have 4 answer options, with only one correct answer. Ensure the questions are clear, educational, and relevant to the phase's focus (e.g., foundational skills for beginners, practical projects for intermediates, advanced techniques for experts).

      **Required Structure:**
      Return the quiz as a JSON object with the following structure:
      
      {
        "questions": [
          {
            "id": 1,
            "question": "Question text here",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "correctAnswer": "Option 1"
          },
          ...
        ]
      }
      
      **Output Format:**
      - The output should be a JSON object with the following structure:
      {
        "questions": [
          {
            "id": 1,
            "question": "Question text here",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "correctAnswer": "Option 1"
          },
          ...
        ]
      }

      **Guidelines:**
      - Ensure exactly 10 questions, numbered from 1 to 10.
      - Cover all relevant topics for the phase (e.g., HTML, CSS, JavaScript for Beginner Web Development).
      - Questions should be clear, concise, and test key concepts or practical applications.
      - Options should be plausible but distinct, with only one correct answer.
      - Tailor difficulty to the phase (e.g., simple for beginners, complex for experts).
      - Return only the JSON object, no additional text or explanations.
    `;

    // Generate quiz using the AI model
    const result = await model.generateContent(prompt);
    const generatedText = await result.response.text();

    // Parse the generated text as JSON
    let quizData;
    try {
      quizData = JSON.parse(generatedText);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError.message);
      return res.status(500).json({ error: "Failed to parse quiz data" });
    }

    // Validate the quiz data
    if (
      !quizData.questions ||
      !Array.isArray(quizData.questions) ||
      quizData.questions.length !== 10
    ) {
      return res
        .status(500)
        .json({ error: "Invalid quiz format: Expected 10 questions" });
    }

    for (const question of quizData.questions) {
      if (
        !question.id ||
        !question.question ||
        !Array.isArray(question.options) ||
        question.options.length !== 4 ||
        !question.correctAnswer ||
        !question.options.includes(question.correctAnswer)
      ) {
        return res.status(500).json({ error: "Invalid question format" });
      }
    }

    // Return the quiz data
    res.status(200).json(quizData);
  } catch (error) {
    console.error("Error generating quiz:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
