import React from "react";
import { countryCodes } from "./constants";

const PhoneInput = ({ countryCode, phone, onChange }) => {
  return (
    <div className="group">
      <div className="flex">
        <select
          name="countryCode"
          value={countryCode}
          onChange={onChange}
          className="px-3 py-3 bg-white border border-r-0 border-purple-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-700 font-medium cursor-pointer transition-all duration-300 focus:bg-white"
        >
          {countryCodes.map((country) => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.code}
            </option>
          ))}
        </select>
        <input
          type="tel"
          name="phone"
          value={phone}
          onChange={onChange}
          className="flex-1 pl-3 pr-3 py-3 border border-purple-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-all duration-300 focus:shadow-lg"
          placeholder="503923239"
        />
      </div>
    </div>
  );
};

export default PhoneInput;