import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import GeneratedRoadmap from "../models/GeneratedRoadmap.js";

dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

import RoadmapForm from "../models/RoadmapForm.js";

const router = express.Router();

// POST route to save education background and career details
router.post("/", async (req, res) => {
  try {
    const formData = req.body;

    console.log(formData);

    const roadmap = new RoadmapForm(formData);

    await roadmap.save();

    const genAI = new GoogleGenerativeAI(process.env.GOOGLEAPI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an AI-based personalized learning path generator. Generate a roadmap based on the provided user data:

      ${JSON.stringify(formData, null, 2)}

      ## Detailed Roadmap:

      Generate a personalized career guidance roadmap based on the user-provided data: personal information, education background, future career goals, current skills, learning preferences, and challenges. The roadmap must be structured into three distinct phases: **Beginner**, **Intermediate**, and **Expert**, tailored to the user's chosen field and current skill level.

      ### Phase Structure:
      - **Beginner Phase**: Focus on foundational skills and knowledge required for the user's career path. If the user has some skills (e.g., HTML for web development), start with the next logical step (e.g., CSS, JavaScript, or an introductory framework like React). Include basic tools, technologies, and concepts essential for the field.
      - **Intermediate Phase**: Build on beginner skills, introducing more complex concepts, frameworks, or tools relevant to the field (e.g., for web development, introduce React, Next.js, or backend frameworks like Node.js; for data science, introduce machine learning with Python). Emphasize practical projects and portfolio-building.
      - **Expert Phase**: Focus on advanced topics, specialization, and industry-leading practices (e.g., for web development, cover server-side rendering, DevOps, or microservices; for cybersecurity, cover advanced penetration testing or threat hunting). Include strategies for leadership, innovation, and staying updated with trends.

      ### Requirements for All Phases:
      - **Learning Recommendations**: Specify what the user should learn, including specific technologies, tools, or methodologies relevant to their field. For example:
        - Web Development: Beginner (HTML → CSS, JavaScript), Intermediate (React, Node.js), Expert (Next.js, DevOps).
        - Data Science: Beginner (Python, statistics), Intermediate (machine learning, SQL), Expert (deep learning, big data).
        - Cybersecurity: Beginner (networking basics, Linux), Intermediate (ethical hacking, penetration testing), Expert (threat hunting, zero-trust architecture).
      - **Actionable Steps**: Provide clear, practical steps for skill development, networking, and job search strategies. Include project ideas to apply skills (e.g., building a portfolio website for web developers).
      - **Recommended Courses**: Include links to relevant courses from platforms like Udemy, Coursera, edX, and LinkedIn Learning. For each course, provide:
        - Platform name
        - Course title
        - Link to the course
        - Price (approximate or "Free" if applicable)
        - Duration (e.g., "6 weeks", "Self-paced")
        - Mentor/instructor name (if available)
        - Image URL (a placeholder or actual course image if available)
      - **Industry Trends**: Highlight current and emerging trends in the field (e.g., AI integration in web development, cloud security in cybersecurity).
      - **Resources and Support**: Suggest mentorship opportunities, communities, and job search strategies specific to the phase and field.

      ### Additional Guidelines:
      - Tailor recommendations to the user’s current skills and career goals. For example, if the user knows HTML and aims to be a web developer, avoid recommending HTML courses and focus on CSS, JavaScript, or frameworks.
      - Ensure all recommendations are up-to-date (as of April 2025) and relevant to the user’s career path.
      - Address the user’s challenges (e.g., time constraints, lack of resources) with practical solutions in the "challengesAndSolutions" section.
      - Return the response **only in JSON format**, following the structure below (example for reference):

      {
        "userId": "678fe640180fa929cc64f786",
        "userName": "Om",
        "roadmap": {
          "title": "Personalized Career Roadmap for Aspiring Web Developer",
          "overview": "This roadmap guides Om to become a professional web developer, leveraging his HTML knowledge and focusing on modern frameworks, project-building, and advanced practices.",
          "phases": [
            {
              "phaseName": "Beginner: Foundations of Web Development (3-6 Months)",
              "description": "Learn core web technologies to build functional websites and understand web development basics.",
              "actionableSteps": [
                "Master CSS for styling and responsive design.",
                "Learn JavaScript for interactivity and DOM manipulation.",
                "Build a simple static website as a project.",
                "Join online communities like freeCodeCamp forums."
              ],
              "recommendedCourses": [
                {
                  "platform": "Coursera",
                  "title": "HTML, CSS, and JavaScript for Web Developers",
                  "link": "https://www.coursera.org/learn/html-css-javascript-for-web-developers",
                  "price": "$49/month",
                  "duration": "5 weeks",
                  "mentor": "Yaakov Chaikin",
                  "image": "https://example.com/course-image.jpg"
                },
                {
                  "platform": "Udemy",
                  "title": "The Complete JavaScript Course 2025",
                  "link": "https://www.udemy.com/course/the-complete-javascript-course/",
                  "price": "$89",
                  "duration": "Self-paced",
                  "mentor": "Jonas Schmedtmann",
                  "image": "https://example.com/course-image.jpg"
                }
              ],
              "industryTrends": "Rise of component-based frameworks, increasing demand for responsive design."
            },
            {
              "phaseName": "Intermediate: Building Dynamic Applications (6-12 Months)",
              "description": "Dive into modern frameworks and backend development to create dynamic, full-stack applications.",
              "actionableSteps": [
                "Learn React for building interactive UIs.",
                "Explore Node.js and Express for backend development.",
                "Build a full-stack project (e.g., a task management app).",
                "Contribute to open-source projects on GitHub."
              ],
              "recommendedCourses": [
                {
                  "platform": "Udemy",
                  "title": "React - The Complete Guide",
                  "link": "https://www.udemy.com/course/react-the-complete-guide-incl-hooks-router-redux/",
                  "price": "$99",
                  "duration": "Self-paced",
                  "mentor": "Maximilian Schwarzmüller",
                  "image": "https://example.com/course-image.jpg"
                }
              ],
              "industryTrends": "Popularity of headless CMS, serverless architecture."
            },
            {
              "phaseName": "Expert: Advanced Web Development (12-18 Months)",
              "description": "Master advanced concepts, optimize performance, and prepare for senior roles or freelancing.",
              "actionableSteps": [
                "Learn Next.js for server-side rendering and SEO optimization.",
                "Explore DevOps tools like Docker and CI/CD pipelines.",
                "Build a complex project (e.g., an e-commerce platform).",
                "Network at tech conferences and meetups."
              ],
              "recommendedCourses": [
                {
                  "platform": "Coursera",
                  "title": "Advanced React and Next.js",
                  "link": "https://www.coursera.org/learn/advanced-react-nextjs",
                  "price": "$59/month",
                  "duration": "4 weeks",
                  "mentor": "TBD",
                  "image": "https://example.com/course-image.jpg"
                }
              ],
              "industryTrends": "Adoption of Web3, AI-driven personalization."
            }
          ],
          "additionalResources": {
            "mentorship": "Connect with experienced developers via LinkedIn or local tech meetups.",
            "communitySupport": "Join communities like freeCodeCamp, Reddit’s r/webdev, and Discord servers.",
            "jobSearchStrategies": "Build a GitHub portfolio, optimize LinkedIn, apply via platforms like AngelList."
          },
          "challengesAndSolutions": {
            "challenge": "Overwhelm with too many frameworks.",
            "solution": "Focus on one framework (e.g., React) initially, then explore others based on job requirements."
          }
        }
      }

      Ensure the JSON is valid and contains all required fields.`;

    const result = await model.generateContent(prompt);
    const generatedText = await result.response.text();

    // Extract JSON content only (use regex to find the first valid JSON block)
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Failed to extract valid JSON from AI response.");
    }

    const cleanedJson = jsonMatch[0]; // Extracted JSON content
    const generatedRoadmap = JSON.parse(cleanedJson);

    const savedRoadmap = new GeneratedRoadmap(generatedRoadmap);
    await savedRoadmap.save();

    res.status(201).json(generatedRoadmap);

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;