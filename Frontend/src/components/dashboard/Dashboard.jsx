import React, { useState } from "react";
import CareerCard from "./CareerCard";
import { motion } from "framer-motion";
import PodConfirm from "../pods/PodConfirm";
import RoadmapList from "../RoadmapList";
import PodList from "../PodList";

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = localStorage.getItem("user");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirm = () => {
    console.log("Confirmed!");
    // Add your confirmation logic here
  };

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
          className="px-4 py-2 m-4 rounded-md bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-semibold shadow-md hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          Create Pod
        </button>

        <PodConfirm
          open={open}
          onClose={handleClose}
          onConfirm={handleConfirm}
        />
      </div>

      <RoadmapList />

      <PodList />

      <CareerCard />
    </div>
  );
};

export default Dashboard;
