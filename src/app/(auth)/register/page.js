"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "@/components/auth/RegisterForm";
import { useAuthStore } from "@/lib/stores/authStore";
import { setAuthToken } from "@/lib/api/auth";
import LanguageSwitcher from "@/components/WebsiteComponents/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import Link from "next/link";


export default function RegisterPage() {
  const router = useRouter();
  const { register, error, isLoading, resetError } = useAuthStore();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/"); 
    }
  }, [router]);

  const handleRegister = async (formData) => {
    try {
      const res = await register(formData);
      if (res.success) {
        // Navigate to verification with email
        router.push(`/verification?email=${encodeURIComponent(res.email)}`);
      }
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };
  return (
    // <div className="max-w-md mx-auto mt-10">
    //   <h1 className="text-2xl font-bold mb-4">Create Account</h1>

    //   {error && (
    //     <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
    //       {error}
    //       <button
    //         onClick={resetError}
    //         className="float-right font-bold cursor-pointer"
    //       >
    //         ×
    //       </button>
    //     </div>
    //   )}

    //   <RegisterForm
    //     onSubmit={handleRegister}
    //     isLoading={isLoading}
    //   />

    //   <p className="mt-4 text-center">
    //     Already have an account?{' '}
    //     <a href="/login" className="text-green-600">
    //       Sign in
    //     </a>
    //   </p>
    // </div>

    <div className="min-h-screen w-full flex flex-col lg:flex-row ">
      {/* Left side (Blue section - hidden on mobile) */}
      <div className="hidden lg:flex w-full lg:w-[40%] bg-[#175f48] text-white flex-col justify-between p-8 lg:p-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold mb-4 leading-snug">
            {t("Register to Trade,")} <br /> <span>{t("Buy & Sell")}</span>
          </h1>
          <p className="text-sm sm:text-base mb-6">
            {t(
              "Our platform connects buyers and sellers worldwide, making trade simple and efficient. Discover a wide range of products and services tailored to meet your business needs. Empower your trade journey with secure, fast, and reliable solutions"
            )}
          </p>
        </div>
        <div className="flex justify-center lg:justify-start">
          <img
            src="./register.png"
            alt="Phone"
            className="w-[300px] sm:w-[400px] md:w-[500px] lg:w-[850px] h-[200px] sm:h-[250px] md:h-[312px] object-contain -ml-24"
          />
        </div>
      </div>

      {/* Right side (Form section) */}
      <div className="w-full lg:w-[60%] flex items-center justify-center bg-white px-4 py-20 min-h-screen">
  
        <div className="w-full max-w-xl">
            <div className="text-right -mt20">
            <LanguageSwitcher
              className="absolute  "
              buttonClassName="bg-green-600 text-green"
            />
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded relative">
              {error}
              <button
                onClick={resetError}
                className="absolute top-2 right-3 font-bold cursor-pointer"
                aria-label="Close error"
              >
                ×
              </button>
            </div>
          )}

      
          <h2
            className={`text-2xl font-bold mb-6 text-center ${i18n.language === "ar" ? "text-right" : "lg:text-left"
              }`}
          >
            {t("Register")}
          </h2>
          <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
          <p className="mt-4 text-center text-sm text-gray-600">
            {t("By registering, you agree to our")}{" "}
            <Link
              href="/privacy"
              className="text-green-600 underline hover:text-green-800"
            >
              {t("Privacy Policy")}
            </Link>
          </p>
          <p className="mt-2 text-center">
            {t("Already have an account?")}{" "}
            <Link href="/login" className="text-green-600">
              {t("Sign in")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
