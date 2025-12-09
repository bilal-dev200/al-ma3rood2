"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { profilePostApi, profilePutApi } from "@/lib/api/jobs-profile";
import { toast } from "react-toastify";

const educationSchema = z.object({
  education_provider: z.string().min(2, "Education provider is required"),
  qualification: z.string().min(2, "Qualification is required"),
  currently_studying: z.enum(["1", "0"]),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
});

const EducationForm = ({ defaultData, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(educationSchema),
    defaultValues: defaultData
  ? {
      ...defaultData,
      currently_studying: String(defaultData.currently_studying ?? "0"),
      end_date: ""
    }
  :  {
      education_provider: "",
      qualification: "",
      currently_studying: "0",
      start_date: "",
      end_date: "",
    },
  });

  const currentlyStudying = watch("currently_studying");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let res;
      if (defaultData?.id) {
        res = await profilePutApi(`user/education/${defaultData?.id}/update`, data);
      } else {
        res = await profilePostApi("user/education/store", data);
      }

      toast.success(res.message || "Education saved successfully!");
      onSuccess?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <h2 className="text-2xl font-semibold mb-6">{t("Education Details")}</h2>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-md font-semibold mb-4">{t("Education Information")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Education Provider */}
          <div>
            <label className="block text-sm mb-1">
              {t("Education Provider")} <span className="text-red-500">*</span>
            </label>
            <input
              {...register("education_provider")}
              placeholder={t("Enter institute or university name")}
              className="w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
            {errors.education_provider && (
              <p className="text-red-500 text-xs mt-1">
                {errors.education_provider.message}
              </p>
            )}
          </div>

          {/* Qualification */}
          <div>
            <label className="block text-sm mb-1">
              {t("Qualification")} <span className="text-red-500">*</span>
            </label>
            <input
              {...register("qualification")}
              placeholder={t("Enter degree or certification name")}
              className="w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
            {errors.qualification && (
              <p className="text-red-500 text-xs mt-1">
                {errors.qualification.message}
              </p>
            )}
          </div>
        </div>

        {/* Currently Studying */}
        <div className="mt-4">
          <h4 className="text-sm mb-2">{t("Currently Studying?")}</h4>
          <div className="flex items-center gap-6">
            <label className="flex items-center space-x-2">
              <input type="radio" {...register("currently_studying")} value="1" />
              <span>{t("Yes")}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" {...register("currently_studying")} value="0" />
              <span>{t("No")}</span>
            </label>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm mb-1">
              {t("Start Date")} <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("start_date")}
              className="w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
            {errors.start_date && (
              <p className="text-red-500 text-xs mt-1">{errors.start_date.message}</p>
            )}
          </div>

          {currentlyStudying === "0" && (
            <div>
              <label className="block text-sm mb-1">{t("End Date")}</label>
              <input
                type="date"
                {...register("end_date")}
                className="w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
          >
            {t("Cancel")}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
          >
            {loading ? t("Saving...") : t("Save")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EducationForm;
