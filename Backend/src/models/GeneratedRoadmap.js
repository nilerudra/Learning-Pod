import mongoose from "mongoose";

const GeneratedRoadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
 
  userName: { type: String, required: true },
  roadmap: {
    title: { type: String, required: true },
    overview: { type: String, required: true },
    phases: [
      {
        phaseName: { type: String, required: true },
        description: { type: String, required: true },
        actionableSteps: [String],
        recommendedCourses: [
          {
            platform: { type: String, required: true },
            title: { type: String, required: true },
            link: { type: String, required: true },
            price: { type: String, required: true },
            duration: { type: String, required: true },
            mentor: { type: String, required: true },
            image: { type: String, required: true },
          },
        ],
        industryTrends: { type: String, required: true },
      },
    ],
    additionalResources: {
      mentorship: { type: String, required: true },
      communitySupport: { type: String, required: true },
      jobSearchStrategies: { type: String, required: true },
    },
    challengesAndSolutions: {
      challenge: { type: String, required: true },
      solution: { type: String, required: true },
    },
  },
  createdAt: { type: Date, default: Date.now },
  
},{ timestamps: true });

export default mongoose.model("GeneratedRoadmap", GeneratedRoadmapSchema);
