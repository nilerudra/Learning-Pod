import React, { useState } from "react";

const StepLearningPreferences = ({ formData, setFormData }) => {
  const [selectedResources, setSelectedResources] = useState(
    formData.learningPreferences.resources || []
  );
  const [learningStyle, setLearningStyle] = useState(
    formData.learningPreferences.style || ""
  );
  const [timeCommitment, setTimeCommitment] = useState(
    formData.learningPreferences.timeCommitment || ""
  );
  const [error, setError] = useState("");

  // Learning resource options
  const resourceOptions = [
    "Free Online Courses",
    "Paid Bootcamps",
    "Books",
    "Mentorship",
    "YouTube Tutorials",
    "University Courses",
    "Hands-on Projects",
    "Group Study Sessions",
  ];

  // Learning style options
  const learningStyles = [
    "Visual (Videos, Infographics)",
    "Hands-on (Projects, Practice)",
    "Theoretical (Books, Articles)",
  ];

  // Time commitment options
  const timeCommitmentOptions = [
    "<5 hours per week",
    "5-10 hours per week",
    "10-20 hours per week",
    "Full-time",
  ];

  // Handle resource selection
  const toggleResource = (resource) => {
    const updatedResources = selectedResources.includes(resource)
      ? selectedResources.filter((r) => r !== resource) // Remove if already selected
      : [...selectedResources, resource]; // Add if not selected

    setSelectedResources(updatedResources);
    setFormData({
      ...formData,
      learningPreferences: {
        ...formData.learningPreferences,
        resources: updatedResources,
      },
    });
    setError(""); // Clear error when user selects at least one
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2 text-purple-500 dark:text-purple-400">
        Resources & Learning Preferences
      </h2>
      <p className="text-gray-600 mb-4 dark:text-gray-300">
        Customize your roadmap based on how you learn best.
      </p>

      {/* Learning Resource Selection */}
      <label className="block text-lg font-semibold mb-2 dark:text-gray-200">
        Preferred Learning Resources:
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {resourceOptions.map((resource) => (
          <button
            key={resource}
            className={`p-4 border rounded-lg text-center transition-all dark:border-gray-600 ${
              selectedResources.includes(resource)
                ? "border-purple-500 bg-purple-100 text-purple-600 dark:bg-purple-700 dark:text-purple-200"
                : "border-gray-300 hover:border-purple-400 dark:border-gray-700 dark:hover:border-purple-500 dark:hover:bg-purple-800"
            }`}
            onClick={() => toggleResource(resource)}
          >
            {resource}
          </button>
        ))}
      </div>

      {/* Time Commitment Selection */}
      <div className="mt-6">
        <label className="block text-lg font-semibold mb-2 dark:text-gray-200">
          Preferred Time Commitment:
        </label>
        <select
          value={timeCommitment}
          onChange={(e) => {
            setTimeCommitment(e.target.value);
            setFormData({
              ...formData,
              learningPreferences: {
                ...formData.learningPreferences,
                timeCommitment: e.target.value,
              },
            });
          }}
          className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-purple-600"
        >
          <option value="">Select Time Commitment</option>
          {timeCommitmentOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      {/* Learning Style Selection */}
      <div className="mt-6">
        <label className="block text-lg font-semibold mb-2 dark:text-gray-200">
          Preferred Learning Style:
        </label>
        <select
          value={learningStyle}
          onChange={(e) => {
            setLearningStyle(e.target.value);
            setFormData({
              ...formData,
              learningPreferences: {
                ...formData.learningPreferences,
                style: e.target.value,
              },
            });
          }}
          className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-purple-600"
        >
          <option value="">Select Learning Style</option>
          {learningStyles.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-2 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default StepLearningPreferences;
