"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";

const ExperienceView = ({ data = [], onEdit, onAdd, onDelete }) => {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        {t("No experience details found.")}{" "}
        <button
          onClick={onAdd}
          className="text-green-600 underline hover:text-green-700 ml-1"
        >
          {t("Add now")}
        </button>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-green-600">
          {t("Work Experience")}
        </h2>
        <button
          onClick={onAdd}
          className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition"
        >
          {t("Add New")}
        </button>
      </div>

      {data.map((exp, idx) => (
        <div
          key={idx}
          className="border-t border-gray-100 py-4 first:border-t-0 flex justify-between"
        >
          <div>
            <p className="font-semibold text-gray-800">
              {exp.job_title || "-"}
            </p>
            <p className="text-gray-600 text-sm">
              {exp.company || "-"}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {exp.start_date} —{" "}
              {exp.currently_working == "1" ? t("Present") : exp.end_date}
            </p>
            {exp.description && (
              <p className="text-gray-500 text-xs mt-1">{exp.description}</p>
            )}
          </div>

<div className="flex justify-center gap-1">
  <button
                onClick={() => onDelete(exp.id)}
                className="text-red-600 hover:text-red-800"
              >
                <AiOutlineDelete size={24} />
              </button>
          <button
            onClick={() => onEdit(exp)}
            className="text-green-600 hover:text-green-700"
          >
            <MdModeEdit size={24} />
          </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExperienceView;
