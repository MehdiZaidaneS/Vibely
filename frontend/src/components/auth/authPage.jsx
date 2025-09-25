import React, { useState } from "react";
import { createUser, logUser } from "../../api/userApi.js"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Phone, Mail, Lock, User } from "lucide-react";
import styles from "./authPage.module.css";

const Auth = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // Controls whether we're showing login or signup form
  const [isLogin, setIsLogin] = useState(false);

  // Controls password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  // Loading state for form submission
  const [isLoading, setIsLoading] = useState(false);

  // Controls form slide animation when switching between login/signup
  const [showForm, setShowForm] = useState(true);

  // Add error state for UI feedback
  const [error, setError] = useState(null);

  // Form data object containing all input values
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    countryCode: "+358", // Default to Finland
  });

  const navigate = useNavigate()

  // ============================================================================
  // CONSTANTS AND DATA
  // ============================================================================

  // Array of country codes with flags for phone number input
  const countryCodes = [
    { code: "+358", flag: "🇫🇮", country: "Finland" },
    { code: "+1", flag: "🇺🇸", country: "United States" },
    { code: "+44", flag: "🇬🇧", country: "United Kingdom" },
    { code: "+49", flag: "🇩🇪", country: "Germany" },
    { code: "+33", flag: "🇫🇷", country: "France" },
    { code: "+46", flag: "🇸🇪", country: "Sweden" },
    { code: "+47", flag: "🇳🇴", country: "Norway" },
    { code: "+45", flag: "🇩🇰", country: "Denmark" },
    { code: "+31", flag: "🇳🇱", country: "Netherlands" },
    { code: "+39", flag: "🇮🇹", country: "Italy" },
    { code: "+34", flag: "🇪🇸", country: "Spain" },
    { code: "+86", flag: "🇨🇳", country: "China" },
    { code: "+91", flag: "🇮🇳", country: "India" },
    { code: "+81", flag: "🇯🇵", country: "Japan" },
    { code: "+82", flag: "🇰🇷", country: "South Korea" },
    { code: "+61", flag: "🇦🇺", country: "Australia" },
    { code: "+55", flag: "🇧🇷", country: "Brazil" },
    { code: "+52", flag: "🇲🇽", country: "Mexico" },
    { code: "+7", flag: "🇷🇺", country: "Russia" },
    { code: "+27", flag: "🇿🇦", country: "South Africa" },
  ];

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  // Handle input changes for all form fields
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // clear any old errors

    if (isLogin) {
      try{
         const user = await logUser(formData);
         navigate("/events");
      } catch (err) {
        setError(err.message || "Log In failed. Please try again.");
      } finally {
        setIsLoading(false);
      }

    } else {
      try {
        const newUser = await createUser(formData);
        navigate("/welcome");
      } catch (err) {
        setError(err.message || "Registration failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

  };

  // Toggle between login and signup modes with animation
  const toggleMode = () => {
    setShowForm(false); // Hide form for smooth transition
    setError(null)
    setTimeout(() => {
      setIsLogin(!isLogin); // Switch mode
      // Reset form data when switching modes
      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
        countryCode: "+358",
      });
      // Force a small delay to ensure proper animation reset
      setTimeout(() => {
        setShowForm(true); // Show form again
      }, 50);
    }, 300); // Delay matches CSS transition duration
  };

  return (
    <div className="min-h-screen flex bg-purple-50 overflow-hidden">
      {/* ================================================================== */}
      {/* LEFT SIDE - BRAND PRESENTATION */}
      {/* ================================================================== */}
      <div className="w-1/2 relative overflow-hidden flex flex-col">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          {/* Main background image */}
          <img
            src="/images/friends.jpg"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dark gradient overlay to improve text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-purple-700/40 to-indigo-900/60"></div>

          {/* Animated decorative background effects */}
          <div className="absolute inset-0">
            {/* Floating colored orbs with different animations */}
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

            {/* Animated shooting stars for magical effect */}
            <div
              className={`absolute top-20 left-10 w-1 h-1 bg-white rounded-full opacity-0 ${styles.animateShooting1}`}
            ></div>
            <div
              className={`absolute top-32 right-20 w-1 h-1 bg-white rounded-full opacity-0 ${styles.animateShooting2}`}
            ></div>
            <div
              className={`absolute top-60 left-32 w-1 h-1 bg-white rounded-full opacity-0 ${styles.animateShooting3}`}
            ></div>
            <div
              className={`absolute bottom-40 right-32 w-1 h-1 bg-white rounded-full opacity-0 ${styles.animateShooting4}`}
            ></div>
          </div>
        </div>

        {/* Fallback gradient background if image fails to load */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-900 z-[-1]"></div>

        {/* Main Vibely Logo Section */}
        <div className="absolute inset-0 z-10 flex items-start justify-center px-10 pt-50">
          <div className={`text-center ${styles.animateFadeIn}`}>
            <div className="group cursor-pointer">
              {/* Large animated Vibely text */}
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 transition-all duration-700 group-hover:scale-105 group-hover:text-purple-200">
                {/* Each letter bounces individually with staggered timing */}
                <span
                  className={styles.animateLetterBounce}
                  style={{ animationDelay: "0s" }}
                >
                  V
                </span>
                <span
                  className={styles.animateLetterBounce}
                  style={{ animationDelay: "0.1s" }}
                >
                  i
                </span>
                <span
                  className={styles.animateLetterBounce}
                  style={{ animationDelay: "0.2s" }}
                >
                  b
                </span>
                <span
                  className={styles.animateLetterBounce}
                  style={{ animationDelay: "0.3s" }}
                >
                  e
                </span>
                <span
                  className={styles.animateLetterBounce}
                  style={{ animationDelay: "0.4s" }}
                >
                  l
                </span>
                <span
                  className={styles.animateLetterBounce}
                  style={{ animationDelay: "0.5s" }}
                >
                  y
                </span>
              </h1>

              {/* Brand tagline with delayed animation */}
              <p
                className={`text-xl md:text-2xl text-white/90 font-medium italic tracking-wide ${styles.animateSlideUpDelayed}`}
              >
                "Where friendships begin."
              </p>

              {/* Decorative dots with pulsing animation */}
              <div
                className={`mt-6 flex justify-center space-x-2 ${styles.animateFadeInDelayed}`}
              >
                <div
                  className="w-3 h-3 bg-white/60 rounded-full animate-pulse"
                  style={{ animationDelay: "0s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-white/60 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-white/60 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Icons at Bottom */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {[
            { src: "/icons/facebook.svg", alt: "Facebook", delay: "0s" },
            { src: "/icons/instagram.svg", alt: "Instagram", delay: "0.2s" },
            { src: "/icons/x.svg", alt: "X", delay: "0.4s" },
          ].map((social, index) => (
            <div
              key={index}
              className={`w-12 h-12 bg-black bg-opacity-20 rounded-md flex items-center justify-center cursor-pointer hover:bg-opacity-40 transition-all duration-300 hover:scale-125 hover:rotate-12 ${styles.animateBounceIn}`}
              style={{ animationDelay: social.delay }}
            >
              {/* Social media icon with hover effects */}
              <img
                src={social.src}
                alt={social.alt}
                className="w-4 h-4 brightness-0 invert transition-all duration-300 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================== */}
      {/* RIGHT SIDE - AUTHENTICATION FORM */}
      {/* ================================================================== */}
      <div className="w-1/2 bg-gradient-to-br from-purple-400 via-white to-indigo-400 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, #9333ea 0, #9333ea 1px, transparent 1px, transparent 40px),
                                    repeating-linear-gradient(90deg, #9333ea 0, #9333ea 1px, transparent 1px, transparent 40px)`,
            }}
          ></div>
        </div>

        {/* Language selector in top right corner */}
        <div className="absolute top-6 right-6">
          <select className="text-xs text-gray-500 bg-transparent border-none focus:outline-none cursor-pointer">
            <option value="en">English</option>
            <option value="fi">Suomi</option>
            <option value="sv">Svenska</option>
          </select>
        </div>

        {/* Form container with slide animation */}
        <div
          className={`w-full max-w-sm transition-all duration-500 ${showForm ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
        >
          {/* Main form card */}
          <div className="bg-gray-50 rounded-2xl shadow-lg p-8 border border-gray-200">
            {/* Welcome message section */}
            <div className={`text-center mb-6 ${styles.animateFadeIn}`}>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {isLogin
                  ? "Welcome back to Vibely"
                  : "Start your Vibely journey"}
              </h3>
              <p className="text-sm text-gray-600">
                {isLogin
                  ? "Connect with your community again"
                  : "Connect, discover events, and make real friends"}
              </p>
            </div>

            {/* Google login button - only shown during signup */}
            {!isLogin && (
              <div
                className={`mb-6 space-y-3 ${styles.animateSlideUp}`}
                style={{ animationDelay: "0.1s" }}
              >
                <button className="w-full flex items-center justify-center px-4 py-3 border border-purple-200 rounded-lg hover:bg-purple-50/50 transition-all duration-300 hover:scale-105 group bg-white">
                  {/* Google logo SVG */}
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285f4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34a853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#fbbc05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#ea4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Continue with Google
                  </span>
                </button>

                {/* Divider between Google login and form */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-purple-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 text-gray-500">or</span>
                  </div>
                </div>
              </div>
            )}

            {/* Form header with dynamic text */}
            <div className={`mb-8 ${styles.animateSlideDown}`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 transition-all duration-300">
                {isLogin ? "Login" : "Sign Up"}
              </h2>
              <p className="text-sm text-gray-600 transition-all duration-300">
                {isLogin
                  ? "Please enter your credentials"
                  : "Please fill your information below"}
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-600 mb-4 text-center font-medium">
                {error}
              </p>
            )}

            {/* Form fields with staggered animations */}
            <div className="space-y-4">
              {/* Name field - only shown during signup */}
              {!isLogin && (
                <div
                  key={`name-${isLogin}`}
                  className={styles.animateSlideUp}
                  style={{ animationDelay: "0.1s" }}
                >
                  <div className="relative group">
                    {/* User icon */}
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 transition-all duration-300 group-focus-within:text-purple-500 z-10" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-all duration-300 focus:shadow-lg"
                      placeholder="Name"
                    />
                  </div>
                </div>
              )}

              {/* Phone number field with country code - only shown during signup */}
              {!isLogin && (
                <div
                  key={`phone-${isLogin}`}
                  className={styles.animateSlideUp}
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="group">
                    <div className="flex">
                      {/* Country code selector */}
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleInputChange}
                        className="px-3 py-3 bg-white border border-r-0 border-purple-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-700 font-medium cursor-pointer transition-all duration-300 focus:bg-white"
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.flag} {country.code}
                          </option>
                        ))}
                      </select>
                      {/* Phone number input */}
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="flex-1 pl-3 pr-3 py-3 border border-purple-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-all duration-300 focus:shadow-lg"
                        placeholder="503923239"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email field - shown in both login and signup */}
              <div
                key={`email-${isLogin}`}
                className={styles.animateSlideUp}
                style={{ animationDelay: isLogin ? "0.1s" : "0.3s" }}
              >
                <div className="relative group">
                  {/* Mail icon */}
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 transition-all duration-300 group-focus-within:text-purple-500 z-10" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-all duration-300 focus:shadow-lg"
                    placeholder="E-mail"
                  />
                </div>
              </div>

              {/* Password field with visibility toggle */}
              <div
                key={`password-${isLogin}`}
                className={styles.animateSlideUp}
                style={{ animationDelay: isLogin ? "0.2s" : "0.4s" }}
              >
                <div className="relative group">
                  {/* Lock icon */}
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 transition-all duration-300 group-focus-within:text-purple-500 group-focus-within:scale-110 z-10" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-all duration-300 focus:shadow-lg"
                    placeholder="Password"
                  />
                  {/* Password visibility toggle button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 hover:scale-125 z-10"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-500 group-focus-within:text-purple-500 transition-colors duration-300" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-500 group-focus-within:text-purple-500 transition-colors duration-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me and forgot password - only shown during login */}
              {isLogin && (
                <div
                  className={`flex items-center justify-between text-sm ${styles.animateSlideUp}`}
                  style={{ animationDelay: "0.3s" }}
                >
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-2 text-gray-600">Remember me</span>
                  </label>
                  <button className="text-purple-600 hover:text-purple-700 transition-colors duration-300">
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Terms and conditions checkbox - only shown during signup */}
              {!isLogin && (
                <div
                  className={styles.animateSlideUp}
                  style={{ animationDelay: "0.5s" }}
                >
                  <label className="flex items-start text-sm">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-2 mt-0.5"
                    />
                    <span className="ml-2 text-gray-600">
                      I agree to the{" "}
                      <button className="text-purple-600 hover:underline">
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button className="text-purple-600 hover:underline">
                        Privacy Policy
                      </button>
                    </span>
                  </label>
                </div>
              )}


              {/* Submit button with loading state */}
              <div
                className={styles.animateSlideUp}
                style={{ animationDelay: isLogin ? "0.4s" : "0.6s" }}
              >
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      {/* Loading spinner */}
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {isLogin ? "Login" : "Create Account"}
                      {/* Arrow icon that moves on hover */}
                      <svg
                        className="ml-2 w-4 h-4 transition-all duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Footer section with mode toggle */}
            <div
              className={`mt-6 text-center ${styles.animateFadeIn}`}
              style={{ animationDelay: "0.7s" }}
            >
              {/* Additional login option - only shown during login */}
              {isLogin && (
                <div className="mb-4">
                  <button className="text-sm text-gray-600 hover:text-gray-800 transition-all duration-300 hover:scale-105">
                    Login to a different account
                  </button>
                </div>
              )}

              {/* Toggle between login and signup modes */}
              <p className="text-sm text-gray-600">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  onClick={toggleMode}
                  className="ml-1 text-purple-600 hover:text-purple-700 font-medium transition-all duration-300 hover:scale-105 hover:underline"
                >
                  {isLogin ? "Sign up" : "Login to your account"}
                </button>
              </p>
            </div>

            {/* Security badge for trust */}
            <div
              className={`mt-8 flex items-center justify-center text-xs text-gray-500 ${styles.animateFadeIn}`}
              style={{ animationDelay: "0.8s" }}
            >
              {/* Lock icon */}
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              SSL Secured • Your data is protected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
