"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { MdModeEdit } from "react-icons/md";

const PersonalDetailsView = ({ data, onEdit, onAdd }) => {
  const { t } = useTranslation();

  if (!data) {
    return (
      <div className="text-center py-10 text-gray-500">
        {t("No personal details found.")}
        <button
          onClick={onAdd}
          className="text-green-600 underline hover:text-green-700 ml-1"
        >
          {t("Add now")}
        </button>
      </div>
    );
  }

  const { name, email, current_job_title, job_profile_visibility } = data;

  return (
    <div className="bg-white rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-green-600">
          {t("Personal Details")}
        </h2>
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-green-600 hover:text-green-700 transition"
        >
          <MdModeEdit size={24} />
        </button>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <div>
          <p className="font-semibold">{t("Full Name")}</p>
          <p>{name || "-"}</p>
        </div>

        <div>
          <p className="font-semibold">{t("Email")}</p>
          <p>{email || "-"}</p>
        </div>

        <div>
          <p className="font-semibold">{t("Current Job Title")}</p>
          <p>{current_job_title || "-"}</p>
        </div>

        <div>
          <p className="font-semibold">{t("Profile Visibility")}</p>
          <p className="capitalize">{job_profile_visibility || "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsView;
