"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";

const CertificationView = ({ data = [], onEdit, onAdd, onDelete }) => {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        {t("No certifications found.")}{" "}
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
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-green-600">
          {t("Certifications")}
        </h2>
        <button
          onClick={onAdd}
          className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition"
        >
          {t("Add New")}
        </button>
      </div>

      {data.map((cert, idx) => (
        <div
          key={idx}
          className="border-t border-gray-100 py-4 first:border-t-0 flex justify-between items-start"
        >
          <div>
            <p className="font-semibold text-gray-800">
              {cert.certificate_name || "-"}
            </p>
            <p className="text-gray-600 text-sm">
              {cert.issuer || "-"}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {cert.issue_date
                ? `Issued: ${cert.issue_date}`
                : ""}
              {cert.no_expiry === "1"
                ? " | No Expiry"
                : cert.expiry_date
                ? ` | Expires: ${cert.expiry_date}`
                : ""}
            </p>
            {cert.document && (
              <a
                href={cert.document}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline mt-1 inline-block"
              >
                {t("View Document")}
              </a>
            )}
          </div>

<div className="flex justify-center gap-1">
  <button
                onClick={() => onDelete(cert.id)}
                className="text-red-600 hover:text-red-800"
              >
                <AiOutlineDelete size={24} />
              </button>
          <button
            onClick={() => onEdit(cert)}
            className="text-green-600 hover:text-green-700"
          >
            <FaEdit size={18} />
          </button>
        </div>
        </div>

      ))}
    </div>
  );
};

export default CertificationView;
