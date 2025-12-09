"use client";
import React from 'react'
import { useTranslation } from 'react-i18next';

export const HeadingAndDes = () => {
      const { t } = useTranslation();
  return (
    <div>
        <h1 className="text-2xl font-semibold mb-2">{t("About Us")}</h1>
      <p className="text-gray-600 mb-8 max-w-3xl">
        {t(
          "Leading with inspiration: the heart of our mission is a passionate team shaping strategy, culture, and impact."
        )}
      </p>
    </div>
  )
}
