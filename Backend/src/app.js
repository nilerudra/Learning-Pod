import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/mongoConn.js";

import careerpathRes from "./routes/carrepathRes.js";
import roadMapRoute from "./routes/roadMapRoute.js";

import createPodRoute from "./routes/pods.js";
import joinPodRoute from "./routes/join.js";
import tasksRoute from "./routes/tasks.js";
import messagesRoute from "./routes/messages.js";
import fileUploadRoutes from "./routes/fileUpload.js";
import resourceShareRoutes from "./routes/resource.js";
import notificationRoute from "./routes/notification.js";
import learnnowRouter from './routes/learnnowRoute.js'
import quizRoute from   './routes/quizRoute.js'

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/files", express.static("files"));

app.use("/api/auth", authRoutes);
app.use("/api/ai_generated_path", careerpathRes);
app.use("/api/roadmap", roadMapRoute);
app.use("/api/roadmaps", roadMapRoute);
app.use("/create", createPodRoute);
app.use("/join", joinPodRoute);
app.use("/tasks", tasksRoute);
app.use("/messages", messagesRoute);
app.use("/files", fileUploadRoutes);
app.use("/resource-share", resourceShareRoutes);
app.use("/notification", notificationRoute);
app.use("/api/learning-content",learnnowRouter)
app.use("/api/quiz",quizRoute)

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
