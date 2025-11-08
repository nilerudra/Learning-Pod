import { useEffect, useState } from "react";

const FeatureCard = ({ icon, title, description, index }) => {
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
      className={`p-6 bg-gray-800 text-white rounded-lg shadow-md transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } hover:scale-105`}
    >
      <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mb-4 transition-all">
        <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent text-xl">
          {icon}
        </span>
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

export default FeatureCard;
