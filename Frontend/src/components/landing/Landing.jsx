import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import {
  auth,
  signInWithPopup,
  googleProvider,
  signOut,
} from "../../config/firebase";
import axios from "axios";
import { useNavigate } from "react-router";
import FeatureCard from "./FeatureCard";
import Footer from "../Footer";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Testimonials from "./Testimonials";

const LearningPod = () => {
  const [heroVisible, setHeroVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  // const { setUser } = useAuth();
  const phrases = ["Best Path", "AI Roadmap", "Success Plan", "Dream Journey"];
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const speed = 120;

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [tempUser, setTempUser] = useState(null);

  useEffect(() => {
    const currentWord = phrases[index];
    let timeout;

    if (!isDeleting) {
      // Typing effect
      if (text.length < currentWord.length) {
        timeout = setTimeout(() => {
          setText((prev) => prev + currentWord.charAt(prev.length));
        }, speed);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 900);
      }
    } else {
      // Deleting effect
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText((prev) => prev.slice(0, -1));
        }, speed / 2);
      } else {
        setIsDeleting(false);
        setIndex((prevIndex) => (prevIndex + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting]);

  useEffect(() => {
    // Entrance animations when component mounts
    const menuTimer = setTimeout(() => setMenuVisible(true), 100);
    const heroTimer = setTimeout(() => setHeroVisible(true), 300);

    return () => {
      clearTimeout(menuTimer);
      clearTimeout(heroTimer);
    };
  }, []);

  // Auth
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userData = {
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      };

      setTempUser(userData); // temporarily hold user data
      setShowRoleModal(true); // show modal to choose role
    } catch (error) {
      console.error("Login Failed:", error.message);
    }
  };

  const handleRoleSelect = async (role) => {
    try {
      const userData = { ...tempUser, role };

      const response = await axios.post(
        "https://learning-pod-e3wo.onrender.com/api/auth",
        userData
      );
      const serverUser = response.data.user;

      setUser(serverUser);
      localStorage.setItem("user", JSON.stringify(serverUser));
      localStorage.setItem("userId", serverUser._id);

      setShowRoleModal(false);
      navigate("/dashboard", { state: { user: serverUser } });
    } catch (error) {
      console.error("Role Selection Failed:", error.message);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gradient-to-r from-[#111827] via-[#1f2937] to-[#0f172a] text-white">
      {/* Navigation */}
      <nav
        className={`flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#111827] via-[#1f2937] to-[#0f172a] border-gray-200 border-b transition-all duration-300 ${
          menuVisible ? "opacity-100" : "opacity-0"
        } `}
      >
        <div className="flex items-center">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center mr-2 transition-colors`}
          >
            <DotLottieReact
              src="https://lottie.host/5e6005ef-41de-425b-b566-7585e8523a12/Q1nKp82ai4.lottie"
              loop
              autoplay
            />
          </div>
          <span className="text-lg font-bold uppercase tracking-wider bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent transition-colors">
            Learning Pod
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="px-4 py-2 rounded-md bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-semibold shadow-md hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </nav>

      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="bg-gradient-to-br from-[#1f2937] via-[#111827] to-[#0f172a] rounded-2xl p-6 w-[90%] max-w-sm text-center shadow-2xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 bg-clip-text text-transparent">
              Select Your Role
            </h2>

            <div className="flex justify-around">
              <button
                className="px-5 py-2 cursor-pointer rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 hover:from-violet-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-md"
                onClick={() => handleRoleSelect("student")}
              >
                Student
              </button>

              <button
                className="px-5 py-2 cursor-pointer rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-emerald-700 hover:to-green-700 transition-all transform hover:scale-105 shadow-md"
                onClick={() => handleRoleSelect("teacher")}
              >
                Teacher
              </button>
            </div>

            <p className="mt-5 text-sm text-gray-400">
              Choose your role to continue your journey 🚀
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative py-16 px-6 overflow-hidden bg-gray-800 transition-colors duration-300">
        <div
          className={`max-w-6xl mx-auto relative z-10 transition-all duration-700 transform ${
            heroVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-12 opacity-0"
          }`}
        >
          <div className="flex items-center mb-6">
            <span className="mr-2">✨</span>
            <span className="text-gray-300 transition-colors">
              AI-Powered Career Guidance
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h1 className="text-5xl font-bold mb-4">
                Discover Your <br />
                <span className="bg-gradient-to-tr from-purple-500 to-indigo-500 bg-clip-text text-transparent transition-colors text-5xl font-extrabold block mt-2">
                  {text}
                  <span className="animate-blink">|</span>{" "}
                </span>
              </h1>
              <p className="text-gray-300 text-lg mb-8 transition-colors">
                Let AI guide you to the perfect career path. Transform your
                future with data-driven direction.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleLogin}
                  className="px-6 py-3 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-semibold shadow-md hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  Start Your Journey <span className="ml-2">→</span>
                </button>
              </div>
            </div>

            <div className="flex justify-center align-center">
              <DotLottieReact
                src="https://lottie.host/df5d5f7e-0a9a-4f12-8a7d-ee534fc26b38/hVz0kBAEhR.lottie"
                background="transparent"
                speed="1"
                style={{ width: "400px", height: "400px", margin: "0 auto" }}
                loop
                autoplay
              ></DotLottieReact>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🎯"
              title="Career Path Suggestion"
              description="Get personalized career path recommendations based on your skills and interests."
              index={0}
            />

            <FeatureCard
              icon="📊"
              title="Salary Insights"
              description="Access real-time job market data and salary estimates for your chosen career path."
              index={1}
            />

            <FeatureCard
              icon="🗺️"
              title="Learning Roadmap"
              description="Follow a step-by-step guide to achieve your career goals with milestone tracking."
              index={2}
            />
          </div>
          <div>
            <Testimonials />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LearningPod;
