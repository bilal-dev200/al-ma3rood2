// "use client";
// import React from "react";
// import Image from "next/image";
// import { useTranslation } from "react-i18next";
// import { FaUserCheck, FaSignInAlt } from "react-icons/fa";
// import TrustSafety from "./TrustSafety";
// import  { Faqs }  from "./Faqs";

// export const HowWorks = () => {
//   const { t } = useTranslation();

//   const steps = [
//     {
//       title: t("Create & Verify Your Account"),
//       description: t(
//         "Sign up with your email or mobile number. Complete basic profile info and verify to unlock messaging and alerts."
//       ),
//       image: "/work1.png",
//     },
//     {
//       title: t("Browse & Search Smart"),
//       description: t(
//         "Explore categories like cars, homes, jobs, and more with smart filters for price, location, and condition. Save your searches and get instant alerts for new deals."
//       ),
//       image: "/work2.png",
//     },
//     {
//       title: t("Check the Details"),
//       description: t(
//         "Review photos, description, specs, and the seller’s rating. Look for Verification badges and listing history for extra confidence."
//       ),
//       image: "/work3.png",
//     },
//     {
//       title: t("Chat Securely"),
//       description: t(
//         "Message sellers in-app to ask questions, request more photos, or confirm availability. Keep all coordination inside Ma3rood chat for safety."
//       ),
//       image: "/work4.png",
//     },
//     {
//       title: t("Make an Offer or Proceed"),
//       description: t(
//         "Use Make Offer (where available) or agree on a final price in chat. For property/jobs/services, schedule viewings, interviews, or service calls."
//       ),
//       image: "/work5.png",
//     },
//     {
//       title: t("Arrange Payment & Delivery"),
//       description: t(
//         "Agree on a method that suits you: cash on delivery, bank transfer, or any in-app payment option available in your city (if enabled). Choose pickup or delivery where supported. Confirm timing and handover location."
//       ),
//       image: "/work5.png",
//     },
//     {
//       title: t("Rate & Review"),
//       description: t(
//         "After the deal, leave a rating. Great behavior builds trust across the community."
//       ),
//       image: "/work5.png",
//     },
//   ];
//    const steps1 = [
//     {
//       title: t("Register & Verify"),
//       description: t(
//         "Create your account, add your business name (if applicable), and verify to boost trust."
//       ),
//       image: "/work1.png",
//     },
//     {
//       title: t("Create a Standout Listing"),
//       description: t(
//         "Pick the right category (e.g., Household Items → Electronics).Add clear photos, a precise title, and an honest description.Set price in SAR and choose condition, location, and pickup/delivery options."
//       ),
//       image: "/work2.png",
//     },
//     {
//       title: t("Check the Details"),
//       description: t(
//         "Review photos, description, specs, and the seller’s rating. Look for Verification badges and listing history for extra confidence."
//       ),
//       image: "/work3.png",
//     },
//     {
//       title: t("Chat Securely"),
//       description: t(
//         "Message sellers in-app to ask questions, request more photos, or confirm availability. Keep all coordination inside Ma3rood chat for safety."
//       ),
//       image: "/work4.png",
//     },
//     {
//       title: t("Make an Offer or Proceed"),
//       description: t(
//         "Use Make Offer (where available) or agree on a final price in chat. For property/jobs/services, schedule viewings, interviews, or service calls."
//       ),
//       image: "/work5.png",
//     },
//     {
//       title: t("Arrange Payment & Delivery"),
//       description: t(
//         "Agree on a method that suits you: cash on delivery, bank transfer, or any in-app payment option available in your city (if enabled). Choose pickup or delivery where supported. Confirm timing and handover location."
//       ),
//       image: "/work5.png",
//     },
//     {
//       title: t("Rate & Review"),
//       description: t(
//         "After the deal, leave a rating. Great behavior builds trust across the community."
//       ),
//       image: "/work5.png",
//     },
//   ];

//   return (
//     <div>
//       {/* Page Heading */}
//       <h1 className="text-3xl font-bold text-center">{t("How It Works – Ma3rood")}</h1>
//       <p className="text-center text-gray-700 mt-2 max-w-2xl mx-auto">
//         {t(
//           "Simple steps to buy & sell across the Kingdom. Whether you’re here to find a great deal or to reach more buyers, Ma3rood makes trading fast, safe, and straightforward."
//         )}
//       </p>

//       {/* Quick Start Section */}
//    <div className="p-4 mt-10 mx-auto max-w-3xl">
//   {/* Heading */}
//   <h3 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3 text-gray-800">
//     {t("Quick Start")}
//   </h3>

//   {/* First Row */}
//   <div className="flex items-center justify-between mb-10 flex-col sm:flex-row">
//     {/* Image Left */}
//     <img
//       src="/images/signup.png" // yaha apni image ka path do
//       alt="Create Account"
//       className="w-32 h-32 object-contain sm:mr-6 mb-4 sm:mb-0"
//     />
//     {/* Text Right */}
//     <p className="text-base sm:text-lg text-center sm:text-left max-w-md text-gray-700 leading-relaxed">
//       {t(
//         "New to Ma3rood? Create your account with just a few steps, verify your profile, and instantly start exploring categories or listing your first item to reach buyers quickly."
//       )}
//     </p>
//   </div>

