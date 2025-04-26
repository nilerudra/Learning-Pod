import React, { useState, useContext } from "react";
import StepPersonalInfo from "./Steps/StepPersonalInfo";
import StepEducationProfession from "./Steps/StepEducationProfession";
import StepFutureGoals from "./Steps/StepFutureGoals";
import StepSkillsExperience from "./Steps/StepSkillsExperience";
import StepLearningPreferences from "./Steps/StepLearningPreferences";
import StepChallenges from "./Steps/StepChallenges";
import ProgressBar from "./ProgressBar";
import { ThemeContext } from "../../../context/ThemeContext";

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const { theme } = useContext(ThemeContext);

  // ✅ Initialize formData with default values
  const [formData, setFormData] = useState({
    userId: localStorage.getItem("userId"),
    personalInfo: { fullName: "", age: "", location: "" },
    educationProfession: { type: "", currentField: "", qualification: "" },
    futureGoals: { primaryGoal: "", interestField: "", learningStyle: "" },
    skills: { selected: [], experience: { value: "", unit: "Months" } },
    learningPreferences: { resources: "", timeCommitment: "" },
    challenges: { learningChallenges: "", supportNeeded: "" },
  });

  const nextStep = () => {
    if (step < 6) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderFinalData = () => {
    const renderObject = (obj) => {
      return Object.keys(obj).map((key) => (
        <div key={key} className="mb-2">
          <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
          <pre className="text-sm p-2 bg-transparent rounded-lg overflow-auto">
            {JSON.stringify(obj[key], null, 2)}
          </pre>
        </div>
      ));
    };

    return (
      <div className="mt-6 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent">
        <h3 className="text-xl font-bold mb-2">Final Collected Data:</h3>
        <div>
          {renderObject(formData.personalInfo)}
          {renderObject(formData.educationProfession)}
          {renderObject(formData.futureGoals)}
          {renderObject(formData.skills)}
          {renderObject(formData.learningPreferences)}
          {renderObject(formData.challenges)}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col gap-4 min-h-screen ${
        theme === "dark"
          ? "bg-transparent text-white"
          : "bg-transparent text-gray-900"
      }`}
    >
      <ProgressBar step={step} />

      <div className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 transition-all duration-300">
        {step === 1 && (
          <StepPersonalInfo formData={formData} setFormData={setFormData} />
        )}
        {step === 2 && (
          <StepEducationProfession
            formData={formData}
            setFormData={setFormData}
          />
        )}
        {step === 3 && (
          <StepFutureGoals formData={formData} setFormData={setFormData} />
        )}
        {step === 4 && (
          <StepSkillsExperience formData={formData} setFormData={setFormData} />
        )}
        {step === 5 && (
          <StepLearningPreferences
            formData={formData}
            setFormData={setFormData}
          />
        )}
        {step === 6 && (
          <StepChallenges formData={formData} setFormData={setFormData} />
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="px-4 py-2 m-4 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-400 dark:hover:bg-gray-800 transition-all duration-300"
            >
              Back
            </button>
          )}
          {step < 6 ? (
            <button
              onClick={nextStep}
              className="px-4 py-2 m-4 rounded-md bg-purple-400 text-white font-semibold hover:bg-purple-500 transition-all duration-300"
            >
              Next
            </button>
          ) : null}
        </div>

        {/* Final Data Display */}
        {step === 6 && renderFinalData()}
      </div>
    </div>
  );
};

export default MultiStepForm;
