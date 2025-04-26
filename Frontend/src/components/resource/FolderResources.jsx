import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import "./FolderResources.css";
import { File } from "lucide-react";
import { apiGeneral } from "../../utils/urls";

const FolderResources = () => {
  const { folderName } = useParams();
  const location = useLocation();
  const podId = location.state?.podId;
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      if (!podId) {
        setError("Pod ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${apiGeneral.getResources}${podId}`);
        const allResources = response.data.resources;
        const folderResources = allResources.filter(
          (resource) =>
            resource.folder_name.trim().toLowerCase() ===
            folderName.trim().toLowerCase()
        );
        setResources(folderResources);
        setFilteredResources(filterResources(folderResources, searchQuery));
      } catch (error) {
        setError("Error fetching resources");
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [folderName, podId]);

  useEffect(() => {
    if (resources.length > 0) {
      setFilteredResources(filterResources(resources, searchQuery));
    }
  }, [searchQuery, resources]);

  const filterResources = (resources, query) => {
    if (!query) return resources;

    return resources.filter((resource) =>
      resource.resource_name.toLowerCase().includes(query.toLowerCase())
    );
  };

  if (loading) return <p>Loading resources...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="folder-resources-page">
      <h1>Resources in {folderName}</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="resources">
        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <div className="resource-card" key={resource._id}>
              <div className="resource-details">
                <h3>{resource.resource_name}</h3>
                <a
                  href={resource.resource_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <File className="file-icon" size={32} />
                </a>
              </div>
            </div>
          ))
        ) : (
          <p>No resources found in this folder.</p>
        )}
      </div>
    </div>
  );
};

export default FolderResources;
