"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { profilePostApi, profilePutApi } from "@/lib/api/jobs-profile";
import { toast } from "react-toastify";

const certificationSchema = z.object({
  certificate_name: z.string().min(2, "Certificate name is required"),
  issuer: z.string().min(2, "Issuer is required"),
  issue_date: z.string().min(1, "Issue date is required"),
  expiry_date: z.string().optional(),
  no_expiry: z.enum(["1", "0"]),
  document: z.any().optional(),
});

const CertificationForm = ({ defaultData, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(certificationSchema),
    defaultValues:  defaultData
  ? {
      ...defaultData,
      no_expiry: String(defaultData.no_expiry ?? "0"),
      document_path: null,
    }
  :  {
      certificate_name: "",
      issuer: "",
      issue_date: "",
      expiry_date: "",
      no_expiry: "0",
      document: null,
    },
  });

  const noExpiry = watch("no_expiry");

  useEffect(() => {
  if (defaultData) {
    reset({
      certificate_name: defaultData.certificate_name || "",
      issuer: defaultData.issuer || "",
      issue_date: defaultData.issue_date || "",
      expiry_date: defaultData.expiry_date || "",
      no_expiry: String(defaultData.no_expiry ?? "0"), // FIXED
      document: null, // IMPORTANT FIX
    });
  }
}, [defaultData, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      // Object.entries(data).forEach(([key, value]) => {
      //   if (key === "document" && value !== null && value && value[0]) {
      //     formData.append("document", value[0]);
      //   } else if (key === "expiry_date" && data.no_expiry === "1") {
      //     // skip expiry_date if no_expiry is true
      //   } else {
      //     formData.append(key, value);
      //   }
      // });
      for (const [key, value] of Object.entries(data)) {
  if (key === "document") {
    // ONLY append if user selected a new file
    if (value && value[0] instanceof File) {
      formData.append("document", value[0]);
    }
    continue; // skip default append
  }

  if (key === "expiry_date" && data.no_expiry === "1") {
    continue; // skip expiry_date if no expiry
  }

  formData.append(key, value ?? "");
}

      let res;
      if (defaultData?.id) {
        res = await profilePutApi(`user/job-certificate/${defaultData.id}/update`, formData);
      } else {
        res = await profilePostApi("user/job-certificate/store", formData);
      }

      toast.success(res.message || "Certificate saved successfully!");
      onSuccess?.(res.data || {});
    } catch (err) {
      toast.error(err?.message || err?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <h2 className="text-2xl font-semibold mb-6">{t("Certificate Details")}</h2>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-md font-semibold mb-4">{t("Certification Information")}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Certificate Name */}
          <div>
            <label className="block text-sm mb-1">
              {t("Certificate Name")} <span className="text-red-500">*</span>
            </label>
            <input
              {...register("certificate_name")}
              placeholder={t("Enter certificate name")}
              className="w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
            {errors.certificate_name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.certificate_name.message}
              </p>
            )}
          </div>

          {/* Issuer */}
          <div>
            <label className="block text-sm mb-1">
              {t("Issuer")} <span className="text-red-500">*</span>
            </label>
            <input
              {...register("issuer")}
              placeholder={t("Enter organization name")}
              className="w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
            {errors.issuer && (
              <p className="text-red-500 text-xs mt-1">
                {errors.issuer.message}
              </p>
            )}
          </div>
        </div>

        {/* Issue and Expiry Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm mb-1">
              {t("Issue Date")} <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("issue_date")}
              className="w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
            {errors.issue_date && (
              <p className="text-red-500 text-xs mt-1">{errors.issue_date.message}</p>
            )}
          </div>

          {noExpiry == "0" && (
            <div>
              <label className="block text-sm mb-1">{t("Expiry Date")}</label>
              <input
                type="date"
                {...register("expiry_date")}
                className="w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}
        </div>

        {/* No Expiry Option */}
        <div className="mt-4">
          <h4 className="text-sm mb-2">{t("Does this certificate expire?")}</h4>
          <div className="flex items-center gap-6">
            <label className="flex items-center space-x-2">
              <input type="radio" {...register("no_expiry")} value="0" />
              <span>{t("Yes, it expires")}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" {...register("no_expiry")} value="1" />
              <span>{t("No Expiry")}</span>
            </label>
          </div>
        </div>

        {/* Document Upload */}
        <div className="mt-4">
          <label className="block text-sm mb-1">{t("Upload Document (PDF)")}</label>
          <input
            type="file"
            accept="application/pdf"
            {...register("document")}
            className="w-full border border-gray-300 rounded-[10px] px-3 py-2"
          />
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

export default CertificationForm;
