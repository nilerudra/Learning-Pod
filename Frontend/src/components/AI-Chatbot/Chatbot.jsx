import React, { useState } from "react";
import { Send, X, MessageCircle } from "lucide-react";
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
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
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
        <div className="fixed bottom-16 right-5 w-100 bg-gray-800 shadow-lg rounded-lg border p-4 z-1000">
          {/* Chat Header */}
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-bold">AI Chatbot</h2>
            <button
              onClick={toggleChat}
              className="text-gray-500 hover:text-red-500"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-60 overflow-y-auto space-y-2 p-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white self-end ml-auto"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex items-center border-t pt-2">
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent hover:bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
