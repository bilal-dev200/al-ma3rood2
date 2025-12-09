// import Image from "next/image";
// import { useTranslation } from "react-i18next";
// import { userApi } from "@/lib/api/user";

// const Reviews = () => {
//   const options = [
//     {
//       title: "84 positive feedback",
//       description:
//         "78 are from individual members and count towards the final rating",
//       color: "#E8FFB7", // green-400
//       icon: "/Profile/reviews1.png",
//     },
//     {
//       title: "0 neutral feedback",
//       description: "",
//       color: "#FFE38E", // green-400
//       icon: "/Profile/reviews2.png",
//     },
//     {
//       title: "0 negative feedback",
//       description:
//         "0 are from individual members and count towards the final rating",
//       color: "#FFC3C7",
//       icon: "/Profile/reviews3.png",
//     },
//   ];
//   const { t } = useTranslation();

//   return (
//     <div className="mt-8  ml-5">
//       <h1 className="text-2xl font-semibold mb-2 ">{t("Feedback")}</h1>
//       <p className="text-md mb-2">
//         {" "}
//         {t("Your rating is")} 78+{" "}
//         <span className="text-yellow-400 text-xl">★★★★★</span>
//       </p>
//       <p className="text-md mb-8">{t("100% positive feedback")}</p>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//         {options.map((option, index) => (
//           <div
//             key={index}
//             className="rounded-lg p-5 text-black shadow-md h-72 flex flex-col justify-center items-center text-center"
//             style={{ backgroundColor: option.color }}
//           >
//             {/* <img
//               src={option.icon}
//               alt={option.title}
//               className="w-20 h-24 mb-4 mt-8"
//             /> */}
//             <Image
//               src={option.icon}
//               alt={option.title}
//               className="object-cover"
//               width={80}
//               height={80}
//             />
//             <h3 className="text-lg font-bold  mt-5">{t(option.title)}</h3>
//             <p className="text-sm mt-4 max-w-64 h-10">
//               {t(option.description)}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Reviews;

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { userApi } from "@/lib/api/user";
import { useAuthStore } from "@/lib/stores/authStore";
import { IoIosStar,IoIosStarHalf,IoIosStarOutline } from "react-icons/io";

const Reviews = () => {
  const { t } = useTranslation();
  const [feedbackData, setFeedbackData] = useState(null);
  const { user } = useAuthStore();

  console.log("user", user);

  useEffect(() => {
    userApi
      .userFeedback(user?.id)
      .then((res) => {
        console.log("✅ API Response:", res);

        if (res && res.status === true) {
          setFeedbackData(res.data);
        } else {
          console.warn("⚠️ API status is false:", res);
        }
      })
      .catch((err) => {
        console.error("❌ API Error:", err);
      });
  }, [user]);

  // const renderStars = (rating) => {
  //   const fullStars = Math.floor(rating); // number of full stars
  //   const hasHalfStar = rating % 1 >= 0.5; // check for half star
  //   const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // remaining

  //   const stars = [];

  //   for (let i = 0; i < fullStars; i++) {
  //     stars.push("★");
  //   }
  //   if (hasHalfStar) {
  //     stars.push("½");
  //   }
  //   for (let i = 0; i < emptyStars; i++) {
  //     stars.push("☆");
  //   }

  //   return stars.join("");
  // };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<IoIosStar key={`full-${i}`} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<IoIosStarHalf key="half" className="text-yellow-400" />);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<IoIosStarOutline key={`empty-${i}`} className="text-yellow-400" />);
    }

    return stars;
  };

  const options = feedbackData
    ? [
        {
          title: `${feedbackData.positive_percent}% positive feedback`,
          description: `${feedbackData.positive_percent} are from individual members and count towards the final rating`,
          color: "#E8FFB7",
          icon: "/Profile/reviews1.png",
        },
        {
          title: `${feedbackData.neutral_percent}% neutral feedback`,
          description: `${feedbackData.neutral_percent} are from individual members and count towards the final rating`,
          color: "#FFE38E",
          icon: "/Profile/reviews2.png",
        },
        {
          title: `${feedbackData.negative_percent}% negative feedback`,
          description: `${feedbackData.negative_percent} are from individual members and count towards the final rating`,
          color: "#FFC3C7",
          icon: "/Profile/reviews3.png",
        },
      ]
    : [];

  return (
    <div className="mt-8 ml-5">
      <h1 className="text-2xl font-semibold mb-2">{t("Feedback")}</h1>

      {!feedbackData && (
        <p className="text-gray-500 mb-4">⏳ Loading feedback...</p>
      )}

      {feedbackData && (
        <>
          <p className="text-md mb-2 flex items-center gap-2">
            {t("Your rating is")} {feedbackData.average_rating}+{" "}
            <span className="flex gap-1 text-xl">
              {renderStars(feedbackData.average_rating)}
            </span>
          </p>
          <p className="text-md mb-8">
            {feedbackData.positive_percent}% {t("positive feedback")}
          </p>
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {options.map((option, index) => (
          <div
            key={index}
            className="rounded-lg p-5 text-black shadow-md h-72 flex flex-col justify-center items-center text-center"
            style={{ backgroundColor: option.color }}
          >
            <Image
              src={option.icon}
              alt={option.title}
              className="object-cover"
              width={80}
              height={80}
            />
            <h3 className="text-lg font-bold mt-5">{option.title}</h3>
            <p className="text-sm mt-4 max-w-64 h-10">{option.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
