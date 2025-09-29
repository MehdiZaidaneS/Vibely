import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import InterestCard from "./InterestCard";
import { interests } from "./welcomeConstants";

const InterestsStep = ({
  username,
  selectedInterests,
  onToggleInterest,
  onContinue,
  onSkip,
  onBack,
  isLoading,
}) => {
  return (
    <>
      {/* Welcome header section with username */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Hi {username}! 👋
        </h2>
        <p className="text-lg text-gray-600 mb-2">What brings you here today?</p>
        <p className="text-sm text-gray-500">
          Help us personalize your experience by selecting your interests
        </p>

        {/* Back button */}
        <button
          onClick={onBack}
          className="mt-4 text-sm text-purple-600 hover:text-purple-800 transition-colors duration-200 flex items-center mx-auto font-medium"
        >
          ← Change username
        </button>
      </div>

      {/* Interest selection grid */}
      <div className="space-y-4 mb-8">
        {interests.map((interest, index) => (
          <InterestCard
            key={interest.id}
            interest={interest}
            isSelected={selectedInterests.includes(interest.id)}
            onClick={() => onToggleInterest(interest.id)}
            index={index}
          />
        ))}
      </div>

      {/* Selection counter */}
      {selectedInterests.length > 0 && (
        <div className="text-center mb-6">
          <p className="text-sm text-purple-600 font-medium">
            {selectedInterests.length} interest
            {selectedInterests.length > 1 ? "s" : ""} selected
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="space-y-3">
        {/* Continue button */}
        <button
          onClick={onContinue}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl ${
            selectedInterests.length > 0
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Setting up your experience...
            </>
          ) : (
            <>
              Continue with {selectedInterests.length} selection
              {selectedInterests.length !== 1 ? "s" : ""}
              <ArrowRight className="ml-2 w-4 h-4 transition-all duration-300 group-hover:translate-x-1" />
            </>
          )}
        </button>

        {/* Skip button */}
        <button
          onClick={onSkip}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-lg font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Skip for now
        </button>
      </div>

      {/* Footer note */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          You can always change your interests later in settings
        </p>
      </div>
    </>
  );
};

export default InterestsStep;