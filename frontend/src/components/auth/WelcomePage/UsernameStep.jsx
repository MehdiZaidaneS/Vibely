import React from "react";
import { User, ArrowRight, Check } from "lucide-react";

const UsernameStep = ({ username, usernameStatus, onUsernameChange, onSubmit }) => {
  return (
    <>
      {/* Welcome header section */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Welcome to Vibely!
        </h2>
        <p className="text-lg text-gray-600 mb-2">
          Let's get started with your journey
        </p>
        <p className="text-sm text-gray-500">
          First, tell us what you'd like to be called
        </p>
      </div>

      {/* Username input */}
      <div className="space-y-6">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Choose your username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            onKeyPress={(e) => {
              if (
                e.key === "Enter" &&
                username.trim().length >= 4 &&
                usernameStatus === "available"
              ) {
                onSubmit(e);
              }
            }}
            placeholder="Enter your username..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-lg"
            maxLength={20}
          />
          <div className="mt-2 flex justify-between items-center text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Minimum 4 characters</span>
              {usernameStatus === "checking" && (
                <div className="flex items-center space-x-1 text-blue-600">
                  <div className="animate-spin rounded-full h-3 w-3 border border-blue-600 border-t-transparent"></div>
                  <span>Checking...</span>
                </div>
              )}
              {usernameStatus === "available" && (
                <div className="flex items-center space-x-1 text-green-600">
                  <Check className="w-3 h-3" />
                  <span>Available!</span>
                </div>
              )}
              {usernameStatus === "taken" && (
                <div className="flex items-center space-x-1 text-red-600">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Taken</span>
                </div>
              )}
            </div>
            <span className="text-gray-500">{username.length}/20</span>
          </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={username.trim().length < 4 || usernameStatus !== "available"}
          className={`w-full py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl ${
            username.trim().length >= 4 && usernameStatus === "available"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {usernameStatus === "checking" ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Checking username...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="ml-2 w-4 h-4 transition-all duration-300 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>

      {/* Footer note */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          You can change your username later in settings
        </p>
        {usernameStatus === "taken" && (
          <p className="text-xs text-red-600 mt-2">
            Try adding numbers to make it unique
          </p>
        )}
      </div>
    </>
  );
};

export default UsernameStep;