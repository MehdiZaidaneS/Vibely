import React from "react";

const FormInput = ({ icon: Icon, type, name, value, onChange, placeholder }) => {
  return (
    <div className="relative group">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 transition-all duration-300 group-focus-within:text-purple-500 z-10" />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-all duration-300 focus:shadow-lg"
        placeholder={placeholder}
      />
    </div>
  );
};

export default FormInput;