import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiGeneral } from "../../utils/urls";

function PodConfirm({ open, onClose }) {
  const [uniqueCode, setUniqueCode] = useState("");
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = async () => {
    setLoading(true);
    console.log(uniqueCode);
    console.log(userId);
    try {
      const response = await axios.post(apiGeneral.joinPod, {
        unique_code: uniqueCode,
        user_id: userId,
      });
      console.log("Joined pod:", response.data);
      onClose();
    } catch (error) {
      console.error("Error joining pod:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 shadow-lg relative">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Choose an Action
        </h2>
        <hr className="border-gray-300 dark:border-gray-600 mb-4" />
        <p className="text-center text-gray-700 dark:text-gray-300">
          Do you want to join an existing pod or create a new one?
        </p>

        <input
          type="text"
          placeholder="Enter Pod Code"
          className="w-full mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          value={uniqueCode}
          onChange={(e) => setUniqueCode(e.target.value)}
        />

        <div className="mt-4 flex flex-col items-center">
          <button
            onClick={handleJoin}
            disabled={loading}
            className="w-48 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all mb-3"
          >
            {loading ? "Joining..." : "Join Pod"}
          </button>

          <div className="flex items-center w-full my-2">
            <hr className="flex-grow border-gray-300 dark:border-gray-600" />
            <span className="mx-2 text-gray-500 dark:text-gray-400 font-semibold">
              or
            </span>
            <hr className="flex-grow border-gray-300 dark:border-gray-600" />
          </div>

          <button
            onClick={() => {
              navigate("/create-pod");
              onClose();
            }}
            className="w-48 px-4 py-2 border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Create Pod
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default PodConfirm;
