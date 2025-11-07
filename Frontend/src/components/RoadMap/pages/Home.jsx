import React from "react";
import { Link } from "react-router-dom";
import { Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import RoadmapList from "../../RoadmapList";

const Home = () => {
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
      <RoadmapList />
    </div>
  );
};

export default Home;
