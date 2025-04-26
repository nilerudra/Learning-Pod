const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Message = require("../models/messageSchema ");

router.post("/send", async (req, res) => {
  const { podId, senderId, text } = req.body;

  try {
    const newMessage = new Message({
      pod: podId,
      sender: senderId,
      text,
    });

    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

router.get("/chats/:pod", async (req, res) => {
  try {
    const { pod } = req.params;

    if (!mongoose.Types.ObjectId.isValid(pod)) {
      return res.status(400).json({ message: "Invalid chat ID format" });
    }

    const messages = await Message.find({ pod });

    if (messages.length === 0) {
      return res.status(404).json({ message: "No messages found" });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).json({ message: "Failed to retrieve messages" });
  }
});

module.exports = router;
