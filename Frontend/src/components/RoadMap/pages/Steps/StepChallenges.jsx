import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

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
    console.log(formData);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/ai_generated_path",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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
        {/* Next Button */}
        <div className="flex justify-end mt-12">
          <button
            onClick={() => handleGenerateRoadmap()}
            className="px-6 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-all duration-300 dark:bg-purple-600 dark:hover:bg-purple-700"
          >
            Generate Roadmap
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepChallenges;