//   {/* Second Row */}
//   <div className="flex items-center justify-between flex-col sm:flex-row-reverse">
//     {/* Image Right */}
//     <img
//       src="/images/login.png" // yaha apni image ka path do
//       alt="Login"
//       className="w-32 h-32 object-contain sm:ml-6 mb-4 sm:mb-0"
//     />
//     {/* Text Left */}
//     <p className="text-base sm:text-lg text-center sm:text-left max-w-md text-gray-700 leading-relaxed">
//       {t(
//         "Already a member? Simply log in and continue from where you left off — access your dashboard to manage listings, reply to messages, and track your ongoing orders with ease."
//       )}
//     </p>
//   </div>
// </div>




//       {/* Seller Section */}
//       <h2 className="text-3xl font-semibold text-center mt-10">{t("For Buyers")}</h2>
//       <div className="mt-10 flex flex-wrap gap-6 justify-center">
//         {steps.map((step, index) => (
//           <div
//             key={index}
//             className="bg-green-600 text-white w-full sm:w-[387px] rounded-[10px] p-6 flex flex-col transition relative"
//           >
//             <p className="absolute top-3 left-4 text-sm font-semibold">
//               {t("Step")} {index + 1}
//             </p>

//             <div className="mt-6 mb-4 flex justify-center w-full">
//               <Image src={step.image} alt={step.title} width={56} height={56} />
//             </div>

//             <h2 className="text-xl font-semibold text-center">{step.title}</h2>

//             <p className="text-center text-sm mt-2">{step.description}</p>
//           </div>
//         ))}
//       </div>

//       <h2 className="text-3xl font-semibold text-center mt-10">{t("For Sellers")}</h2>
//       <div className="mt-10 flex flex-wrap gap-6 justify-center">
//         {steps1.map((step, index) => (
//           <div
//             key={index}
//             className="bg-green-600 text-white w-full sm:w-[387px] rounded-[10px] p-6 flex flex-col transition relative"
//           >
//             <p className="absolute top-3 left-4 text-sm font-semibold">
//               {t("Step")} {index + 1}
//             </p>

//             <div className="mt-6 mb-4 flex justify-center w-full">
//               <Image src={step.image} alt={step.title} width={56} height={56} />
//             </div>

//             <h2 className="text-xl font-semibold text-center">{step.title}</h2>

//             <p className="text-center text-sm mt-2">{step.description}</p>
//           </div>
//         ))}
//       </div>
//       <TrustSafety/>
//       {/* <Faqs/> */}
//       <Faqs/>
      
//     </div>
//   );
// };
"use client";
import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import TrustSafety from "./TrustSafety";
import { Faqs } from "./Faqs";

