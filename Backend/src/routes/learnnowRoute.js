import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import GeneratedRoadmap from "../models/GeneratedRoadmap.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const router = express.Router();

// GET route to generate text-based learning content for a specific phase
router.get("/:phaseId", async (req, res) => {
  console.log("Learn now route reached");
  try {
    const { phaseId } = req.params;
    const { phaseName, userId } = req.query;

    // Validate input parameters
    if (!phaseId || !phaseName || !userId) {
      return res.status(400).json({ error: "phaseId, phaseName, and userId are required" });
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
      return res.status(404).json({ error: "Roadmap not found for the provided userId" });
    }

    // Find the phase in the roadmap that matches the phaseName
    const phase = roadmap.roadmap.phases.find((p) => p.phaseName.includes(phaseName));
    if (!phase) {
      return res.status(404).json({ error: `Phase '${phaseName}' not found in the roadmap` });
    }

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLEAPI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Construct the prompt for generating text-based learning content
    const prompt = `
      You are an AI-based personalized learning content generator. Generate detailed, text-based learning content for a specific phase of a user's career roadmap, covering all topics related to the phase title. The content should be comprehensive, educational, and formatted as plain text with clear section headers for easy rendering in a frontend application.

      **User and Phase Context:**
      - User ID: ${userId}
      - Roadmap Title: ${roadmap.roadmap.title}
      - Phase Name: ${phase.phaseName}
      - Phase Description: ${phase.description}
      - Actionable Steps: ${JSON.stringify(phase.actionableSteps, null, 2)}
      - Recommended Courses: ${JSON.stringify(phase.recommendedCourses, null, 2)}
      - Industry Trends: ${phase.industryTrends || "Not specified"}

      **Task:**
      Generate text-based learning content for the '${phaseName}' phase, tailored to the user's career path and phase context. The content should cover all key topics related to the phase title (e.g., for "Beginner: Foundations of Web Development," include HTML, CSS, JavaScript, responsive design, Git, VS Code). Include detailed explanations, key concepts, practical tips, and examples for each topic. Additionally, provide recommended courses with realistic details. Format the content using Markdown-like section headers and bullet points for clarity.

      **Required Structure:**
      # Learning Content for [Phase Name]

      ## Phase Description
      [Detailed description of the phase, aligned with the user's career path.]

      ## Learning Objectives
      - [Objective 1 specific to the phase]
      - [Objective 2 specific to the phase]
      - [Objective 3 specific to the phase]

      ## Topics Covered
      ### [Topic 1, e.g., HTML]
      **Overview**: [Brief introduction to the topic, its importance, and relevance to the phase]
      **Key Concepts**:
      - [Concept 1]: [Detailed explanation, including definitions, use cases, and examples]
      - [Concept 2]: [Detailed explanation, including definitions, use cases, and examples]
      **Practical Tips**:
      - [Tip 1 for applying the topic effectively]
      - [Tip 2 for avoiding common mistakes or pitfalls]
      **Example**:
      \`\`\`
      [A practical example, such as a code snippet, use case, or step-by-step guide in text format]
      \`\`\`

      ### [Topic 2, e.g., CSS]
      **Overview**: [Brief introduction to the topic, its importance, and relevance to the phase]
      **Key Concepts**:
      - [Concept 1]: [Detailed explanation, including definitions, use cases, and examples]
      - [Concept 2]: [Detailed explanation, including definitions, use cases, and examples]
      **Practical Tips**:
      - [Tip 1 for applying the topic effectively]
      - [Tip 2 for avoiding common mistakes or pitfalls]
      **Example**:
      \`\`\`
      [A practical example, such as a code snippet, use case, or step-by-step guide in text format]
      \`\`\`

      [... Additional topics as needed, ensuring all relevant topics are covered]

      ## Recommended Courses
      - **Course Title**: [Title of the course]
        - **Platform**: [e.g., Coursera, Udemy, edX]
        - **Duration**: [e.g., 6 weeks]
        - **Price**: [e.g., $49 or Free]
        - **Link**: [Placeholder URL (e.g., "#") or real link if available]
        - **Description**: [Brief description of the course and its relevance to the phase]
      - **Course Title**: [Title of another course]
        - **Platform**: [e.g., Coursera, Udemy, edX]
        - **Duration**: [e.g., 8 weeks]
        - **Price**: [e.g., $99]
        - **Link**: [Placeholder URL or real link]
        - **Description**: [Brief description of the course and its relevance to the phase]

      **Guidelines:**
      - **Comprehensive Coverage**: Include all topics relevant to the phase title. For example:
        - Beginner Web Development: HTML, CSS, JavaScript, responsive design, Git, VS Code.
        - Intermediate Web Development: React, Node.js, APIs, databases.
        - Expert Web Development: Next.js, DevOps, Web3.
      - Tailor content to the phase's focus:
        - Beginner: Focus on foundational skills, simple explanations, and basic examples.
        - Intermediate: Emphasize practical projects, integration of concepts, and intermediate techniques.
        - Expert: Cover advanced specialization, cutting-edge technologies, and complex use cases.
      - Use the provided phase data (description, actionable steps, recommended courses) to ensure consistency with the roadmap.
      - Replace "[Topic]" with specific topics relevant to the phase (e.g., "HTML", "React").
      - Provide detailed explanations for each topic, including definitions, use cases, and examples suitable for text rendering.
      - Include practical tips to help users apply the knowledge and avoid common mistakes.
      - Ensure examples are clear, concise, and formatted as plain text code blocks (e.g., wrapped in \`\`\`).
      - Recommended courses should include realistic details (platforms, durations, prices as of April 2025) and placeholder URLs (e.g., "#") unless real links are available.
      - Format the response as plain text with Markdown-like headers (e.g., #, ##, ###) and bullet points for clarity.
      - Do not return JSON; return only the formatted text content.
    `;

    // Generate content using the AI model
    const result = await model.generateContent(prompt);
    const generatedText = await result.response.text();

    // Parse the courses section to extract structured course data
    const courses = [];
    const coursesSectionMatch = generatedText.match(/## Recommended Courses\n([\s\S]*)$/);
    if (coursesSectionMatch) {
      const coursesText = coursesSectionMatch[1];
      const courseEntries = coursesText.split("- **Course Title**: ").slice(1);
      courseEntries.forEach((entry) => {
        const lines = entry.split("\n").filter((line) => line.trim());
        const title = lines[0].trim();
        const platform = lines
          .find((line) => line.includes("Platform"))
          ?.split(": ")[1]
          ?.trim();
        const duration = lines
          .find((line) => line.includes("Duration"))
          ?.split(": ")[1]
          ?.trim();
        const price = lines
          .find((line) => line.includes("Price"))
          ?.split(": ")[1]
          ?.trim();
        const link = lines
          .find((line) => line.includes("Link"))
          ?.split(": ")[1]
          ?.trim();
        const description = lines
          .find((line) => line.includes("Description"))
          ?.split(": ")[1]
          ?.trim();

        if (title && platform && duration && price && link && description) {
          courses.push({
            title,
            platform,
            duration,
            price,
            link,
            description
          });
        }
      });
    }

    // Return JSON response
    res.status(200).json({
      content: generatedText,
      courses
    });
  } catch (error) {
    console.error("Error generating learning content:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;