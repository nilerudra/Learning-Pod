import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGeneral } from "../utils/urls";
import axios from "axios";
import { motion } from "framer-motion";
import { Copy } from "lucide-react";

export default function PodList() {
  const [userPods, setUserPods] = useState([]);
  const [podsLoading, setPodsLoading] = useState(true);
  const navigate = useNavigate();
  const [visiblePods, setVisiblePods] = useState(4);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
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
      fetchUserPods();
    }
  }, [userId]);

  return (
    <>
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
        <>
          {/* Visible Pods */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {userPods.slice(0, visiblePods).map((pods, index) => (
              <div
                key={index}
                className="relative p-6 rounded-2xl bg-transparent dark:shadow-sm shadow-gray-300 hover:shadow-md hover:shadow-gray-300 hover:scale-103 transition-all duration-300 flex flex-col justify-between"
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
                  <div className="w-12 h-12 p-3 rounded-xl bg-gray-100 dark:bg-gray-200 flex items-center justify-center">
                    {pods.icon}
                  </div>
                  <h3 className="text-gray-500 font-semibold dark:text-gray-400 mt-4">
                    {pods.pod_name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {pods.pod_description}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/pod`)}
                  className="px-4 py-2 m-4 rounded-md bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-semibold shadow-md hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  Open Pod
                </button>
              </div>
            ))}
          </div>

          {/* View More Button */}
          {visiblePods < userPods.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setVisiblePods((prev) => prev + 4)}
                className="px-4 py-2 m-4 rounded-md bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-semibold shadow-md hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                View More
              </button>
            </div>
          )}
        </>
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
    </>
  );
}
