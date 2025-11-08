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
            className="mr-3 text-purple-500 hover:text-violet-400 transition-colors duration-300"
            size={40}
          />

          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 bg-clip-text text-transparent">
            AI Roadmap Generator
          </h1>
        </motion.div>

        <p className="text-xl text-gray-400 max-w-2xl mb-4">
          Craft a personalized learning journey tailored to your goals.
        </p>

        <Link to="/form">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 p-4 m-4 rounded-md bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-semibold shadow-md hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 cursor-pointer"
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
