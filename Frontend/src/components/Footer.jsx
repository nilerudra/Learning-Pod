import React, { useContext } from "react";
import { Facebook, Twitter, Linkedin, Github } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

const Footer = () => {
  const theme = useContext(ThemeContext);
  return (
    <footer
      className={`bg-gray-100 dark:bg-gray-900 py-6 border-t ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col  md:flex-row items-center justify-between">
        {/* Left Section - Brand & Copyright */}
        <div className="text-gray-600 dark:text-gray-400 text-center md:text-left">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Team Vikrant
          </h2>
          <p className="text-sm">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        {/* Middle Section - Navigation Links */}
        <ul className="flex gap-4 mt-4 md:mt-0">
          <li>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600"
            >
              Careers
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600"
            >
              Contact
            </a>
          </li>
        </ul>

        {/* Right Section - Social Media Icons */}
        <div className="flex gap-4 mt-4 md:mt-0">
          <a
            href="#"
            className="text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent"
          >
            <Facebook size={20} />
          </a>
          <a
            href="#"
            className="text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent"
          >
            <Twitter size={20} />
          </a>
          <a
            href="#"
            className="text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="#"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-700"
          >
            <Github size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
