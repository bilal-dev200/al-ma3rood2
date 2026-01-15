"use client";

import React, { useState } from "react";
import { VscFeedback } from "react-icons/vsc";
import { useTranslation } from "react-i18next";
import FeedbackFormModal from "./FeedbackFormModal";
import { useAuthStore } from "@/lib/stores/authStore";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";

export default function FeedbackButton() {
  const { token } = useAuthStore();
  const isLoggedIn = !!token;
  const [isOpen, setIsOpen] = useState(false);
  const { i18n, t } = useTranslation();
  const isArabic = i18n.language === "ar";

  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    if (!isLoggedIn) {
      toast.info(t("Please login first to submit feedback"));

      setTimeout(() => {
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      }, 1200);

      return;
    }

    setIsOpen(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`fixed bottom-6 ${
          isArabic ? "left-6" : "right-6"
        } z-40 bg-green-500 hover:bg-green-600 text-white cursor-pointer rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group`}
        aria-label="Feedback"
      >
        <VscFeedback
          size={24}
          className="group-hover:scale-110 transition-transform"
        />
      </button>

      {isLoggedIn && (
        <FeedbackFormModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
