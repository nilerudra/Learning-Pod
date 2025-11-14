import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

const Roadmap = () => {
  const { id } = useParams();
  const [roadmapData, setRoadmapData] = useState(null);
  const [roadmapId, setRoadmapId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizEligibility, setQuizEligibility] = useState({});
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // debounce timers per phase
  const progressTimers = useRef({});

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = id
          ? `https://learning-pod-e3wo.onrender.com/api/roadmap/full/${id}`
          : `https://learning-pod-e3wo.onrender.com/api/roadmap/${userId}`;

        const res = await axios.get(url);
        const data = res.data;

        let doc = null;
        if (Array.isArray(data)) {
          doc = data[0];
        } else {
          doc = data;
        }

        if (!doc) throw new Error("No roadmap returned from API");

        let nestedRoadmap = null;
        if (doc.roadmap) {
          nestedRoadmap = doc.roadmap;
          setRoadmapId(doc._id || null);
        } else if (doc.phases) {
          nestedRoadmap = doc;
          setRoadmapId(null);
        } else {
          throw new Error("Unexpected roadmap structure from server");
        }

        setRoadmapData(nestedRoadmap);

        const eligibility = {};
        (nestedRoadmap.phases || []).forEach((phase, idx) => {
          eligibility[idx] =
            (phase.completedSteps?.length || 0) ===
            (phase.actionableSteps?.length || 0);
        });
        setQuizEligibility(eligibility);
      } catch (err) {
        console.error("fetchRoadmap error:", err.response?.data || err.message);
        setError(
          err.response?.data?.message || err.message || "Error fetching roadmap"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [id, userId]);

  // Save progress to backend: requires roadmapId to exist
  const saveProgress = async (
    phaseIndex,
    completedSteps,
    quizCompleted = false
  ) => {
    if (!roadmapId) {
      console.warn(
        "No roadmapId available — cannot save progress. roadmapId:",
        roadmapId
      );
      return;
    }

    try {
      await axios.post(
        `https://learning-pod-e3wo.onrender.com/api/roadmap/progress/${roadmapId}`,
        { phaseIndex, completedSteps, quizCompleted },
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      console.error("saveProgress error:", err.response?.data || err.message);
    }
  };

  const toggleStepCompletion = (phaseIndex, stepIndex) => {
    if (!roadmapData?.phases) return;

    const newRoadmap = {
      ...roadmapData,
      phases: roadmapData.phases.map((p) => ({ ...p })),
    };

    const phase = newRoadmap.phases[phaseIndex];
    if (!phase) return;

    phase.completedSteps = Array.isArray(phase.completedSteps)
      ? [...phase.completedSteps]
      : [];

    const pos = phase.completedSteps.indexOf(stepIndex);
    if (pos === -1) phase.completedSteps.push(stepIndex);
    else phase.completedSteps.splice(pos, 1);

    setRoadmapData(newRoadmap);

    const newEligibility = { ...quizEligibility };
    newEligibility[phaseIndex] =
      phase.completedSteps.length === (phase.actionableSteps?.length || 0);
    setQuizEligibility(newEligibility);

    if (progressTimers.current[phaseIndex])
      clearTimeout(progressTimers.current[phaseIndex]);
    progressTimers.current[phaseIndex] = setTimeout(() => {
      saveProgress(
        phaseIndex,
        phase.completedSteps,
        newEligibility[phaseIndex]
      );
    }, 1500);
  };

  const calculatePhaseProgress = (phase) =>
    Math.round(
      ((phase.completedSteps?.length || 0) /
        (phase.actionableSteps?.length || 1)) *
        100
    );

  const calculateOverallProgress = () => {
    if (!roadmapData?.phases) return 0;
    let total = 0;
    let done = 0;
    roadmapData.phases.forEach((p) => {
      total += p.actionableSteps?.length || 0;
      done += p.completedSteps?.length || 0;
    });
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  const handleCreatePod = (phaseIndex) => {
    if (!roadmapData?.phases) return;
    alert(
      `Creating learning pod for: ${roadmapData.phases[phaseIndex].phaseName}`
    );
  };

  const handleLearnNow = (phaseIndex) => {
    if (!roadmapData?.phases) return;
    navigate(`/learn/${phaseIndex}`, {
      state: {
        phaseData: roadmapData.phases[phaseIndex],
        phaseName: roadmapData.phases[phaseIndex].phaseName,
      },
    });
  };

  const handleTakeQuiz = (phaseIndex) => {
    if (!roadmapData?.phases) return;
    // Save quizCompleted immediately (if we have roadmapId)
    const phase = roadmapData.phases[phaseIndex];
    if (phase) saveProgress(phaseIndex, phase.completedSteps || [], true);
    navigate(`/quiz/${phaseIndex}`, {
      state: { phaseData: phase, phaseName: phase?.phaseName },
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 text-2xl font-semibold p-10">
        {error}
      </div>
    );

  if (!roadmapData)
    return (
      <div className="text-center text-gray-400 text-xl">
        No roadmap data available.
      </div>
    );

  // UI uses roadmapData (nested) as before
  return (
    <div className="min-h-screen  text-white px-4 py-6 overflow-x-hidden">
      <motion.div className="max-w-4xl w-full mx-auto">
        {/* Heading */}
        <h1
          className="md:text-5xl text-3xl font-bold mb-4 
      bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 
      bg-clip-text text-transparent"
        >
          Your Learning Roadmap
        </h1>

        <p className="md:text-sm text-xs text-gray-400 mb-6">
          {roadmapData.overview}
        </p>

        {/* Overall Progress */}
        <div className="mb-8 bg-[#111827]/60 p-4 rounded-xl border border-gray-700 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <h2 className="text-lg font-semibold">Overall Progress</h2>
            <span
              className="bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 
          bg-clip-text text-transparent font-semibold"
            >
              {calculateOverallProgress()}%
            </span>
          </div>

          <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
            <motion.div
              className="h-4 bg-gradient-to-r from-purple-500 to-blue-500"
              initial={{ width: "0%" }}
              animate={{ width: `${calculateOverallProgress()}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* PHASES */}
        {roadmapData.phases.map((phase, idx) => (
          <motion.div
            key={idx}
            className="mb-10 p-5 rounded-2xl border border-gray-700 
        bg-[#111827]/60 backdrop-blur-md shadow-xl"
          >
            {/* Phase Header */}
            <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
              <h2 className="text-xl font-semibold text-purple-400">
                {phase.phaseName}
              </h2>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCreatePod(idx)}
                  className="px-4 py-1.5 rounded-md text-sm font-medium
              bg-gradient-to-r from-purple-600 to-purple-700 hover:opacity-80 transition"
                >
                  Create Pod
                </button>

                <button
                  onClick={() => handleLearnNow(idx)}
                  className="px-4 py-1.5 rounded-md text-sm font-medium
              bg-gradient-to-r from-green-600 to-green-700 hover:opacity-80 transition"
                >
                  Learn Now
                </button>
              </div>
            </div>

            <p className="text-gray-400 md:text-sm text-xs mb-4">
              {phase.description}
            </p>

            {/* Phase Progress */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-md font-semibold">Phase Progress</h4>
                <span className="text-teal-400 font-semibold">
                  {calculatePhaseProgress(phase)}%
                </span>
              </div>

              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-3 bg-gradient-to-r from-teal-500 to-teal-400"
                  initial={{ width: "0%" }}
                  animate={{ width: `${calculatePhaseProgress(phase)}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>

            {/* Steps */}
            <h4 className="font-bold mb-2">Actionable Steps:</h4>
            <ul className="space-y-2">
              {phase.actionableSteps.map((step, stepIdx) => (
                <li key={stepIdx} className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-purple-500 cursor-pointer"
                    checked={phase.completedSteps?.includes(stepIdx)}
                    onChange={() => toggleStepCompletion(idx, stepIdx)}
                  />

                  <span
                    className={`text-gray-300 md:text-sm text-xs ${
                      phase.completedSteps?.includes(stepIdx)
                        ? "line-through"
                        : ""
                    }`}
                  >
                    {step}
                  </span>
                </li>
              ))}
            </ul>

            {/* Quiz */}
            {quizEligibility[idx] && (
              <button
                onClick={() => handleTakeQuiz(idx)}
                className="w-full mt-5 px-4 py-2 rounded-md font-medium
            bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-80 transition"
              >
                Take Quiz
              </button>
            )}

            <hr className="border-gray-700 my-5" />

            {/* Recommended Courses */}
            {phase.recommendedCourses && (
              <>
                <h4 className="font-bold mb-3">Recommended Courses:</h4>
                <ul className="space-y-3">
                  {phase.recommendedCourses.map((course, i) => (
                    <li
                      key={i}
                      className="p-3 rounded-lg border border-gray-700 bg-[#0f172a]"
                    >
                      <a
                        href={course.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold bg-gradient-to-r from-purple-400 to-blue-400 
                    bg-clip-text text-transparent"
                      >
                        {course.title}
                      </a>

                      <p className="text-gray-400 text-xs mt-1">
                        {course.platform} | {course.duration} | {course.price}
                      </p>
                    </li>
                  ))}
                </ul>

                <hr className="border-gray-700 my-5" />
              </>
            )}

            {/* Industry Trends */}
            <h4 className="font-bold">Industry Trends:</h4>
            <p className="text-gray-300 text-sm mt-2">{phase.industryTrends}</p>
          </motion.div>
        ))}

        {/* Additional Resources */}
        {roadmapData.additionalResources && (
          <motion.div className="p-5 rounded-2xl border border-gray-700 bg-[#111827]/60 shadow-xl backdrop-blur-md">
            <h2 className="text-xl font-semibold text-yellow-400">
              Additional Resources
            </h2>

            <p className="text-gray-300 text-sm mt-4">
              <strong className="text-white">Mentorship:</strong>{" "}
              {roadmapData.additionalResources.mentorship}
            </p>

            <p className="text-gray-300 text-sm mt-4">
              <strong className="text-white">Community Support:</strong>{" "}
              {roadmapData.additionalResources.communitySupport}
            </p>

            <p className="text-gray-300 text-sm mt-4">
              <strong className="text-white">Job Search Strategies:</strong>{" "}
              {roadmapData.additionalResources.jobSearchStrategies}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Roadmap;
