"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { postApi, putApi } from "@/lib/api/jobs-profile";
import { toast } from "react-toastify";

const experienceSchema = z.object({
  job_title: z.string().min(2, "Job title is required"),
  company: z.string().min(2, "Company name is required"),
  country: z.string().min(2, "Country is required"),
  currently_working: z.enum(["1", "0"]),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

const ExperienceForm = ({ defaultData, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(experienceSchema),
    defaultValues: defaultData
  ? {
      ...defaultData,
      currently_working: String(defaultData.currently_working ?? "0"),
    }
  : {
      job_title: "",
      company: "",
      country: "",
      currently_working: "0",
      start_date: "",
      end_date: "",
      description: "",
    },

  });

  const currentlyWorking = watch("currently_working");

  // ✅ Reset form whenever defaultData changes
  useEffect(() => {
    if (defaultData) {
      console.log("Resetting form with defaultData:", defaultData);
      reset({
        job_title: defaultData.job_title || "",
        company: defaultData.company || "",
        country: defaultData.country || "",
        currently_working: String(defaultData.currently_working ?? "0"),
        start_date: defaultData.start_date || "",
        end_date: defaultData.end_date || "",
        description: defaultData.description || "",
      });
    }
  }, [defaultData, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Loop through all fields
      Object.entries(data).forEach(([key, value]) => {
        // Skip null/undefined values
        if (value === undefined || value === null) return;

        // If current_working is true, skip end_date
        if (key === "end_date" && data.currently_working == 1) return;

        formData.append(key, value);
      });

      if (defaultData?.id) {
        const res = await putApi(
          `user/job-experience/${defaultData.id}/update`,
          formData
        );
        toast.success(res?.message || "Experience updated successfully!");
      } else {
        const res = await postApi("user/job-experience/store", formData);
        toast.success(res?.message || "Experience added successfully!");
      }

      onSuccess?.();
    } catch (err) {
      const errorResponse = err?.response?.data;
      if (errorResponse?.message?.schema) {
        Object.entries(errorResponse.message.schema).forEach(([key, msgs]) => {
          toast.error(`${key.replace(/_/g, " ")}: ${msgs.join(", ")}`);
        });
      } else {
        toast.error(errorResponse?.message || "Failed to save experience.");
      }
      console.error("Error saving experience:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <h2 className="text-2xl font-semibold mb-6">{t("Experience Details")}</h2>

      <div className="-mt-3 p-4 bg-gray-50 rounded-lg">
        {/* Job Title */}
        <h3 className="text-md font-semibold mb-4">
          {t("Experience Information")}
        </h3>
        <div className="mb-6 p-4 bg-white rounded">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Job Title */}
            <div>
              <label htmlFor="job_title" className="block text-sm mb-1">
                {t("Job Title")} <span className="text-red-500">*</span>
              </label>
              <input
                id="job_title"
                {...register("job_title")}
                className="w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.job_title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.job_title.message}
                </p>
              )}
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm mb-1">
                {t("Company")} <span className="text-red-500">*</span>
              </label>
              <input
                id="company"
                {...register("company")}
                className="w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.company && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.company.message}
                </p>
              )}
            </div>
          </div>

          {/* Country */}
          <div className="mt-4">
            <label htmlFor="country" className="block text-sm mb-1">
              {t("Country")} <span className="text-red-500">*</span>
            </label>
            <input
              id="country"
              {...register("country")}
              className="w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.country && (
              <p className="text-red-500 text-xs mt-1">
                {errors.country.message}
              </p>
            )}
          </div>

          {/* Currently Working */}
          <div className="mt-4">
            <h4 className="text-sm mb-2">{t("Currently Working?")}</h4>
            <div className="flex items-center gap-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  {...register("currently_working")}
                  value="1"
                />
                <span>{t("Yes")}</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  {...register("currently_working")}
                  value="0"
                />
                <span>{t("No")}</span>
              </label>
            </div>
            {errors.currently_working && (
              <p className="text-red-500 text-xs mt-1">
                {errors.currently_working.message}
              </p>
            )}
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
                className="w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.start_date && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.start_date.message}
                </p>
              )}
            </div>

            {currentlyWorking === "0" && (
              <div>
                <label className="block text-sm mb-1">{t("End Date")}</label>
                <input
                  type="date"
                  {...register("end_date")}
                  className="w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mt-4">
            <label htmlFor="description" className="block text-sm mb-1">
              {t("Description")} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              {...register("description")}
              placeholder={t("Describe your responsibilities and achievements")}
              className="w-full border border-gray-300 rounded-[10px] px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
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

export default ExperienceForm;
