import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Check, Clock, X, Download } from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";

const LearnNow = () => {
  const { phaseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { phaseName } = location.state || {};
  const userId = localStorage.getItem("userId");

  const [learningContent, setLearningContent] = useState(null);
  const [activeTab, setActiveTab] = useState("content");
  const [completedSections, setCompletedSections] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState({});

  useEffect(() => {
    const fetchLearningContent = async () => {
      if (!phaseId) {
        setError("Phase ID is missing");
        setLoading(false);
        return;
      }
      if (!phaseName) {
        setError("Phase name is missing");
        setLoading(false);
        return;
      }
      if (!userId) {
        setError("User ID is missing. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/api/learning-content/${phaseId}`,
          {
            params: {
              phaseName: phaseName,
              userId: userId,
            },
          }
        );
        setLearningContent(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
        setLoading(false);
      }
    };

    fetchLearningContent();
  }, [phaseId, phaseName, userId]);

  const handleMarkComplete = (sectionId) => {
    if (completedSections.includes(sectionId)) {
      setCompletedSections(completedSections.filter((id) => id !== sectionId));
    } else {
      setCompletedSections([...completedSections, sectionId]);
    }
  };

  const toggleSectionCollapse = (sectionId) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleStartExercise = (exercise) => {
    setSelectedExercise(exercise);
  };

  const closeModal = () => {
    setSelectedExercise(null);
  };

  // Download content as PDF
  const handleDownload = () => {
    if (!learningContent?.content) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Set font and styling
    doc.setFont("helvetica");
    doc.setFontSize(16);

    // Add title
    doc.text(`Learning Content for ${phaseName}`, 20, 20);

    // Split content into lines for basic formatting
    const lines = learningContent.content.split("\n");
    let y = 30;
    let isListItem = false;

    lines.forEach((line) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      if (line.startsWith("# ")) {
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(line.replace("# ", ""), 20, y);
        y += 10;
      } else if (line.startsWith("## ")) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(line.replace("## ", ""), 20, y);
        y += 8;
      } else if (line.startsWith("### ")) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(line.replace("### ", ""), 20, y);
        y += 7;
      } else if (line.startsWith("- ")) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`• ${line.replace("- ", "")}`, 25, y);
        isListItem = true;
        y += 6;
      } else if (line.startsWith("```")) {
        // Skip code block delimiters
      } else if (line.trim() && !isListItem) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const wrappedText = doc.splitTextToSize(line, 170); // Wrap text within 170mm
        doc.text(wrappedText, 20, y);
        y += wrappedText.length * 5 + 5;
      } else {
        isListItem = false;
      }
    });

    // Save the PDF
    doc.save(
      `learning-content-${phaseName.replace(/\s+/g, "-").toLowerCase()}.pdf`
    );
  };

  // Mock exercises
  const mockExercises = [
    {
      id: 1,
      title: "Build a Simple Web Page",
      description:
        "Create a web page using HTML and CSS to practice structuring and styling content.",
      difficulty: "Beginner",
      estimatedTime: "30 mins",
      relatedContent: ["### HTML", "### CSS"],
    },
    {
      id: 2,
      title: "Interactive Button with JavaScript",
      description:
        "Add interactivity to a button using JavaScript event listeners.",
      difficulty: "Intermediate",
      estimatedTime: "45 mins",
      relatedContent: ["### JavaScript"],
    },
  ];

  // Mock notes
  const mockNotes = [
    {
      id: 1,
      title: "HTML Cheatsheet",
      topic: "HTML",
      content:
        "Key HTML tags: `<div>`, `<p>`, `<a>`, `<img>`. Use semantic elements like `<header>`, `<footer>` for accessibility.",
    },
    {
      id: 2,
      title: "CSS Best Practices",
      topic: "CSS",
      content:
        "Use relative units (%, vw, rem) for responsive design. Avoid !important for better maintainability.",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error || !learningContent) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold">
            {error || "No content available"}
          </h1>
          <button
            onClick={() => navigate("/roadmap")}
            className="mt-4 px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition"
          >
            Return to Roadmap
          </button>
        </div>
      </div>
    );
  }

  // Custom Markdown renderers
  const markdownRenderers = {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold text-white mt-6">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold text-white mt-6">{children}</h2>
    ),
    h3: ({ children }) => {
      const sectionId = children.toString().toLowerCase().replace(/\s+/g, "-");
      return (
        <div className="flex justify-between items-center mt-4">
          <h3
            className="text-xl font-semibold text-white cursor-pointer"
            onClick={() => toggleSectionCollapse(sectionId)}
          >
            {children}
          </h3>
          <button
            onClick={() => handleMarkComplete(sectionId)}
            className={`p-1.5 rounded-full ${
              completedSections.includes(sectionId)
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      );
    },
    p: ({ children }) => <p className="text-gray-300 mt-2">{children}</p>,
    ul: ({ children }) => (
      <ul className="list-disc pl-5 space-y-1 text-gray-300">{children}</ul>
    ),
    code: ({ node, inline, className, children, ...props }) =>
      inline ? (
        <code className="bg-gray-800 text-red-400 px-1 rounded">
          {children}
        </code>
      ) : (
        <pre className="bg-gray-800 p-4 rounded mt-2">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      ),
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <button
              onClick={() => navigate("/roadmap")}
              className="flex items-center text-gray-400 hover:text-white mb-4 transition"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Roadmap
            </button>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 bg-clip-text text-transparent"
            >
              Learning: {phaseName}
            </motion.h1>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition text-sm font-medium"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "content"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("content")}
          >
            Learning Content
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "exercises"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("exercises")}
          >
            Practice Exercises
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "notes"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("notes")}
          >
            Study Notes
          </button>
        </div>

        {/* Content based on active tab */}
        <div className="space-y-4">
          {activeTab === "content" && (
            <>
              <h2 className="text-xl font-semibold mb-4">Learning Content</h2>
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown components={markdownRenderers}>
                  {learningContent.content
                    .split("## Recommended Courses")[0]
                    .split("### ")
                    .map((section, index) => {
                      if (index === 0) return section;
                      const sectionId = section
                        .split("\n")[0]
                        .toLowerCase()
                        .replace(/\s+/g, "-");
                      return collapsedSections[sectionId]
                        ? `### ${section.split("\n")[0]}`
                        : `### ${section}`;
                    })
                    .join("\n")}
                </ReactMarkdown>
              </div>

              {/* Recommended Courses */}
              {learningContent.courses &&
                learningContent.courses.length > 0 && (
                  <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-4">
                      Recommended Courses
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {learningContent.courses.map((course, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 border border-gray-700 rounded-lg bg-gray-800 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start">
                            <BookOpen className="w-5 h-5 text-blue-400 mr-3 mt-1" />
                            <div>
                              <h3 className="font-semibold text-lg bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 bg-clip-text text-transparent">
                                {course.title}
                              </h3>
                              <p className="text-gray-400 text-sm mt-1">
                                {course.platform} | {course.duration} |{" "}
                                {course.price}
                              </p>
                              <p className="text-gray-300 text-sm mt-2">
                                {course.description}
                              </p>
                              <div className="flex items-center mt-3 text-sm text-gray-400">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>{course.duration}</span>
                              </div>
                              <a
                                href={course.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-3 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition"
                              >
                                View Course
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
            </>
          )}

          {activeTab === "exercises" && (
            <>
              <h2 className="text-xl font-semibold mb-4">Practice Exercises</h2>
              {mockExercises.map((exercise) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-gray-700 rounded-lg bg-gray-800"
                >
                  <h3 className="font-semibold text-lg text-white">
                    {exercise.title}
                  </h3>
                  <p className="text-gray-300 text-sm mt-1">
                    {exercise.description}
                  </p>
                  <div className="flex items-center mt-3 text-sm text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{exercise.estimatedTime}</span>
                    <span className="mx-2">•</span>
                    <span className="px-2 py-0.5 rounded bg-gray-900 text-xs">
                      {exercise.difficulty}
                    </span>
                  </div>
                  <button
                    onClick={() => handleStartExercise(exercise)}
                    className="inline-block mt-3 px-4 py-1.5 bg-purple-600 hover:bg-purple-700 rounded text-sm font-medium transition"
                  >
                    Start Exercise
                  </button>
                </motion.div>
              ))}
            </>
          )}

          {activeTab === "notes" && (
            <>
              <h2 className="text-xl font-semibold mb-4">Study Notes</h2>
              {mockNotes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-gray-700 rounded-lg bg-gray-800"
                >
                  <h3 className="font-semibold text-lg text-white">
                    {note.title}
                  </h3>
                  <p className="text-gray-300 text-sm mt-1">{note.topic}</p>
                  <p className="text-gray-300 mt-2">{note.content}</p>
                </motion.div>
              ))}
            </>
          )}
        </div>

        {/* Exercise Modal */}
        {selectedExercise && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Related Content for {selectedExercise.title}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Related Content */}
              <h3 className="text-lg font-semibold mb-2">
                Related Learning Content
              </h3>
              {selectedExercise.relatedContent.length > 0 ? (
                selectedExercise.relatedContent.map((section, index) => {
                  const sectionContent = learningContent.content
                    .split("### ")
                    .find((s) => s.startsWith(section.replace("### ", "")));
                  return sectionContent ? (
                    <div
                      key={index}
                      className="p-4 border border-gray-700 rounded-lg mb-2 bg-gray-900"
                    >
                      <ReactMarkdown components={markdownRenderers}>
                        {`### ${sectionContent}`}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p key={index} className="text-gray-400">
                      Content not found for {section}.
                    </p>
                  );
                })
              ) : (
                <p className="text-gray-400">No related content available.</p>
              )}

              <button
                onClick={closeModal}
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm font-medium transition"
              >
                Proceed to Exercise
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnNow;
