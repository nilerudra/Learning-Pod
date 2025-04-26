"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLocation } from "react-router-dom";

const RoadmapTimeline = () => {
  const location = useLocation();
  const [roadmapData, setRoadmapData] = useState(
    location.state?.roadmap.roadmap || {
      roadmap: {
        title: "My Journey",
        overview: "Invalid response format.",
        phases: [],
      },
    }
  );

  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  const toggleStepCompletion = (phaseIndex, stepIndex) => {
    if (!roadmapData) return;

    const updatedRoadmap = { ...roadmapData };
    const phase = updatedRoadmap.phases[phaseIndex];

    if (!phase.completedSteps) {
      phase.completedSteps = [];
    }

    const stepPos = phase.completedSteps.indexOf(stepIndex);
    if (stepPos === -1) {
      phase.completedSteps.push(stepIndex);
    } else {
      phase.completedSteps.splice(stepPos, 1);
    }

    setRoadmapData(updatedRoadmap);
  };

  const calculatePhaseProgress = (phase) => {
    const actionableSteps = Array.isArray(phase.actionableSteps)
      ? phase.actionableSteps
      : [];
    const completedSteps = Array.isArray(phase.completedSteps)
      ? phase.completedSteps
      : [];
    return actionableSteps.length === 0
      ? 0
      : Math.round((completedSteps.length / actionableSteps.length) * 100);
  };

  const calculateOverallProgress = () => {
    if (!roadmapData?.phases) return 0;
    let totalSteps = 0;
    let totalCompletedSteps = 0;

    roadmapData.phases.forEach((phase) => {
      totalSteps += phase.actionableSteps.length;
      totalCompletedSteps += phase.completedSteps
        ? phase.completedSteps.length
        : 0;
    });

    return totalSteps > 0
      ? Math.round((totalCompletedSteps / totalSteps) * 100)
      : 0;
  };

  return (
    <div
      className="w-full bg-transparent font-sans md:px-10 transition-colors duration-200"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-10 px-4 md:px-8 lg:px-10">
        <h2 className="text-2xl md:text-4xl mb-4 max-w-5xl font-bold bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent">
          {roadmapData.title}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base max-w-full">
          {roadmapData.overview}
        </p>
        <div className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold py-2 text-gray-900 dark:text-gray-100">
              Overall Progress
            </h3>
            <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent dark:bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent font-semibold">
              {calculateOverallProgress()}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
            <motion.div
              className="bg-blue-500 dark:bg-blue-500 h-4"
              initial={{ width: "0%" }}
              animate={{ width: `${calculateOverallProgress()}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {roadmapData.phases &&
          roadmapData.phases.map((phase, index) => (
            <div
              key={index}
              className="flex justify-start pt-10 md:pt-26 md:gap-10"
            >
              <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
                <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center border border-gray-300 dark:border-gray-700">
                  <div className="h-4 w-4 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600" />
                </div>
                <h3 className="hidden md:block text-xl md:pl-20 md:text-3xl font-bold bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500  bg-clip-text text-transparent">
                  {phase.phaseName}
                </h3>
              </div>

              <div className="relative pl-20 pr-4 md:pl-4 w-full">
                <h3 className="md:hidden block text-2xl mb-4 text-left font-bold bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent dark:bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent">
                  {phase.phaseName}
                </h3>
                <div>
                  <p className="text-xs md:text-sm font-normal mb-4 text-gray-600 dark:text-gray-400">
                    {phase.description}
                  </p>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Phase Progress
                      </h4>
                      <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent dark:bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent font-semibold">
                        {calculatePhaseProgress(phase)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="bg-blue-500 dark:bg-blue-500 h-3"
                        initial={{ width: "0%" }}
                        animate={{ width: `${calculatePhaseProgress(phase)}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                  <h4 className="font-bold mb-3 text-gray-900 dark:text-gray-100">
                    Actionable Steps:
                  </h4>
                  <ul className="space-y-3">
                    {phase.actionableSteps.map((step, stepIndex) => (
                      <li
                        key={stepIndex}
                        className="flex items-center space-x-3"
                      >
                        <input
                          type="checkbox"
                          className="w-5 h-5 cursor-pointer accent-blue-500 dark:accent-blue-400 rounded"
                          checked={phase.completedSteps?.includes(stepIndex)}
                          onChange={() =>
                            toggleStepCompletion(index, stepIndex)
                          }
                        />
                        <span
                          className={
                            phase.completedSteps?.includes(stepIndex)
                              ? "line-through text-gray-500 dark:text-gray-500"
                              : "text-gray-800 dark:text-gray-200"
                          }
                        >
                          {step}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        <div
          style={{ height: height + "px" }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-gray-300 dark:via-gray-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-blue-500 via-blue-500 to-transparent dark:from-blue-500 dark:via-blue-500 from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default RoadmapTimeline;
