import React from "react";
import { User, Mail } from "lucide-react";
import styles from "./authPage.module.css";
import FormInput from "./FormInput";
import PhoneInput from "./PhoneInput";
import PasswordInput from "./PasswordInput";
import GoogleLoginButton from "./GoogleLoginButton";

const AuthForm = ({
  isLogin,
  formData,
  showPassword,
  showForm,
  error,
  isLoading,
  rememberMe,
  termsAccepted,
  onInputChange,
  onTogglePassword,
  onRememberMeChange,
  onTermsChange,
  onSubmit,
  onToggleMode,
}) => {
  return (
    <div className="w-full lg:w-1/2 bg-gradient-to-br from-purple-400 via-white to-indigo-400 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, #9333ea 0, #9333ea 1px, transparent 1px, transparent 40px),
                                  repeating-linear-gradient(90deg, #9333ea 0, #9333ea 1px, transparent 1px, transparent 40px)`,
          }}
        ></div>
      </div>

      {/* Form container */}
      <div
        className={`w-full max-w-sm transition-all duration-500 ${
          showForm ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        }`}
      >
        <div className="bg-gray-50 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-200">
          {/* Welcome message */}
          <div className={`text-center mb-6 ${styles.animateFadeIn}`}>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {isLogin ? "Welcome back to Vibely" : "Start your Vibely journey"}
            </h3>
            <p className="text-sm text-gray-600">
              {isLogin
                ? "Connect with your community again"
                : "Connect, discover events, and make real friends"}
            </p>
          </div>

          {/* Google login button - signup only */}
          {/* {!isLogin && (
            <div
              className={`mb-6 space-y-3 ${styles.animateSlideUp}`}
              style={{ animationDelay: "0.1s" }}
            >
              <GoogleLoginButton />

              {/* Divider */}
              {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-purple-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">or</span>
                </div>
              </div>
            </div>
          )} */}

          {/* Form header */}
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

          {/* Error message */}
          {error && (
            <p className="text-sm text-red-600 mb-4 text-center font-medium">
              {error}
            </p>
          )}

          {/* Form fields */}
          <div className="space-y-4">
            {/* Name field - signup only */}
            {!isLogin && (
              <div
                key={`name-${isLogin}`}
                className={styles.animateSlideUp}
                style={{ animationDelay: "0.1s" }}
              >
                <FormInput
                  icon={User}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={onInputChange}
                  placeholder="Name"
                />
              </div>
            )}

            {/* Phone field - signup only */}
            {!isLogin && (
              <div
                key={`phone-${isLogin}`}
                className={styles.animateSlideUp}
                style={{ animationDelay: "0.2s" }}
              >
                <PhoneInput
                  countryCode={formData.countryCode}
                  phone={formData.phone}
                  onChange={onInputChange}
                />
              </div>
            )}

            {/* Email field */}
            <div
              key={`email-${isLogin}`}
              className={styles.animateSlideUp}
              style={{ animationDelay: isLogin ? "0.1s" : "0.3s" }}
            >
              <FormInput
                icon={Mail}
                type="email"
                name="email"
                value={formData.email}
                onChange={onInputChange}
                placeholder="E-mail"
              />
            </div>

            {/* Password field */}
            <div
              key={`password-${isLogin}`}
              className={styles.animateSlideUp}
              style={{ animationDelay: isLogin ? "0.2s" : "0.4s" }}
            >
              <PasswordInput
                value={formData.password}
                onChange={onInputChange}
                showPassword={showPassword}
                onTogglePassword={onTogglePassword}
              />
            </div>

            {/* Remember me & Forgot password - login only */}
            {isLogin && (
              <div
                className={`flex items-center justify-between text-sm ${styles.animateSlideUp}`}
                style={{ animationDelay: "0.3s" }}
              >
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={onRememberMeChange}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-2 cursor-pointer"
                  />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <button className="text-purple-600 hover:text-purple-700 transition-colors duration-300">
                  Forgot password?
                </button>
              </div>
            )}

            {/* Terms and conditions - signup only */}
            {!isLogin && (
              <div
                className={styles.animateSlideUp}
                style={{ animationDelay: "0.5s" }}
              >
                <label className="flex items-start text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={onTermsChange}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-2 mt-0.5 cursor-pointer"
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

            {/* Submit button */}
            <div
              className={styles.animateSlideUp}
              style={{ animationDelay: isLogin ? "0.4s" : "0.6s" }}
            >
              <button
                onClick={onSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {isLogin ? "Login" : "Create Account"}
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

          {/* Footer */}
          <div
            className={`mt-6 text-center ${styles.animateFadeIn}`}
            style={{ animationDelay: "0.7s" }}
          >
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={onToggleMode}
                className="ml-1 text-purple-600 hover:text-purple-700 font-medium transition-all duration-300 hover:scale-105 hover:underline"
              >
                {isLogin ? "Sign up" : "Login to your account"}
              </button>
            </p>
          </div>

          {/* Security badge */}
          <div
            className={`mt-8 flex items-center justify-center text-xs text-gray-500 ${styles.animateFadeIn}`}
            style={{ animationDelay: "0.8s" }}
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
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
  );
};

export default AuthForm;