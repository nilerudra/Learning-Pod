import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function RoadmapList() {
  const navigate = useNavigate();
  const [careerPaths, setCareerPaths] = useState([]);
  const [roadmapsLoading, setRoadmapsLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await axios.get(
          `https://learning-pod-e3wo.onrender.com/api/roadmap/last-three/${userId}`
        );
        setCareerPaths(response.data);
      } catch (error) {
        console.error("Error fetching roadmaps:", error);
        setCareerPaths([]);
      } finally {
        setRoadmapsLoading(false);
      }
    };
    if (userId) {
      fetchRoadmaps();
    }
  }, [userId]);

  return (
    <>
      <div className="mt-8">
        <p className="text-2xl font-bold mb-8">Your Recent Career Paths</p>
        {roadmapsLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse text-center text-gray-400 dark:text-gray-500">
              <div className="h-4 w-24 mx-auto bg-gray-300 dark:bg-gray-700 rounded mb-2.5"></div>
              <div className="h-3 w-16 mx-auto bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ) : careerPaths.length > 0 ? (
          <div className="grid grid-cols-1 mb-8 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerPaths.map((path, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-transparent border-2 border-gray-300 dark:border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
              >
                <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 bg-clip-text text-transparent mb-2">
                  {path.title}
                </h3>
                <p className="text-gray-400 mb-2">
                  <strong className="text-gray-300">Created At: </strong>
                  {new Date(path.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-300 mb-2">
                  <strong>Industry Trends:</strong>{" "}
                  <p className="text-gray-400">
                    {path.industryTrends
                      .split(" ")
                      .slice(0, 5)
                      .join(" ")
                      .concat(
                        path.industryTrends.split(" ").length > 5 ? "..." : ""
                      )}
                  </p>
                </p>
                <div className="mt-3">
                  <strong className="text-gray-300">Key Skills:</strong>
                  <ul className="list-disc list-inside text-gray-400 mt-1">
                    {path.keySkills.map((skill, i) => (
                      <li key={i} className="text-sm">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center mt-8">
            <button
              onClick={() => navigate("/career-path")}
              className="px-6 py-3 bg-purple-400 text-white text-lg rounded-md hover:bg-purple-500 transition-all duration-300"
            >
              Generate Roadmap
            </button>
          </div>
        )}
      </div>
    </>
  );
}
