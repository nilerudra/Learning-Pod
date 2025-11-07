import React, { useEffect, useState } from "react";
import axios from "axios";
import { domain } from "../../utils/domain";
import { BookOpen, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const Explore = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedPod, setSelectedPod] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [pods, setPods] = useState([]);
  const dummyPods = [
    {
      id: 1,
      pod_name: "Tech Enthusiasts",
      pod_description:
        "A group for people passionate about technology, gadgets, and the latest in tech news. Join to discuss and learn together!",
      created_by: "user1",
      is_public: true,
    },
    {
      id: 2,
      pod_name: "Fitness Freaks",
      pod_description:
        "For those who are committed to staying fit, healthy, and motivated. Share workout routines, fitness tips, and nutrition advice.",
      created_by: "user2",
      is_public: true,
    },
    {
      id: 3,
      pod_name: "Bookworms Club",
      pod_description:
        "A place for book lovers to share their latest reads, discuss literary works, and explore new genres. Join the club for lively book discussions!",
      created_by: "user3",
      is_public: true,
    },
    {
      id: 4,
      pod_name: "Gaming Legends",
      pod_description:
        "Join this pod for passionate gamers who want to connect, play multiplayer games, and discuss the latest in gaming culture.",
      created_by: "user4",
      is_public: true,
    },
    {
      id: 5,
      pod_name: "Photography Enthusiasts",
      pod_description:
        "A community for amateur and professional photographers to share tips, tricks, and their latest photo projects.",
      created_by: "user5",
      is_public: true,
    },
    {
      id: 6,
      pod_name: "Travel Explorers",
      pod_description:
        "For avid travelers and adventure seekers to share their travel stories, tips, and explore new destinations together.",
      created_by: "user6",
      is_public: true,
    },
  ];

  useEffect(() => {
    const fetchPods = async () => {
      try {
        const response = await axios.get(
          `${domain}/create/get-pods?is_public=true`
        );
        setPods(response.data);
        setPods(dummyPods); // Mocking data for testing
      } catch (error) {
        console.error("Error fetching pods:", error);
      }
    };

    fetchPods();
  }, []);

  const handleOpenPopup = (pod) => {
    setSelectedPod(pod);
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setSelectedPod(null);
    setRequestMessage("");
  };

  const handleSendRequest = async () => {
    if (!selectedPod) return;

    try {
      const response = await axios.post(`${domain}/notification/create`, {
        userId: localStorage.getItem("user_id"),
        podId: selectedPod._id,
        podAdminId: selectedPod.created_by,
        message: requestMessage,
      });

      alert(
        `Request sent to join "${selectedPod.pod_name}" pod with message: "${requestMessage}"`
      );

      handleClosePopup();
    } catch (error) {
      console.error(
        "Error sending request:",
        error.response?.data || error.message
      );
      alert("Failed to send request. Please try again.");
    }
  };

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
            Explore Pods
          </h1>
        </motion.div>

        <p className="text-xl text-gray-700 dark:text-gray-500 max-w-2xl">
          Discover and join pods that match your interests and passions.
        </p>
      </motion.div>

      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <BookOpen
              className="mr-3 bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 bg-clip-text text-transparent"
              size={30}
            />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 bg-clip-text text-transparent">
              Public Pods
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pods.map((pod) => (
              <motion.div
                key={pod.id}
                whileHover={{ scale: 1.05 }}
                className="bg-transparent border-2 border-gray-300 dark:border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
              >
                <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 bg-clip-text text-transparent mb-2">
                  {pod.pod_name}
                </h3>

                <p className="text-gray-400 mb-2">{pod.pod_description}</p>

                <div className="mt-3">
                  <button
                    onClick={() => handleOpenPopup(pod)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all"
                  >
                    Join Pod
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for sending a join request */}
      {openPopup && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-96 max-w-full border border-gray-200 dark:border-gray-700 transition-all">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Join{" "}
                <span className="text-purple-600">{selectedPod?.pod_name}</span>
              </h3>
              <button
                onClick={handleClosePopup}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition"
              >
                ✕
              </button>
            </div>

            {/* Textarea */}
            <textarea
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-100 resize-none mb-5"
              rows="4"
              placeholder="Write a short message to request joining..."
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
            ></textarea>

            {/* Action buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleClosePopup}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-sm transition-all"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;
