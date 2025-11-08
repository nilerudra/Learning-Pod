import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

const Roadmap = () => {
  const { id } = useParams(); // optional roadmap document id in URL
  const [roadmapData, setRoadmapData] = useState(null); // nested roadmap object (what your UI expects)
  const [roadmapId, setRoadmapId] = useState(null); // MongoDB document _id
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
          ? `http://localhost:8000/api/roadmap/full/${id}`
          : `http://localhost:8000/api/roadmap/${userId}`;

        const res = await axios.get(url);
        const data = res.data;

        // data shape possibilities:
        // 1) full doc: { _id, userId, userName, roadmap: { ... } }
        // 2) array of full docs (for /:userId): [ { _id, roadmap: { ... } }, ... ]
        // 3) nested roadmap only (if backend returned roadmap directly) - handle but rare

        let doc = null;
        if (Array.isArray(data)) {
          doc = data[0]; // latest roadmaps route returns array
        } else {
          doc = data;
        }

        if (!doc) throw new Error("No roadmap returned from API");

        // If doc has .roadmap (full doc) use that, else if doc itself looks like roadmap, use it
        let nestedRoadmap = null;
        if (doc.roadmap) {
          nestedRoadmap = doc.roadmap;
          setRoadmapId(doc._id || null);
        } else if (doc.phases) {
          // doc already is the nested roadmap (no _id)
          nestedRoadmap = doc;
          setRoadmapId(null); // backend id unknown in this case
        } else {
          throw new Error("Unexpected roadmap structure from server");
        }

        // Set UI state
        setRoadmapData(nestedRoadmap);

        // init quiz eligibility
        const eligibility = {};
        (nestedRoadmap.phases || []).forEach((phase, idx) => {
          eligibility[idx] = (phase.completedSteps?.length || 0) === (phase.actionableSteps?.length || 0);
        });
        setQuizEligibility(eligibility);
      } catch (err) {
        console.error("fetchRoadmap error:", err.response?.data || err.message);
        setError(err.response?.data?.message || err.message || "Error fetching roadmap");
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [id, userId]);

  // Save progress to backend: requires roadmapId to exist
  const saveProgress = async (phaseIndex, completedSteps, quizCompleted = false) => {
    if (!roadmapId) {
      console.warn("No roadmapId available — cannot save progress. roadmapId:", roadmapId);
      return;
    }

    try {
      await axios.post(
        `http://localhost:8000/api/roadmap/progress/${roadmapId}`,
        { phaseIndex, completedSteps, quizCompleted },
        { headers: { "Content-Type": "application/json" } }
      );
      // optionally show a toast or set saved flag here
      // console.log("Saved progress for phase", phaseIndex);
    } catch (err) {
      console.error("saveProgress error:", err.response?.data || err.message);
    }
  };

  // Toggle completion for a step (works with roadmapData.phases)
  const toggleStepCompletion = (phaseIndex, stepIndex) => {
    if (!roadmapData?.phases) return; // defensive

    // Immutable update: copy roadmapData and phases
    const newRoadmap = {
      ...roadmapData,
      phases: roadmapData.phases.map((p) => ({ ...p })),
    };

    const phase = newRoadmap.phases[phaseIndex];
    if (!phase) return;

    // ensure completedSteps exists and is a copy
    phase.completedSteps = Array.isArray(phase.completedSteps) ? [...phase.completedSteps] : [];

    const pos = phase.completedSteps.indexOf(stepIndex);
    if (pos === -1) phase.completedSteps.push(stepIndex);
    else phase.completedSteps.splice(pos, 1);

    // set updated roadmapData (nested object)
    setRoadmapData(newRoadmap);

    // update eligibility
    const newEligibility = { ...quizEligibility };
    newEligibility[phaseIndex] = phase.completedSteps.length === (phase.actionableSteps?.length || 0);
    setQuizEligibility(newEligibility);

    // Debounce save to backend (if we have roadmapId)
    if (progressTimers.current[phaseIndex]) clearTimeout(progressTimers.current[phaseIndex]);
    progressTimers.current[phaseIndex] = setTimeout(() => {
      saveProgress(phaseIndex, phase.completedSteps, newEligibility[phaseIndex]);
    }, 1500);
  };

  const calculatePhaseProgress = (phase) =>
    Math.round(((phase.completedSteps?.length || 0) / (phase.actionableSteps?.length || 1)) * 100);

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
    alert(`Creating learning pod for: ${roadmapData.phases[phaseIndex].phaseName}`);
  };

  const handleLearnNow = (phaseIndex) => {
    if (!roadmapData?.phases) return;
    navigate(`/learn/${phaseIndex}`, {
      state: { phaseData: roadmapData.phases[phaseIndex], phaseName: roadmapData.phases[phaseIndex].phaseName },
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

  // Loading / error UI
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
      </div>
    );

  if (error) return <div className="text-center text-red-500 text-2xl font-semibold p-10">{error}</div>;

  if (!roadmapData) return <div className="text-center text-gray-400 text-xl">No roadmap data available.</div>;

  // UI uses roadmapData (nested) as before
  return (
    <div className="min-h-screen bg-transparent text-white p-6">
      <motion.div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 bg-clip-text text-transparent">
          Your Learning Roadmap
        </h1>

        <p className="text-gray-400 mb-6">{roadmapData.overview}</p>

        {/* Overall Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Overall Progress</h2>
            <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 bg-clip-text text-transparent font-semibold">
              {calculateOverallProgress()}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <motion.div
              className="bg-blue-500 h-4"
              initial={{ width: "0%" }}
              animate={{ width: `${calculateOverallProgress()}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Phases */}
        {roadmapData.phases.map((phase, idx) => (
          <motion.div key={idx} className="mb-12 p-4 border border-gray-700 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-teal-600">{phase.phaseName}</h2>
              <div className="flex space-x-3">
                <button onClick={() => handleCreatePod(idx)} className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition">
                  Create Pod
                </button>
                <button onClick={() => handleLearnNow(idx)} className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition">
                  Learn Now
                </button>
              </div>
            </div>

            <p className="text-gray-400 mb-4">{phase.description}</p>

            {/* Phase progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold">Phase Progress</h4>
                <span className="text-teal-400 font-semibold">{calculatePhaseProgress(phase)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div className="bg-teal-500 h-3" initial={{ width: "0%" }} animate={{ width: `${calculatePhaseProgress(phase)}%` }} transition={{ duration: 1 }} />
              </div>
            </div>

            {/* Actionable steps */}
            <h4 className="font-bold mb-2">Actionable Steps:</h4>
            <ul className="space-y-2">
              {phase.actionableSteps.map((step, stepIdx) => (
                <li key={stepIdx} className="flex items-center space-x-3">
                  <input type="checkbox" className="w-5 h-5 cursor-pointer accent-teal-500" checked={phase.completedSteps?.includes(stepIdx)} onChange={() => toggleStepCompletion(idx, stepIdx)} />
                  <span className={phase.completedSteps?.includes(stepIdx) ? "line-through text-gray-400" : "text-gray-400"}>{step}</span>
                </li>
              ))}
            </ul>

            {/* Quiz button */}
            {quizEligibility[idx] && (
              <div className="mt-4 flex justify-end">
                <button onClick={() => handleTakeQuiz(idx)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition w-[40%] text-center">
                  Take Quiz
                </button>
              </div>
            )}

            {/* Recommended courses */}
            {phase.recommendedCourses && (
              <>
                <h4 className="font-bold mt-4">Recommended Courses:</h4>
                <ul className="space-y-2">
                  {phase.recommendedCourses.map((course, i) => (
                    <li key={i} className="border p-3 rounded-md border-gray-700">
                      <a href={course.link} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 bg-clip-text text-transparent font-semibold">
                        {course.title}
                      </a>
                      <p className="text-gray-400 text-sm">{course.platform} | {course.duration} | {course.price}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h4 className="font-bold mt-4">Industry Trends:</h4>
            <p className="text-gray-400">{phase.industryTrends}</p>
          </motion.div>
        ))}

        {/* Additional resources */}
        {roadmapData.additionalResources && (
          <motion.div className="p-4 border border-gray-700 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-2">Additional Resources</h2>
            <p className="text-gray-400"><strong>Mentorship:</strong> {roadmapData.additionalResources.mentorship}</p>
            <p className="text-gray-400"><strong>Community Support:</strong> {roadmapData.additionalResources.communitySupport}</p>
            <p className="text-gray-400"><strong>Job Search Strategies:</strong> {roadmapData.additionalResources.jobSearchStrategies}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Roadmap;
