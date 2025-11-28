"use client";
import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "@/components/WebsiteComponents/LanguageSwitcher";
import { authApi } from "@/lib/api/auth";
import { FiMail } from "react-icons/fi";

function ForgotPasswordContent() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  // Pre-fill email from query params if available
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const validateEmail = (email) => {
    if (!email) {
      return "Email is required";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      console.error("Forgot Password Error:", err);
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
            {t("Forgot Password")}
          </h2>

          {success ? (
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <FiMail className="text-3xl text-green-600" />
                </div>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800 text-center">
                  {t(
                    "We've sent a password reset link to your email. Please check your inbox and follow the instructions to reset your password."
                  )}
                </p>
              </div>
              <Link
                href="/login"
                className="block text-center text-sm text-green-600 hover:text-green-800"
              >
                {t("Back to Login")}
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 text-center mb-4">
                {t(
                  "Enter your email address and we'll send you a link to reset your password."
                )}
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
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    {t("Email Address")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 border-gray-300"
                    disabled={isLoading}
                    required
                    placeholder={t("Enter your email")}
                  />
                </div>

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
                      {t("Sending...")}
                    </span>
                  ) : (
                    t("Send Reset Link")
                  )}
                </button>
              </form>

              <p className="mt-4 text-center text-sm">
                <Link href="/login" className="text-green-600 hover:text-green-800">
                  {t("Back to Login")}
                </Link>
              </p>
            </>
          )}
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

export default function ForgotPasswordPage() {
  const { t } = useTranslation();

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          {t("Loading...")}
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
