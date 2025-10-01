import { useState, useRef } from "react";
import { checkUserName } from "../../../api/userApi";

export const useUsername = () => {
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState("idle");
  const timeoutRef = useRef(null);

  const handleUsernameChange = (value) => {
    const sanitizedValue = value.replace(/[^a-zA-Z0-9_]/g, "");
    setUsername(sanitizedValue);


    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (sanitizedValue.trim().length >= 4) {
      setUsernameStatus("checking");

      
      timeoutRef.current = setTimeout(async () => {
        try {
          const isTaken = await checkUserName(sanitizedValue.trim());
          setUsernameStatus(isTaken);
        } catch (error) {
          console.error("Error checking username:", error);
          setUsernameStatus("idle");
        }
      }, 800);
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
