"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { IoEyeSharp } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { authApi } from "@/lib/api/auth";

export default function LoginForm({ onSubmit, isLoading, resetError, isForgotMode, setIsForgotMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const router = useRouter();

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!isForgotMode) {
      if (!password) {
        newErrors.password = "Password is required";
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ email, password });
    }
  };

  const handleForgotPassword = async () => {
  if (!email) {
    setErrors({ email: "Please enter your email first" });
    return;
  }

  try {
    await authApi.forgotPassword(email);
    router.push(`/forgot-password?email=${encodeURIComponent(email)}`);
  } catch (error) {
    console.error("Forgot Password Error:", error);
    alert("Something went wrong. Please try again.");
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {t("Email Address")}{" "}
        </label>
        <input
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            resetError();
          }}
          className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          disabled={isLoading}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Field — hide when forgot mode */}
      {!isForgotMode && (
      <div>
        <label
          htmlFor="password"
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {t("Password")}
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              resetError();
            }}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          <button
            type="button"
            className={`absolute inset-y-0 ${
              isArabic ? "left-0 pl-3" : "right-0 pr-3"
            } flex items-center text-gray-500 hover:text-gray-700`}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <IoEyeSharp className="w-5 h-5" />
            ) : (
              <BsFillEyeSlashFill className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="mt-1 text-sm text-red-600">
            {errors.password}
          </p>
        )}
      </div>
      )}

      {/* Forgot Password Link */}
      {!isForgotMode && (
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-green-600 hover:text-green-800 cursor-pointer"
          >
            {t("Forgot password?")}
          </Link>
        </div>
      )}

      {/* Submit Button */}
      {!isForgotMode ? (
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 cursor-pointer border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
            isLoading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Spinner className="animate-spin h-4 w-4 mr-2" />
              {t("Signing in...")}
            </span>
          ) : (
            t("Sign In")
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={isLoading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isLoading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isLoading ? t("Sending...") : t("Send Code")}
        </button>
      )}
    </form>
  );
}

// Simple icon components (replace with your actual icons)
function EyeIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

function EyeOffIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      />
    </svg>
  );
}

function Spinner({ className }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
