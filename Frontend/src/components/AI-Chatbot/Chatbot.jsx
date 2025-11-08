import React, { useState } from "react";
import { Send, X } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Toggle Chatbox
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Handle Message Send
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: input }] }],
          }),
        }
      );
      const data = await response.json();
      const botReply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I couldn't understand.";

      setMessages([...newMessages, { text: botReply, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages([
        ...newMessages,
        { text: "Error connecting to AI.", sender: "bot" },
      ]);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}

      <DotLottieReact
        src="https://lottie.host/3aeba8c6-e450-45a2-9279-96341ee23082/0gxfq4zpX5.lottie"
        loop
        autoplay
        style={{
          width: "60px",
          height: "60px",
          margin: "0",
          padding: "0",
          right: "5px",
          bottom: "5px",
          position: "fixed",
          cursor: "pointer",
        }} // Adjust size here
        onClick={toggleChat}
      />

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#0f172a] border border-gray-700 shadow-xl rounded-2xl p-4 z-[1000] backdrop-blur-lg text-gray-200 animate-fadeIn">
          {/* Chat Header */}
          <div className="flex justify-between items-center border-b border-gray-700 pb-2">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              AI Chatbot 🤖
            </h2>
            <button
              onClick={toggleChat}
              className="text-gray-400 hover:text-red-500 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-64 overflow-y-auto space-y-3 mt-3 p-2 custom-scrollbar">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 px-3 rounded-lg text-sm max-w-[80%] break-words ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white ml-auto"
                    : "bg-gray-700/80 text-gray-100"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex items-center mt-3 border-t border-gray-700 pt-2">
            <input
              type="text"
              className="w-full bg-[#0f172a] border border-gray-700 text-gray-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 hover:opacity-80 transition-all p-2 rounded-lg"
            >
              <Send size={18} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
