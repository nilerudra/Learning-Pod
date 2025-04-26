import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { sub } from "framer-motion/client";
import { useNavigate } from "react-router-dom";
import WORLD_FIELDS from "../../../fields.json";

// const WORLD_FIELDS = [
//   // Natural Sciences
//   {
//     category: "Natural Sciences",
//     fields: [
//       "Physics",
//       "Chemistry",
//       "Biology",
//       "Astronomy",
//       "Geology",
//       "Ecology",
//       "Environmental Science",
//       "Marine Biology",
//       "Zoology",
//       "Botany",
//       "Paleontology",
//       "Meteorology",
//       "Oceanography",
//     ],
//   },

//   // Social Sciences
//   {
//     category: "Social Sciences",
//     fields: [
//       "Anthropology",
//       "Sociology",
//       "Psychology",
//       "Economics",
//       "Political Science",
//       "Archaeology",
//       "Geography",
//       "Linguistics",
//       "Criminology",
//       "Ethnography",
//       "Demography",
//       "International Relations",
//     ],
//   },

//   // Humanities
//   {
//     category: "Humanities",
//     fields: [
//       "Philosophy",
//       "History",
//       "Literature",
//       "Art History",
//       "Religious Studies",
//       "Cultural Studies",
//       "Comparative Literature",
//       "Musicology",
//       "Theatre Studies",
//       "Film Studies",
//       "Classics",
//       "Theology",
//     ],
//   },

//   // Engineering and Technology
//   {
//     category: "Engineering and Technology",
//     fields: [
//       "Computer Science",
//       "Mechanical Engineering",
//       "Electrical Engineering",
//       "Civil Engineering",
//       "Chemical Engineering",
//       "Aerospace Engineering",
//       "Robotics",
//       "Artificial Intelligence",
//       "Data Science",
//       "Biotechnology",
//       "Nanotechnology",
//       "Software Engineering",
//       "Cybersecurity",
//     ],
//   },

//   // Medical Sciences
//   {
//     category: "Medical Sciences",
//     fields: [
//       "Medicine",
//       "Neuroscience",
//       "Pharmacology",
//       "Dentistry",
//       "Veterinary Science",
//       "Genetics",
//       "Immunology",
//       "Epidemiology",
//       "Public Health",
//       "Biomedical Engineering",
//       "Oncology",
//       "Psychiatry",
//       "Pediatrics",
//     ],
//   },

//   // Arts
//   {
//     category: "Arts",
//     fields: [
//       "Visual Arts",
//       "Performing Arts",
//       "Graphic Design",
//       "Architecture",
//       "Music Composition",
//       "Sculpture",
//       "Photography",
//       "Digital Art",
//       "Animation",
//       "Fashion Design",
//       "Industrial Design",
//       "Interior Design",
//     ],
//   },

//   // Business and Management
//   {
//     category: "Business and Management",
//     fields: [
//       "Business Administration",
//       "Marketing",
//       "Finance",
//       "Accounting",
//       "Entrepreneurship",
//       "International Business",
//       "Supply Chain Management",
//       "Human Resources",
//       "Management Consulting",
//       "Business Analytics",
//       "Organizational Behavior",
//       "Strategic Management",
//     ],
//   },

//   // Environmental and Sustainability
//   {
//     category: "Environmental and Sustainability",
//     fields: [
//       "Sustainable Development",
//       "Environmental Engineering",
//       "Climate Science",
//       "Conservation Biology",
//       "Renewable Energy",
//       "Urban Planning",
//       "Environmental Policy",
//       "Waste Management",
//       "Green Technology",
//       "Ecological Economics",
//       "Environmental Education",
//     ],
//   },

//   // Law and Legal Studies
//   {
//     category: "Law and Legal Studies",
//     fields: [
//       "Constitutional Law",
//       "International Law",
//       "Criminal Law",
//       "Corporate Law",
//       "Human Rights Law",
//       "Environmental Law",
//       "Intellectual Property Law",
//       "Maritime Law",
//       "Tax Law",
//       "Labor Law",
//       "Comparative Law",
//     ],
//   },

//   // Communication and Media
//   {
//     category: "Communication and Media",
//     fields: [
//       "Journalism",
//       "Mass Communication",
//       "Media Studies",
//       "Public Relations",
//       "Digital Media",
//       "Broadcasting",
//       "Advertising",
//       "Communication Design",
//       "Social Media Strategy",
//       "Content Creation",
//       "Multimedia Journalism",
//     ],
//   },
// ];

