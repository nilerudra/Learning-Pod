import { useEffect, useState } from "react";

const CareerPathCard = ({
  icon,
  title,
  description,
  timeline,
  skills,
  darkMode,
}) => {
  // Animation state
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate entrance animation delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800 text-white" : "bg-blue-50"
      } p-6 rounded-lg transition-all duration-300 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } hover:shadow-lg`}
    >
      <div
        className={`text-xl ${
          darkMode
            ? "bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent"
            : "bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent"
        } mb-4`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p
        className={`${
          darkMode ? "text-gray-300" : "text-gray-600"
        } text-sm mb-4`}
      >
        {description}
      </p>
      <div className="mb-4">
        <div
          className={`flex items-center text-sm ${
            darkMode
              ? "bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent"
              : "bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent"
          } mb-1`}
        >
          <span className="mr-2">⭐</span>
          {timeline}
        </div>
      </div>
      <div>
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center mb-1 text-sm">
            <span
              className={`${darkMode ? "text-gray-400" : "text-gray-500"} mr-2`}
            >
              📌
            </span>
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerPathCard;
