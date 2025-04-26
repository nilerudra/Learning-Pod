import React from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Landing from "./components/landing/Landing";
import Dashboard from "./components/dashboard/Dashboard";
import { ThemeProvider } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar";

import RoadmapComponent from "./components/Static-Roadmap/StaticRoadmap";
import RoadmapList from "./components/Static-Roadmap/RoadmapList";

import Home from "./components/RoadMap/pages/Home";
import MultiStepForm from "./components/RoadMap/pages/MultiStepForm";
import Roadmap from "./components/RoadMap/pages/Roadmap";
import NotFound from "./components/RoadMap/pages/NotFound";
import Chatbot from "./components/AI-Chatbot/Chatbot";
import WhiteBoard from "./components/whiteboard/WhiteBoard";
import Pod from "./components/pods/Pod";
import Explore from "./components/explore/Explore";
import CreatePod from "./components/pods/CreatePod";
import ResourcePage from "./components/resource/ResourcePage";
import FolderResources from "./components/resource/FolderResources";
import TaskCreation from "./components/submissions/TaskCreation";
import TaskSubmission from "./components/submissions/TaskSubmission";
import LearnNow from "./components/RoadMap/learn_now/LearnNow";
import TakeQuiz from "./components/RoadMap/Quiz/TakeQuiz";

function MainLayout() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-layout">
        <Sidebar />

        <div className="content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/career-path" element={<Home />} />
            <Route path="/roadmap-list" element={<RoadmapList />} />
            <Route path="/form" element={<MultiStepForm />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/static-roadmap" element={<RoadmapComponent />} />
            <Route path="/*" element={<NotFound />} />
            <Route path="/whiteboard" element={<WhiteBoard />} />
            <Route path="/pod" element={<Pod />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/create-pod" element={<CreatePod />} />
            <Route path="resource" element={<ResourcePage />} />
            <Route path="/folder/:folderName" element={<FolderResources />} />
            <Route path="/task-creation" element={<TaskCreation />} />
            <Route path="/submission" element={<TaskSubmission />} />
            <Route path="/learn/:phaseId" element={<LearnNow />} />
            <Route path="/quiz/:phaseId" element={<TakeQuiz />} />
          </Routes>
        </div>
        <Chatbot />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastContainer position="top-center" autoClose={3000} />
      <Router>
        <Routes>
          {/* Landing Page without Navbar & Sidebar */}
          <Route path="/" element={<Landing />} />

          {/* Main layout for dashboard & other pages */}
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