const RoadmapList = () => {
  const [selectedField, setSelectedField] = useState(null);
  const [subFields, setSubFields] = useState([]);
  const [selectedSubField, setSelectedSubField] = useState(null);
  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState({});
  const navigate = useNavigate();

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Function to fetch subfields from Gemini API
  const fetchSubFields = async (field) => {
    if (cache[field]) {
      setSubFields(cache[field]); // Use cached data
      return;
    }

    setSelectedField(field);
    setSubFields([]);
    setSelectedSubField(null);
    setRoadmap("");

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `List the major subfields of ${field}. Only return a comma-separated list without explanations.`,
                },
              ],
            },
          ],
        }
      );

      const subFieldsText =
        response.data.candidates[0]?.content.parts[0]?.text || "";
      setSubFields(subFieldsText.split(",").map((s) => s.trim()));

      console.log(subFieldsText);
    } catch (error) {
      console.error("Error fetching subfields:", error);
      setSubFields(["Error fetching subfields. Try again."]);
    }
  };

  const goBack = () => {
    setSelectedField(null);
    setSubFields([]);
  };

  // Function to fetch roadmap for a subfield
  const fetchRoadmap = async (subField) => {
    console.log(subField);
    setLoading(true);
    setSelectedSubField(subField);
    setRoadmap("");

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `You are an AI-based personalized learning path generator. Your task is to generate a **career roadmap** for ${subField} in the tech industry.
  
  ## Output Format:
  The response **must** be in valid **JSON format**, following this structure:
  
  {
  "subfield": "Classical Mechanics",
  "roadmap": {
    "title": "Career Roadmap for Classical Mechanics in the Tech Industry",
    "overview": "This roadmap outlines a step-by-step guide to leveraging a strong understanding of Classical Mechanics for a successful tech career.",
    "phases": [
      {
        "phaseName": "Phase 1: Foundational Knowledge (0-6 months)",
        "description": "Build a solid understanding of core classical mechanics principles and relevant mathematical tools.",
        "actionableSteps": [
          "Complete a comprehensive introductory course in Classical Mechanics.",
          "Master linear algebra, calculus, and differential equations.",
          "Develop proficiency in numerical methods and scientific computing.",
          "Familiarize yourself with Lagrangian and Hamiltonian mechanics."
        ]
      },
      {
        "phaseName": "Phase 2: Specialized Application (6-12 months)",
        "description": "Focus on a specific area of application within the tech industry where classical mechanics is crucial.",
        "actionableSteps": [
          "Choose a specialization: Robotics, Game Physics, Computer Graphics, etc.",
          "Take specialized courses related to the chosen area.",
          "Develop a portfolio of projects.",
          "Learn relevant software and tools (e.g., Unity, Unreal, Gazebo)."
        ]
      },
      {
        "phaseName": "Phase 3: Advanced Skills & Industry Experience (12-24 months)",
        "description": "Gain advanced skills and practical experience through internships, projects, or further education.",
        "actionableSteps": [
          "Seek internships or entry-level positions.",
          "Contribute to open-source projects.",
          "Network with professionals in the industry.",
          "Consider pursuing a Master's degree.",
          "Develop strong communication and teamwork skills."
        ]
      },
      {
        "phaseName": "Phase 4: Career Advancement (24+ months)",
        "description": "Continuously learn and advance your career based on your chosen specialization and industry trends.",
        "actionableSteps": [
          "Stay updated with the latest advancements.",
          "Seek leadership and mentorship opportunities.",
          "Develop specialized skills in areas like real-time rendering or AI-driven simulations.",
          "Pursue further education or certifications."
        ]
      }
    ]
  }
}
ai should follow this type of json form only in my response 
  }`,
                },
              ],
            },
          ],
        }
      );

      // Extract response text
      let roadmapText =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

      // Clean possible invalid JSON
      roadmapText = roadmapText.replace(/```json|```/g, "").trim();

      console.log("Raw AI Response:", roadmapText);

      // Parse response JSON safely
      let roadmapJSON;
      try {
        roadmapJSON = JSON.parse(roadmapText);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        roadmapJSON = {
          roadmap: { overview: "Invalid response format.", phases: [] },
        };
      }

      // Set roadmap and navigate
      setRoadmap(roadmapJSON);
      navigate("/static-roadmap", { state: { roadmap: roadmapJSON } });
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      setRoadmap({
        roadmap: { overview: "Failed to generate roadmap.", phases: [] },
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-transparent p-6 dark:text-black">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent">
          World Fields Explorer
        </h1>

        {/* If a field is selected, show subfields */}
        {selectedField ? (
          <div>
            <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent">
              {selectedField} - Subfields
            </h2>
            <button
              onClick={goBack}
              className="mb-4 px-4 py-2 bg-gray-300 bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent rounded-md"
            >
              ← Back
            </button>
            <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4">
              {subFields.map((sub, index) => (
                <motion.div
                  key={index}
                  onClick={() => fetchRoadmap(sub)}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-all cursor-pointer hover:bg-blue-50"
                >
                  {sub}
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          // Show fields list if no field is selected
          WORLD_FIELDS.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.2, duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-semibold mb-6 border-b pb-2 bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent">
                {category.category}
              </h2>
              <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4">
                {category.fields.map((field, fieldIndex) => (
                  <motion.div
                    key={fieldIndex}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => fetchSubFields(field)}
                    className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-all cursor-pointer hover:bg-blue-50"
                  >
                    {field}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default RoadmapList;
