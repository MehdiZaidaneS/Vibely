import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addInfo } from "../../../api/userApi.js";
import BrandPresentation from "../Register-Login/BrandPresentation.jsx";
import UsernameStep from "./UsernameStep";
import InterestsStep from "./InterestsStep";
import { useUsername } from "./useUsername";
import { interests } from "./welcomeConstants";

const WelcomePage = () => {
  const [currentStep, setCurrentStep] = useState("username");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const navigate = useNavigate();

  const { username, usernameStatus, handleUsernameChange } = useUsername();

  const handleUsernameSubmit = (e) => {
    if (e) e.preventDefault();
    if (username.trim().length >= 4 && usernameStatus === "available") {
      setShowContent(false);
      setTimeout(() => {
        setCurrentStep("interests");
        setShowContent(true);
      }, 300);
    }
  };

  const toggleInterest = (interestId) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleContinue = async () => {
    setIsLoading(true);
    const body = { username, interests: selectedInterests };

    try {
      await addInfo(body);
    } catch (error) {
      console.log(error.message);
    }

    setTimeout(() => {
      setIsLoading(false);
      navigate("/events");
      alert(
        `Welcome ${username}! You selected: ${selectedInterests
          .map((id) => interests.find((i) => i.id === id)?.title)
          .join(", ")}`
      );
    }, 2000);
  };

  const handleSkip = () => {
    console.log("User skipped interest selection");
    alert(
      `Welcome to Vibely, ${username}! You can set your interests later in settings.`
    );
  };

  const handleBackToUsername = () => {
    setShowContent(false);
    setTimeout(() => {
      setCurrentStep("username");
      setShowContent(true);
    }, 300);
  };

  return (
    <div className="min-h-screen flex bg-purple-50 overflow-hidden">
      <BrandPresentation />

      {/* Right side - Welcome Form */}
      <div className="w-1/2 bg-gradient-to-br from-purple-400 via-white to-indigo-400 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, #9333ea 0, #9333ea 1px, transparent 1px, transparent 40px),
                                    repeating-linear-gradient(90deg, #9333ea 0, #9333ea 1px, transparent 1px, transparent 40px)`,
            }}
          ></div>
        </div>

        {/* Main content container */}
        <div
          className={`w-full max-w-lg transition-all duration-500 ${
            showContent
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-8"
          }`}
        >
          <div className="bg-gray-50 rounded-2xl shadow-lg p-8 border border-gray-200">
            {currentStep === "username" && (
              <UsernameStep
                username={username}
                usernameStatus={usernameStatus}
                onUsernameChange={handleUsernameChange}
                onSubmit={handleUsernameSubmit}
              />
            )}

            {currentStep === "interests" && (
              <InterestsStep
                username={username}
                selectedInterests={selectedInterests}
                onToggleInterest={toggleInterest}
                onContinue={handleContinue}
                onSkip={handleSkip}
                onBack={handleBackToUsername}
                isLoading={isLoading}
              />
            )}

            {/* Security badge */}
            <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Your information is private and secure
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
