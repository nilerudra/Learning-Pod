import React from "react";

const ProgressBar = ({ step }) => {
  const steps = [
    "Personal Info",
    "Education",
    "Future Goals",
    "Skills",
    "Preferences",
    "Challenges",
  ];

  // Function to calculate the line's length based on the step
  const calculateLineLength = () => {
    const totalSteps = steps.length;
    const widthPercentage = ((step - 1) / (totalSteps - 1)) * 100;
    return widthPercentage;
  };

  return (
    <div className="sticky top-0 bg-gray-100 p-4 shadow-md z-50">
      <div className="relative flex justify-between items-center text-sm md:text-base">
        {/* SVG Line connecting the steps */}
        <svg
          className="absolute top-1/2 left-0 w-full h-[2px] transform -translate-y-1/2"
          viewBox="0 0 100 2"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="1"
            x2={`${calculateLineLength()}%`}
            y2="1"
            stroke="#4CAF50" // Green line color
            strokeWidth="2"
            strokeDasharray="100"
            strokeDashoffset="0"
            style={{
              transition:
                "stroke-dashoffset 0.5s ease-in-out, stroke 0.5s ease-in-out",
            }}
          />
        </svg>

        {/* Steps */}
        {steps.map((title, index) => (
          <div
            key={index}
            className={`relative px-3 py-1 rounded-md transition-all duration-500 ease-in-out transform ${
              step === index + 1
                ? "bg-purple-500 text-white font-bold scale-105 shadow-lg"
                : step > index + 1
                ? "bg-green-600 text-white font-bold scale-105 shadow-lg"
                : "bg-gray-200 text-gray-600 hover:scale-105 hover:bg-blue-100"
            }`}
            style={{
              transition:
                "transform 0.3s ease-in-out, background-color 0.3s ease-in-out",
            }}
          >
            {title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
