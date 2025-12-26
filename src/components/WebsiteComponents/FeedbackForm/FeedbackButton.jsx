"use client";

import React, { useState } from "react";
import { VscFeedback } from "react-icons/vsc";
import { useTranslation } from "react-i18next";
import FeedbackFormModal from "./FeedbackFormModal";

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 ${isArabic ? "left-6" : "right-6"} z-40 bg-green-500 hover:bg-green-600 text-white cursor-pointer rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group`}
        aria-label="Feedback"
      >
        <VscFeedback size={24} className="group-hover:scale-110 transition-transform" />
      </button>
      <FeedbackFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

