"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import { profilePostApi } from "@/lib/api/jobs-profile";
import { useTranslation } from "react-i18next";
import { categoriesApi } from "@/lib/api/category";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaTimes } from "react-icons/fa";

// ✅ Zod schema validation
const schema = z.object({
  summary: z.string().min(5, "Summary is required"),
    preferred_role: z.array(
    z.object({
      value: z.string().min(1, "Role cannot be empty"),
    })
  ).min(1, "At least one role is required"),
  open_to_all_roles: z.boolean().optional(),
  industry_id: z.union([z.string(), z.number()]).refine((v) => !!v, { message: "Industry is required" }),
  right_to_work_in_saudi: z.boolean().optional(),
  minimum_pay_type: z.enum(["hourly", "daily"], { required_error: "Minimum pay type is required" }),
  minimum_pay_amount: z.number({ invalid_type_error: "Minimum pay amount must be a number" }).min(1, "Minimum pay amount is required"),
  notice_period: z.string().min(1, "Notice period is required"),
  work_type: z.enum(["full_time", "part_time", "contract", "freelance"], { required_error: "Work type is required" }),
});

const noticePeriodOptions = [
  { value: "1 Week", label: "1 Week" },
  { value: "2 Weeks", label: "2 Weeks" },
  { value: "3 Weeks", label: "3 Weeks" },
  { value: "4 Weeks", label: "4 Weeks" },
  { value: "5 Weeks", label: "5 Weeks" },
  { value: "6 Weeks", label: "6 Weeks" },
  { value: "7 Weeks", label: "7 Weeks" },
  { value: "8 Weeks", label: "8 Weeks" },
];

const payTypeOptions = [
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
];

const workTypeOptions = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
];

const DetailsForm = ({ onCancel, defaultData, onSuccess }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [roleInput, setRoleInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      summary: defaultData?.summary || "",
       preferred_role: defaultData?.preferred_role?.map((r) => ({ value: r })) || [],
      open_to_all_roles: defaultData?.open_to_all_roles || false,
      right_to_work_in_saudi: defaultData?.right_to_work_in_saudi || false,
      industry_id: defaultData?.industry_id ? String(defaultData.industry_id) : "",
      minimum_pay_type: defaultData?.minimum_pay_type || "",
      minimum_pay_amount: defaultData?.minimum_pay_amount
        ? Number(String(defaultData.minimum_pay_amount).replace(/,/g, ""))
        : "",
      notice_period: defaultData?.notice_period || "",
      work_type: defaultData?.work_type || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
  control,
  name: "preferred_role",
});


