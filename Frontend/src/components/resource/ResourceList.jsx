import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ResourceList.css";
import { FaFolder } from "react-icons/fa";
import { apiGeneral } from "../../utils/urls";

const ResourceList = ({ podId }) => {
  const [resources, setResources] = useState({});
  const [filteredResources, setFilteredResources] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("pod", podId);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get(`${apiGeneral.getResources}${podId}`);
        let resources = response.data.resources || [];

        // Group resources by folder name
        const groupedResources = resources.reduce((acc, resource) => {
          if (!acc[resource.folder_name]) {
            acc[resource.folder_name] = [];
          }
          acc[resource.folder_name].push(resource);
          return acc;
        }, {});

        setResources(groupedResources);
        setFilteredResources(groupedResources); // Initially, show all folders
      } catch (error) {
        setError("Error fetching resources");
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };

    if (podId) {
      fetchResources();
    }
  }, [podId]);

  // Filter resources based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredResources(resources); // If no query, show all folders
    } else {
      const queryLowerCase = searchQuery.toLowerCase();

      // Filter resources based on their resource_name
      const filtered = Object.keys(resources).reduce((acc, folderName) => {
        const matchingResources = resources[folderName].filter((resource) =>
          resource.resource_name.toLowerCase().includes(queryLowerCase)
        );

        // If folder contains matching resources, include it in the filtered results
        if (matchingResources.length > 0) {
          acc[folderName] = matchingResources;
        }

        return acc;
      }, {});

      setFilteredResources(filtered);
    }
  }, [searchQuery, resources]);

  if (loading) return <p>Loading resources...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="resource-grid">
        {Object.keys(filteredResources).length > 0 ? (
          Object.keys(filteredResources).map((folderName) => (
            <div className="folder-item" key={folderName}>
              <Link
                to={`/folder/${folderName}`}
                state={{ podId }} // Pass podId as state
                className="folder-link"
              >
                <FaFolder className="folder-icon" size={50} />
                <h3 className="folder-name">{folderName}</h3>
              </Link>
            </div>
          ))
        ) : (
          <p>No resources found.</p>
        )}
      </div>
    </div>
  );
};

export default ResourceList;
