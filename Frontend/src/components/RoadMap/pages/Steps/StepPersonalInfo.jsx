import React, { useContext } from "react";
import { ThemeContext } from "../../../../context/ThemeContext";

const StepPersonalInfo = ({ formData, setFormData }) => {
  const { theme } = useContext(ThemeContext); // Getting the current theme

  return (
    <div className={`p-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
      <h2
        className={`text-3xl font-bold mb-2 ${
          theme === "dark"
            ? "text-purple-500"
            : "bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent"
        }`}
      >
        Personal Information
      </h2>
      <p
        className={`mb-6 ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Let’s start with the basics.
      </p>

      {/* Full Name */}
      <div className="mb-4">
        <label
          className={`block font-semibold mb-1 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Full Name:
        </label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={formData.personalInfo?.fullName || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              personalInfo: {
                ...formData.personalInfo,
                fullName: e.target.value,
              },
            })
          }
          required
          className={`w-full p-3 bg-transparent border rounded-md focus:outline-none focus:ring-2 ${
            theme === "dark"
              ? "text-white border-gray-600 focus:ring-purple-500"
              : "text-gray-900 border-gray-300 ring-purple-500"
          }`}
        />
      </div>

      {/* Age */}
      <div className="mb-4">
        <label
          className={`block font-semibold mb-1 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Age:
        </label>
        <input
          type="number"
          placeholder="Enter your age"
          value={formData.personalInfo?.age || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              personalInfo: { ...formData.personalInfo, age: e.target.value },
            })
          }
          required
          className={`w-full p-3 bg-transparent border rounded-md focus:outline-none focus:ring-2 ${
            theme === "dark"
              ? "text-white border-gray-600 focus:ring-purple-500"
              : "text-gray-900 border-gray-300 focus:ring-purple-500"
          }`}
        />
      </div>

      {/* Current Location */}
      <div className="mb-4">
        <label
          className={`block font-semibold mb-1 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Current Location:
        </label>
        <input
          type="text"
          placeholder="City, Country"
          value={formData.personalInfo?.location || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              personalInfo: {
                ...formData.personalInfo,
                location: e.target.value,
              },
            })
          }
          required
          className={`w-full p-3 bg-transparent border rounded-md focus:outline-none focus:ring-2 ${
            theme === "dark"
              ? "text-white border-gray-600 focus:ring-purple-500"
              : "text-gray-900 border-gray-300 focus:ring-purple-500"
          }`}
        />
      </div>
    </div>
  );
};

export default StepPersonalInfo;