useEffect(() => {
  if (defaultData?.preferred_role?.length) {
    const formattedRoles = defaultData.preferred_role.map((r) => ({ value: r }));
    setValue("preferred_role", formattedRoles);
  }
}, [defaultData, setValue]);

  console.log("Fields:", defaultData?.preferred_role, fields);


  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoriesApi.getAllCategories(null, "job");
        const formatted = res.data.map((cat) => ({
          value: String(cat.id),
          label: cat.name,
        }));
        setCategories(formatted);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Submit handler
  const onSubmit = async (data) => {
    setLoading(true);
    const payload = {
      ...data,
      industry_id: Number(data.industry_id),
      minimum_pay_amount: Number(data.minimum_pay_amount),
      open_to_all_roles: data.open_to_all_roles ? 1 : 0,
      right_to_work_in_saudi: data.right_to_work_in_saudi ? 1 : 0,
      preferred_role: data.preferred_role.map((r) => (typeof r === "string" ? r : r.value)),
    };

    try {
      const res = await profilePostApi("user/job/profile/store", payload);
      toast.success(res.message || "Details saved successfully!");
      onSuccess();
    } catch (err) {
      const errorResponse = err?.response?.data;
      if (errorResponse?.message?.schema) {
        // ✅ Show all schema errors properly
        Object.entries(errorResponse.message.schema).forEach(([key, msgs]) => {
          toast.error(`${key.replace(/_/g, " ")}: ${msgs.join(", ")}`);
        });
      } else {
        toast.error(errorResponse?.message || err?.message || "Failed to save details.");
      } 
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <h2 className="text-2xl font-semibold mb-6">{t("Job Details")}</h2>

      {/* Summary */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-md font-semibold mb-4">{t("Summary")}</h3>
        <textarea
          {...register("summary")}
          placeholder={t("Write a short summary about yourself")}
          className="resize-none w-full border border-gray-300 rounded-[10px] px-3 py-2 h-28 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.summary && <p className="text-red-500 text-xs mt-1">{errors.summary.message}</p>}
      </div>

      {/* Preferences */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-md font-semibold mb-4">{t("Job Preferences")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Preferred Role */}
          <div>
            <label className="block text-sm mb-1">
              {t("Preferred Roles")} <span className="text-red-500">*</span>
            </label>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={t("Enter a role and press Add")}
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  className="w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    append({ value: roleInput.trim() });
                  }}
                  className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 text-sm"
                >
                  <FaPlus size={12} />
                </button>
              </div>

      <div className="flex flex-wrap gap-2">
 {fields.map((field, index) => (
  <div
    key={field.id}
    className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full"
  >
    <span>{field.value}</span>
    <button
      type="button"
      onClick={() => remove(index)}
      className="ml-2 text-red-500 hover:text-red-700"
    >
      <FaTimes size={12} />
    </button>
  </div>
))}

</div>



            </div>

            {errors.preferred_role && (
              <p className="text-red-500 text-xs mt-1">{errors.preferred_role.message}</p>
            )}
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm mb-1">
              {t("Industry")} <span className="text-red-500">*</span>
            </label>
            <Controller
              name="industry_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={categories}
                  placeholder={t("Select Industry")}
                  isClearable
                  value={categories.find((opt) => opt.value === field.value) || null}
                  onChange={(selected) => field.onChange(selected?.value || "")}
                />
              )}
            />
            {errors.industry_id && <p className="text-red-500 text-xs mt-1">{errors.industry_id.message}</p>}
          </div>
        </div>

        {/* Role & Rights */}
        <div className="mt-6 flex flex-wrap gap-6">
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("open_to_all_roles")} />
            <span>{t("Open to all roles")}</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("right_to_work_in_saudi")} />
            <span>{t("Right to work in Saudi Arabia")}</span>
          </label>
        </div>
      </div>

      {/* Pay & Work Info */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-md font-semibold mb-4">{t("Pay & Work Info")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Work Type */}
          <Controller
            name="work_type"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm mb-1">
                  {t("Work Type")} <span className="text-red-500">*</span>
                </label>
                <Select
                  {...field}
                  options={workTypeOptions}
                  placeholder={t("Select Work Type")}
                  isClearable
                  value={workTypeOptions.find((opt) => opt.value === field.value) || null}
                  onChange={(selected) => field.onChange(selected?.value || "")}
                />
                {errors.work_type && <p className="text-red-500 text-xs mt-1">{errors.work_type.message}</p>}
              </div>
            )}
          />

          {/* Pay Type */}
          <Controller
            name="minimum_pay_type"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm mb-1">
                  {t("Minimum Pay Type")} <span className="text-red-500">*</span>
                </label>
                <Select
                  {...field}
                  options={payTypeOptions}
                  placeholder={t("Select Pay Type")}
                  isClearable
                  value={payTypeOptions.find((opt) => opt.value === field.value) || null}
                  onChange={(selected) => field.onChange(selected?.value || "")}
                />
                {errors.minimum_pay_type && (
                  <p className="text-red-500 text-xs mt-1">{errors.minimum_pay_type.message}</p>
                )}
              </div>
            )}
          />

          {/* Notice Period */}
          <Controller
            name="notice_period"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm mb-1">
                  {t("Notice Period")} <span className="text-red-500">*</span>
                </label>
                <Select
                  {...field}
                  options={noticePeriodOptions}
                  placeholder={t("Select Notice Period")}
                  isClearable
                  value={noticePeriodOptions.find((opt) => opt.value === field.value) || null}
                  onChange={(selected) => field.onChange(selected?.value || "")}
                />
                {errors.notice_period && (
                  <p className="text-red-500 text-xs mt-1">{errors.notice_period.message}</p>
                )}
              </div>
            )}
          />
        </div>

        {/* Minimum Pay Amount */}
        <div className="mt-4">
          <label className="block text-sm mb-1">
            {t("Minimum Pay Amount")} <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("minimum_pay_amount", { valueAsNumber: true })}
            placeholder="e.g. 100"
            className="w-full border border-gray-300 rounded-[6px] px-3 py-2 focus:ring-2 focus:ring-green-500"
          />
          {errors.minimum_pay_amount && (
            <p className="text-red-500 text-xs mt-1">{errors.minimum_pay_amount.message}</p>
          )}
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-3 mt-4 w-full">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
        >
          {t("Cancel")}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700"
        >
          {loading ? t("Saving...") : t("Save")}
        </button>
      </div>
    </form>
  );
};

export default DetailsForm;
