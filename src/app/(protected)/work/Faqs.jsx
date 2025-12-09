// "use client";
// import React, { useState } from "react";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";

// const Faqs = () => {
//   const [openIndex, setOpenIndex] = useState(null);

//   const faqs = [
//     {
//       question: "Is Ma3rood available across Saudi Arabia?",
//       answer: "Yes—Ma3rood serves buyers and sellers across the Kingdom.",
//     },
//     {
//       question: "Do I need to pay to list?",
//       answer:
//         "You can post standard listings for free. Optional upgrades (like featuring/promotions) may be available.",
//     },
//     {
//       question: "Does Ma3rood handle delivery or payments?",
//       answer:
//         "Delivery and payment are agreed between buyer and seller. In-app options may be available in select cities/categories and will be shown at checkout when enabled.",
//     },
//     {
//       question: "How are disputes handled?",
//       answer:
//         "Keep all messages on Ma3rood and share evidence via chat. Use Report on the listing or user, and our Trust & Safety team will review.",
//     },
//   ];

//   const toggleFAQ = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <div
//       style={{
//         maxWidth: "800px",
//         margin: "50px auto",
//         padding: "20px",
//         borderRadius: "12px",
//         background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
//         boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
//       }}
//     >
//       <h2
//         style={{
//           textAlign: "center",
//           marginBottom: "30px",
//           fontSize: "28px",
//           fontWeight: "bold",
//           color: "#0077b6",
//         }}
//       >
//         FAQs
//       </h2>
//       {faqs.map((faq, index) => (
//         <div
//           key={index}
//           style={{
//             marginBottom: "15px",
//             border: "1px solid #ddd",
//             borderRadius: "8px",
//             background: "#fff",
//             overflow: "hidden",
//             transition: "all 0.3s ease",
//           }}
//         >
//           <button
//             onClick={() => toggleFAQ(index)}
//             style={{
//               width: "100%",
//               padding: "15px 20px",
//               fontSize: "16px",
//               fontWeight: "500",
//               background: "none",
//               border: "none",
//               outline: "none",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               cursor: "pointer",
//             }}
//           >
//             {faq.question}
//             {openIndex === index ? (
//               <FaChevronUp color="#0077b6" />
//             ) : (
//               <FaChevronDown color="#0077b6" />
//             )}
//           </button>
//           {openIndex === index && (
//             <div
//               style={{
//                 padding: "15px 20px",
//                 fontSize: "15px",
//                 color: "#555",
//                 borderTop: "1px solid #eee",
//                 background: "#f9f9f9",
//               }}
//             >
//               {faq.answer}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Faqs;

// "use client";
// import React, { useState } from "react";
// import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
// import { useTranslation } from "react-i18next";

// export const Faqs = () => {
//   const [activeIndex, setActiveIndex] = useState(null);
//     const { t } = useTranslation();
  

//   // Hardcoded FAQ array
//   const faqData = {
//     top_heading: "FAQs",
//     main_heading: "Frequently Asked Questions",
//     pages_faq_details: [
//       {
//         id: 1,
//         question: "Is Ma3rood available across Saudi Arabia?",
//         answer: "Yes—Ma3rood serves buyers and sellers across the Kingdom.",
//       },
//       {
//         id: 2,
//         question: "Do I need to pay to list?",
//         answer: "You can post standard listings for free. Optional upgrades may be available.",
//       },
//       {
//         id: 3,
//         question: "Does Ma3rood handle delivery or payments?",
//         answer: "Delivery and payment are agreed between buyers and sellers.",
//       },
//       {
//         id: 4,
//         question: "Can I edit or delete my listing?",
//         answer: "Yes, you can manage your listings anytime from your account dashboard.",
//       },
//     ],
//   };

//   const toggleAccordion = (index) => {
//     setActiveIndex(activeIndex === index ? null : index);
//   };

//   return (
//     <div className="flex justify-center flex-col md:flex-row items-center py-12 md:py-0 md:pt-10 md:items-start gap-4 bg-transparent w-full">
//       <div className="flex justify-center flex-col md:flex-row items-center md:items-start md:w-[80%]">
//         {/* Left Headings */}
//         <div className="flex flex-col pt-4 md:w-[40%] w-[90%] text-start">
//           <h3 className="text-green-600 text-lg font-Amaranth">
//             {faqData.top_heading}
//           </h3>
//           <h2 className="capitalize text-3xl md:text-4xl font-Amaranth w-96 text-black">
//             {faqData.main_heading}
//           </h2>
//         </div>

//         {/* FAQ List */}
//         <div className="w-[90%] md:w-[60%]">
//           {faqData.pages_faq_details.map((faq, index) => (
//             <div key={faq.id} className="w-full mb-2">
//               <div className="transition duration-300">
//                 <div
//                   className={`flex justify-between items-center cursor-pointer`}
//                   onClick={() => toggleAccordion(index)}
//                 >
//                   <p className="md:text-xl font-inter text-lg text-black py-4">
//                     {faq.question}
//                   </p>
//                   <span className="md:text-2xl text-xl px-4 text-black">
//                     {activeIndex === index ? <IoIosArrowUp /> : <IoIosArrowDown />}
//                   </span>
//                 </div>
//                 {activeIndex === index && (
//                   <div className="py-2 text-black rounded-b-xl">
//                     <p>{faq.answer}</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };
"use client";
import React, { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useTranslation } from "react-i18next";

export const Faqs = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const { t } = useTranslation();

  // FAQ data with translation keys
  const faqData = {
    top_heading: t("FAQs"),
    main_heading: t("Frequently Asked Questions"),
    pages_faq_details: [
      {
        id: 1,
        question: t("Is Ma3rood available across Saudi Arabia?"),
        answer: t("Yes—Ma3rood serves buyers and sellers across the Kingdom."),
      },
      {
        id: 2,
        question: t("Do I need to pay to list?"),
        answer: t("You can post standard listings for free. Optional upgrades may be available."),
      },
      {
        id: 3,
        question: t("Does Ma3rood handle delivery or payments?"),
        answer: t("Delivery and payment are agreed between buyers and sellers."),
      },
      {
        id: 4,
        question: t("Can I edit or delete my listing?"),
        answer: t("Yes, you can manage your listings anytime from your account dashboard."),
      },
    ],
  };

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="flex justify-center flex-col md:flex-row items-center py-12 md:py-0 md:pt-10 md:items-start gap-4 bg-transparent w-full">
      <div className="flex justify-center flex-col md:flex-row items-center md:items-start md:w-[80%]">
        {/* Left Headings */}
        <div className="flex flex-col pt-4 md:w-[40%] w-[90%] text-start">
          <h3 className="text-green-600 text-lg font-Amaranth">
            {faqData.top_heading}
          </h3>
          <h2 className="capitalize text-3xl md:text-4xl font-Amaranth w-96 text-black">
            {faqData.main_heading}
          </h2>
        </div>

        {/* FAQ List */}
        <div className="w-[90%] md:w-[60%]">
          {faqData.pages_faq_details.map((faq, index) => (
            <div key={faq.id} className="w-full mb-2">
              <div className="transition duration-300">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleAccordion(index)}
                >
                  <p className="md:text-xl font-inter text-lg text-black py-4">
                    {faq.question}
                  </p>
                  <span className="md:text-2xl text-xl px-4 text-black">
                    {activeIndex === index ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </span>
                </div>
                {activeIndex === index && (
                  <div className="py-2 text-black rounded-b-xl">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
