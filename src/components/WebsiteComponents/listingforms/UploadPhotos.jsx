import React from "react";
import { FiUploadCloud } from "react-icons/fi";
import { useFormContext } from "react-hook-form";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Image_URL } from "@/config/constants";
import axiosClient from "@/lib/api/axiosClient";
import { useTranslation } from "react-i18next";

const UploadPhotos = ({ name = "images", label }) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const images = watch(name) || [];

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const limitedFiles = [...images, ...files].slice(0, 20);
    setValue(name, limitedFiles, { shouldValidate: true });
  };

  const handleDelete = async (index) => {
    const img = images[index];
    if (img instanceof File) {
      // Just remove from state
      const updated = images.filter((_, i) => i !== index);
      setValue(name, updated, { shouldValidate: true });
    } else if (img?.id) {
      // Call delete API for backend image
      try {
        await axiosClient.delete(`/user/listings/images/${img.id}`);
      } catch (e) {
        // Optionally show error
      }
      const updated = images.filter((_, i) => i !== index);
      setValue(name, updated, { shouldValidate: true });
    }
  };

  const getImageSrc = (img) => {
    if (typeof img === "string") {
      return img.startsWith("http") ? img : `${Image_URL}${img}`;
    } else if (img instanceof File) {
      return URL.createObjectURL(img);
    } else if (img?.image_path) {
      return img.image_path.startsWith("http") ? img.image_path : `${Image_URL}${img.image_path}`;
    }
    return "";
  };
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-5xl px-4 sm:px-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-2">{label || t("Photos")}</h2>
      <p className="text-sm text-gray-600 mb-4">
        {t("Upload photos ({{count}}/20)", { count: images.length })}

      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {images.map((img, index) => (
          <div
            key={img.id || index}
            className="w-full aspect-square overflow-hidden rounded-md border border-gray-300 relative"
          >
            <img
              src={getImageSrc(img)}
              alt={`Upload preview ${index + 1}`}
              className="w-full h-full object-cover"
            />

            <button
              aria-label="Delete photo"
              type="button"
              title={t("Delete photo")}
              className="absolute top-2 right-2 bg-white bg-opacity-80 cursor-pointer hover:bg-red-500 hover:text-white text-red-500 rounded-full p-1 shadow"
              onClick={() => handleDelete(index)}
            >
              <RiDeleteBin6Line />
            </button>
          </div>
        ))}

        {images.length < 20 && (
          <div
            className={`aspect-square w-full rounded-md p-6 flex flex-col items-center justify-center text-center text-sm bg-white cursor-pointer transition ${errors[name]
                ? "border border-dashed border-red-500 text-red-600 hover:bg-red-50"
                : "border border-dashed border-green-400 text-green-600 hover:bg-green-50"
              }`}
          >
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <FiUploadCloud
                size={30}
                className={`mb-2 ${errors[name] ? "text-red-500" : "text-green-600"
                  }`}
              />
              <span className="font-medium">{t("Browse photos")}</span>
              <span className="text-gray-500 text-xs">{t("or drag and drop")}</span>
            </label>
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

          </div>
        )}
      </div>

      {errors[name] && (
        <p className="text-red-500 text-sm mt-2">{errors[name].message}</p>
      )}
      {/* Photo policy and guidelines link */}
      <p className="text-sm text-gray-600 mt-4">
        {/* {t("Drag to rearrange or tap to edit/remove.")}{" "} */}
        <span
          onClick={() => window.location.href = "/photo-policy"}  // yahan apna route likh do
          className="text-green-700 ml-1 cursor-pointer"
        >
          {t("Photo policy and guidelines")}
        </span>
      </p>

      {/* <p className="text-sm text-gray-600 mt-4">
{t("Drag to rearrange or tap to edit/remove.")}{" "}    <span className="text-green-700 ml-1 cursor-pointer underline">
    {t("Photo policy and guidelines")}
    </span>
  </p> */}
    </div>


  );
};

export default UploadPhotos;
