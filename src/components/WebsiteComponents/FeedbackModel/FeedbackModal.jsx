"use client";

import React, { useEffect, useState, useMemo } from "react";
import { FaStar, FaRegStar, FaTimes } from "react-icons/fa";
import Button from "@/components/WebsiteComponents/ReuseableComponenets/Button";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { userApi } from "@/lib/api/user";
import { useAuthStore } from "@/lib/stores/authStore";
import { Image_URL } from "@/config/constants";

export default function FeedbackModal({
  isOpen,
  onClose,
  listing,
  onSave,
  perspective,
  initialFeedback = "",
  initialRating = 0, 
}) {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0); // 👈 start from 0
  const [hoveredRating, setHoveredRating] = useState(0);

  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  // Determine if we're showing seller (from buying section) or buyer (from selling section)
  const partyInfo = useMemo(() => {
    if (!listing) return null;
    
    // If final_buyer exists, we're in selling section → show buyer
    if (perspective === "seller" && listing.final_buyer) {
      return {
        type: "buyer",
        user: listing.final_buyer?.user,
        label: t("Buyer"),
      };
    }
    
    // Otherwise, we're in buying section → show seller
    if (perspective === "buyer" && listing.creator) {
      return {
        type: "seller",
        user: listing.creator,
        label: t("Seller"),
      };
    }
    
    return null;
  }, [listing, t]);

  useEffect(() => {
    setFeedback(initialFeedback)
        setRating(initialRating); // 👈 pre-fill rating when modal opens
;
  }, [initialFeedback,initialRating, isOpen]);

  const handleClose = () => {
    setFeedback("");
    setRating(0);
    setHoveredRating(0);
    onClose();
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div 
        dir={isArabic ? "rtl" : "ltr"}
        className={`bg-white rounded-xl w-[90%] max-w-md p-6 shadow-2xl relative transition-all ${isArabic ? "text-right" : "text-left"}`}
      >
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`absolute top-4 ${isArabic ? "left-4" : "right-4"} text-gray-400 hover:text-gray-600`}
          aria-label={t("Close")}
        >
          <FaTimes size={20} />
        </button>

        {/* Modal Title */}
        <h2 className={`text-xl font-semibold mb-4 ${isArabic ? "text-right" : "text-left"} text-gray-800`}>
          {t("We value your feedback")}
        </h2>

        {/* Party Information (Seller/Buyer) */}
        {partyInfo && (
          <div className={`mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 ${isArabic ? "text-right" : "text-left"}`}>
            <div className={`flex items-center gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {partyInfo.user?.profile_photo ? (
                    <img
                      src={`${Image_URL}${partyInfo.user.profile_photo}`}
                      alt={partyInfo.user?.username || partyInfo.user?.name}
                      className="w-full h-full object-cover rounded-full"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-lg font-bold text-gray-700">
                      {(partyInfo.user?.username || partyInfo.user?.name)
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Party Details */}
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 mb-1">
                  {partyInfo.label}
                </div>
                <div className="text-sm font-semibold text-gray-800 truncate">
                  {partyInfo.user?.username || partyInfo.user?.name }
                </div>
              </div>
            </div>
          </div>
        )}



        {/* Star Rating */}
        <div className={`flex items-center gap-1 mb-4 ${isArabic ? "justify-end" : "justify-start"}`}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
            //   onMouseEnter={() => setHoveredRating(star)}
            //   onMouseLeave={() => setHoveredRating(0)}
              className="text-yellow-500 text-2xl transition-colors"
              aria-label={`${star} ${t("star")}`}
            >
              {star <= (hoveredRating || rating) ? <FaStar /> : <FaRegStar />}
            </button>
          ))}
        </div>

        {/* Feedback Textarea */}
        <label htmlFor="feedback-textarea" className="block text-sm font-medium text-gray-700 mb-1">
          {t("Your Feedback")}
        </label>
        <textarea
          id="feedback-textarea"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          maxLength={512}
          rows={4}
          dir={isArabic ? "rtl" : "ltr"}
          className={`w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500 text-gray-800 resize-none ${isArabic ? "text-right" : "text-left"}`}
          placeholder={t("Write your comments here...")}
        />
        <div className={`text-xs text-gray-500 mt-1 ${isArabic ? "text-left" : "text-right"}`}>
          {512 - feedback.length} {t("characters remaining")}
        </div>

        {/* Action Buttons */}
        <div className={`flex gap-3 mt-6 ${isArabic ? "flex-row-reverse justify-start" : "justify-end"}`}>
          <Button
            title={t("Cancel")}
            onClick={handleClose}
            className="text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
          />
          {/* <Button
            title={t("Submit")}
            onClick={() => {
              onSave({ feedback, rating });
              handleClose();
            }}
            className="text-sm"
          /> */}
          <Button
  title={t("Submit")}
  onClick={() => {
    if (rating === 0) {
      toast.error(t("Please select at least 1 star before submitting."));
      return; // empty rating prevent karne ke liye (optional)
    }
     if (!feedback) {
      toast.error(t("Please write your feedback before submitting."));
      return; // empty feedback prevent karne ke liye (optional)
    }
    onSave({ feedback, rating });
    handleClose();
  }}
  className="text-sm"
/>

        </div>
      </div>
    </div>
  );
}