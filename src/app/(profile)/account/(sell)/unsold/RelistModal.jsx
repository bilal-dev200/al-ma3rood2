
import React from "react";
import { useTranslation } from "react-i18next";

export default function RelistModal({
  isOpen,
  onClose,
  onQuickRelist,
  onEdit,
  quickRelistLabel = "Quick relist",
  editLabel = "Edit",
}) {
  if (!isOpen) return null;
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-white rounded-lg w-[90%] max-w-md p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-lg font-semibold mb-2">          {t("Relist this listing")}</h2>

        <p className="text-sm text-gray-700 mb-5">
          {t("Make changes before relisting with")}  <strong>{t("Edit")}</strong>  {t("or choose")}{" "}
          <strong>{t("Quick relist")}</strong> {t("to relist it as it is")}
        </p>

        <div className="flex gap-4">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => {
              onQuickRelist?.();
              onClose();
            }}
          >
            {quickRelistLabel}
          </button>

          <button
            className="bg-white text-gray-700 border border-gray-400 px-4 py-2 rounded hover:bg-gray-50"
            onClick={() => {
              onEdit?.();
              onClose();
            }}
          >
            {editLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

