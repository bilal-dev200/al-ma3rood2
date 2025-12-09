"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { MdModeEdit } from "react-icons/md";

const DetailsView = ({ data, onEdit, onAdd }) => {
  const { t } = useTranslation();

  if (!data) {
    return (
      <div className="text-center py-10 text-gray-500">
        {t("No profile details found.")}
        <button
          onClick={onAdd}
          className="text-green-600 underline hover:text-green-700 ml-1"
        >
          {t("Add now")}
        </button>
      </div>
    );
  }

  const {
    summary,
    preferred_roles,
    open_to_all_roles,
    industry,
    right_to_work_in_saudi,
    minimum_pay_type,
    minimum_pay_amount,
    notice_period,
    work_type,
  } = data;

  return (
    <div className="bg-white rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-green-600">
          {t("Professional Details")}
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
        {/* Summary - spans 2 columns */}
        <div className="md:col-span-2">
          <p className="font-semibold">{t("Summary")}</p>
          <p className="text-gray-600">{summary || "-"}</p>
        </div>

        <div>
          <p className="font-semibold">{t("Preferred Role")}</p>
<p>
 { Array.isArray(data.preferred_role) ? data.preferred_role.join(", ") : data.preferred_role || "-"}
</p>


        </div>

        <div>
          <p className="font-semibold">{t("Open to All Roles")}</p>
          <p className="uppercase">{open_to_all_roles ? t("Yes") : t("No")}</p>
        </div>

        <div>
          <p className="font-semibold">{t("Industry")}</p>
          <p>{industry || "-"}</p>
        </div>

        <div>
          <p className="font-semibold">{t("Right to Work in Saudi Arabia")}</p>
          <p className="uppercase">{right_to_work_in_saudi ? t("Yes") : t("No")}</p>
        </div>

        <div>
          <p className="font-semibold">{t("Minimum Pay Type")}</p>
          <p className="uppercase">{minimum_pay_type || "-"}</p>
        </div>

        <div>
          <p className="font-semibold">{t("Minimum Pay Amount")}</p>
          <p className="uppercase">{minimum_pay_amount || "-"}</p>
        </div>

        <div>
          <p className="font-semibold">{t("Notice Period")}</p>
          <p className="uppercase">{notice_period || "-"}</p>
        </div>

        <div>
          <p className="font-semibold">{t("Work Type")}</p>
          <p className="uppercase">{work_type ? work_type.replace(/_/g, " ") : "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default DetailsView;
