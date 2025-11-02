import React, { useState, useEffect } from "react";
import "./TaskSubmission.css";
import { apiGeneral } from "../../utils/urls";
import { toast } from "react-toastify";

const TaskSubmission = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [previousSubmissions, setPreviousSubmissions] = useState([]);
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getPreviousSubmittedFiles = async () => {
      try {
        const response = await fetch(`${apiGeneral.submissions}`);
        if (response.ok) {
          const data = await response.json();
          setPreviousSubmissions(data.data);
        } else {
          console.error(
            "Failed to fetch previous submissions:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching previous submissions:", error);
      }
    };

    getPreviousSubmittedFiles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", taskTitle);
      formData.append("description", taskDescription);
      formData.append("userId", localStorage.getItem("userId"));

      try {
        const response = await fetch(
          "https://learning-pod-e3wo.onrender.com/files/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUrl(data.fileUrl);
          toast.success("Task submitted successfully!");
          setPreviousSubmissions((prev) => [...prev, data.submission]);
        } else {
          toast.error("Task submission failed!");
          setError("Upload failed. Please try again.");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePdfOpen = (file) => {
    window.open(file, "_blank", "noreferrer");
  };

  return (
    <div className="task-submission-container p-4">
      <form className="task-submission-form space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold">Submit Your Task</h2>
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Task Title"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <textarea
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Task Description"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
          className="block w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? "Submitting..." : "Submit Task"}
        </button>
      </form>

      <hr className="my-6 border-gray-300" />

      <div className="previous-submissions">
        <h3 className="text-xl font-semibold mb-4">Previous Submissions</h3>
        <div className="submissions-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {previousSubmissions.length === 0 ? (
            <p>No previous submissions</p>
          ) : (
            previousSubmissions.map((task) => (
              <div
                className="submission-item border rounded p-3 shadow cursor-pointer hover:shadow-md"
                key={task._id}
                onClick={() => handlePdfOpen(task.file)}
              >
                <div className="submission-preview mb-2">
                  {task.contentType?.includes("image") ? (
                    <img
                      src={task.file}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded"
                    />
                  ) : (
                    <span className="text-4xl">📄</span>
                  )}
                </div>
                <div className="submission-info">
                  <h4 className="text-lg font-medium">{task.title}</h4>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskSubmission;
