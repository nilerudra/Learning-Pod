import React, { useState } from "react";
import ResourceList from "./ResourceList";
import UploadResource from "./UploadResource";
import { useLocation } from "react-router-dom";
import { Search } from "lucide-react";

const ResourcePage = () => {
  const location = useLocation();
  const podId = location.state?.podId;
  const podName = location.state?.podName;
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchText, setSearchText] = useState(""); // State for search input

  const handleUploadSuccess = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 md:p-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 border-b-2 border-purple-600 pb-2 mb-6">
        Resources for Pod: {podName}
      </h1>
      <div className="flex flex-col gap-6">
        {podId ? (
          <>
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchText}
                onChange={handleSearchChange}
                className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Upload Resource Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300">
              <UploadResource
                podId={podId}
                onUploadSuccess={handleUploadSuccess}
              />
            </div>

            {/* Resource List Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300">
              <ResourceList
                key={refreshKey}
                podId={podId}
                searchText={searchText} // Pass searchText to ResourceList
              />
            </div>
          </>
        ) : (
          <p className="text-lg text-gray-700 dark:text-gray-300 text-center">
            Pod ID not available.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResourcePage;
