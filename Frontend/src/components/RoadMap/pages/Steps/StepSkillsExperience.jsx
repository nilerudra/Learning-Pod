import React, { useState } from "react";

const StepSkillsExperience = ({ formData, setFormData }) => {
  const [experienceValue, setExperienceValue] = useState(
    formData.skills.experience?.value || ""
  );
  const [experienceUnit, setExperienceUnit] = useState(
    formData.skills.experience?.unit || "Months"
  );
  const [selectedSkills, setSelectedSkills] = useState(
    formData.skills.selected || []
  );
  const [error, setError] = useState("");

  // Skill Categories (from multiple domains)
  const skillOptions = [
    "Programming",
    "Graphic Design",
    "Public Speaking",
    "Photography",
    "Sports Coaching",
    "Music Production",
    "Writing & Content Creation",
    "Marketing & Sales",
    "Project Management",
    "Teaching & Training",
    "Finance & Investing",
    "Cooking & Culinary Arts",
    "Fitness & Wellness",
    "Psychology & Counseling",
    "Video Editing",
    "Entrepreneurship",
  ];

  // Handle Skill Selection
  const toggleSkill = (skill) => {
    const updatedSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter((s) => s !== skill) // Remove if already selected
      : [...selectedSkills, skill]; // Add if not selected

    setSelectedSkills(updatedSkills);
    setFormData({
      ...formData,
      skills: { ...formData.skills, selected: updatedSkills },
    });
    setError(""); // Clear error when user selects at least one skill
  };

  // Handle overall experience change
  const handleExperienceValueChange = (e) => {
    const value = e.target.value;
    setExperienceValue(value);
    setFormData({
      ...formData,
      skills: {
        ...formData.skills,
        experience: { value, unit: experienceUnit },
      },
    });
    setError(""); // Clear error
  };

  // Handle experience unit change
  const handleExperienceUnitChange = (e) => {
    const unit = e.target.value;
    setExperienceUnit(unit);
    setFormData({
      ...formData,
      skills: {
        ...formData.skills,
        experience: { value: experienceValue, unit },
      },
    });
    setError(""); // Clear error
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2 text-purple-500">
        Your Skills & Experience
      </h2>
      <p className="text-gray-600 mb-4">
        Select at least one skill from any field and provide your overall
        experience.
      </p>

      {/* Skill Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {skillOptions.map((skill) => (
          <button
            key={skill}
            className={`p-4 border rounded-lg text-center transition-all ${
              selectedSkills.includes(skill)
                ? "border-purple-500 bg-purple-100 text-purple-600"
                : "border-gray-300 hover:border-purple-400 hover:bg-purple-500"
            }`}
            onClick={() => toggleSkill(skill)}
          >
            {skill}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <label className="block text-lg font-semibold">Experience:</label>
        <div className="flex space-x-4">
          <input
            type="number"
            value={experienceValue}
            onChange={handleExperienceValueChange}
            className="p-3 w-1/3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g. 11"
          />
          <select
            value={experienceUnit}
            onChange={handleExperienceUnitChange}
            className="p-3 w-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white "
          >
            <option value="Months">Months</option>
            <option value="Years">Years</option>
          </select>
        </div>
      </div>

      {/* Manual Skill Input */}
      <div className="mt-4">
        <label className="block text-lg font-semibold">Other Skills:</label>
        <textarea
          placeholder="List any additional skills..."
          className="mt-2 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={formData.skills.manual || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              skills: { ...formData.skills, manual: e.target.value },
            })
          }
        />
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default StepSkillsExperience;
