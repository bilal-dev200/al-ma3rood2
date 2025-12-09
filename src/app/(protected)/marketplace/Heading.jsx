"use client";
import React from "react";
import { useTranslation } from "react-i18next";

export const Heading = () => {
  const { t } = useTranslation();
  return (
    //  {/* Heading */}
    <div className="py-16 px-10 w-full flex justify-start">
      <h1 className="text-3xl md:text-3xl">
        {t("SHOP NEW & USED ITEMS")} <br /> {t("FOR SALE")} <br />
        <br />
      </h1>
    </div>
  );
};
