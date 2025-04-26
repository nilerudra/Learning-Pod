import React, { useContext, useEffect, useState, useRef } from "react";
import { ThemeContext } from "../context/ThemeContext";
import {
  Sun,
  Moon,
  Home,
  Shield,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useNavigate } from "react-router";
import GoogleTranslate from "./GoogleTranslate";

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for dropdown
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user data
    setUser(null);
    setIsOpen(false);
    window.location.href = "/"; // Redirect to home
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 py-3 border-b-1 border-gray-300
      backdrop-blur-md transition-all duration-300 z-1000
      ${theme === "dark" ? "text-white" : "text-gray-900"}`}
    >
      <div className="flex items-center">
        <div
          className={`w-10 h-10  rounded-lg flex items-center justify-center mr-2 transition-colors`}
        >
          <DotLottieReact
            src="https://lottie.host/5e6005ef-41de-425b-b566-7585e8523a12/Q1nKp82ai4.lottie"
            loop
            autoplay
          />
        </div>
        <span
          className={`text-xl font-bold ${
            theme === "dark"
              ? "bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent"
              : "text-blue-600"
          } transition-colors`}
        >
          Learning Pod
        </span>
      </div>

      <div className="flex items-center gap-x-4 relative">
        <GoogleTranslate />
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full cursor-pointer ${
            theme === "dark"
              ? "bg-gray-700 text-yellow-300"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <img
              src={user.photo}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && (
              <div className="absolute right-0 mt-4 w-54 shadow-md shadow-gray-300 rounded-lg p-2 bg-white text-black">
                <div className="p-3 border-b-1 border-gray-300">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
                <ul className="flex flex-col p-2">
                  <li
                    className="py-2 px-4 flex items-center gap-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => navigate("/dashboard")}
                  >
                    <Home size={18} /> Home
                  </li>
                  <li className="py-2 px-4 flex items-center gap-2 hover:bg-gray-200 cursor-pointer">
                    <Shield size={18} /> Privacy
                  </li>
                  <li className="py-2 px-4 flex items-center gap-2 hover:bg-gray-200 cursor-pointer">
                    <Settings size={18} /> Settings
                  </li>
                  <li className="py-2 px-4 flex items-center gap-2 hover:bg-gray-200 cursor-pointer">
                    <HelpCircle size={18} /> Help
                  </li>
                </ul>
                <div
                  className="py-2 px-4 flex items-center gap-2 text-red-500 hover:bg-red-50 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut size={18} /> Logout
                </div>
              </div>
            )}
          </div>
        ) : (
          <button>Login</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
