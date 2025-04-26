import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Profile from "./Profile";
import { apiGeneral } from "../../utils/urls";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FolderOpen, Upload } from "lucide-react";

// Establish socket connection
const socket = io("https://learning-pod-e3wo.onrender.com");

export default function ChatContainer({ pod, isOpen }) {
  const [chatInput, setChatInput] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentPod, setCurrentPod] = useState(null);
  const userId = localStorage.getItem("userId");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleSubmission = async () => {
    try {
      const response = await axios.get(
        `https://learning-pod-e3wo.onrender.com/tasks/pods/${pod._id}/check-admin/${userId}`
      );
      if (response.data.isAdmin) {
        navigate("/task-creation");
      } else {
        navigate("/submission");
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  const handleResource = () => {
    navigate("/resource", {
      state: {
        podId: pod?._id,
        podName: pod?.pod_name,
      },
    });
  };

  // Fetch pod details
  const fetchPodDetails = () => {
    if (pod?._id) {
      fetch(`${apiGeneral.pods}${pod._id}`)
        .then((response) => response.json())
        .then((data) => {
          setCurrentPod(data);
        })
        .catch((error) => {
          console.error("Error fetching pod details:", error);
        });
    }
  };

  // Fetch messages from the server (polling)
  const fetchMessages = () => {
    if (isOpen && pod?._id) {
      fetch(`${apiGeneral.chats}${pod._id}`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setChatMessages(data);
          } else {
            console.error("Expected an array of messages but got:", data);
            setChatMessages([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    }
  };

  useEffect(() => {
    if (isOpen && pod?._id) {
      fetchMessages();
      fetchPodDetails();

      socket.on("chatMessage", (msg) => {
        if (msg.podId === pod._id) {
          setChatMessages((prevMessages) => [...prevMessages, msg]);
        }
      });

      const pollingInterval = setInterval(fetchMessages, 10000);

      return () => {
        clearInterval(pollingInterval);
        socket.off("chatMessage");
      };
    }
  }, [isOpen, pod?._id]);

  const handleSend = () => {
    if (chatInput.trim()) {
      const newMessage = {
        podId: pod._id,
        sender: userId,
        text: chatInput,
      };

      socket.emit("chatMessage", newMessage);
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);

      fetch(`${apiGeneral.send}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          podId: pod._id,
          senderId: userId,
          text: chatInput,
        }),
      })
        .then((response) => response.json())
        .then(() => {
          setChatInput("");
        })
        .catch((error) => {});
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  if (!isOpen || !pod || !pod._id) return null;

  return (
    <div className="flex flex-col w-full h-full bg-transparent dark:bg-gray-900">
      {/* Pod Details Header */}
      <div
        className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 p-4 cursor-pointer"
        onClick={handleProfileClick}
      >
        <div className="flex items-center space-x-4">
          <img
            src={pod.profilePhoto}
            alt="Pod Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {pod.pod_name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {pod.pod_description}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleResource}
            className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300"
          >
            <FolderOpen className="w-5 h-5" />
          </button>
          {currentPod && currentPod.createdBy === userId && (
            <button
              onClick={handleSubmission}
              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300"
            >
              Assign
            </button>
          )}
          <button
            onClick={handleSubmission}
            className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300"
          >
            <Upload className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Array.isArray(chatMessages) ? (
          chatMessages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[50%] p-3 rounded-lg text-white ${
                  message.sender === userId ? "bg-purple-600" : "bg-gray-700"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            No messages found.
          </p>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-300 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300"
          >
            Send
          </button>
        </div>
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
