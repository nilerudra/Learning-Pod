import React, { useContext, useState } from "react";
import { ThemeContext } from "../../../../context/ThemeContext";

const StepEducationProfession = ({ formData, setFormData }) => {
  const theme = useContext(ThemeContext);

  const [selectedType, setSelectedType] = useState(
    formData.educationProfession.type || ""
  );
  const [selectedQualification, setSelectedQualification] = useState(
    formData.educationProfession.qualification || ""
  );

  // Options for Students
  const studentOptions = [
    "10th",
    "12th",
    "Undergraduate",
    "Postgraduate",
    "Diploma",
    "Other",
  ];

  // Handle selection
  const handleTypeSelection = (type) => {
    setSelectedType(type);
    setFormData({
      ...formData,
      educationProfession: { type, qualification: "", currentField: "" },
    });
  };

  // Handle qualification selection for Students
  const handleQualificationSelection = (qualification) => {
    setSelectedQualification(qualification);
    setFormData({
      ...formData,
      educationProfession: {
        ...formData.educationProfession,
        qualification,
        currentField: "",
      },
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-purple-500">
        Current Education/Profession
      </h2>

      {/* Select Student or Working Professional */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {["Student", "Working Professional"].map((option) => (
          <button
            key={option}
            className={`p-4 border rounded-lg text-center ${
              selectedType === option
                ? "border-purple-500 bg-purple-100 text-purple-600"
                : "border-gray-300"
            }`}
            onClick={() => handleTypeSelection(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {/* If Student is selected */}
      {selectedType === "Student" && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Select Qualification:</h3>
          <div className="grid grid-cols-2 gap-4">
            {studentOptions.map((option) => (
              <button
                key={option}
                className={`p-4 border rounded-lg text-center ${
                  selectedQualification === option
                    ? "border-purple-500 bg-purple-100 text-purple-600"
                    : "border-gray-300"
                }`}
                onClick={() => handleQualificationSelection(option)}
              >
                {option}
              </button>
            ))}
          </div>

          {/* If qualification is 12th, ask for Stream */}
          {/* If qualification is 12th, ask for Stream */}
          {selectedQualification === "12th" && (
            <div className="mt-4">
              <label className="block text-lg font-semibold">Stream:</label>
              <select
                className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-purple-600"
                value={formData.educationProfession.currentField}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    educationProfession: {
                      ...formData.educationProfession,
                      currentField: e.target.value,
                    },
                  })
                }
              >
                <option
                  value=""
                  className={`${
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  Select Stream
                </option>
                <option
                  value="Science"
                  className={`${
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  Science
                </option>
                <option
                  value="Commerce"
                  className={`${
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  Commerce
                </option>
                <option
                  value="Arts"
                  className={`${
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  Arts
                </option>
                <option
                  value="Vocational"
                  className={`${
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  Vocational
                </option>
                <option
                  value="Other"
                  className={`${
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  Other
                </option>
              </select>
            </div>
          )}

          {/* If qualification is Undergraduate or Postgraduate, ask for Current Field */}
          {(selectedQualification === "Undergraduate" ||
            selectedQualification === "Postgraduate" ||
            selectedQualification === "Diploma" ||
            selectedQualification === "Other") && (
            <div className="mt-4">
              <label className="block text-lg font-semibold">
                Current Field of Study:
              </label>
              <input
                type="text"
                className="mt-2 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. Computer Science"
                value={formData.educationProfession.currentField}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    educationProfession: {
                      ...formData.educationProfession,
                      currentField: e.target.value,
                    },
                  })
                }
              />
            </div>
          )}
        </div>
      )}

      {/* If Working Professional is selected */}
      {selectedType === "Working Professional" && (
        <div className="mt-4">
          <label className="block text-lg font-semibold">Job Title:</label>
          <input
            type="text"
            className="mt-2 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g. Software Engineer"
            value={formData.educationProfession.currentField}
            onChange={(e) =>
              setFormData({
                ...formData,
                educationProfession: {
                  ...formData.educationProfession,
                  currentField: e.target.value,
                },
              })
            }
          />
          <label className="block text-lg mt-6 font-semibold">
            Experience:
          </label>

          <input
            type="text"
            className="mt-2 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g. 2 years"
            value={formData.educationProfession.experience}
            onChange={(e) =>
              setFormData({
                ...formData,
                educationProfession: {
                  ...formData.educationProfession,
                  experience: e.target.value,
                },
              })
            }
          />
        </div>
      )}
    </div>
  );
};

export default StepEducationProfession;
