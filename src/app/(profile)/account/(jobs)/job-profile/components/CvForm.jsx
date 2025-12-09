"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { profilePostApi } from "@/lib/api/jobs-profile";
import { toast } from "react-toastify";

// ✅ Zod Schema for CV upload
const cvSchema = z.object({
  cv_file: z
    .any()
    .refine((file) => file && file.length > 0, "Please upload your CV.")
    .refine(
      (file) => file && file[0]?.type === "application/pdf",
      "CV must be a PDF file."
    ),
});

const CvForm = ({ onCancel, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(cvSchema),
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("cv_file", data.cv_file[0]);

      const res = await profilePostApi("user/job-cv/store", formData);
toast.success(res.message || "CV uploaded successfully!");
      reset();
      onSuccess?.();
    } catch (err) {
      toast.error(err?.message || "Something went wrong!");
      console.error("CV upload failed:", err);
    }
  };

  return (
    <div className="max-w-lg w-full">
      <h2 className="text-xl font-bold text-green-600 mb-4">
        Upload Your CV (PDF only)
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* CV File Upload */}
        <div>
          <input
            type="file"
            accept=".pdf"
            {...register("cv_file")}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.cv_file && (
            <p className="text-red-500 text-sm mt-1">
              {errors.cv_file.message}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Uploading..." : "Upload CV"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md font-semibold hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CvForm;
