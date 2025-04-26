import React, { useContext } from "react";
import {
  ArrowRight,
  PenTool,
  Briefcase,
  BarChart,
  MapPin,
  BriefcaseBusiness,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const careers = [
  {
    title: "UX Designer",
    category: "Technology",
    match: 95,
    salary: "$75k - $120k",
    location: "Remote",
    jobType: "Full-Time",
    icon: <PenTool size={24} className="text-purple-400" />,
  },
  {
    title: "Product Manager",
    category: "Software",
    match: 88,
    salary: "$90k - $150k",
    location: "San Francisco, CA",
    jobType: "Hybrid",
    icon: <Briefcase size={24} className="text-purple-400" />,
  },
  {
    title: "Data Analyst",
    category: "Analytics",
    match: 82,
    salary: "$65k - $95k",
    location: "New York, NY",
    jobType: "On-Site",
    icon: <BarChart size={24} className="text-purple-400" />,
  },
];

const CareerCard = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="text-gray-900 dark:text-white rounded-2xl shadow-lg p-6 mt-6 w-full max-w-xl transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2
          className={`text-2xl font-bold tracking-wide ${
            theme === "dark" ? "text-gray-300" : "text-black"
          }`}
        >
          Recommended Careers
        </h2>
        <a
          href="#"
          className="bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent font-medium hover:underline transition-all duration-300"
        >
          View All
        </a>
      </div>

      {/* Career List */}
      <div
        className={`space-y-4 ${
          theme === "dark" ? "text-gray-300" : "text-black"
        }`}
      >
        {careers.map((career, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-center sm:justify-between p-5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 shadow-md cursor-pointer hover:shadow-blue-500/50 hover:scale-103 hover:text-white"
          >
            {/* Left Section */}
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 text-center sm:text-left w-full bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent">
              <div className="p-3 rounded-xl shadow-md bg-opacity-30 dark:bg-opacity-30 ">
                {career.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{career.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {career.category}
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start items-center text-gray-500 dark:text-gray-400 text-xs mt-1 space-x-2">
                  <MapPin size={14} className="mr-1" /> {career.location}
                  <span>•</span>
                  <BriefcaseBusiness size={14} className="mr-1" />{" "}
                  {career.jobType}
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="text-center sm:text-right mt-3 sm:mt-0 flex flex-col items-center sm:items-end">
              <p className="font-semibold bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent dark:bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent">
                {career.match}% Match
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {career.salary}
              </p>
              <div className="w-24 h-1 mt-1 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-1 bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-500"
                  style={{ width: `${career.match}%` }}
                ></div>
              </div>
            </div>

            {/* Arrow - Positioned below for mobile, right for larger screens */}
            <ArrowRight className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-all duration-300 mt-3 sm:mt-0 sm:ml-4 sm:self-auto self-center" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerCard;
