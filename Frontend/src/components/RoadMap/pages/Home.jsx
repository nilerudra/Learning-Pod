import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BookOpen, Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const Home = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [error, setError] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/roadmap/last-three/${userId}`
        );
        setRoadmaps(response.data);
        setError(false);
      } catch (error) {
        console.error("Error fetching roadmaps:", error);
        setError(true);
      }
    };

    if (userId) fetchRoadmaps();
  }, [userId]);

  return (
    <div className="min-h-screen p-8 flex flex-col bg-transparent transition-all duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-grow flex flex-col items-center justify-center text-center px-4"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center mb-6"
        >
          <Sparkles
            className="mr-3 bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 bg-clip-text text-transparent"
            size={40}
          />
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 bg-clip-text text-transparent">
            AI Roadmap Generator
          </h1>
        </motion.div>

        <p className="text-xl text-gray-700 dark:text-gray-500 max-w-2xl mt-4">
          Craft a personalized learning journey tailored to your goals.
        </p>

        <Link to="/form">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="mt-6 px-8 py-4 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2"
          >
            <Target size={20} />
            <span>Create Your Roadmap</span>
          </motion.button>
        </Link>
      </motion.div>

      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <BookOpen
              className="mr-3 bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 bg-clip-text text-transparent"
              size={30}
            />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 bg-clip-text text-transparent">
              Recently Generated Roadmaps
            </h2>
          </div>

          {error ? (
            <p className="text-red-500 text-lg">
              Can't fetch data. Please try again later.
            </p>
          ) : roadmaps.length === 0 ? (
            <p className="text-gray-500">No roadmaps found.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {roadmaps.map((roadmap, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-transparent border-2 border-gray-300 dark:border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
                >
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 bg-clip-text text-transparent mb-2">
                    {roadmap.title}
                  </h3>

                  <p className="bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 bg-clip-text text-transparent mb-2">
                    <strong>Created by:</strong> {roadmap.author}
                  </p>

                  <p className="text-gray-400 mb-2">
                    <strong className="text-gray-300">Created At: </strong>
                    {new Date(roadmap.createdAt).toLocaleDateString()}
                  </p>

                  <p className="text-gray-300 mb-2">
                    <strong>Industry Trends:</strong>{" "}
                    <p className="text-gray-400">{roadmap.industryTrends}</p>
                  </p>

                  <div className="mt-3">
                    <strong className="text-gray-300">Key Skills:</strong>
                    <ul className="list-disc list-inside text-gray-400 mt-1">
                      {roadmap.keySkills.map((skill, i) => (
                        <li key={i} className="text-sm">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
