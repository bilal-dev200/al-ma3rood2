"use client";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";

/**
 * FontSync component - Syncs body font class with current language
 * This ensures the font updates immediately when language changes without page refresh
 * Works without requiring "use client" on the layout, maintaining SSR benefits
 */
function FontSync() {
  const { i18n: i18nInstance } = useTranslation();

  useEffect(() => {
    // Function to update body font class based on current language
    const updateFontClass = () => {
      if (typeof document === "undefined") return;
      
      const body = document.body;
      if (!body) return;
      
      // Get current language from i18n instance or fallback to i18n singleton
      const currentLang = i18nInstance?.language || i18n?.language || "en";
      const isArabic = currentLang === "ar";
      
      // Remove both font classes
      body.classList.remove("font-Amiri", "font-Poppins");
      
      // Add the appropriate font class
      if (isArabic) {
        body.classList.add("font-Amiri");
      } else {
        body.classList.add("font-Poppins");
      }
    };

    // Small delay to ensure i18n is initialized
    const timeoutId = setTimeout(() => {
      updateFontClass();
    }, 0);

    // Listen for language changes using the i18n singleton (more reliable)
    const handleLanguageChange = () => {
      updateFontClass();
    };

    i18n.on("languageChanged", handleLanguageChange);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18nInstance]);

  // This component doesn't render anything
  return null;
}

export default FontSync;

