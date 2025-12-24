"use client";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import dynamic from "next/dynamic";

const QuillEditor = dynamic(() => import("@/components/ui/QuillEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-32 bg-gray-100 animate-pulse rounded-md"></div>
  ),
});

import { useTranslation } from "react-i18next";
import DynamicAttributes from "./DynamicAttributes";

// Keep for backward compatibility if needed elsewhere
export const categoryFields = {};


const ItemDetail = ({ parentCategoryName }) => {
  const {
    register,
    watch,
    formState: { errors },
    control,
  } = useFormContext();
  const condition = watch("condition");
  const { t } = useTranslation();
  const conditions = [
    {
      key: "brand_new_unused",
      label: "Brand New / Unused – never opened or used.",
    },
    {
      key: "like_new",
      label: "Like New – opened but looks and works like new.",
    },
    {
      key: "gently_used_excellent_condition",
      label: "Gently Used / Excellent Condition – minor signs of use.",
    },
    {
      key: "good_condition",
      label: "Good Condition – visible wear but fully functional.",
    },
    {
      key: "fair_condition",
      label: "Fair Condition – heavily used but still works.",
    },
    {
      key: "for_parts_or_not_working",
      label: "For Parts or Not Working – damaged or needs repair.",
    },
    {
      key: "not_applicable",
      label: "Not Applicable – condition does not apply to this item.",
    },
  ];

  return (
    <div className="w-full max-w-[800px] px-4 md:px-0">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">
        {" "}
        {t("Item details")}
      </h2>

      {/* Description */}
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t("Description")}
      </label>
      <Controller
        name="description"
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <div className="rounded-md">
            <QuillEditor
              value={value}
              onChange={onChange}
              error={error?.message}
              placeholder="Describe your item..."
            />
          </div>
        )}
      />

      {/* Condition */}
      <label className="block text-sm font-medium text-gray-700 mt-6 mb-2">
        {t("Condition")}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {conditions.map((item) => (
          <label
            key={item.key}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
          >
            <input
              type="radio"
              value={item.key}
              {...register("condition")}
              checked={condition === item.key}
              className="accent-green-500"
            />
            <span className="text-sm">{t(item.label)}</span>
          </label>
        ))}
      </div>
      {errors.condition && (
        <p className="text-red-500 text-sm mt-1">{errors.condition.message}</p>
      )}

      {/* Dynamic Attributes */}
      <DynamicAttributes />
    </div>
  );
};

export default ItemDetail;
