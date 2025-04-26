import React from "react";
import { Frown } from "lucide-react"; // Importing the Frown icon from Lucide
import { useNavigate } from "react-router-dom"; // For navigation, if using react-router-dom

function NotFound() {
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Function to go back to the homepage
  const goHome = () => {
    navigate("/dashboard"); // Navigate to the home page
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg w-80">
        <Frown className="text-6xl text-purple-500 mb-4" />{" "}
        {/* Using Lucide Frown Icon */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The page you’re looking for might have been moved or doesn’t exist.
        </p>
        <button
          onClick={goHome}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition duration-300"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;
