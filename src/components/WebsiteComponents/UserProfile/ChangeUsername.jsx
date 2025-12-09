import React from "react";
import Button from "../ReuseableComponenets/Button";
import { useProfileStore } from "@/lib/stores/profileStore";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { userApi } from "@/lib/api/user"; // Adjust the path if needed
import { useAuthStore } from "@/lib/stores/authStore";
import { useTranslation } from "react-i18next";

// ✅ Yup Validation Schema
const schema = yup.object().shape({
  new_name: yup
    .string()
    .min(3, "Fullname must be at least 3 characters")
    .required("Fullname is required"),
  password: yup.string().required("Password is required"),
});

const ChangeUsername = () => {
  const hideComponent = useProfileStore((state) => state.hideComponent);
  const { user, updateUser } = useAuthStore();



  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      new_name: user?.name || "",
    },
  });

  console.log('aaaa user', user);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("new_name", data.new_name);
    formData.append("password", data.password);

    try {
      const res = await userApi.updateUsername(formData);
      console.log('aaaa res', res);
      updateUser({
        first_name: res.data?.user?.first_name || "",
        last_name: res.data?.user?.last_name || "",
        name: `${res.data?.user?.first_name} ${res.data?.user?.last_name}` || "",
      });
      // console.log('aaaa res', res);
      // updateUser({ name: res.data.name });
      toast.success("Full name  updated successfully!");
      reset();
      hideComponent();
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      console.error("Username update error:", err);
    }
  };
  const { t } = useTranslation();

  return (
    <div className="p-3  bg-[#FAFAFA] rounded-[10px]">
      <h2 className="text-2xl font-semibold mb-2 text-black">
        {t("Change Fullname")}
      </h2>

      <p className="text-black mb-6 text-sm">
        {t("You will only be able to change it once every 30 days.")}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="new_name"
              className="block text-sm font-semibold mb-1"
            >
              {t("Fullname")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="new_name"
              {...register("new_name")}
              className="w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.new_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.new_name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-1"
            >
              {t("Current Password")} <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              placeholder={t("Your password")}
              className="w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        {/* Save Button */}
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

export default ChangeUsername;
