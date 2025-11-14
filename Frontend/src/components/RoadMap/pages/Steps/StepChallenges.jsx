import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { apiGeneral } from "../../../../utils/urls";

const StepChallenges = ({ formData, setFormData }) => {
  const navigate = useNavigate();
  const [learningChallenges, setLearningChallenges] = useState(
    formData.challenges?.learningChallenges || ""
  );
  const [supportNeeded, setSupportNeeded] = useState(
    formData.challenges?.supportNeeded || ""
  );
  const [isLoading, setIsLoading] = useState(false); // For loading state during roadmap generation

  // Handle the selection change for challenges and support needed
  const handleSelectChange = (field, value) => {
    setFormData({
      ...formData,
      challenges: {
        ...formData.challenges,
        [field]: value,
      },
    });
  };

  const handleGenerateRoadmap = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${apiGeneral.generateRoadmap}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);

      setIsLoading(false);
      navigate("/roadmap");
      // navigate("/roadmap", { state: { roadmap: response.data } });
    } catch (error) {
      console.error("Error generating roadmap:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-transparent text-gray-800 dark:text-white">
      <h2 className="text-xl font-bold mb-4 text-purple-500">
        Challenges & Roadblocks
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Identifying challenges to provide better solutions.
      </p>

      {/* Biggest Learning Challenges */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">
          Biggest Learning Challenges
        </label>
        <select
          value={learningChallenges}
          onChange={(e) => {
            setLearningChallenges(e.target.value);
            handleSelectChange("learningChallenges", e.target.value);
          }}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700 dark:focus:ring-purple-400 dark:text-white"
          required
        >
          <option value="">Select your biggest learning challenge</option>
          <option value="Lack of time">Lack of time</option>
          <option value="Lack of motivation">Lack of motivation</option>
          <option value="Financial constraints">Financial constraints</option>
          <option value="Too many resources, not sure where to start">
            Too many resources, not sure where to start
          </option>
        </select>
      </div>

      {/* Support Needed */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">
          Support Needed
        </label>
        <select
          value={supportNeeded}
          onChange={(e) => {
            setSupportNeeded(e.target.value);
            handleSelectChange("supportNeeded", e.target.value);
          }}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700 dark:focus:ring-purple-400 dark:text-white"
        >
          <option value="">Select support needed</option>
          <option value="Mentorship">Mentorship</option>
          <option value="Study Groups">Study Groups</option>
          <option value="Structured Plan">Structured Plan</option>
          <option value="Other">Other</option>
        </select>

        {/* Generate Roadmap Button */}
        <div className="flex justify-end mt-12">
          <button
            onClick={handleGenerateRoadmap}
            disabled={isLoading}
            className={`px-6 py-2 font-semibold rounded-lg transition-all duration-300 text-white ${
              isLoading
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span>Generating...</span>
              </div>
            ) : (
              "Generate Roadmap"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepChallenges;
