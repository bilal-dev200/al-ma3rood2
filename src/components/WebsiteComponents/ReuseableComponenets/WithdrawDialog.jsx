import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function WithdrawDialog({ isOpen, onClose, onWithdraw }) {
  // const [selectedOption, setSelectedOption] = useState("");
  const { t, i18n } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 bg-opacity-30 flex items-center justify-center z-50"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <div
        className="bg-white max-w-md w-full rounded-lg shadow-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-900" id="dialog-title">
         {t("Withdraw a listing")} 
        </h2>
        {/* <p className="mt-2 text-sm text-gray-700 font-medium">
          Listing #5401199654
        </p> */}
        <p className="mt-2 text-gray-600 text-sm">
          {t("Note that buyers sometimes get frustrated when items they are interested in get withdrawn. Please only list items that you have available for sale. Repeated unjustified withdrawals may result in your membership being suspended.")}
        </p>

        {/* <div className="mt-4 space-y-3 text-sm text-gray-800">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="withdrawOption"
              value="soldToMember"
              checked={selectedOption === "soldToMember"}
              onChange={() => setSelectedOption("soldToMember")}
              className="form-radio h-5 w-5 text-green-600"
            />
            <span className="ml-2">
              I sold this item to a Ma3rood member
            </span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="withdrawOption"
              value="didNotSell"
              checked={selectedOption === "didNotSell"}
              onChange={() => setSelectedOption("didNotSell")}
              className="form-radio h-5 w-5 text-green-600"
            />
            <span className="ml-2">I didn&apos;t sell this item</span>
          </label>
        </div> */}

        <p className="mt-4 text-xs text-gray-500">
         {t("Note: You'll still be able to relist this item, if you need to.")} 
        </p>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 rounded px-4 py-2 text-gray-700 text-sm"
          >
            {t("Cancel")}
          </button>
          <button
            onClick={() => onWithdraw()}
            className="rounded px-4 py-2 text-white text-sm
              bg-green-600 hover:bg-green-700"
            // onClick={() => onWithdraw(selectedOption)}
            // disabled={!selectedOption}
            // className={`rounded px-4 py-2 text-white text-sm ${
            //   selectedOption
            //     ? "bg-green-600 hover:bg-green-700"
            //     : "bg-green-300 cursor-not-allowed"
            // }`}
          >
            {t("Withdraw listing")}
          </button>
        </div>

      <button
  onClick={onClose}
  aria-label="Close dialog"
  className={`absolute top-4 ${
    i18n.language === "ar" ? "left-4" : "right-4"
  } text-gray-400 hover:text-gray-600 focus:outline-none`}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
</button>

      </div>
    </div>
  );
}
