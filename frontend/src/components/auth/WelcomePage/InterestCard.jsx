import React from "react";
import { Check } from "lucide-react";
import styles from "./welcomePage.module.css";

const InterestCard = ({ interest, isSelected, onClick, index }) => {
  const Icon = interest.icon;

  return (
    <div
      className={`cursor-pointer transition-all duration-300 transform hover:scale-102 ${
        isSelected ? "scale-102" : ""
      } ${isSelected ? styles.hoverScale102 : ""}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={onClick}
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
              isSelected ? "opacity-100 scale-100" : "opacity-0 scale-50"
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
};

export default InterestCard;