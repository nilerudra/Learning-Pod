const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    file: { type: String, required: true },
    contentType: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    podId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pods",
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
