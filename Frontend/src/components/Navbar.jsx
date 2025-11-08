import React, { useContext, useEffect, useState, useRef } from "react";
import { ThemeContext } from "../context/ThemeContext";
import {
  Sun,
  Moon,
  Home,
  Settings,
  HelpCircle,
  LogOut,
  User,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useNavigate } from "react-router";

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
      className={`fixed top-0 left-0 min-w-xs md:w-full flex items-center justify-between px-6 py-3 border-b-1 border-gray-300
      backdrop-blur-md transition-all duration-300 z-1000
      ${theme === "dark" ? "text-white" : "text-gray-900"}`}
    >
      <div className="flex items-center">
        <div
          className={`w-6 h-6 md:w-10 md:h-10  rounded-lg flex items-center justify-center mr-2 transition-colors`}
        >
          <DotLottieReact
            src="https://lottie.host/5e6005ef-41de-425b-b566-7585e8523a12/Q1nKp82ai4.lottie"
            loop
            autoplay
          />
        </div>
        <span className="text-sm md:text-lg font-bold uppercase tracking-wider bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 bg-clip-text text-transparent transition-colors">
          Learning Pod
        </span>
      </div>

      <div className="flex items-center relative">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <img
              src={user.photo}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && (
              <div className="absolute right-0 mt-4 w-56 rounded-xl shadow-lg shadow-[#0f172a]/70 bg-gradient-to-br from-[#1f2937] via-[#111827] to-[#0f172a] border border-gray-700 text-gray-200 backdrop-blur-md transition-all duration-300">
                <div className="p-3 border-b border-gray-700">
                  <p className="font-semibold text-white">{user.name}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>

                <ul className="flex flex-col p-2">
                  <li
                    className="py-2 px-4 flex items-center gap-2 rounded-md hover:bg-gradient-to-r from-violet-600 to-blue-600 hover:text-white transition-all cursor-pointer"
                    onClick={() => {
                      navigate("/dashboard");
                      setIsOpen(!isOpen);
                    }}
                  >
                    <Home size={18} /> Dashboard
                  </li>
                  <li
                    onClick={() => {
                      navigate("/profile");
                      setIsOpen(!isOpen);
                    }}
                    className="py-2 px-4 flex items-center gap-2 rounded-md hover:bg-gradient-to-r from-violet-600 to-blue-600 hover:text-white transition-all cursor-pointer"
                  >
                    <User size={18} /> View Profile
                  </li>
                  <li className="py-2 px-4 flex items-center gap-2 rounded-md hover:bg-gradient-to-r from-violet-600 to-blue-600 hover:text-white transition-all cursor-pointer">
                    <Settings size={18} /> Settings
                  </li>
                  <li className="py-2 px-4 flex items-center gap-2 rounded-md hover:bg-gradient-to-r from-violet-600 to-blue-600 hover:text-white transition-all cursor-pointer">
                    <HelpCircle size={18} /> Help
                  </li>
                </ul>

                <div
                  className="py-2 px-4 flex items-center gap-2 rounded-md text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-all cursor-pointer"
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
