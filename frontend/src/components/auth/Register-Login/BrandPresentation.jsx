import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./authPage.module.css";
import { socialMedia } from "./constants";

const BrandPresentation = () => {
  const navigate = useNavigate();

  return (
    <div className="w-1/2 relative overflow-hidden flex flex-col">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/friends.jpg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-purple-700/40 to-indigo-900/60"></div>

        {/* Animated decorative background effects */}
        <div className="absolute inset-0">
          {/* Floating colored orbs */}
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

          {/* Animated shooting stars */}
          <div className={`absolute top-20 left-10 w-1 h-1 bg-white rounded-full opacity-0 ${styles.animateShooting1}`}></div>
          <div className={`absolute top-32 right-20 w-1 h-1 bg-white rounded-full opacity-0 ${styles.animateShooting2}`}></div>
          <div className={`absolute top-60 left-32 w-1 h-1 bg-white rounded-full opacity-0 ${styles.animateShooting3}`}></div>
          <div className={`absolute bottom-40 right-32 w-1 h-1 bg-white rounded-full opacity-0 ${styles.animateShooting4}`}></div>
        </div>
      </div>

      {/* Fallback gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-900 z-[-1]"></div>

      {/* Main Vibely Logo Section */}
      <div className="absolute inset-0 z-10 flex items-start justify-center px-10 pt-50">
        <div className={`text-center ${styles.animateFadeIn}`}>
          <div className="group cursor-pointer" onClick={() => navigate("/")}>
            {/* Large animated Vibely text */}
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 transition-all duration-700 group-hover:scale-105 group-hover:text-purple-200">
              {["V", "i", "b", "e", "l", "y"].map((letter, index) => (
                <span
                  key={index}
                  className={styles.animateLetterBounce}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {letter}
                </span>
              ))}
            </h1>

            {/* Brand tagline */}
            <p className={`text-xl md:text-2xl text-white/90 font-medium italic tracking-wide ${styles.animateSlideUpDelayed}`}>
              "Where friendships begin."
            </p>

            {/* Decorative dots */}
            <div className={`mt-6 flex justify-center space-x-2 ${styles.animateFadeInDelayed}`}>
              {[0, 0.5, 1].map((delay, index) => (
                <div
                  key={index}
                  className="w-3 h-3 bg-white/60 rounded-full animate-pulse"
                  style={{ animationDelay: `${delay}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {socialMedia.map((social, index) => (
          <div
            key={index}
            className={`w-12 h-12 bg-black bg-opacity-20 rounded-md flex items-center justify-center cursor-pointer hover:bg-opacity-40 transition-all duration-300 hover:scale-125 hover:rotate-12 ${styles.animateBounceIn}`}
            style={{ animationDelay: social.delay }}
          >
            <img
              src={social.src}
              alt={social.alt}
              className="w-4 h-4 brightness-0 invert transition-all duration-300 hover:scale-110"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandPresentation;