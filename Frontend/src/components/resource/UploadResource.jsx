import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./UploadResource.css";

const UploadResource = ({ podId, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resourceName, setResourceName] = useState("");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleResourceNameChange = (event) => {
    setResourceName(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile || !resourceName) {
      alert("Please complete all fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("resource_name", resourceName);
    formData.append("uploaded_by", localStorage.getItem("userId"));
    formData.append("podId", podId);

    setIsUploading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `https://learning-pod-e3wo.onrender.com/resource-share`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(`Success: ${response.data.message}`);
      toast.success("Resource uploaded successfully!");
      onUploadSuccess(); // Notify parent component of successful upload
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage(
        `Error: ${error.response ? error.response.data.message : error.message}`
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <h2>Upload Resource</h2>
      <input
        type="text"
        placeholder="Resource Name"
        value={resourceName}
        onChange={handleResourceNameChange}
        className="input-field"
      />
      <input type="file" onChange={handleFileChange} className="file-input" />
      <button
        onClick={handleUpload}
        className="upload-button"
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>
      {message && <p className="message">{message}</p>}
    </>
  );
};

export default UploadResource;
