import React, { useEffect, useState } from "react";
import { Flame, FolderOpen, Award, ClipboardList, Copy } from "lucide-react";
import CareerCard from "./CareerCard";
import Chatbot from "../AI-Chatbot/Chatbot";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import PodConfirm from "../pods/PodConfirm";
import { apiGeneral } from "../../utils/urls";

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [careerPaths, setCareerPaths] = useState([]);
  const [userPods, setUserPods] = useState([]);
  const [podsLoading, setPodsLoading] = useState(true); // Loading state for pods
  const [roadmapsLoading, setRoadmapsLoading] = useState(true); // Loading state for roadmaps
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirm = () => {
    console.log("Confirmed!");
    // Add your confirmation logic here
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

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

    const fetchUserPods = async () => {
      console.log("Full URL:", `${apiGeneral.userPods}${userId}`);
      try {
        const response = await axios.get(`${apiGeneral.userPods}${userId}`);
        setUserPods(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error during fetch:", error);
        setUserPods([]);
      } finally {
        setPodsLoading(false);
      }
    };

    if (userId) {
      fetchRoadmaps();
      fetchUserPods();
    }
  }, [userId]);

  return (
    <div className="p-8">
      <div className="flex justify-between">
        <div>
          <p className="text-2xl font-bold">
            Welcome back, {user ? user.name : "Guest"} 👋
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Stay on track with your learning journey!
          </p>
        </div>
        <button
          onClick={handleOpen}
          className="px-4 py-2 m-4 rounded-md bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-all duration-300 cursor-pointer"
        >
          Create Pod
        </button>
        <PodConfirm
          open={open}
          onClose={handleClose}
          onConfirm={handleConfirm}
        />
      </div>

      {/* Career Path Section */}
      <div className="mt-8">
        <p className="text-2xl font-bold mb-4">Your Career Paths</p>
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

      {/* Pods Section */}
      <p className="text-2xl font-bold">Pods</p>
      {podsLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-pulse text-center text-gray-400 dark:text-gray-500">
            <div className="h-4 w-24 mx-auto bg-gray-300 dark:bg-gray-700 rounded mb-2.5"></div>
            <div className="h-3 w-16 mx-auto bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      ) : userPods.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {userPods.map((pods, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-transparent dark:shadow-sm shadow-gray-300 hover:shadow-md hover:shadow-gray-300 hover:scale-103 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div
                  className="absolute top-4 right-4 cursor-pointer"
                  title="Copy Code"
                  onClick={() =>
                    navigator.clipboard.writeText(pods.unique_code)
                  }
                >
                  <Copy className="w-5 h-5 text-gray-500 hover:text-black transition" />
                </div>
                <div className="w-12 h-12 p-3 rounded-xl bg-gray-100 dark:bg-gray-200 flex items-center">
                  {pods.icon}
                </div>
                <h3 className="text-gray-500 font-semibold dark:text-gray-400 mt-4">
                  {pods.pod_name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {pods.pod_description}
                </p>
              </div>
              <button
                onClick={() => navigate(`/pod`)}
                className="mt-6 bg-purple-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-300"
              >
                Open Pod
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-32 p-4 text-center">
          <span className="text-5xl mb-4 text-gray-400 dark:text-gray-600">
            🔍
          </span>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            No pods available
          </p>
          <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
            Create your first pod to get started
          </p>
        </div>
      )}

      <CareerCard />
    </div>
  );
};

export default Dashboard;
