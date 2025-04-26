import mongoose from "mongoose";



const roadMapFormSchema = new mongoose.Schema({

    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
        },

    personalInfo: {
      fullName: String,
      age: String,
      location: String
    },
    educationProfession: {
      type: {type:String},
      currentField: String,
      qualification: String
    },
    futureGoals: {
      primaryGoal: String,
      interestField: String,
      learningStyle: String
    },
    skills: {
      selected: [String],
      experience: {
        value: String,
        unit: { type: String, default: 'Months' }
      }
    },
    learningPreferences: {
      resources: [String],
      timeCommitment: String
    },
    challenges: {
      learningChallenges: String,
      supportNeeded: String
    }
  });
  
  export default mongoose.model('RoadMapForm', roadMapFormSchema);
  