import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Profile from "./Profile";
import { apiGeneral } from "../../utils/urls";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FolderOpen, Upload } from "lucide-react";

export default function ChatContainer({ pod, isOpen }) {
  const [chatInput, setChatInput] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentPod, setCurrentPod] = useState(null);
  const userId = localStorage.getItem("userId");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [chatMessages]);

  const handleProfileClick = () => setIsProfileOpen(!isProfileOpen);

  const handleSubmission = async () => {
    try {
      const res = await axios.get(
        `https://learning-pod-e3wo.onrender.com/tasks/pods/${pod._id}/check-admin/${userId}`
      );
      if (res.data.isAdmin) navigate("/task-creation");
      else navigate("/submission");
    } catch (err) {
      console.error("Error checking admin status:", err);
    }
  };

  const handleResource = () => {
    navigate("/resource", {
      state: { podId: pod?._id, podName: pod?.pod_name },
    });
  };

  const fetchPodDetails = () => {
    if (pod?._id) {
      fetch(`${apiGeneral.pods}${pod._id}`)
        .then((res) => res.json())
        .then((data) => setCurrentPod(data))
        .catch((err) => console.error("Error fetching pod details:", err));
    }
  };

  const fetchMessages = () => {
    if (isOpen && pod?._id) {
      fetch(`${apiGeneral.chats}${pod._id}`)
        .then((res) => res.json())
        .then((data) => setChatMessages(Array.isArray(data) ? data : []))
        .catch((err) => console.error("Error fetching messages:", err));
    }
  };

  useEffect(() => {
    if (isOpen && pod?._id) {
      const socket = io("https://learning-pod-e3wo.onrender.com", {
        transports: ["websocket"],
        reconnection: false,
        timeout: 5000,
      });

      fetchMessages();
      fetchPodDetails();

      socket.on("chatMessage", (msg) => {
        if (msg.podId === pod._id) setChatMessages((prev) => [...prev, msg]);
      });

      return () => {
        socket.off("chatMessage");
        socket.disconnect();
      };
    }
  }, [isOpen, pod?._id]);

  const handleSend = () => {
    if (!chatInput.trim()) return;

    const newMsg = { podId: pod._id, sender: userId, text: chatInput };
    setChatMessages((prev) => [...prev, newMsg]);

    fetch(`${apiGeneral.send}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        podId: pod._id,
        senderId: userId,
        text: chatInput,
      }),
    }).finally(() => setChatInput(""));
  };

  const handleKeyPress = (e) => e.key === "Enter" && handleSend();

  if (!isOpen || !pod?._id) return null;

  // Generate initials if no photo
  const getInitials = (fullName) => {
    if (!fullName) return "";
    const names = fullName.trim().split(" ");
    return names
      .map((n) => n[0].toUpperCase())
      .join("")
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] ml-2 w-full max-w-4xl mx-auto bg-gray-900 text-gray-200 rounded-xl border border-gray-800 shadow-lg overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700 cursor-pointer"
        onClick={handleProfileClick}
      >
        <div className="flex items-center justify-center space-x-4">
          {pod.photo ? (
            <img
              src={pod.photo}
              alt="Profile"
              className="w-12 h-12 rounded-full mb-4 object-cover border-2 border-gray-700"
            />
          ) : (
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-600 text-white text-xl font-bold border-2 border-gray-700">
              {getInitials(pod.pod_name)}
            </div>
          )}
          <h3 className="text-lg font-semibold text-white">{pod.pod_name}</h3>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleResource}
            className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-300"
          >
            <FolderOpen className="w-5 h-5 text-white" />
          </button>

          {currentPod && currentPod.createdBy === userId && (
            <button
              onClick={handleSubmission}
              className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-300 text-white"
            >
              Assign
            </button>
          )}

          <button
            onClick={handleSubmission}
            className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-300"
          >
            <Upload className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 bg-gray-900">
        {chatMessages.length > 0 ? (
          chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[70%] break-words ${
                  msg.sender === userId
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-200"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">No messages yet.</p>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-700 p-4 bg-gray-800 flex items-center space-x-2">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleSend}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
        >
          Send
        </button>
      </div>

      {/* Profile Modal */}
      {isProfileOpen && (
        <Profile
          isOpen={isProfileOpen}
          onClose={handleProfileClick}
          photo={pod.profilePhoto}
          name={pod.pod_name}
          description={pod.pod_description}
          files={pod.files || 0}
          links={pod.links || 0}
        />
      )}
    </div>
  );
}
