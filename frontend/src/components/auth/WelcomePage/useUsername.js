import { useState } from "react";
import { checkUsernameAvailability } from "./welcomeConstants";

export const useUsername = () => {
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState("idle");

  const handleUsernameChange = async (value) => {
    const sanitizedValue = value.replace(/[^a-zA-Z0-9_]/g, "");
    setUsername(sanitizedValue);

    if (sanitizedValue.trim().length >= 4) {
      setUsernameStatus("checking");
      try {
        const isTaken = await checkUsernameAvailability(sanitizedValue.trim());
        setUsernameStatus(isTaken ? "taken" : "available");
      } catch (error) {
        console.error("Error checking username:", error);
        setUsernameStatus("idle");
      }
    } else {
      setUsernameStatus("idle");
    }
  };

  return {
    username,
    usernameStatus,
    handleUsernameChange,
  };
};