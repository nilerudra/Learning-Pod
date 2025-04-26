import React, { useState, useEffect } from "react";
import { apiGeneral } from "../../utils/urls";
import { Search, Plus } from "lucide-react";

export default function PodList({ onSelectPod, darkMode }) {
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

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleCreatePod = () => {
    window.location.href = "/create-pod";
  };

  return (
    <div className="flex flex-col h-full bg-transparent dark:bg-gray-900 border-r-1">
      {/* Search and Create Pod */}
      <div className="p-4">
        <div className="relative mb-4">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
          />
          <input
            type="text"
            placeholder="Search pods..."
            value={searchText}
            onChange={handleSearchChange}
            className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          onClick={handleCreatePod}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center justify-center hover:bg-purple-700 transition-all duration-300"
        >
          <Plus size={18} className="mr-2" />
          Create Pod
        </button>
      </div>

      {/* Pods List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-center text-gray-400 dark:text-gray-500">
              <div className="h-4 w-24 mx-auto bg-gray-300 dark:bg-gray-700 rounded mb-2.5"></div>
              <div className="h-3 w-16 mx-auto bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ) : filteredPods.length > 0 ? (
          <div className="divide-y divide-gray-300 dark:divide-gray-700">
            {filteredPods.map((pod) => (
              <div
                key={pod._id}
                onClick={() => onSelectPod(pod)}
                className="flex items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 mr-3 bg-gray-100 dark:bg-gray-700">
                  <img
                    src={pod.profilePhoto || "/api/placeholder/48/48"}
                    alt={pod.pod_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                    {pod.pod_name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {pod.pod_description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <span className="text-5xl mb-4 text-gray-400 dark:text-gray-600">
              🔍
            </span>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {searchText ? "No pods found" : "No pods available"}
            </p>
            <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
              {searchText
                ? "Try a different search term"
                : "Create your first pod to get started"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
