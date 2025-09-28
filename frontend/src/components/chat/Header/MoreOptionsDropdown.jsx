import React from "react";
import { MoreVertical } from "lucide-react";

const MoreOptionsDropdown = ({
  showMoreMenu,
  setShowMoreMenu,
  moreOptions,
  styles,
}) => {
  return (
    <div className="relative dropdown-container">
      <button
        onClick={() => setShowMoreMenu(!showMoreMenu)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
      >
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>

      {showMoreMenu && (
        <div
          className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 ${styles.animateFadeIn}`}
        >
          <div className="py-2">
            {moreOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  option.action();
                  setShowMoreMenu(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors duration-200 ${
                  option.danger
                    ? "text-red-600 hover:bg-red-50"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <option.icon className="w-4 h-4" />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoreOptionsDropdown;
