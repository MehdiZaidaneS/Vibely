import React from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const PasswordInput = ({ value, onChange, showPassword, onTogglePassword }) => {
  return (
    <div className="relative group">
      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 transition-all duration-300 group-focus-within:text-purple-500 group-focus-within:scale-110 z-10" />
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-all duration-300 focus:shadow-lg"
        placeholder="Password"
      />
      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 hover:scale-125 z-10"
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4 text-gray-500 group-focus-within:text-purple-500 transition-colors duration-300" />
        ) : (
          <Eye className="w-4 h-4 text-gray-500 group-focus-within:text-purple-500 transition-colors duration-300" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;