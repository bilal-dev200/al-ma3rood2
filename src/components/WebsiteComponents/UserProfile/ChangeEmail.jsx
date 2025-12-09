import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import Button from "../ReuseableComponenets/Button";
import { useProfileStore } from "@/lib/stores/profileStore";
import { userApi } from "@/lib/api/user";
import { useAuthStore } from "@/lib/stores/authStore";
import { useTranslation } from "react-i18next";

// Validation Schema
const schema = yup.object().shape({
  new_email: yup
    .string()
    .email("Invalid email address")
    .required("New email is required"),
  password: yup.string().required("Password is required"),
});

const ChangeEmail = () => {
  const hideComponent = useProfileStore((state) => state.hideComponent);
    const { user,updateUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
    new_email: user?.email || "",
  },
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("new_email", data.new_email);
    formData.append("password", data.password);

    try {
      const res = await userApi.uploadEmail(formData);
      updateUser({ email: res.data.email });
      toast.success("Email updated successfully!");
      reset(); 
    } catch (err) {
  const errorMessage =
    err?.data?.message || "Something went wrong. Please try again.";

  toast.error(errorMessage);
  console.error("Email update error:", err);
}
  };
  const { t } = useTranslation();

  return (
    <div className="p-3 
     bg-[#FAFAFA] rounded-[10px]">
  <h2 className="text-2xl font-semibold mb-2 text-black">
    {t("Change email address")}
  </h2>

  <p className="text-black mb-6 text-sm">
    {t("We will send you an email to confirm your new email address.")} <br />
    {t("Continue to use your current email address until you confirm the change.")}
  </p>

  <form
    onSubmit={handleSubmit(onSubmit)}
    className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
  >
    <div>
      <label htmlFor="newEmail" className="block text-sm font-semibold mb-1">
        {t("New email address")}
      </label>
      <input
        type="email"
        id="newEmail"
        placeholder={t("you@example.com")}
        {...register("new_email")}
        className="w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      {errors.new_email && (
        <p className="text-red-500 text-sm mt-1">{errors.new_email.message}</p>
      )}
    </div>

    <div>
      <label htmlFor="password" className="block text-sm font-semibold mb-1">
        {t("Current Password")}
      </label>
      <input
        type="password"
        id="password"
        placeholder={t("Your password")}
        {...register("password")}
        className="w-full border rounded-[10px] border-gray-300  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      {errors.password && (
        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
      )}
    </div>

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

export default ChangeEmail;
