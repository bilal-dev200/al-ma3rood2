"use client";
import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "@/components/WebsiteComponents/LanguageSwitcher";
import { authApi } from "@/lib/api/auth";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { IoEyeSharp } from "react-icons/io5";
import { FaUnlockAlt } from "react-icons/fa";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (!tokenParam || !emailParam) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    setToken(tokenParam);
    setEmail(decodeURIComponent(emailParam));
  }, [searchParams]);

  const validate = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!passwordConfirmation) {
      newErrors.passwordConfirmation = "Please confirm your password";
    } else if (password !== passwordConfirmation) {
      newErrors.passwordConfirmation = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setError(Object.values(newErrors)[0]);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validate()) {
      return;
    }

    if (!token || !email) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });
      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      console.error("Reset Password Error:", err);
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col md:flex-row w-full h-screen">
        <div>
          <LanguageSwitcher
            className="absolute top-4 left-2"
            buttonClassName="bg-green-600 text-green"
          />
        </div>

        <div className="w-full md:w-[60%] flex flex-col justify-center items-center px-4 py-8 bg-white min-h-screen md:min-h-full">
          <div className="flex justify-center mb-6">
            <Link href="/">
              <Image
                src="/Ma3rood-logo-green.png"
                alt="Ma3rood Logo"
                width={180}
                height={60}
                priority
                className="cursor-pointer"
              />
            </Link>
          </div>
          <div className="w-full max-w-sm space-y-4 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <FaUnlockAlt className="text-3xl text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {t("Password Reset Successful")}
            </h2>
            <p className="text-sm text-gray-600">
              {t("Your password has been reset successfully. Redirecting to login...")}
            </p>
            <Link
              href="/login"
              className="inline-block text-sm text-green-600 hover:text-green-800"
            >
              {t("Go to Login")}
            </Link>
          </div>
        </div>

        <div className="hidden md:flex w-[40%] bg-[#175f48] text-white flex-col justify-between px-8 py-12">
          <div className="mx-auto text-center">
            <p>
              {t(
                "Pick up right where you left off. Log in to access powerful seller tools and insights, manage your listings, messages, and orders — all in one place. Trusted by thousands across the Kingdom."
              )}
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="./login.png"
              alt="Mobile Login"
              className="w-[440px] h-[380px] object-contain"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      {/* Language Switcher */}
      <div>
        <LanguageSwitcher
          className="absolute top-4 left-2"
          buttonClassName="bg-green-600 text-green"
        />
      </div>

      {/* LEFT: Form Section */}
      <div className="w-full md:w-[60%] flex flex-col justify-center items-center px-4 py-8 bg-white min-h-screen md:min-h-full">
        <div className="flex justify-center mb-6">
          <Link href="/">
            <Image
              src="/Ma3rood-logo-green.png"
              alt="Ma3rood Logo"
              width={180}
              height={60}
              priority
              className="cursor-pointer"
            />
          </Link>
        </div>
        <div className="w-full max-w-sm space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
            {t("Reset Password")}
          </h2>

          <p className="text-sm text-gray-600 text-center mb-4">
            {t("Enter your new password below.")}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
              <button
                onClick={() => setError("")}
                className="float-right font-bold"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                {t("New Password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className={`w-full p-2 ${isArabic ? "pl-10" : "pr-10"} border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 border-gray-300`}
                  disabled={isLoading}
                  required
                  minLength={6}
                  placeholder={t("Enter new password")}
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
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="password_confirmation"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                {t("Confirm Password")}
              </label>
              <div className="relative">
                <input
                  type={showPasswordConfirmation ? "text" : "password"}
                  id="password_confirmation"
                  name="password_confirmation"
                  value={passwordConfirmation}
                  onChange={(e) => {
                    setPasswordConfirmation(e.target.value);
                    setError("");
                  }}
                  className={`w-full p-2 ${isArabic ? "pl-10" : "pr-10"} border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 border-gray-300`}
                  disabled={isLoading}
                  required
                  minLength={6}
                  placeholder={t("Confirm new password")}
                />
                <button
                  type="button"
                  className={`absolute inset-y-0 ${
                    isArabic ? "left-0 pl-3" : "right-0 pr-3"
                  } flex items-center text-gray-500 hover:text-gray-700`}
                  onClick={() =>
                    setShowPasswordConfirmation(!showPasswordConfirmation)
                  }
                  aria-label={
                    showPasswordConfirmation ? "Hide password" : "Show password"
                  }
                >
                  {showPasswordConfirmation ? (
                    <IoEyeSharp className="w-5 h-5" />
                  ) : (
                    <BsFillEyeSlashFill className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !token || !email}
              className={`w-full py-2 px-4 cursor-pointer border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                isLoading || !token || !email
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
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
                  {t("Resetting...")}
                </span>
              ) : (
                t("Reset Password")
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            <Link href="/login" className="text-green-600 hover:text-green-800">
              {t("Back to Login")}
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT: Info Section */}
      <div className="hidden md:flex w-[40%] bg-[#175f48] text-white flex-col justify-between px-8 py-12">
        <div className="mx-auto text-center">
          <p>
            {t(
              "Pick up right where you left off. Log in to access powerful seller tools and insights, manage your listings, messages, and orders — all in one place. Trusted by thousands across the Kingdom."
            )}
          </p>
        </div>

        <div className="flex justify-center">
          <img
            src="./login.png"
            alt="Mobile Login"
            className="w-[440px] h-[380px] object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  const { t } = useTranslation();

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          {t("Loading...")}
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
