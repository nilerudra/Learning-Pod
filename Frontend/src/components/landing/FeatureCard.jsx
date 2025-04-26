import { useEffect, useState } from "react";

const FeatureCard = ({ icon, title, description, index, darkMode }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Staggered animation for feature cards
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200 * index);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`p-6 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white"
      } rounded-lg shadow-md transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } hover:scale-105`}
    >
      <div
        className={`w-12 h-12 ${
          darkMode ? "bg-blue-900" : "bg-blue-100"
        } rounded-full flex items-center justify-center mb-4 transition-all`}
      >
        <span
          className={`${
            darkMode
              ? "bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent"
              : "bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent"
          } text-xl`}
        >
          {icon}
        </span>
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
