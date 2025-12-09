// "use client";
// import React from "react";
// import { FaUserCheck, FaComments, FaBan, FaMapMarkerAlt, FaCreditCard } from "react-icons/fa";
// import { useTranslation } from "react-i18next";

// const TrustSafety = () => {
//     const { t } = useTranslation();
  
//   const items = [
//     {
//       icon: <FaUserCheck size={32} className="text-blue-600 mx-auto" />,
//       title: "Verified Profiles",
//       desc: "Look for verification badges.",
//     },
//     {
//       icon: <FaComments size={32} className="text-green-600 mx-auto" />,
//       title: "Secure Chat",
//       desc: "Keep all communication inside Ma3rood.",
//     },
//     {
//       icon: <FaBan size={32} className="text-red-600 mx-auto" />,
//       title: "Report & Block",
//       desc: "See something off? Report the listing or user.",
//     },
//     {
//       icon: <FaMapMarkerAlt size={32} className="text-yellow-600 mx-auto" />,
//       title: "Meet Smart",
//       desc: "Choose public places for handovers; confirm details in chat first.",
//     },
//     {
//       icon: <FaCreditCard size={32} className="text-purple-600 mx-auto" />,
//       title: "Payments",
//       desc: "Use trusted methods only. Avoid sending deposits to unknown parties.",
//     },
//   ];

//   return (
//     <div className="p-6 mt-10  mx-auto">
//       <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">
//         Trust & Safety
//       </h2>
//       <div className="grid grid-cols-5 gap-6 text-center">
//         {items.map((item, i) => (
//           <div
//             key={i}
//             className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition"
//           >
//             {/* Icon */}
//             <div className="mb-2">{item.icon}</div>
//             {/* Heading */}
//             <h3 className="font-semibold text-gray-900">{item.title}</h3>
//             {/* Description */}
//             <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TrustSafety;
"use client";
import React from "react";
import {
  FaUserCheck,
  FaComments,
  FaBan,
  FaMapMarkerAlt,
  FaCreditCard,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const TrustSafety = () => {
  const { t } = useTranslation();

  const items = [
    {
      icon: <FaUserCheck size={32} className="text-blue-600 mx-auto" />,
      title: t("Verified Profiles"),
      desc: t("Look for verification badges."),
    },
    {
      icon: <FaComments size={32} className="text-green-600 mx-auto" />,
      title: t("Secure Chat"),
      desc: t("Keep all communication inside Ma3rood."),
    },
    {
      icon: <FaBan size={32} className="text-red-600 mx-auto" />,
      title: t("Report & Block"),
      desc: t("See something off? Report the listing or user."),
    },
    {
      icon: <FaMapMarkerAlt size={32} className="text-yellow-600 mx-auto" />,
      title: t("Meet Smart"),
      desc: t("Choose public places for handovers; confirm details in chat first."),
    },
    {
      icon: <FaCreditCard size={32} className="text-purple-600 mx-auto" />,
      title: t("Payments"),
      desc: t("Use trusted methods only. Avoid sending deposits to unknown parties."),
    },
  ];

  return (
    <div className="p-6 mt-10 mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">
        {t("Trust & Safety")}
      </h2>
      <div className="grid grid-cols-5 gap-6 text-center max-md:grid-cols-2 max-sm:grid-cols-1">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition"
          >
            {/* Icon */}
            <div className="mb-2">{item.icon}</div>
            {/* Heading */}
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            {/* Description */}
            <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustSafety;

