import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import Button from "../ReuseableComponenets/Button";
import { useProfileStore } from "@/lib/stores/profileStore";
import { userApi } from "@/lib/api/user";
import { useTranslation } from "react-i18next";

// Yup Validation Schema
const schema = yup.object().shape({
  current_password: yup.string().required("Old password is required"),
  new_password: yup
    .string()
    .required("New password is required"),
    // .min(8, "Password must be at least 8 characters"),
  new_password_confirmation: yup
    .string()
    .oneOf([yup.ref("new_password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const ChangePassword = () => {
  const hideComponent = useProfileStore((state) => state.hideComponent);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const formData = {
      current_password: data.current_password,
      new_password: data.new_password,
      new_password_confirmation: data.new_password_confirmation,
    };

    try {
      const res = await userApi.updatePassword(formData);
      toast.success(res?.data?.message || "Password updated successfully!");
      reset();
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
      console.error("Password update error:", err);
    }
  };

  const { t } = useTranslation();

  return (
    <div className="p-3  bg-[#FAFAFA] rounded-[10px]">
      <h2 className="text-2xl font-semibold mb-2 text-black">
    {t("Change your password")}
      </h2>

      <p className="text-black mb-6 text-sm">
    {t("Required fields are shown with a star *")}
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        {/* Old Password */}
        <div>
          <label htmlFor="oldPassword" className="block text-sm font-semibold mb-1">
           {t("Old Password")} <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="oldPassword"
        placeholder={t("Enter old password")}
            {...register("current_password")}
            className="w-full md:w-[500px] border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.current_password && (
            <p className="text-red-500 text-sm mt-1">{errors.current_password.message}</p>
          )}
        </div>

        {/* New Password + Confirm */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-semibold mb-1">
            {t("New Password")} <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="newPassword"
          placeholder={t("Enter new password")}
              {...register("new_password")}
              className="w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.new_password && (
              <p className="text-red-500 text-sm mt-1">{errors.new_password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-1">
              {t("Confirm Password")} <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
          placeholder={t("Confirm new password")}
              {...register("new_password_confirmation")}
              className="w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.new_password_confirmation && (
              <p className="text-red-500 text-sm mt-1">{errors.new_password_confirmation.message}</p>
            )}
          </div>
        </div>

        {/* Info Text */}
        <p className="text-sm text-gray-600">
               {t("Password strength")}<br />
      <span>{t("We recommend you use a strong, unique password.")}</span>
        </p>

        {/* Buttons */}
        <div className="md:col-span-2 flex gap-3">
      <Button type="submit">{t("Save")}</Button>
        <Button type="button" onClick={hideComponent}>
        {t("Go Back")}
      </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
