import React, { useState } from "react";
import { createUser, logUser } from "../../../api/userApi.js";
import { useNavigate } from "react-router-dom";
import BrandPresentation from "./BrandPresentation";
import AuthForm from "./AuthForm";
import { defaultFormData } from "./constants";

const Auth = ({isAuthenticated, setIsAuthenticated}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    console.log(isAuthenticated)
    try {
      if (isLogin) {
        await logUser(formData);
        setIsAuthenticated(true)
        console.log(isAuthenticated)
        navigate("/");
        
      } else {
        await createUser(formData);
        setIsAuthenticated(true)
        console.log(isAuthenticated)
        navigate("/welcome");
        
      }
    } catch (err) {
      setError(
        err.message ||
          `${isLogin ? "Login" : "Registration"} failed. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setShowForm(false);
    setError(null);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setFormData(defaultFormData);
      setTimeout(() => {
        setShowForm(true);
      }, 50);
    }, 300);
  };

  return (
    <div className="min-h-screen flex bg-purple-50 overflow-hidden">
      <BrandPresentation />
      <AuthForm
        isLogin={isLogin}
        formData={formData}
        showPassword={showPassword}
        showForm={showForm}
        error={error}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onTogglePassword={() => setShowPassword(!showPassword)}
        onSubmit={handleSubmit}
        onToggleMode={toggleMode}
      />
    </div>
  );
};

export default Auth;
