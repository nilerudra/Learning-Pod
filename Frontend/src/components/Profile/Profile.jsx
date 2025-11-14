import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "./ProfileHeader";
import { apiGeneral } from "../../utils/urls";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const [totalRoadmaps, setTotalRoadmaps] = useState(0);
  const [totalCompleted, setTotalComplete] = useState(0);
  const [visibleRoadmaps, setVisibleRoadmaps] = useState(3);
  const navigate = useNavigate();

  // Fetch roadmaps
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchRoadmaps = async () => {
      try {
        const res = await axios.get(`${apiGeneral.getAllRoadmaps}${userId}`);

        console.log(res.data.formattedRoadmaps[0]);

        setRoadmaps(res.data.formattedRoadmaps || []);
        setTotalRoadmaps(res.data.totalRoadmaps);
        setTotalComplete(res.data.userTotalCompleted);

        // console.log("Fetched roadmaps:", res.data.formattedRoadmaps);
      } catch (error) {
        console.error("Error fetching user roadmaps:", error);
        setRoadmaps([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchRoadmaps();
  }, [userId]);

  // Handle click to open roadmap details
  const handleRoadmapClick = async (id) => {
    try {
      // console.log("Fetching roadmap ID:", id);
      if (!id) {
        alert("Invalid roadmap ID!");
        return;
      }

      // const response = await axios.get(
      //   `http://localhost:8000/api/roadmap/full/${id}`
      // );

      // // console.log(response.data);

      // // Save full roadmap details to localStorage
      // localStorage.setItem("selectedRoadmap", JSON.stringify(response.data));

      // Redirect to roadmap details page
      navigate(`/roadmap/${id}`);
    } catch (error) {
      console.error("Error fetching full roadmap:", error);
    }
  };

  return (
    <div className="p-8 text-white">
      {/* Header */}
      {user && (
        <ProfileHeader
          user={user}
          totalRoadmaps={totalRoadmaps}
          totalCompleted={totalCompleted}
        />
      )}

      <div className="mt-10">
        <p className="text-2xl font-bold mb-8">
          Your Recently Generated Roadmaps
        </p>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse text-center text-gray-400 dark:text-gray-500">
              <div className="h-4 w-24 mx-auto bg-gray-300 dark:bg-gray-700 rounded mb-2.5"></div>
              <div className="h-3 w-16 mx-auto bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ) : roadmaps.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roadmaps.slice(0, visibleRoadmaps).map((rm, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.04 }}
                  onClick={() => handleRoadmapClick(rm.id)} // ✅ send ID from backend
                  className="cursor-pointer bg-transparent border-2 border-gray-300 dark:border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
                >
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 bg-clip-text text-transparent mb-2">
                    {rm.title}
                  </h3>

                  <p className="text-gray-400 mb-2">
                    <strong className="text-gray-300">Created At: </strong>
                    {new Date(rm.createdAt).toLocaleDateString()}
                  </p>

                  <p className="text-gray-300 mb-2">
                    <strong>Progress:</strong>{" "}
                    <span className="text-gray-400">
                      {rm.completedTopics || 0} / {rm.totalTopics || 0} topics
                    </span>
                  </p>

                  <div className="mt-3">
                    <strong className="text-gray-300">Key Skills:</strong>
                    <ul className="list-disc list-inside text-gray-400 mt-1">
                      {(rm.keySkills || []).slice(0, 5).map((skill, i) => (
                        <li key={i} className="text-sm">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>

            {visibleRoadmaps < roadmaps.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setVisibleRoadmaps((prev) => prev + 3)}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-sm transition-all"
                >
                  View More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 p-4 text-center">
            <span className="text-5xl mb-4 text-gray-400 dark:text-gray-600">
              🧭
            </span>
            <p className="text-lg font-medium text-gray-300">
              No roadmaps generated yet
            </p>
            <p className="text-sm mt-2 text-gray-500">
              Go to your dashboard and start your learning journey 🚀
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
