import React, { useState } from "react";
import axios from "axios";
import { apiGeneral } from "../../utils/urls";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CreatePod() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");
  const [userRole, setRole] = useState("");
  const navigate = useNavigate();

  const fetchUserRole = async (userId) => {
    try {
      const res = await axios.get(
        `${apiGeneral.createPod}/user-role/${userId}`
      );
      console.log(res);
      return res.data.role;
    } catch (err) {
      console.error("Error fetching user role:", err);
      throw err;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      console.log(userId);
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setRole(parsedUser.role);

        const role = parsedUser.role;

        const res = await axios.post(
          apiGeneral.createPod,
          {
            pod_name: name,
            pod_description: description,
            is_public: privacy === "public",
            created_by: userId,
            members: [{ user_id: userId, role }],
            resources: [],
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("access_token") || "",
            },
          }
        );

        if (res) {
          toast.success("Pod created successfully");
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error("Error creating pod:", err.response?.data || err.message);
      setError("Failed to create pod. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        🚀 Create a New Pod
      </h2>

      <div className="space-y-5">
        <input
          type="text"
          placeholder="Pod Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Privacy
          </label>
          <select
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        {error && (
          <div className="text-center text-sm text-red-600 font-medium">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 text-white rounded-xl font-semibold transition-all ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating..." : "Create Pod"}
        </button>
      </div>
    </div>
  );
}

export default CreatePod;
