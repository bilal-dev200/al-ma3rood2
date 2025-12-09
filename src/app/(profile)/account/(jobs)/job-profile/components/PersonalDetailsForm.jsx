"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import { profilePostApi } from "@/lib/api/jobs-profile";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/stores/authStore";

// ✅ Validation schema
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  job_profile_visibility: z.enum(["full", "limited", "hidden"], {
    required_error: "Please select visibility",
  }),
  current_job_title: z.string().min(1, "Current job title is required"),
});

const visibilityOptions = [
  { value: "full", label: "Full" },
  { value: "limited", label: "Limited" },
  { value: "hidden", label: "Hidden" },
];

const PersonalDetailsForm = ({ onCancel, defaultData, onSuccess }) => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultData?.name || "",
      job_profile_visibility: defaultData?.job_profile_visibility || "",
      current_job_title: defaultData?.current_job_title || "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await profilePostApi(`user/${user?.id}/edit-contact-details`, data);
      console.log(res);
      toast.success(res?.message || "Personal details updated successfully!");
      updateUser({
        name: res.data?.name || "",
        job_profile_visibility: res.data?.job_profile_visibility || "",
        current_job_title: res.data?.current_job_title || "",
      });
      onSuccess();
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      console.error("Contact Detail update error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <h2 className="text-2xl font-semibold mb-6">{t("Personal Details")}</h2>
<div className="flex flex-wrap justify-content-center mb-6 bg-gray-50 p-4 rounded-lg gap-10">
      {/* ✅ Name Field */}
      <div className="w-full md:w-1/3">
        <label className="block text-sm mb-1">
          {t("Name")} <span className="text-red-500">*</span>
        </label>
        <input
          {...register("name")}
          placeholder={t("Enter your name")}
          className="w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:ring-2 focus:ring-green-500"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* ✅ Current Job Title */}
      <div className="w-full md:w-1/3">
        <label className="block text-sm mb-1">
          {t("Current Job Title")} <span className="text-red-500">*</span>
        </label>
        <input
          {...register("current_job_title")}
          placeholder={t("e.g. Frontend Developer")}
          className="w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:ring-2 focus:ring-green-500"
        />
        {errors.current_job_title && (
          <p className="text-red-500 text-xs mt-1">
            {errors.current_job_title.message}
          </p>
        )}
      </div>
</div>
      {/* ✅ Visibility */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg w-full md:w-96">
        <label className="block text-sm mb-1">
          {t("Job Profile Visibility")} <span className="text-red-500">*</span>
        </label>
        <Controller
          name="job_profile_visibility"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={visibilityOptions}
              placeholder={t("Select visibility")}
              isClearable
              value={
                visibilityOptions.find((opt) => opt.value === field.value) ||
                null
              }
              onChange={(selected) => field.onChange(selected?.value || "")}
            />
          )}
        />
        {errors.job_profile_visibility && (
          <p className="text-red-500 text-xs mt-1">
            {errors.job_profile_visibility.message}
          </p>
        )}
      </div>

      {/* ✅ Buttons */}
      <div className="flex justify-end gap-3 mt-4 w-full">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
        >
          {t("Cancel")}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700"
        >
          {loading ? t("Saving...") : t("Save")}
        </button>
      </div>
    </form>
  );
};

export default PersonalDetailsForm;
