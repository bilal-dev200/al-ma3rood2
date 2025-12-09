"use client";
import React from "react";
import { useForm } from "react-hook-form";
import {
  FaEnvelope,
  FaCheckCircle,
  FaUser,
  FaMapMarkerAlt,
} from "react-icons/fa";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../ReuseableComponenets/Button";
import { userApi } from "@/lib/api/user";
import { toast } from "react-toastify";
import UserDetails from "./UserDetails";
import { useAuthStore } from "@/lib/stores/authStore";
import { useProfileStore } from "@/lib/stores/profileStore";
import { useTranslation } from "react-i18next";

// Validation schema
const schema = yup.object().shape({
  occupation: yup.string().required("Occupation is required"),
  about_me: yup.string().required("About me is required"),
  favourite_quote: yup.string().required("Favourite quote is required"),
});

const EditDeliveryaddress = () => {
    const hideComponent = useProfileStore((state) => state.hideComponent);
  
  const { updateUser } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      occupation: "",
      about_me: "",
      favourite_quote: "",
    },
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("occupation", data.occupation);
    formData.append("about_me", data.about_me);
    formData.append("favourite_quote", data.favourite_quote);

    try {
      const res = await userApi.updateProfile(formData);
      updateUser({
        occupation: res.data.occupation,
        favourite_quote: res.data.favourite_quote,
        about_me: res.data.about_me,
      });
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };
  const { t } = useTranslation();

  return (
    <div className="w-full mx-auto bg-[#FAFAFA] rounded-lg overflow-hidden">
      <UserDetails profile={true} />

      {/* Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="pt-14 px-3 pb-6">
        {/* Editable Fields */}
        <div className="mt-6 space-y-4">
          {/* Occupation */}
          <div>
            <h4 className="text-sm font-semibold mb-1">{t("Occupation")}</h4>
            <input
              type="text"
              {...register("occupation")}
              placeholder={t("Enter your occupation")}
              className="w-full md:w-3/4 border border-gray-300 rounded-[10px] px-3 py-2"
            />
            {errors.occupation && (
              <p className="text-red-500 text-xs mt-1">
                {errors.occupation.message}
              </p>
            )}
          </div>

          {/* About Me */}
          <div>
            <h4 className="text-sm font-semibold mb-1">{t("About Me")}</h4>
            <textarea
              {...register("about_me")}
              placeholder={t("Write something about yourself...")}
              className="w-full md:w-3/4 border border-gray-300 rounded-[10px] px-3 py-2 h-32 resize-none"
            ></textarea>
            {errors.about_me && (
              <p className="text-red-500 text-xs mt-1">
                {errors.about_me.message}
              </p>
            )}
          </div>

          {/* Favourite Quote */}
          <div>
            <h4 className="text-sm font-semibold mb-1">
              {t("Favourite Quote")}
            </h4>
            <textarea
              {...register("favourite_quote")}
              placeholder={t("Write your favorite quote...")}
              className="w-full md:w-3/4 border border-gray-300 rounded-[10px] px-3 py-2 h-32 resize-none"
            ></textarea>
            {errors.favourite_quote && (
              <p className="text-red-500 text-xs mt-1">
                {errors.favourite_quote.message}
              </p>
            )}
          </div>

          <div className="flex   gap-3">
            <Button type="submit">{t("Save")}</Button>
             <Button type="button" onClick={hideComponent}>
                    {t("Go Back")}
                  </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditDeliveryaddress;
