const mongoose = require("mongoose");

const podSchema = new mongoose.Schema({
  pod_name: { type: String, required: true },
  pod_description: { type: String },
  is_public: { type: Boolean, default: false },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  unique_code: { type: String },
  members: [
    {
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      role: { type: String, enum: ["student", "teacher"] },
      joined_at: { type: Date, default: Date.now },
    },
  ],
  resources: [
    {
      resource_name: { type: String },
      resource_url: { type: String },
      folder_name: { type: String },
      content: { type: String },
      uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      uploaded_at: { type: Date, default: Date.now },
    },
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Pod = mongoose.model("Pod", podSchema);
module.exports = Pod;
