import React, { useState, useEffect } from "react";
import { createUser, logUser } from "../../../api/userApi.js";
import { useNavigate, useLocation } from "react-router-dom";
import BrandPresentation from "./BrandPresentation";
import AuthForm from "./AuthForm";
import { defaultFormData } from "./constants";

const Auth = ({isAuthenticated, setIsAuthenticated}) => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname !== "/register");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [rememberMe, setRememberMe] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail && isLogin) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, [isLogin]);

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

    // Check terms acceptance for registration
    if (!isLogin && !termsAccepted) {
      setError("Please accept the Terms of Service and Privacy Policy to continue.");
      setIsLoading(false);
      return;
    }

    console.log(isAuthenticated)
    try {
      if (isLogin) {
        await logUser(formData);
        setIsAuthenticated(true)

        // Handle remember me functionality
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

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
      setTermsAccepted(false);
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
        rememberMe={rememberMe}
        termsAccepted={termsAccepted}
        onInputChange={handleInputChange}
        onTogglePassword={() => setShowPassword(!showPassword)}
        onRememberMeChange={() => setRememberMe(!rememberMe)}
        onTermsChange={() => setTermsAccepted(!termsAccepted)}
        onSubmit={handleSubmit}
        onToggleMode={toggleMode}
      />
    </div>
  );
};

export default Auth;
