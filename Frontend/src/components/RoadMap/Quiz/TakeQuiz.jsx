import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  X,
  Download,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsPDF } from "jspdf";

const TakeQuiz = () => {
  const { phaseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { phaseName } = location.state || {};
  const userId = localStorage.getItem("userId");

  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState(""); // success, error, warning
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  // Progress calculation
  const progress = quizData
    ? Math.round(
        (Object.keys(userAnswers).length / quizData.questions.length) * 100
      )
    : 0;

  useEffect(() => {
    const generateQuiz = async () => {
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
        // Mock phase context based on phaseName
        const phaseContext = {
          topics: phaseName.includes("Beginner")
            ? [
                "HTML",
                "CSS",
                "JavaScript",
                "Responsive Design",
                "Git",
                "VS Code",
              ]
            : phaseName.includes("Intermediate")
            ? ["React", "Node.js", "APIs", "Databases", "Express"]
            : ["Next.js", "DevOps", "Web3", "Microservices"],
          description: `Learn foundational skills for ${phaseName.toLowerCase()}.`,
        };

        // Initialize Gemini API
        const genAI = new GoogleGenerativeAI(
          import.meta.env.VITE_GEMINI_API_KEY
        );
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Generate quiz
        const quizPrompt = `
  Generate a quiz with exactly 10 multiple-choice questions (4 options each, one correct answer) for the '${phaseName}' phase. The quiz should test understanding of key topics: ${phaseContext.topics.join(
          ", "
        )}. Tailor difficulty to the phase (e.g., simple for beginners, complex for experts).
  
  **Required Structure:**
  {
    "questions": [
      {
        "id": 1,
        "question": "Question text here",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswer": "Option 1"
      },
      ...
    ]
  }
  
  **Guidelines:**
  - Ensure exactly 10 questions, numbered 1 to 10.
  - Questions should be clear, concise, and cover all topics.
  - Options should be plausible, with one correct answer.
  - Return only a pure JSON object without any markdown formatting or extra explanation.
  `;

        const quizResult = await model.generateContent(quizPrompt);
        const quizText = await quizResult.response.text();

        // Log raw response for debugging (optional)
        console.log("Raw quiz text:", quizText);

        // Helper to extract JSON from raw string
        const extractJson = (text) => {
          const jsonStart = text.indexOf("{");
          const jsonEnd = text.lastIndexOf("}");
          if (jsonStart === -1 || jsonEnd === -1) {
            throw new Error("No JSON object found in response");
          }
          const jsonString = text.substring(jsonStart, jsonEnd + 1);
          return JSON.parse(jsonString);
        };

        let quizData;
        try {
          quizData = extractJson(quizText);
        } catch (parseError) {
          console.error("Error parsing quiz response:", parseError.message);
          throw new Error("Failed to parse quiz data");
        }

        // Validate quiz data
        if (!quizData.questions || quizData.questions.length !== 10) {
          throw new Error("Invalid quiz format: Expected 10 questions");
        }
        for (const question of quizData.questions) {
          if (
            !question.id ||
            !question.question ||
            !Array.isArray(question.options) ||
            question.options.length !== 4 ||
            !question.correctAnswer ||
            !question.options.includes(question.correctAnswer)
          ) {
            throw new Error("Invalid question format");
          }
        }

        setQuizData(quizData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    generateQuiz();
  }, [phaseId, phaseName, userId]);

  const showToastNotification = (message, type = "warning") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleAnswerSelect = (questionId, answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (!userAnswers[quizData.questions[currentQuestionIndex].id]) {
      showToastNotification(
        "Please select an answer before proceeding.",
        "warning"
      );
      return;
    }
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(userAnswers).length !== quizData.questions.length) {
      // Count unanswered questions
      const answered = Object.keys(userAnswers).length;
      const total = quizData.questions.length;
      const remaining = total - answered;

      showToastNotification(
        `Please answer all questions before submitting. (${remaining} remaining)`,
        "error"
      );
      return;
    }

    // Calculate score
    let correctCount = 0;
    quizData.questions.forEach((question) => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);

    // Generate interview questions - FIX: Modified to handle parsing issues
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const interviewPrompt = `
        Generate exactly 50 interview questions for a candidate preparing for a role related to the '${phaseName}' phase. 
        The questions should cover key topics: ${
          phaseName.includes("Beginner")
            ? "HTML, CSS, JavaScript, responsive design, Git, VS Code"
            : phaseName.includes("Intermediate")
            ? "React, Node.js, APIs, databases, Express"
            : "Next.js, DevOps, Web3, microservices"
        }.

        Format each question exactly like this:
        Question 1: [Question text]
        Question 2: [Question text]
        ...
        Question 10: [Question text]

        Do not include any other text or explanations. Just provide exactly 50 questions numbered from 1 to 50.
      `;

      const interviewResult = await model.generateContent(interviewPrompt);
      const interviewText = await interviewResult.response.text();

      // Better regex pattern to extract questions
      const questionPattern = /Question\s+\d+:\s+(.*?)(?=Question\s+\d+:|$)/gs;
      const matches = Array.from(interviewText.matchAll(questionPattern));

      // Extract just the question text from each match
      const questions = matches.map((match) => match[1].trim());

      // Fallback if we don't get exactly 10 questions
      if (questions.length !== 50) {
        // Simple line-by-line parsing as fallback
        const fallbackQuestions = interviewText
          .split("\n")
          .filter((line) => line.trim().startsWith("Question"))
          .map((line) => line.replace(/^Question\s+\d+:\s+/, "").trim());

        if (fallbackQuestions.length >= 10) {
          setInterviewQuestions(fallbackQuestions.slice(0, 10));
        } else {
          // Generate placeholder questions if parsing fails
          const defaultQuestions = [
            `What experience do you have with ${phaseName} technologies?`,
            `How would you approach debugging in a ${phaseName} project?`,
            `Describe your workflow when developing a new feature.`,
            `How do you stay updated with the latest trends in web development?`,
            `What challenges have you faced in previous projects?`,
            `How do you ensure code quality?`,
            `Describe your experience with version control systems.`,
            `How do you approach optimization in your projects?`,
            `What team collaboration tools have you used?`,
            `How do you handle tight deadlines?`,
          ];
          setInterviewQuestions(defaultQuestions);
        }
      } else {
        setInterviewQuestions(questions);
      }
    } catch (err) {
      console.error("Error generating interview questions:", err.message);
      // Generate fallback questions instead of showing error
      const fallbackQuestions = [
        `What experience do you have with ${phaseName} technologies?`,
        `How would you approach debugging in a ${phaseName} project?`,
        `Describe your workflow when developing a new feature.`,
        `How do you stay updated with the latest trends in web development?`,
        `What challenges have you faced in previous projects?`,
        `How do you ensure code quality?`,
        `Describe your experience with version control systems.`,
        `How do you approach optimization in your projects?`,
        `What team collaboration tools have you used?`,
        `How do you handle tight deadlines?`,
      ];
      setInterviewQuestions(fallbackQuestions);
    }

    // Show toast for submission
    showToastNotification("Quiz submitted successfully!", "success");
    setShowResults(true);
  };

  const handleDownloadInterviewQuestions = () => {
    if (!interviewQuestions.length) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.setFont("helvetica");
    doc.setFontSize(16);
    doc.text(`Interview Questions for ${phaseName}`, 20, 20);

    doc.setFontSize(12);
    let y = 30;
    interviewQuestions.forEach((question, index) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      const wrappedText = doc.splitTextToSize(`${index + 1}. ${question}`, 170);
      doc.text(wrappedText, 20, y);
      y += wrappedText.length * 5 + 5;
    });

    doc.save(
      `interview-questions-${phaseName.replace(/\s+/g, "-").toLowerCase()}.pdf`
    );
    showToastNotification(
      "Interview questions downloaded successfully!",
      "success"
    );
  };

  const toggleExpandQuestion = (id) => {
    if (expandedQuestion === id) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-3xl font-bold">Preparing your quiz...</h1>
          <p className="text-gray-400 mt-2">This might take a few moments</p>
        </div>
      </div>
    );
  }

  if (error || !quizData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-500/20 p-4 rounded-lg mb-6 inline-block">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold">{error || "No quiz available"}</h1>
          <button
            onClick={() => navigate("/roadmap")}
            className="mt-6 px-6 py-3 bg-blue-600 rounded-md hover:bg-blue-700 transition flex items-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Roadmap
          </button>
        </div>
      </div>
    );
  }

  // Toast component with higher z-index
  const Toast = () => (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-20 right-4 z-50 p-4 rounded-md shadow-lg flex items-center ${
            toastType === "error"
              ? "bg-red-600"
              : toastType === "success"
              ? "bg-green-600"
              : "bg-yellow-600"
          }`}
          style={{ zIndex: 9999 }} // Added explicit z-index
        >
          {toastType === "error" && <X className="w-5 h-5 mr-2" />}
          {toastType === "success" && <Check className="w-5 h-5 mr-2" />}
          {toastType === "warning" && <AlertCircle className="w-5 h-5 mr-2" />}
          <span>{toastMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 relative">
        <Toast />
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
                Quiz Results: {phaseName}
              </motion.h1>
            </div>
            {interviewQuestions.length > 0 && (
              <button
                onClick={handleDownloadInterviewQuestions}
                className="flex items-center px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition text-sm font-medium"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Interview Questions
              </button>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                Your Score: {score} / {quizData.questions.length}
              </h2>
              <div className="flex items-center">
                <div className="h-3 w-32 bg-gray-700 rounded-full mr-2 overflow-hidden">
                  <div
                    className={`h-full ${
                      score / quizData.questions.length >= 0.7
                        ? "bg-green-500"
                        : score / quizData.questions.length >= 0.4
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${(score / quizData.questions.length) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-400">
                  {Math.round((score / quizData.questions.length) * 100)}%
                </span>
              </div>
            </div>

            {quizData.questions.map((question) => (
              <motion.div
                key={question.id}
                className={`mb-6 p-4 rounded-md transition-colors ${
                  userAnswers[question.id] === question.correctAnswer
                    ? "bg-green-900/20 border border-green-700/30"
                    : "bg-red-900/20 border border-red-700/30"
                }`}
              >
                <div
                  className="cursor-pointer flex justify-between items-center"
                  onClick={() => toggleExpandQuestion(question.id)}
                >
                  <h3 className="text-lg font-semibold">{question.question}</h3>
                  {userAnswers[question.id] === question.correctAnswer ? (
                    <Check className="flex-shrink-0 w-5 h-5 text-green-500 ml-2" />
                  ) : (
                    <X className="flex-shrink-0 w-5 h-5 text-red-500 ml-2" />
                  )}
                </div>

                <AnimatePresence>
                  {expandedQuestion === question.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-2">
                        {question.options.map((option, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded ${
                              option === question.correctAnswer
                                ? "bg-green-500/20 border border-green-500/30"
                                : option === userAnswers[question.id] &&
                                  option !== question.correctAnswer
                                ? "bg-red-500/20 border border-red-500/30"
                                : "bg-gray-700/40"
                            }`}
                          >
                            {option}
                            {option === question.correctAnswer && (
                              <Check className="inline w-4 h-4 text-green-500 ml-2" />
                            )}
                            {option === userAnswers[question.id] &&
                              option !== question.correctAnswer && (
                                <X className="inline w-4 h-4 text-red-500 ml-2" />
                              )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!expandedQuestion && (
                  <p className="text-gray-300 mt-2">
                    Your Answer: {userAnswers[question.id] || "Not answered"}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>

          {interviewQuestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
              className="mt-10"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Practice Interview Questions
                </h2>
                <button
                  onClick={handleDownloadInterviewQuestions}
                  className="flex items-center px-3 py-1 bg-gray-700 rounded-md hover:bg-gray-600 transition text-xs font-medium"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download PDF
                </button>
              </div>
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                {interviewQuestions.map((question, index) => (
                  <div
                    key={index}
                    className={`p-4 ${
                      index % 2 === 0 ? "bg-gray-800" : "bg-gray-800/50"
                    } border-b border-gray-700/50 hover:bg-gray-700/30 transition`}
                  >
                    <p className="text-gray-300">
                      <span className="font-semibold text-blue-400">
                        {index + 1}.
                      </span>{" "}
                      {question}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="mt-10 text-center">
            <button
              onClick={() => navigate("/roadmap")}
              className="px-6 py-3 bg-purple-600 rounded-md hover:bg-purple-700 transition text-white font-medium"
            >
              Return to Roadmap
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 relative">
      <Toast />
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
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
            Quiz: {phaseName}
          </motion.h1>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>
              {Object.keys(userAnswers).length} of {quizData.questions.length}{" "}
              answered
            </span>
            <span>{progress}% complete</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {quizData.questions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition
                ${
                  currentQuestionIndex === idx
                    ? "bg-blue-600 text-white"
                    : userAnswers[q.id]
                    ? "bg-green-600/20 text-green-400 border border-green-600"
                    : "bg-gray-800 text-gray-400 border border-gray-700"
                }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Question {currentQuestionIndex + 1}
            </h2>
            <span className="text-sm text-gray-400">
              {currentQuestionIndex + 1} of {quizData.questions.length}
            </span>
          </div>

          <p className="text-lg mb-6">{currentQuestion.question}</p>

          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition border hover:border-blue-500/50 ${
                  userAnswers[currentQuestion.id] === option
                    ? "bg-blue-600/20 border-blue-500"
                    : "bg-gray-700/50 border-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={userAnswers[currentQuestion.id] === option}
                  onChange={() =>
                    handleAnswerSelect(currentQuestion.id, option)
                  }
                  className="mr-3"
                />
                <span
                  className={`${
                    userAnswers[currentQuestion.id] === option
                      ? "text-white"
                      : "text-gray-300"
                  }`}
                >
                  {option}
                </span>
              </label>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center ${
                currentQuestionIndex === 0
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            {currentQuestionIndex < quizData.questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-md text-sm font-medium transition flex items-center bg-blue-600 hover:bg-blue-700"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-md text-sm font-medium transition bg-purple-600 hover:bg-purple-700"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TakeQuiz;
