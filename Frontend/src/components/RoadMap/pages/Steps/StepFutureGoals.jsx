import React, { useState } from "react";

const StepFutureGoals = ({ formData, setFormData }) => {
  const [selectedGoal, setSelectedGoal] = useState(
    formData.futureGoals.primaryGoal || ""
  );

  // List of goals
  const goals = [
    "Get a job",
    "Start a business",
    "Upskill in current job",
    "Switch careers",
    "Pursue higher studies",
    "Become a freelancer",
  ];

  // Handle goal selection
  const handleGoalSelection = (goal) => {
    setSelectedGoal(goal);
    setFormData({
      ...formData,
      futureGoals: {
        ...formData.futureGoals,
        primaryGoal: goal,
        details: "", // Clear previous details
      },
    });
  };

  // Handle input changes for future goals
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      futureGoals: {
        ...formData.futureGoals,
        [field]: value,
      },
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2 text-purple-500">
        Future Goals & Interests
      </h2>
      <p className="text-gray-600 mb-4">
        Understanding your aspirations to personalize your roadmap.
      </p>

      {/* Goal Selection */}
      <div className="grid grid-cols-2 gap-4">
        {goals.map((goal) => (
          <button
            key={goal}
            className={`p-4 border rounded-lg text-center ${
              selectedGoal === goal
                ? "border-purple-500 bg-purple-100 text-purple-600"
                : "border-gray-300"
            }`}
            onClick={() => handleGoalSelection(goal)}
          >
            {goal}
          </button>
        ))}
      </div>

      {/* Additional Input for Specific Goals */}
      {selectedGoal === "Pursue higher studies" && (
        <div className="mt-4">
          <label className="block text-lg font-semibold">Field of Study:</label>
          <input
            type="text"
            className="mt-2 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g. Data Science, MBA, Engineering"
            value={formData.futureGoals.details}
            onChange={(e) => handleInputChange("details", e.target.value)}
          />
        </div>
      )}

      {selectedGoal === "Start a business" && (
        <div className="mt-4">
          <label className="block text-lg font-semibold">Business Idea:</label>
          <input
            type="text"
            className="mt-2 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g. Tech startup, E-commerce, Consultancy"
            value={formData.futureGoals.details}
            onChange={(e) => handleInputChange("details", e.target.value)}
          />
        </div>
      )}

      {/* New Input: Interest Field */}
      <div className="mt-4">
        <label className="block text-lg font-semibold">
          Field of Interest:
        </label>
        <input
          type="text"
          className="mt-2 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="e.g. AI, Marketing, Finance"
          value={formData.futureGoals.interestField || ""}
          onChange={(e) => handleInputChange("interestField", e.target.value)}
        />
      </div>

      {/* New Dropdown: Learning Style */}
      <div className="mt-4">
        <label className="block text-lg font-semibold">
          Preferred Learning Style:
        </label>
        <select
          className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-purple-600"
          value={formData.futureGoals.learningStyle || ""}
          onChange={(e) => handleInputChange("learningStyle", e.target.value)}
        >
          <option value="" disabled>
            Select your learning style
          </option>
          <option value="Visual">Visual (Diagrams, Videos)</option>
          <option value="Auditory">Auditory (Podcasts, Lectures)</option>
          <option value="Kinesthetic">Kinesthetic (Hands-on Learning)</option>
        </select>
      </div>
    </div>
  );
};

export default StepFutureGoals;
