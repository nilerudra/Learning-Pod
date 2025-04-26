const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  pod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "pods",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
