import React, { useState, useEffect } from "react";
import { apiGeneral } from "../../utils/urls";
import { Search, Plus } from "lucide-react";

export default function PodList({ onSelectPod }) {
  const [pods, setPods] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPods = async () => {
      try {
        const response = await fetch(`${apiGeneral.userPods}${userId}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setPods(data);
        } else {
          console.error("Expected an array of pods but got:", data);
          setPods([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pods:", error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchPods();
    }
  }, [userId]);

  const filteredPods = pods.filter(
    (pod) =>
      pod.pod_name.toLowerCase().includes(searchText.toLowerCase()) ||
      pod.pod_description.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSearchChange = (e) => setSearchText(e.target.value);
  const handleCreatePod = () => (window.location.href = "/create-pod");

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
    <div className="flex flex-col h-[calc(100vh-80px)] rounded-xl bg-gradient-to-b from-[#111827] via-[#1f2937] to-[#0f172a] border-r border-gray-800 text-gray-200">
      {/* Search and Create Pod */}
      <div className="p-4 border-b border-gray-800 backdrop-blur-md">
        <div className="relative mb-4">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search pods..."
            value={searchText}
            onChange={handleSearchChange}
            className="w-full py-2 pl-10 pr-4 rounded-lg bg-[#0f172a] border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
          />
        </div>

        <button
          onClick={handleCreatePod}
          className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 text-white rounded-lg flex items-center justify-center hover:opacity-90 hover:shadow-md transition-all"
        >
          <Plus size={18} className="mr-2" />
          Create Pod
        </button>
      </div>

      {/* Pods List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-center text-gray-500">
              <div className="h-4 w-24 mx-auto bg-gray-700 rounded mb-2.5"></div>
              <div className="h-3 w-16 mx-auto bg-gray-700 rounded"></div>
            </div>
          </div>
        ) : filteredPods.length > 0 ? (
          <div className="divide-y divide-gray-800">
            {filteredPods.map((pod) => (
              <div
                key={pod._id}
                onClick={() => onSelectPod(pod)}
                className="flex items-center p-4 cursor-pointer hover:bg-[#1e293b] transition-all duration-300 rounded-lg mx-2 my-1"
              >
                <div className="overflow-hidden flex-shrink-0 mr-3">
                  {pod.photo ? (
                    <img
                      src={pod.photo}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-600 text-white text-xl font-bold border-2 border-gray-700">
                      {getInitials(pod.pod_name)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-100 truncate">
                    {pod.pod_name}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">
                    {pod.pod_description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <span className="text-5xl mb-4 text-gray-500">🔍</span>
            <p className="text-lg font-medium text-gray-300">
              {searchText ? "No pods found" : "No pods available"}
            </p>
            <p className="text-sm mt-2 text-gray-500">
              {searchText
                ? "Try a different search term"
                : "Create your first pod to get started 🚀"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
