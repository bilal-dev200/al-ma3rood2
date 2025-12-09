// "use client";
// import React from 'react'
// import { useTranslation } from "react-i18next";

// const Page = () => {
//   const { t,i18n } = useTranslation();
//   const isArabic = i18n.language === "ar";

//   return (
//     <div className="font-poppins bg-gray-50 p-5">
//       {/* Header */}
//       <div className="text-center mb-10">
//         <h1 className="text-4xl font-bold">
//           {t("Photo Policy Guidelines")}
//         </h1>
//         <p className="text-gray-600 mt-2">
//           {t("Follow these rules to keep your listings clear, professional, and safe.")}
//         </p>
//       </div>

//       {/* Content */}
//       <div className="mx-auto space-y-8">
//         {/* Do's Section */}
//         <div className="bg-white border-l-8 border-green-500 p-6 rounded-xl shadow-md">
//           <h2 className="text-green-700 text-2xl font-semibold mb-4">{t("Do’s")}</h2>
//           <ul className="space-y-3 text-gray-700 leading-relaxed list-inside list-disc">
//             <li>{t("Use large and clear images of the item for sale.")}</li>
//             <li>{t("Add small, transparent watermarks (ownership/attribution only) – max 5% of the image area, at least 50% transparency.")}</li>
//             <li>{t("Show any product flaws or defects clearly.")}</li>
//             <li>{t("Keep other items in the photo only if they help the buyer.")}</li>
//             <li>{t("Make sure videos follow Marketplace video rules (available to Top Sellers and Stores only).")}</li>
//             <li>{t("Use only images you own or have permission to use.")}</li>
//             <li>{t("Keep backgrounds clean and uncluttered (plain or neutral works best).")}</li>
//             <li>{t("Upload high-resolution photos (avoid stretched or distorted images).")}</li>
//             <li>{t("Use consistent photo style across all listings for a professional look.")}</li>
//           </ul>
//         </div>

//         {/* Don'ts Section */}
//         <div className="bg-white border-l-8 border-red-500 p-6 rounded-xl shadow-md">
//           <h2 className="text-red-700 text-2xl font-semibold mb-4">{t("Don’ts")}</h2>
//           <ul className="space-y-3 text-gray-700 leading-relaxed list-inside list-disc">
//             <li>{t("Use a main photo that doesn’t show the actual item for sale.")}</li>
//             <li>{t("Add watermarks, logos, borders, or text with marketing messages (e.g., “low stock”).")}</li>
//             <li>{t("Use watermarks/logos larger than 5% of the image or with less than 50% transparency.")}</li>
//             <li>{t("Include contact details, website addresses, or any branded marketing.")}</li>
//             <li>{t("Use images that violate Intellectual Property Rights (e.g., taken from the internet).")}</li>
//             <li>{t("Upload images with offensive, inappropriate, or unsafe content.")}</li>
//             <li>{t("Upload stock photos if they don’t match the actual item.")}</li>
//             <li>{t("Upload duplicate or repetitive images of the same angle.")}</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;
"use client";
import React from "react";
import { useTranslation } from "react-i18next";

const Page = () => {
  const { t, i18n } = useTranslation();

  // Check agar current language Arabic hai
  const isArabic = i18n.language === "ar";

  return (
    <div className="font-poppins bg-gray-50 p-5">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">
          {t("Photo Policy Guidelines")}
        </h1>
        <p className="text-gray-600 mt-2">
          {t(
            "Follow these rules to keep your listings clear, professional, and safe."
          )}
        </p>
      </div>

      {/* Content */}
      <div className="mx-auto space-y-8">
        {/* Do's Section */}
        <div
          className={`bg-white p-6 rounded-xl shadow-md border-8 ${
            isArabic ? "border-r-green-500" : "border-l-green-500"
          }`}
        >
          <h2 className="text-green-700 text-2xl font-semibold mb-4">
            {t("Do’s")}
          </h2>
          <ul className="space-y-3 text-gray-700 leading-relaxed list-inside list-disc">
            <li>{t("Use large and clear images of the item for sale.")}</li>
            <li>
              {t(
                "Add small, transparent watermarks (ownership/attribution only) – max 5% of the image area, at least 50% transparency."
              )}
            </li>
            <li>{t("Show any product flaws or defects clearly.")}</li>
            <li>
              {t("Keep other items in the photo only if they help the buyer.")}
            </li>
            <li>
              {t(
                "Make sure videos follow Marketplace video rules (available to Top Sellers and Stores only)."
              )}
            </li>
            <li>{t("Use only images you own or have permission to use.")}</li>
            <li>
              {t(
                "Keep backgrounds clean and uncluttered (plain or neutral works best)."
              )}
            </li>
            <li>
              {t(
                "Upload high-resolution photos (avoid stretched or distorted images)."
              )}
            </li>
            <li>
              {t(
                "Use consistent photo style across all listings for a professional look."
              )}
            </li>
          </ul>
        </div>

        {/* Don'ts Section */}
        <div
          className={`bg-white p-6 rounded-xl shadow-md border-8 ${
            isArabic ? "border-r-red-500" : "border-l-red-500"
          }`}
        >
          <h2 className="text-red-700 text-2xl font-semibold mb-4">
            {t("Don’ts")}
          </h2>
          <ul className="space-y-3 text-gray-700 leading-relaxed list-inside list-disc">
            <li>
              {t("Use a main photo that doesn’t show the actual item for sale.")}
            </li>
            <li>
              {t(
                "Add watermarks, logos, borders, or text with marketing messages (e.g., “low stock”)."
              )}
            </li>
            <li>
              {t(
                "Use watermarks/logos larger than 5% of the image or with less than 50% transparency."
              )}
            </li>
            <li>
              {t(
                "Include contact details, website addresses, or any branded marketing."
              )}
            </li>
            <li>
              {t(
                "Use images that violate Intellectual Property Rights (e.g., taken from the internet)."
              )}
            </li>
            <li>
              {t("Upload images with offensive, inappropriate, or unsafe content.")}
            </li>
            <li>
              {t("Upload stock photos if they don’t match the actual item.")}
            </li>
            <li>
              {t("Upload duplicate or repetitive images of the same angle.")}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Page;
