// // 'use client';
// // import React, { useState } from 'react';
// // import i18n from '../../../i18n';

// // const LanguageSwitcher = ({ className = '', tabClassName = '' }) => {
// //   const [selectedLang, setSelectedLang] = useState(i18n.language || 'en');

// //   const handleLanguageChange = (lng) => {
// //     i18n.changeLanguage(lng);
// //     document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
// //     setSelectedLang(lng);
// //   };

// //   return (
// //     <div className={`flex space-x-2 ${className}`}>
// //       <button
// //         onClick={() => handleLanguageChange('en')}
// //         className={`px-4 py-2 text-sm rounded-md font-medium
// //           ${selectedLang === 'en' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}
// //           ${tabClassName}`}
// //       >
// //         English
// //       </button>

// //       <button
// //         onClick={() => handleLanguageChange('ar')}
// //         className={`px-4 py-2 text-sm rounded-md font-medium
// //           ${selectedLang === 'ar' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}
// //           ${tabClassName}`}
// //       >
// //         العربية
// //       </button>
// //     </div>
// //   );
// // };

// // export default LanguageSwitcher;

// // "use client";
// // import React, { useState } from "react";
// // import i18n from "../../../i18n";

// // const LanguageSwitcher = ({ className = "", tabClassName = "" }) => {
// //   const [selectedLang, setSelectedLang] = useState(i18n.language || "en");

// //   const handleLanguageChange = (lng) => {
// //     i18n.changeLanguage(lng);
// //     document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
// //     setSelectedLang(lng);
// //   };

// //   return (
// //     <div
// //       className={`flex w-fit p-1 bg-green-600 rounded-full shadow-inner ${className}`}
// //       style={{ maxWidth: "fit-content" }}
// //     >
// //       <button
// //         onClick={() => handleLanguageChange("en")}
// //         className={`flex-1 text-center px-6 py-2 rounded-full transition-all duration-300 text-sm
// //     ${
// //       selectedLang === "en"
// //         ? "bg-white text-green-600 font-bold shadow"
// //         : "text-white hover:bg-green-700"
// //     } 
// //     ${tabClassName}`}
// //       >
// //         English
// //       </button>
// //       <button
// //         onClick={() => handleLanguageChange("ar")}
// //         className={`flex-1 text-center px-6 py-2 rounded-full transition-all duration-300 text-sm
// //     ${
// //       selectedLang === "ar"
// //         ? "bg-white text-green-600 font-bold shadow"
// //         : "text-white hover:bg-green-700"
// //     } 
// //     ${tabClassName}`}
// //       >
// //         العربية
// //       </button>
// //     </div>
// //   );
// // };

// // export default LanguageSwitcher;

// "use client";
// import React, { useState } from "react";
// import i18n from "../../../i18n";

// const LanguageSwitcher = ({ className = "", tabClassName = "" }) => {
//   const [selectedLang, setSelectedLang] = useState(i18n.language || "en");

//   const handleLanguageChange = (lng) => {
//     i18n.changeLanguage(lng);
//     document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
//     setSelectedLang(lng);
//   };

//   return (
//     <div
//       className={`flex flex-wrap justify-center items-center p-1 bg-green-600 rounded-full shadow-inner ${className}`}
//       style={{ maxWidth: "100%", gap: "4px" }}
//     >
//       <button
//         onClick={() => handleLanguageChange("en")}
//         className={`px-4 py-1 sm:px-6 sm:py-2 rounded-full text-sm sm:text-base transition-all duration-300 
//           ${
//             selectedLang === "en"
//               ? "bg-white text-green-600 font-bold shadow"
//               : "text-white hover:bg-green-700"
//           } 
//           ${tabClassName}`}
//       >
//         English
//       </button>
//       <button
//         onClick={() => handleLanguageChange("ar")}
//         className={`px-4 py-1 sm:px-6 sm:py-2 rounded-full text-sm sm:text-base transition-all duration-300 
//           ${
//             selectedLang === "ar"
//               ? "bg-white text-green-600 font-bold shadow"
//               : "text-white hover:bg-green-700"
//           } 
//           ${tabClassName}`}
//       >
//         العربية
//       </button>
//     </div>
//   );
// };

// export default LanguageSwitcher;
"use client";
import React, { useState } from "react";
import i18n from "../../../i18n";

const LanguageSwitcher = ({ className = "", tabClassName = "" }) => {
  const [selectedLang, setSelectedLang] = useState(i18n.language || "en");

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    setSelectedLang(lng);
  };

  return (
    <div
      className={`flex flex-wrap justify-center items-center p-1 bg-green-600 rounded-full shadow-inner ${className}`}
      style={{ maxWidth: "100%", gap: "4px" }}
    >
      <button
        onClick={() => handleLanguageChange("en")}
        className={`px-2 py-1 rounded-full text-xs transition-all duration-300 
          ${
            selectedLang === "en"
              ? "bg-white text-green-600"
              : "text-white hover:bg-green-700 cursor-pointer"
          } 
          ${tabClassName}`}
      >
        English
      </button>
      <button
        onClick={() => handleLanguageChange("ar")}
        className={`px-2 py-1 rounded-full text-xs transition-all duration-300 
          ${
            selectedLang === "ar"
              ? "bg-white text-green-600"
              : "text-white hover:bg-green-700 cursor-pointer"
          } 
          ${tabClassName}`}
      >
        العربية
      </button>
    </div>
  );
};

export default LanguageSwitcher;
