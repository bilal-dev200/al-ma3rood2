// import React from "react";
// import { AiOutlineExclamationCircle } from "react-icons/ai";
// import { useFormContext } from "react-hook-form";

// const StepTitleCategory = ({ setIsModalOpen, selectedCategoryName }) => {
//   const {
//     register,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useFormContext();
//   const title = watch("title");
//   const subtitle = watch("subtitle");
//   const category_id = watch("category_id");

//   return (
//     <>
//       <h1 className="text-4xl font-bold mb-6">What are you listing?</h1>

//       <div className="mb-6 relative w-[800px]">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Listing title
//         </label>
//         <div className="relative">
//           <input
//             type="text"
//             {...register("title")}
//             placeholder="e.g. iPhone 5c, Red t-shirt"
//             className={`w-full border rounded px-4 py-2 focus:outline-none ${
//               errors.title
//                 ? "border-red-500 focus:border-red-500 focus:ring-red-400"
//                 : "border-gray-300 focus:border-green-400 focus:ring"
//             }`}
//           />
//           {errors.title && (
//             <AiOutlineExclamationCircle className="absolute right-3 top-3 text-red-500 text-lg" />
//           )}
//         </div>
//         {errors.title && (
//           <p className="text-red-500 text-sm mt-1">
//             {errors.title.message}
//           </p>
//         )}
//         {/* <p className="text-sm text-gray-500 mt-1">80 characters remaining</p> */}
//       </div>

//       <label className="block text-sm font-medium text-gray-700 mb-2">
//         Category
//       </label>
//       <div
//         className={`border rounded-lg px-5 py-4 shadow-sm w-[800px] ${
//           errors.category_id ? "border-red-500" : "border-gray-300"
//         }`}
//       >
//         {category_id && selectedCategoryName ? (
//           <div className="flex justify-between items-center">
//             <p className="text-base text-green-600 font-semibold">
//               {selectedCategoryName}
//             </p>
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="text-sm text-green-600 hover:underline"
//             >
//               Change category
//             </button>
//           </div>
//         ) : (
//           <div onClick={() => setIsModalOpen(true)} className="cursor-pointer">
//             <p className="text-green-600 font-medium">Choose category</p>
//             <p className="text-sm text-gray-500">
//               We'll suggest a category based on your title, too.
//             </p>
//             {errors.category_id && (
//               <p className="text-red-500 text-sm mt-2">
//                 {errors.category_id.message}
//               </p>
//             )}
//           </div>
//         )}
//       </div>

//       {category_id && selectedCategoryName && (
//         <div className="mt-6 w-[800px]">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Subtitle <span className="text-gray-400">(optional)</span>
//           </label>
//           <input
//             type="text"
//             {...register("subtitle")}
//             className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-green-400"
//           />
//           <p className="text-sm text-gray-500 mt-1">80 characters max</p>
//         </div>
//       )}
//     </>
//   );
// };

// export default StepTitleCategory;
import React from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const StepTitleCategory = ({ setIsModalOpen, selectedCategory, watch }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const title = watch("title");
  const subtitle = watch("subtitle");
  const category_id = watch("category_id");
  // Modal open handler
  const openCategoryModal = () => setIsModalOpen(true);
  const { t } = useTranslation();

  return (
    <>
      <h1 className="text-2xl sm:text-4xl font-bold mb-6 px-4 sm:px-0 text-gray-800">
        {t("What are you listing?")}
      </h1>

      {/* Listing Title */}
      <div className="mb-6 relative w-full max-w-full sm:max-w-[800px] px-4 sm:px-0">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("Listing title")}
        </label>
        <div className="relative">
          <div className="relative">
            <input
              type="text"
              {...register("title")}
              placeholder={t("e.g. iPhone 5c, Red t-shirt")}
              className={`w-full border rounded px-4 py-2 pr-10 text-sm sm:text-base focus:outline-none ${
                errors.title
                  ? "border-red-500 focus:border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:border-green-400 focus:ring"
              }`}
            />
            {errors.title && (
              <AiOutlineExclamationCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-lg" />
            )}
          </div>
        </div>
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Category Selection */}
      <div className="mb-6 relative w-full max-w-full sm:max-w-[800px] px-4 sm:px-0">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("Category")}
        </label>
        <div
          className={`border rounded-lg px-4 py-3 shadow-sm w-full ${
            errors.category_id ? "border-red-500" : "border-gray-300"
          }`}
        >
          {category_id && selectedCategory ? (
            <div className="flex justify-between items-center">
              <p className="text-base text-green-600 font-semibold">
                {selectedCategory?.parent?.name ? selectedCategory?.parent?.name + " > " + selectedCategory?.name : selectedCategory?.name }
              </p>
              <button
                type="button"
                onClick={openCategoryModal}
                className="text-sm text-green-600 hover:underline"
              >
                {t("Change")}
              </button>
            </div>
          ) : (
            <div onClick={openCategoryModal} className="cursor-pointer">
              <p className="text-green-600 font-medium">
                {" "}
                {t("Choose category")}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {t("We'll suggest a category based on your title, too.")}
              </p>
              {errors.category_id && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.category_id.message}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Subtitle (Optional) */}
      {category_id && selectedCategory?.name && (
        <div className="mt-6 w-full max-w-full sm:max-w-[800px] px-4 sm:px-0">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Subtitle")}{" "}
            <span className="text-gray-400">{t("(optional)")}</span>
          </label>
          <input
            type="text"
            {...register("subtitle")}
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring focus:border-green-400"
          />
          <p className="text-sm text-gray-500 mt-1">
            {" "}
            {t("80 characters max")}
          </p>
        </div>
      )}
    </>
  );
};

export default StepTitleCategory;