export const HowWorks = () => {
  const { t } = useTranslation();

  const steps = [
    {
      title: t("Create & Verify Your Account"),
      description: t(
        "Sign up with your email or mobile number. Complete basic profile info and verify to unlock messaging and alerts."
      ),
      image: "/work1.png",
    },
    {
      title: t("Browse & Search Smart"),
      description: t(
        "Explore categories like cars, homes, jobs, and more with smart filters for price, location, and condition. Save your searches and get instant alerts for new deals."
      ),
      image: "/work2.png",
    },
    {
      title: t("Check the Details"),
      description: t(
        "Review photos, description, specs, and the seller’s rating. Look for Verification badges and listing history for extra confidence."
      ),
      image: "/work3.png",
    },
    {
      title: t("Chat Securely"),
      description: t(
        "Message sellers in-app to ask questions, request more photos, or confirm availability. Keep all coordination inside Ma3rood chat for safety."
      ),
      image: "/work4.png",
    },
    {
      title: t("Make an Offer or Proceed"),
      description: t(
        "Use Make Offer (where available) or agree on a final price in chat. For property/jobs/services, schedule viewings, interviews, or service calls."
      ),
      image: "/work5.png",
    },
    {
      title: t("Arrange Payment & Delivery"),
      description: t(
        "Agree on a method that suits you: cash on delivery, bank transfer, or any in-app payment option available in your city (if enabled). Choose pickup or delivery where supported. Confirm timing and handover location."
      ),
      image: "/work5.png",
    },
    {
      title: t("Rate & Review"),
      description: t(
        "After the deal, leave a rating. Great behavior builds trust across the community."
      ),
      image: "/work5.png",
    },
  ];

  const steps1 = [
    {
      title: t("Register & Verify"),
      description: t(
        "Create your account, add your business name (if applicable), and verify to boost trust."
      ),
      image: "/work1.png",
    },
    {
      title: t("Create a Standout Listing"),
      description: t(
        "Pick the right category (e.g., Household Items → Electronics). Add clear photos, a precise title, and an honest description. Set price in SAR and choose condition, location, and pickup/delivery options."
      ),
      image: "/work2.png",
    },
    // {
    //   title: t("Check the Details"),
    //   description: t(
    //     "Review photos, description, specs, and the seller’s rating. Look for Verification badges and listing history for extra confidence."
    //   ),
    //   image: "/work3.png",
    // },
    {
    title: t("Review Your Listing"),
    description: t(
      "Double-check photos, description, price, and condition before publishing. Verified listings attract more buyers and build credibility."
    ),
    image: "/work3.png",
  },
    // {
    //   title: t("Chat Securely"),
    //   description: t(
    //     "Message sellers in-app to ask questions, request more photos, or confirm availability. Keep all coordination inside Ma3rood chat for safety."
    //   ),
    //   image: "/work4.png",
    // },
      {
    title: t("Chat with Buyers"),
    description: t(
      "Respond quickly to messages. Answer buyer questions, share extra details if needed, and keep all communication inside Ma3rood chat for security."
    ),
    image: "/work4.png",
  },
    {
      title: t("Make an Offer or Proceed"),
      description: t(
        "Use Make Offer (where available) or agree on a final price in chat. For property/jobs/services, schedule viewings, interviews, or service calls."
      ),
      image: "/work5.png",
    },
    {
      title: t("Arrange Payment & Delivery"),
      description: t(
        "Agree on a method that suits you: cash on delivery, bank transfer, or any in-app payment option available in your city (if enabled). Choose pickup or delivery where supported. Confirm timing and handover location."
      ),
      image: "/work5.png",
    },
    {
      title: t("Rate & Review"),
      description: t(
        "After the deal, leave a rating. Great behavior builds trust across the community."
      ),
      image: "/work5.png",
    },
  ];

  return (
    <div>
      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-center">
        {t("How It Works – Ma3rood")}
      </h1>
      <p className="text-center text-gray-700 mt-2 max-w-2xl mx-auto">
        {t(
          "Simple steps to buy & sell across the Kingdom. Whether you’re here to find a great deal or to reach more buyers, Ma3rood makes trading fast, safe, and straightforward."
        )}
      </p>

      {/* Quick Start Section */}
      <div className="p-4 mt-10 mx-auto max-w-3xl">
        <h3 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3 text-gray-800">
          {t("Quick Start")}
        </h3>

        {/* First Row */}
        <div className="flex items-center justify-between mb-10 flex-col sm:flex-row">
          <img
            src="/work9.png"
            alt={t("Create Account")}
            className="w-72 h-56 object-contain sm:mr-6 mb-4 sm:mb-0"
          />
          <p className="text-base sm:text-lg text-center sm:text-left max-w-md text-gray-700 leading-relaxed">
            {t(
              "New to Ma3rood? Create your account with just a few steps, verify your profile, and instantly start exploring categories or listing your first item to reach buyers quickly."
            )}
          </p>
        </div>

        {/* Second Row */}
        <div className="flex items-center justify-between flex-col sm:flex-row-reverse">
          <img
            src="/login1.png"
            alt={t("Login")}
            className="w-72 h-56 object-contain sm:ml-6 mb-4 sm:mb-0"
          />
          <p className="text-base sm:text-lg text-center sm:text-left max-w-md text-gray-700 leading-relaxed">
            {t(
              "Already a member? Simply log in and continue from where you left off — access your dashboard to manage listings, reply to messages, and track your ongoing orders with ease."
            )}
          </p>
        </div>
      </div>

      {/* Buyers */}
      <h2 className="text-3xl font-semibold text-center mt-10">
        {t("For Buyers")}
      </h2>
      <div className="mt-10 flex flex-wrap gap-6 justify-center">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-green-600 text-white w-full sm:w-[387px] rounded-[10px] p-6 flex flex-col transition relative"
          >
            <p className="absolute top-3 left-4 text-sm font-semibold">
              {t("Step")} {index + 1}
            </p>
            <div className="mt-6 mb-4 flex justify-center w-full">
              <Image src={step.image} alt={step.title} width={56} height={56} />
            </div>
            <h2 className="text-xl font-semibold text-center">{step.title}</h2>
            <p className="text-center text-sm mt-2">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Sellers */}
      <h2 className="text-3xl font-semibold text-center mt-10">
        {t("For Sellers")}
      </h2>
      <div className="mt-10 flex flex-wrap gap-6 justify-center">
        {steps1.map((step, index) => (
          <div
            key={index}
            className="bg-green-600 text-white w-full sm:w-[387px] rounded-[10px] p-6 flex flex-col transition relative"
          >
            <p className="absolute top-3 left-4 text-sm font-semibold">
              {t("Step")} {index + 1}
            </p>
            <div className="mt-6 mb-4 flex justify-center w-full">
              <Image src={step.image} alt={step.title} width={56} height={56} />
            </div>
            <h2 className="text-xl font-semibold text-center">{step.title}</h2>
            <p className="text-center text-sm mt-2">{step.description}</p>
          </div>
        ))}
      </div>

      <TrustSafety />
      <Faqs />
    </div>
  );
};
