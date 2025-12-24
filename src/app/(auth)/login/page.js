// "use client";
// import LoginForm from "@/components/auth/LoginForm";
// import LanguageSwitcher from "@/components/WebsiteComponents/LanguageSwitcher";
// import { useAuthStore } from "@/lib/stores/authStore";
// import Link from "next/link";
// import { Suspense } from "react";
// import { useTranslation } from "react-i18next";
// import { useRouter } from "next/navigation";

// function LoginPageContent() {
//   const { user, login, error, isLoading, resetError } = useAuthStore();
//   const router = useRouter();

//   const { t } = useTranslation();

//   // Redirect if already logged in
//   // useEffect(() => {
//   //   if (user) {
//   //     router.push('/');
//   //   }
//   // }, [user, redirect]);

//   const handleLogin = async (credentials) => {
//     try {
//       await login(credentials.email, credentials.password);
//       // router.push("/");
//       window.location.href = "/";
//       // window.history.back();
//       // router.back();
//     } catch (err) {
//       console.log("Login failed:", err);
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row w-full h-screen">
//       {/* Language Switcher at top right corner */}
//       <div className="">
//         <LanguageSwitcher
//           className="absolute top-4 left-2"
//           buttonClassName="bg-green-600 text-green"
//         />
//       </div>

//       <div className="w-full md:w-[60%] flex justify-center items-center px-4 py-8 bg-white min-h-screen md:min-h-full">
//         <div className="w-full max-w-sm space-y-4">
//           <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
//             {t("Login")}
//           </h2>
//           {/* <LanguageSwitcher /> */}

//           {error && (
//             <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
//               {error}
//               <button onClick={resetError} className="float-right font-bold">
//                 ×
//               </button>
//             </div>
//           )}

//           <LoginForm
//             onSubmit={handleLogin}
//             isLoading={isLoading}
//             resetError={resetError}
//           />

//           <p className="mt-4 text-center">
//             {t("Don't have an account?")}{" "}
//             <Link href="/register" className="text-green-600">
//               {t("Register")}
//             </Link>
//           </p>

//           <p className="mt-2 text-center text-sm text-gray-600">
//             {t("By logging in, you agree to our")}{" "}
//             <Link
//               href="/privacy-policy"
//               className="text-green-600  hover:text-green-800"
//             >
//               {t("Privacy Policy")}
//             </Link>
//           </p>
//         </div>
//       </div>

//       {/* RIGHT: Blue Section (hidden on small screens) */}
//       <div className="hidden md:flex w-[40%] bg-[#175f48] text-white flex-col justify-between px-8 py-12">
//         <div className="mx-auto text-center">
//           <h2>{t("Let’s Pick Up Where You Left Off")}</h2>

//           <p>
//             {t(
//               "Pick up right where you left off. Log in to access powerful seller tools and insights, manage your listings, messages, and orders — all in one place. Trusted by thousands across the Kingdom."
//             )}
//           </p>
//         </div>

//         <div className="flex justify-center">
//           <img
//             src="./login.png"
//             alt="Mobile Login"
//             className="w-[440px] h-[380px] object-contain"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function LoginPage() {
//   const { t } = useTranslation();

//   return (
//     <Suspense
//       fallback={
//         <div className="flex items-center justify-center h-screen">
//           {t("Loading...")}{" "}
//         </div>
//       }
//     >
//       <LoginPageContent />
//     </Suspense>
//   );
// }
"use client";
import LoginForm from "@/components/auth/LoginForm";
import LanguageSwitcher from "@/components/WebsiteComponents/LanguageSwitcher";
import { useAuthStore } from "@/lib/stores/authStore";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function LoginPageContent() {
  const { user, login, error, isLoading, resetError } = useAuthStore();
  const [isForgotMode, setIsForgotMode] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
const callbackUrl = searchParams.get("callbackUrl");

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     router.replace("/");
  //   }
  // }, [router]);

  // const handleLogin = async (credentials) => {
  //   try {
  //     const res = await login(credentials.email, credentials.password);

  //   if (res.success && res.user) {
  //     window.location.href = "/";
  //   } else if (res.requireVerification) {
  //     router.push(`/verification?email=${encodeURIComponent(res.email)}`);
  //   }
  //   } catch (err) {
  //     console.log("Login failed:", err);
  //   }
  // };
  const handleLogin = async (credentials) => {
    try {
      const res = await login(credentials.email, credentials.password);
      console.log("Res", res);
      "Login response:", res;
      if (res.success && res.user) {
      router.replace(callbackUrl || "/");
      return;
    }
     if (res.error == "Emails is not verified yet" && res.email) {
        router.push(`/verification?email=${encodeURIComponent(res.email)}`);
      }
    } catch (err) {
      console.log("Unexpected login error:", err);
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
          {/* Logo */}
          {/* Logo */}
          {/* <div className="flex justify-center mt-6 mb-6">
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
</div> */}

          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
            {isForgotMode ? t("Forgot Password") : t("Login")}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
              <button onClick={resetError} className="float-right font-bold">
                ×
              </button>
            </div>
          )}

          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            resetError={resetError}
            isForgotMode={isForgotMode}
            setIsForgotMode={setIsForgotMode}
          />

          {!isForgotMode && (
            <>
              <p className="mt-4 text-center">
                {t("Don't have an account?")}{" "}
                <Link href="/register" className="text-green-600">
                  {t("Register")}
                </Link>
              </p>

              <p className="mt-1 text-center text-sm text-gray-600">
                {t("By logging in, you agree to our")}{" "}
                <Link
                  href="/privacy"
                  className="text-green-600 hover:text-green-800"
                >
                  {t("Privacy Policy")}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>

      {/* RIGHT: Info Section */}
      <div className="hidden md:flex w-[40%] bg-[#175f48] text-white flex-col justify-between px-8 py-12">
        <div className="mx-auto text-center">
          {/* <h2>{t("Let’s Pick Up Where You Left Off")}</h2> */}
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

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          {t("Loading...")}
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
