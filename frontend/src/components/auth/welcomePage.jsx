import React, { useState } from "react";
import {
  Check,
  ArrowRight,
  Users,
  Calendar,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import styles from "./welcomePage.module.css";

const WelcomePage = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // Track selected interests
  const [selectedInterests, setSelectedInterests] = useState([]);

  // Loading state for continue action
  const [isLoading, setIsLoading] = useState(false);

  // Animation state for content transitions
  const [showContent, setShowContent] = useState(true);

  // ============================================================================
  // CONSTANTS AND DATA
  // ============================================================================

  // Interest options with icons and descriptions
  const interests = [
    {
      id: "events",
      title: "Participating in events",
      description: "Join local meetups, workshops, and social gatherings",
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
      hoverColor: "from-purple-600 to-purple-700",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
    {
      id: "meeting",
      title: "Making new people",
      description: "Connect with like-minded individuals in your area",
      icon: Users,
      color: "from-indigo-500 to-indigo-600",
      hoverColor: "from-indigo-600 to-indigo-700",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
    },
    {
      id: "chatting",
      title: "Chatting with people",
      description: "Start conversations and build meaningful relationships",
      icon: MessageCircle,
      color: "from-pink-500 to-pink-600",
      hoverColor: "from-pink-600 to-pink-700",
      bgColor: "bg-pink-50",
      textColor: "text-pink-700",
    },
    {
      id: "exploring",
      title: "Exploring new experiences",
      description: "Discover activities and hobbies you've never tried",
      icon: Sparkles,
      color: "from-emerald-500 to-emerald-600",
      hoverColor: "from-emerald-600 to-emerald-700",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
    },
  ];

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  // Handle interest selection/deselection
  const toggleInterest = (interestId) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interestId)) {
        return prev.filter((id) => id !== interestId);
      } else {
        return [...prev, interestId];
      }
    });
  };

  // Handle continue button click
  const handleContinue = () => {
    setIsLoading(true);
    console.log("Selected interests:", selectedInterests);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Here you would navigate to the next page
      alert(
        `Welcome! You selected: ${selectedInterests
          .map((id) => interests.find((i) => i.id === id)?.title)
          .join(", ")}`
      );
    }, 2000);
  };

  // Handle skip button click
  const handleSkip = () => {
    console.log("User skipped interest selection");
    // Here you would navigate to the next page without selections
    alert("Welcome to Vibely! You can set your interests later in settings.");
  };

  return (
    <div className="min-h-screen flex bg-purple-50 overflow-hidden">
      {/* ================================================================== */}
      {/* LEFT SIDE - BRAND PRESENTATION (Same as login page) */}
      {/* ================================================================== */}
      <div className="w-1/2 relative overflow-hidden flex flex-col">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          {/* Main background image */}
          <img
            src="/images/friends.jpg"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dark gradient overlay to improve text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-purple-700/40 to-indigo-900/60"></div>

          {/* Animated decorative background effects */}
          <div className="absolute inset-0">
            {/* Floating colored orbs with different animations */}
            <div
              className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-400 opacity-10 rounded-full blur-3xl animate-bounce"
              style={{ animationDuration: "6s", animationDelay: "0s" }}
            ></div>
            <div
              className="absolute top-1/2 right-1/4 w-80 h-80 bg-pink-400 opacity-15 rounded-full blur-2xl animate-pulse"
              style={{ animationDuration: "4s", animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-1/3 left-1/2 w-64 h-64 bg-indigo-400 opacity-10 rounded-full blur-xl animate-ping"
              style={{ animationDuration: "8s", animationDelay: "2s" }}
            ></div>

            {/* Animated shooting stars for magical effect */}
            <div
              className={`absolute top-20 left-10 w-1 h-1 bg-white rounded-full opacity-0 ${styles.animateShooting1}`}
            ></div>
            <div
              className={`absolute top-32 right-20 w-1 h-1 bg-white rounded-full opacity-0 ${styles.animateShooting2}`}
            ></div>
            <div
              className={`absolute top-60 left-32 w-1 h-1 bg-white rounded-full opacity-0 ${styles.animateShooting3}`}
            ></div>
            <div
              className={`absolute bottom-40 right-32 w-1 h-1 bg-white rounded-full opacity-0 ${styles.animateShooting4}`}
            ></div>
          </div>
        </div>

        {/* Fallback gradient background if image fails to load */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-900 z-[-1]"></div>

        {/* Main Vibely Logo Section */}
        <div className="absolute inset-0 z-10 flex items-start justify-center px-10 pt-50">
          <div className={`text-center ${styles.animateFadeIn}`}>
            <div className="group cursor-pointer">
              {/* Large animated Vibely text */}
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 transition-all duration-700 group-hover:scale-105 group-hover:text-purple-200">
                {/* Each letter bounces individually with staggered timing */}
                <span
                  className={styles.animateLetterBounce}
                  style={{ animationDelay: "0s" }}
                >
                  V
                </span>
                <span
                  className={styles.animateLetterBounce}
                  style={{ animationDelay: "0.1s" }}
                >
                  i
                </span>
                <span
                  className={styles.animateLetterBounce}
                  style={{ animationDelay: "0.2s" }}
                >
                  b
                </span>
                <span
                  className={styles.animateLetterBounce}
                  style={{ animationDelay: "0.3s" }}
                >
                  e
                </span>
                <span
                  className={styles.animateLetterBounce}
                  style={{ animationDelay: "0.4s" }}
                >
                  l
                </span>
                <span
                  className={styles.animateLetterBounce}
                  style={{ animationDelay: "0.5s" }}
                >
                  y
                </span>
              </h1>

              {/* Brand tagline with delayed animation */}
              <p
                className={`text-xl md:text-2xl text-white/90 font-medium italic tracking-wide ${styles.animateSlideUpDelayed}`}
              >
                "Where friendships begin."
              </p>

              {/* Decorative dots with pulsing animation */}
              <div
                className={`mt-6 flex justify-center space-x-2 ${styles.animateFadeInDelayed}`}
              >
                <div
                  className="w-3 h-3 bg-white/60 rounded-full animate-pulse"
                  style={{ animationDelay: "0s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-white/60 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-white/60 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Icons at Bottom */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {[
            { src: "/icons/facebook.svg", alt: "Facebook", delay: "0s" },
            { src: "/icons/instagram.svg", alt: "Instagram", delay: "0.2s" },
            { src: "/icons/x.svg", alt: "X", delay: "0.4s" },
          ].map((social, index) => (
            <div
              key={index}
              className={`w-12 h-12 bg-black bg-opacity-20 rounded-md flex items-center justify-center cursor-pointer hover:bg-opacity-40 transition-all duration-300 hover:scale-125 hover:rotate-12 ${styles.animateBounceIn}`}
              style={{ animationDelay: social.delay }}
            >
              {/* Social media icon with hover effects */}
              <img
                src={social.src}
                alt={social.alt}
                className="w-4 h-4 brightness-0 invert transition-all duration-300 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================== */}
      {/* RIGHT SIDE - WELCOME AND INTERESTS SELECTION */}
      {/* ================================================================== */}
      <div className="w-1/2 bg-gradient-to-br from-purple-400 via-white to-indigo-400 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, #9333ea 0, #9333ea 1px, transparent 1px, transparent 40px),
                                    repeating-linear-gradient(90deg, #9333ea 0, #9333ea 1px, transparent 1px, transparent 40px)`,
            }}
          ></div>
        </div>

        {/* Language selector in top right corner */}
        <div className="absolute top-6 right-6">
          <select className="text-xs text-gray-500 bg-transparent border-none focus:outline-none cursor-pointer">
            <option value="en">English</option>
            <option value="fi">Suomi</option>
            <option value="sv">Svenska</option>
          </select>
        </div>

        {/* Main content container with slide animation */}
        <div
          className={`w-full max-w-lg transition-all duration-500 ${
            showContent
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-8"
          }`}
        >
          {/* Main welcome card */}
          <div className="bg-gray-50 rounded-2xl shadow-lg p-8 border border-gray-200">
            {/* Welcome header section */}
            <div className={`text-center mb-8 ${styles.animateFadeIn}`}>
              <div
                className={`w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 ${styles.animateBounceIn}`}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Welcome to Vibely!
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                What brings you here today?
              </p>
              <p className="text-sm text-gray-500">
                Help us personalize your experience by selecting your interests
              </p>
            </div>

            {/* Interest selection grid */}
            <div className="space-y-4 mb-8">
              {interests.map((interest, index) => {
                const Icon = interest.icon;
                const isSelected = selectedInterests.includes(interest.id);

                return (
                  <div
                    key={interest.id}
                    className={`${
                      styles.animateSlideUp
                    } cursor-pointer transition-all duration-300 transform hover:scale-102 ${
                      isSelected ? "scale-102" : ""
                    } ${isSelected ? styles.hoverScale102 : ""}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => toggleInterest(interest.id)}
                  >
                    <div
                      className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                        isSelected
                          ? `border-purple-500 bg-gradient-to-r ${interest.color} text-white shadow-lg`
                          : `border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/50`
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Icon container */}
                        <div
                          className={`p-3 rounded-lg transition-all duration-300 ${
                            isSelected ? "bg-white/20" : `${interest.bgColor}`
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 transition-all duration-300 ${
                              isSelected ? "text-white" : interest.textColor
                            }`}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3
                            className={`font-semibold text-lg mb-1 transition-all duration-300 ${
                              isSelected ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {interest.title}
                          </h3>
                          <p
                            className={`text-sm transition-all duration-300 ${
                              isSelected ? "text-white/90" : "text-gray-600"
                            }`}
                          >
                            {interest.description}
                          </p>
                        </div>

                        {/* Selection indicator */}
                        <div
                          className={`transition-all duration-300 ${
                            isSelected
                              ? "opacity-100 scale-100"
                              : "opacity-0 scale-50"
                          }`}
                        >
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-purple-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selection counter */}
            {selectedInterests.length > 0 && (
              <div className={`text-center mb-6 ${styles.animateSlideUp}`}>
                <p className="text-sm text-purple-600 font-medium">
                  {selectedInterests.length} interest
                  {selectedInterests.length > 1 ? "s" : ""} selected
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div
              className={`space-y-3 ${styles.animateSlideUp}`}
              style={{ animationDelay: "0.4s" }}
            >
              {/* Continue button */}
              <button
                onClick={handleContinue}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl ${
                  selectedInterests.length > 0
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    {/* Loading spinner */}
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Setting up your experience...
                  </>
                ) : (
                  <>
                    Continue with {selectedInterests.length} selection
                    {selectedInterests.length !== 1 ? "s" : ""}
                    {/* Arrow icon that moves on hover */}
                    <ArrowRight className="ml-2 w-4 h-4 transition-all duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {/* Skip button */}
              <button
                onClick={handleSkip}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Skip for now
              </button>
            </div>

            {/* Footer note */}
            <div
              className={`mt-6 text-center ${styles.animateFadeIn}`}
              style={{ animationDelay: "0.6s" }}
            >
              <p className="text-xs text-gray-500">
                You can always change your interests later in settings
              </p>
            </div>

            {/* Security badge for trust */}
            <div
              className={`mt-6 flex items-center justify-center text-xs text-gray-500 ${styles.animateFadeIn}`}
              style={{ animationDelay: "0.7s" }}
            >
              {/* Lock icon */}
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
              Your preferences are private and secure
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
