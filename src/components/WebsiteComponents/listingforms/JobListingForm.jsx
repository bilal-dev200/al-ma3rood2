"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "@/components/WebsiteComponents/ReuseableComponenets/Button";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import UploadPhotos from "./UploadPhotos";
import { categoriesApi } from "@/lib/api/category";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import CategoryModal from "./CategoryModal";
import Select from "react-select";
import { useLocationStore } from "@/lib/stores/locationStore";
import { JobsApi } from "@/lib/api/job-listing";
import { Image_URL } from "@/config/constants";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';

// --- START: UPDATED JOB LISTING SCHEMA ---

const fileSchema = z.any().optional();

const jobListingSchema = z
  .object({
    // Step 0: Basic Info & Pay
    title: z.string().min(3, "Job Title is required (min 3 charcters)"),
    listing_type: z.literal("job"), // Fixed to 'job'
    category_id: z
      .number({ invalid_type_error: "Job Category is required" })
      .nullable()
      .refine((val) => val !== null && val > 0, "Job Category is required"),
    subcategory_id: z.number().int().optional().nullable(),
    region_id: z.string().min(1, "Region is required"),
    governorate_id: z.string().min(1, "Governorate is required"),

    company_name: z.string().min(2, "Company Name is required"),
    work_type: z.enum(["full_time", "part_time", "contract", "freelance", "remote"], {
      required_error: "Work Type is required",
      invalid_type_error: "Invalid work type selected"
    }),

    minimum_pay_type: z.enum(["hourly", "daily", "weekly", "monthly"], {
      required_error: "Pay Type is required",
    }),
    minimum_pay_amount: z.string().min(1, "Pay Amount is required").refine(val => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Must be a valid positive pay amount"),
    show_pay: z.union([z.literal(1), z.literal(0)]),
    company_benefits: z.string().optional(),
    package_id: z.number().int().min(1, "Package is required"),


    // Step 1: Job Description
    short_summary: z.string().min(20, "Short Summary is required (min 20 charcters)"),
    description: z.string().min(50, "Detailed Description is required (min 50 charcters)"),
    is_entry_level: z.union([z.literal(1), z.literal(0)]),
    key_points: z.string().optional(),

    // Step 2: Requirements & Skills (NEW OPTIONAL STEP - placeholder for now)
    // required_skills: z.string().optional(),
    // education_level: z.string().optional(),
    // min_experience_years: z.string().optional().refine(val => !val || !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Must be a non-negative number for experience"),

    // Step 3: Contact & Media (Moved to 4th step)
    contact_name: z.string().min(3, "Contact Name is required"),
    contact_phone: z.string().min(10, "Valid phone number is required"),
    contact_email: z.string().email("A valid email is required"),
    reference: z.string().optional(),
    deadline: z.string().optional().nullable().refine((val) => {
      if (!val) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const deadlineDate = new Date(val);
      return deadlineDate > today;
    }, "Deadline must be a future date"),
    video_link: z.string().url("Must be a valid URL").optional().or(z.literal("")),

    // File Uploads
    logo: z.any().optional(),
    banner: z.any().refine((val) => {
      if (!val) return false;
      if (val instanceof File) return true;
      if (typeof val === 'string' && val.trim().length > 0) return true;
      return false;
    }, "Banner is required"),
    images: z.array(z.any()).min(2, "At least 2 additional images are required"),
  })
// .strict(); 

// Define fields for each step for granular validation
const jobSteps = [
  {
    title: "Basic Info & Pay",
    key: "basic-info",
    fields: [
      "title", "category_id", "region_id", "governorate_id",
      "company_name", "work_type", "minimum_pay_type",
      "minimum_pay_amount", "package_id", "deadline",
    ]
  },
  {
    title: "Description",
    key: "description-details",
    fields: [
      "short_summary", "description", "is_entry_level", "key_points"
    ]
  },
  // {
  //   title: "Requirements & Skills",
  //   key: "requirements-skills",
  //   // No strictly required fields yet, but we validate optional ones if entered
  //   fields: [
  //     "required_skills", 
  //     // "education_level", "min_experience_years"
  //   ]
  // },
  {
    title: "Contact & Media",
    key: "contact-media",
    fields: [
      "contact_name", "contact_phone", "contact_email", "logo", "banner", "images"
    ]
  },
];

// --- END: UPDATED JOB LISTING SCHEMA ---


const JobListingForm = ({ initialValues, mode = "create" }) => {
  const methods = useForm({
    resolver: zodResolver(jobListingSchema),
    defaultValues: {
      title: "",
      listing_type: "job",
      category_id: null,
      subcategory_id: null,
      region_id: "",
      governorate_id: "",
      company_name: "",
      work_type: "full_time",
      minimum_pay_type: "hourly",
      minimum_pay_amount: "",
      show_pay: 1,
      company_benefits: "",
      short_summary: "",
      description: "",
      is_entry_level: 0,
      contact_name: "",
      contact_phone: "",
      contact_email: "",
      // reference: "",
      video_link: "",
      logo: undefined,
      banner: undefined,
      images: [],
      package_id: 1,
      deadline: "",
    },
    mode: "onTouched",
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    control,
    reset,
    trigger,
  } = methods;

  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { locations, getAllLocations } = useLocationStore();
  const country = locations.find((c) => c.id == 1); // Saudi Arabia
  const regions = country?.regions || [];

  const governorates =
    regions.find((r) => r?.name === watch("region_id"))?.governorates || [];

  const cities =
    governorates.find((g) => g?.name === watch("governorate_id"))?.cities || [];

  const router = useRouter();
  const { t } = useTranslation();

  // Category Modal State/Logic
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryStack, setCategoryStack] = useState([]);
  const [currentCategories, setCurrentCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // --- Initial Values Normalization (Omitted for brevity, assumed correct from previous version) ---
  const normalizedInitialValues = useMemo(() => {
    if (!initialValues) return {};
    const copy = { ...initialValues };
    Object.keys(copy).forEach((key) => {
      if (copy[key] === null || copy[key] === undefined) copy[key] = "";
    });
    copy.is_entry_level = copy.is_entry_level === true || copy.is_entry_level === "true" ? 1 : 0;
    copy.show_pay = copy.show_pay === true || copy.show_pay === "true" ? 1 : 0;

    if (copy.category_id) copy.category_id = Number(copy.category_id);
    if (typeof copy.minimum_pay_amount === "string") {
      copy.minimum_pay_amount = copy.minimum_pay_amount.replace(/,/g, "");
    }
    if (initialValues.region && initialValues.region.name) {
      copy.region_id = initialValues.region.name;
    } else {
      // If the object isn't present, set to empty string for React Hook Form
      copy.region_id = "";
    }

    // Use the nested 'governorate' object to get the name for the governorate_id field
    if (initialValues.governorate && initialValues.governorate.name) {
      copy.governorate_id = initialValues.governorate.name;
    } else {
      copy.governorate_id = "";
    }
    if (Array.isArray(initialValues.key_points)) {
      // Join the array elements using a newline character to populate the textarea
      copy.key_points = initialValues.key_points.join('\n');
    } else {
      copy.key_points = "";
    }
    if (copy.package_id) copy.package_id = Number(copy.package_id);
    if (copy.deadline && typeof copy.deadline === "string") {
      // Input type="date" expects YYYY-MM-DD
      copy.deadline = copy.deadline.split("T")[0];
    } else {
      copy.deadline = "";
    }

    if (initialValues.logo) {
      copy.logo = initialValues.logo;
    }
    if (initialValues.banner) {
      copy.banner = initialValues.banner;
    }

    // ⭐ FILE FIX 2: Normalize Additional Media (API 'media_files' array -> form 'images' array)
    if (initialValues.media_files && Array.isArray(initialValues.media_files)) {
      copy.images = initialValues.media_files
        .map(media => media.file_path) // <-- Map to extract file_path string
        .filter(path => typeof path === 'string' && path.length > 0); // Ensure it's a valid string
    } else {
      copy.images = [];
    }

    return copy;
  }, [initialValues]);


  useEffect(() => {
    getAllLocations();
  }, [getAllLocations]);

  useEffect(() => {
    if (Object.keys(normalizedInitialValues).length > 0) {
      reset(normalizedInitialValues);
      if (initialValues?.category) {
        setSelectedCategory(initialValues.category);
      }
    }
  }, [initialValues, reset, normalizedInitialValues]);


  // --- Step Navigation Logic with Zod Validation ---

  // const nextStep = async () => {
  //   const currentStepFields = jobSteps[activeStep].fields;

  //   // Only trigger validation for fields relevant to the current step
  //   const isValid = await trigger(currentStepFields);

  //   if (isValid) {
  //       if (activeStep < jobSteps.length - 1) {
  //           setActiveStep((s) => s + 1);
  //       } else {
  //           // Last step, submit the form
  //           handleSubmit(onSubmit)();
  //       }
  //   } else {
  //       toast.error("Please fill in all required fields to continue.");
  //   }
  // };
  const nextStep = async () => {
    const currentStepFields = jobSteps[activeStep].fields;

    // Only trigger validation for fields relevant to the current step
    const isValid = await trigger(currentStepFields);

    // ⭐ ADDED CONSOLE LOGS HERE
    if (!isValid) {
      // Fetch the current errors object to see which fields failed
      const currentErrors = methods.formState.errors;
      console.error(
        `🚨 Step ${activeStep + 1} Validation Failed for fields:`,
        currentStepFields,
        "Errors:",
        currentErrors
      );
    } else {
      console.log(`✅ Step ${activeStep + 1} Validation Passed.`);
    }
    // ⭐ END CONSOLE LOGS

    if (isValid) {
      if (activeStep < jobSteps.length - 1) {
        setActiveStep((s) => s + 1);
      } else {
        // Last step, submit the form
        handleSubmit(onSubmit)();
      }
    } else {
      toast.error("Please fill in all required fields to continue.");
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  // --- Category Modal Handlers (Omitted for brevity, assumed correct from previous version) ---
  const fetchCategories = useCallback((parentId = '', listingType = 'job') => {
    setLoadingCategories(true);
    categoriesApi.getAllCategories(parentId, listingType)
      .then((res) => {
        setCurrentCategories(res.data || res);
      })
      .finally(() => setLoadingCategories(false));
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      fetchCategories();
      setCategoryStack([]);
    }
  }, [isModalOpen, fetchCategories]);

  const handleCategoryClick = async (cat) => {
    setLoadingCategories(true);
    try {
      const result = await categoriesApi.getAllCategories(cat.id, 'job');
      const children = result.data || result;
      if (children && children.length > 0) {
        setCategoryStack((prev) => [...prev, { id: cat.id, name: cat.name }]);
        setCurrentCategories(children);
      } else {
        setValue("category_id", cat.id);
        setSelectedCategory(cat);
        setIsModalOpen(false);
      }
    } finally {
      setLoadingCategories(false);
    }
  };
  const handleBackCategory = async () => {
    if (categoryStack.length === 0) return;
    setLoadingCategories(true);
    const newStack = [...categoryStack];
    newStack.pop();
    let parentId =
      newStack.length > 0 ? newStack[newStack.length - 1].id : undefined;
    const result = await categoriesApi.getAllCategories(parentId, 'job');
    setCurrentCategories(result.data || result);
    setCategoryStack(newStack);
    setLoadingCategories(false);
  };
  // --- End Category Modal Handlers ---

  // --- ERROR HANDLER FUNCTION (NEW) ---
  const onErrors = (errors) => {
    console.error("🚨 Final Form Validation Failed. Errors:", errors);
    toast.error("Please fill in all required fields. Check for errors in red.");

    // Logic to navigate to the first step with an error
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      for (let i = 0; i < jobSteps.length; i++) {
        if (jobSteps[i].fields.includes(firstErrorField)) {
          setActiveStep(i);
          toast.warn(`Error found in Step ${i + 1}: ${jobSteps[i].title}`);
          break;
        }
      }
    }
  };

  // --- onSubmit LOGIC (Omitted for brevity, assumed correct from previous version) ---

  const onSubmit = async (data) => {
    console.log("Submitting Job Data:", data);
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Mandatory/Core Job fields
      formData.append("listing_type", "job");
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("company_name", data.company_name);
      formData.append("work_type", data.work_type);
      formData.append("minimum_pay_type", data.minimum_pay_type);
      formData.append("minimum_pay_amount", data.minimum_pay_amount);
      formData.append("show_pay", data.show_pay.toString());
      formData.append("is_entry_level", data.is_entry_level.toString());
      formData.append("short_summary", data.short_summary);

      // Contact (Now in Step 3)
      formData.append("contact_name", data.contact_name);
      formData.append("contact_phone", data.contact_phone);
      formData.append("contact_email", data.contact_email);

      // IDs 
      if (data.category_id) formData.append("category_id", data.category_id.toString());
      if (data.region_id) formData.append("region_id", regions.find((r) => r.name === data.region_id)?.id || null);
      if (data.governorate_id) formData.append("governorate_id", governorates.find((g) => g.name === data.governorate_id)?.id || null,);
      if (data.package_id) formData.append("package_id", data.package_id.toString());
      if (data.deadline) formData.append("deadline", data.deadline);

      // Optional/Misc Fields
      if (data.company_benefits) formData.append("company_benefits", data.company_benefits);
      // if (data.reference) formData.append("reference", data.reference);
      if (data.video_link) formData.append("video_link", data.video_link);

      // New Step 2 fields
      // if (data.required_skills) formData.append("required_skills", data.required_skills);
      // if (data.education_level) formData.append("education_level", data.education_level);
      // if (data.min_experience_years) formData.append("min_experience_years", data.min_experience_years);


      // Handling Key Points (split by newline for the API array structure)
      if (data.key_points) {
        data.key_points.split('\n').filter(p => p.trim() !== '').forEach((point, index) => {
          formData.append(`key_points[${index}]`, point.trim());
        });
      }

      // Handling Files 
      if (data.logo instanceof File) {
        formData.append("logo", data.logo);
      }
      if (data.banner instanceof File) {
        formData.append("banner", data.banner);
      }
      if (data.images && data.images.length > 0) {
        data.images.forEach((file, index) => {
          if (file instanceof File) {
            formData.append(`media[${index}]`, file);
          }
        });
      }

      let response;
      if (mode === "edit" && initialValues.slug) {
        response = await JobsApi.updateJob(initialValues.slug, formData);
        toast.success("Job listing updated successfully!");
      } else {
        response = await JobsApi.createJob(formData);
        toast.success("Job listing created successfully!");
      }

      if (response && response.slug) {
        router.push(`/listing/viewJob?slug=${response.slug}`);
      } else {
        router.push("/account");
      }

    } catch (error) {
      console.error("Error creating job listing:", error);

      // Handle API validation errors - check multiple possible error structures
      const validationErrors =
        error?.data?.data ||
        error?.data?.errors ||
        error?.response?.data?.data ||
        error?.response?.data?.errors;

      if (validationErrors && typeof validationErrors === "object") {
        Object.entries(validationErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => {
              toast.error(msg);
            });
          } else {
            toast.error(messages);
          }
        });
      } else {
        // Fallback to general error message
        const errorMessage =
          error?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create job listing. Please try again.";
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- START: UPDATED STEP COMPONENTS ---

  const JobDetailsStep = ({ control, errors, setIsModalOpen, selectedCategory, watch, setValue }) => {
    // ... (Step 0 content - unchanged)
    const workTypeOptions = [
      { value: "full_time", label: "Full Time" },
      { value: "part_time", label: "Part Time" },
      { value: "contract", label: "Contract" },
      { value: "freelance", label: "Freelance" },
      { value: "remote", label: "Remote" },
    ];
    const payTypeOptions = [
      { value: "hourly", label: "Hourly" },
      { value: "daily", label: "Daily" },
      { value: "weekly", label: "Weekly" },
      { value: "monthly", label: "Monthly" },
      // { value: "yearly", label: "Yearly" },
    ];

    return (
      <div className="space-y-8">
        <h2 className="text-xl font-semibold text-gray-900">Basic Info & Pay</h2>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Category/Subcategory Selection */}
          <div onClick={() => setIsModalOpen(true)} className="cursor-pointer">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category*</label>
            <div className={`px-3 py-2 border rounded-md h-10 flex items-center justify-between ${selectedCategory ? 'text-gray-900' : 'text-gray-500'}`}>
              {selectedCategory?.name || "Choose Job Category"}
              <button type="button" className="text-sm text-green-600 hover:underline">
                {selectedCategory ? t("Change") : t("Select")}
              </button>
            </div>
            {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>}
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title*</label>
            <Controller name="title" control={control} render={({ field }) => (
              <input {...field} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. Frontend Developer" />
            )} />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name*</label>
            <Controller name="company_name" control={control} render={({ field }) => (
              <input {...field} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. Company Name" />
            )} />
            {errors.company_name && <p className="text-red-500 text-sm mt-1">{errors.company_name.message}</p>}
          </div>

          {/* Work Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Work Type*</label>
            <Controller name="work_type" control={control} render={({ field }) => (
              <select {...field} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-10">
                {workTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            )} />
            {errors.work_type && <p className="text-red-500 text-sm mt-1">{errors.work_type.message}</p>}
          </div>

          {/* Region ID (Placeholder) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region*</label>
            <Controller
              name="region_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={
                    field.value
                      ? { value: field.value, label: field.value }
                      : null
                  }
                  onChange={(selected) => field.onChange(selected?.value || "")}
                  options={regions.map((g) => ({
                    value: g?.name,
                    label: g?.name,
                  }))}
                  placeholder={t("Select a Region")}
                  className="text-sm w-full"
                  classNamePrefix="react-select"
                  isClearable
                />
              )}
            />
            {errors.region_id && <p className="text-red-500 text-sm mt-1">{errors.region_id.message}</p>}
          </div>

          {/* Governorate ID (Placeholder) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Governorate*</label>
            <Controller
              name="governorate_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={
                    field.value
                      ? { value: field.value, label: field.value }
                      : null
                  }
                  onChange={(selected) => field.onChange(selected?.value || "")}
                  options={governorates.map((g) => ({
                    value: g?.name,
                    label: g?.name,
                  }))}
                  placeholder={t("Select a Governorate")}
                  className="text-sm"
                  classNamePrefix="react-select"
                  isClearable
                />
              )}
            />
            {errors.governorate_id && <p className="text-red-500 text-sm mt-1">{errors.governorate_id.message}</p>}
          </div>

          {/* Minimum Pay Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Pay Amount*</label>
            <Controller name="minimum_pay_amount" control={control} render={({ field }) => (
              <input {...field} type="number" min={0} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. 20 (or 20000)" />
            )} />
            {errors.minimum_pay_amount && <p className="text-red-500 text-sm mt-1">{errors.minimum_pay_amount.message}</p>}
          </div>

          {/* Pay Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pay Type*</label>
            <Controller name="minimum_pay_type" control={control} render={({ field }) => (
              <select {...field} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-10">
                {payTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            )} />
            {errors.minimum_pay_type && <p className="text-red-500 text-sm mt-1">{errors.minimum_pay_type.message}</p>}
          </div>

          {/* Company Benefits (Optional) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Benefits (Optional)</label>
            <Controller name="company_benefits" control={control} render={({ field }) => (
              <input {...field} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. Health Card, Paid Leave" />
            )} />
          </div>

          {/* Show Pay Checkbox */}
          <div className="flex items-center">
            <Controller name="show_pay" control={control} render={({ field }) => (
              <input type="checkbox" checked={field.value === 1} onChange={(e) => field.onChange(e.target.checked ? 1 : 0)} className="h-4 w-4 text-green-600 border-gray-300 rounded" />
            )} />
            <label className="ml-2 block text-sm text-gray-900">Show Pay on Listing</label>
          </div>

          {/* Package ID */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Package ID*</label>
            <Controller name="package_id" control={control} render={({ field }) => (
                <input {...field} type="number" min="1" 
                    onChange={(e) => field.onChange(parseInt(e.target.value) || null)} 
                    value={field.value || ""} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. 1" />
            )} />
            {errors.package_id && <p className="text-red-500 text-sm mt-1">{errors.package_id.message}</p>}
          </div> */}

        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end pt-6">
          <Button type="button" onClick={nextStep} className="px-6 py-2 flex items-center" >
            Continue
            <IoIosArrowForward className="ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  const JobDescriptionStep = ({ control, errors }) => {
    return (
      <div className="space-y-8">
        <h2 className="text-xl font-semibold text-gray-900">Job Details & Description</h2>
        <div className="grid md:grid-cols-1 gap-6">
          {/* Short Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Short Summary*</label>
            <Controller name="short_summary" control={control} render={({ field }) => (
              <textarea {...field} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="A brief, engaging summary of the job." />
            )} />
            {errors.short_summary && <p className="text-red-500 text-sm mt-1">{errors.short_summary.message}</p>}
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description*</label>
            <Controller name="description" control={control} render={({ field }) => (
              <textarea {...field} rows={6} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Full job description, responsibilities, and requirements." />
            )} />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          {/* Key Points (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Key Points (Optional)</label>
            <p className="text-xs text-gray-500 mb-1">Enter key responsibilities or requirements, one point per line.</p>
            <Controller name="key_points" control={control} render={({ field }) => (
              <textarea {...field} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder={`Line 1: Must know React...
Line 2: 3+ years experience...`} />
            )} />
          </div>

          {/* Entry Level Checkbox */}
          <div className="flex items-center">
            <Controller name="is_entry_level" control={control} render={({ field }) => (
              <input type="checkbox" checked={field.value === 1} onChange={(e) => field.onChange(e.target.checked ? 1 : 0)} className="h-4 w-4 text-green-600 border-gray-300 rounded" />
            )} />
            <label className="ml-2 block text-sm text-gray-900">This is an Entry-Level position</label>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button type="button" onClick={prevStep} variant="outline" className="px-6 py-2 flex items-center">
            <IoIosArrowBack className="mr-2" />
            Back
          </Button>
          <Button type="button" onClick={nextStep} className="px-6 py-2 flex items-center">
            Continue
            <IoIosArrowForward className="ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  // --- NEW STEP 3: Requirements & Skills ---
  // const RequirementsSkillsStep = ({ control, errors }) => {
  //   // Placeholder options (replace with actual data)
  //   const educationOptions = [
  //       { value: "high_school", label: "High School" },
  //       { value: "diploma", label: "Diploma" },
  //       { value: "bachelors", label: "Bachelor's Degree" },
  //       { value: "masters", label: "Master's Degree" },
  //       { value: "phd", label: "PhD" },
  //       { value: "other", label: "Other" },
  //   ];

  //   return (
  //     <div className="space-y-8">
  //       <h2 className="text-3xl font-bold text-gray-900 mb-4">3. Requirements & Skills (Optional)</h2>
  //       <div className="grid md:grid-cols-2 gap-6">

  //           {/* Required Skills (Optional) */}
  //           <div className="md:col-span-2">
  //             <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
  //             <Controller name="required_skills" control={control} render={({ field }) => (
  //                 <textarea {...field} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="List key skills (e.g., Python, AWS, Agile) separated by commas." />
  //             )} />
  //           </div>

  //           {/* Education Level (Optional) */}
  //           {/* <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Education Level</label>
  //             <Controller name="education_level" control={control} render={({ field }) => (
  //                 <select {...field} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-10">
  //                     <option value="">Select minimum education...</option>
  //                     {educationOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
  //                 </select>
  //             )} />
  //           </div> */}

  //           {/* Minimum Experience (Optional) */}
  //           {/* <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Experience (Years)</label>
  //             <Controller name="min_experience_years" control={control} render={({ field }) => (
  //                 <input {...field} type="number" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. 2" />
  //             )} />
  //             {errors.min_experience_years && <p className="text-red-500 text-sm mt-1">{errors.min_experience_years.message}</p>}
  //           </div> */}

  //       </div>

  //       {/* Navigation Buttons */}
  //       <div className="flex justify-between pt-6">
  //         <Button type="button" onClick={prevStep} variant="outline" className="px-6 py-2 flex items-center">
  //           <IoIosArrowBack className="mr-2" />
  //           Back
  //         </Button>
  //         <Button type="button" onClick={nextStep} className="px-6 py-2 flex items-center">
  //           Continue
  //           <IoIosArrowForward className="ml-2" />
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // };

  // --- STEP 4 (Index 3): Contact & Media ---
  const ContactMediaStep = ({ control, errors, setValue }) => {

    // const FileInput = ({ name, label }) => (
    //     <div>
    //         <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    //         <Controller
    //             name={name}
    //             control={control}
    //             render={({ field: { onChange, value, ...rest } }) => (
    //                 <input
    //                     type="file"
    //                     onChange={(e) => onChange(e.target.files?.[0])}
    //                     className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
    //                     {...rest}
    //                 />
    //             )}
    //         />
    //         {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>}
    //     </div>
    // );
    // Helper function to resolve image source (needs to be available for FileInput)
    const getFilePreviewSrc = (fileValue) => {
      if (!fileValue) return null;

      if (fileValue instanceof File) {
        // New file selected by the user
        return URL.createObjectURL(fileValue);
      }
      if (typeof fileValue === "string") {
        // Existing file path from the API
        // Check if it's a full URL or needs the base Image_URL
        return fileValue.startsWith("http") ? fileValue : `${Image_URL}${fileValue}`;
      }
      return null;
    };


    const FileInput = ({ name, label }) => {
      // Watch the current value for preview display
      const fileValue = watch(name);
      const previewSrc = getFilePreviewSrc(fileValue);

      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

          {/* 🖼️ IMAGE PREVIEW BLOCK */}
          {previewSrc && (
            <div className="mb-3 border border-gray-300 rounded-md overflow-hidden bg-gray-50 p-2">
              <img
                src={previewSrc}
                alt={`${label} Preview`}
                className="w-full h-24 object-contain" // Use object-contain or object-cover as needed
              />
              <p className="text-xs text-gray-500 mt-1">Current file is set. Uploading a new file will replace it.</p>
            </div>
          )}
          {/* 🖼️ END IMAGE PREVIEW BLOCK */}

          <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value, ...rest } }) => (
              <input
                type="file"
                onChange={(e) => onChange(e.target.files?.[0])}
                // Ensure 'value' prop is NOT passed to type='file' input for uncontrolled behavior
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                {...rest}
              />
            )}
          />
          {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>}
        </div>
      );
    };
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">4. Contact & Media</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name*</label>
            <Controller name="contact_name" control={control} render={({ field }) => (
              <input {...field} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. HR Name" />
            )} />
            {errors.contact_name && <p className="text-red-500 text-sm mt-1">{errors.contact_name.message}</p>}
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone*</label>
            <Controller
              name="contact_phone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  country="sa"
                  onlyCountries={["sa"]}
                  disableDropdown
                  countryCodeEditable={false}
                  value={field.value || ""}
                  onChange={(value) => field.onChange(value)}
                  inputClass={`w-full p-2 border rounded-md ${errors.contact_phone ? "border-red-500" : "border-gray-300"
                    }`}
                  inputStyle={{
                    width: "100%",
                    height: "40px",
                    fontSize: "14px",
                  }}
                  buttonStyle={{
                    border: "none",
                    backgroundColor: "transparent",
                  }}
                  placeholder="5XXXXXXXX"
                />
              )}
            />
            {errors.contact_phone && <p className="text-red-500 text-sm mt-1">{errors.contact_phone.message}</p>}
          </div>

          {/* Contact Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email*</label>
            <Controller name="contact_email" control={control} render={({ field }) => (
              <input {...field} type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. hr@abc.com" />
            )} />
            {errors.contact_email && <p className="text-red-500 text-sm mt-1">{errors.contact_email.message}</p>}
          </div>

          {/* Package (Placeholder) - usually fixed to 1 for now */}
          {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package ID</label>
                <Controller name="package_id" control={control} render={({ field }) => (
                    <input {...field} type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                )} />
            </div> */}

          {/* Deadline (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline (Optional)</label>
            <Controller
              name="deadline"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              )}
            />
            {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline.message}</p>}
          </div>
          {/* Reference (Optional) */}
          {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reference (Optional)</label>
              <Controller name="reference" control={control} render={({ field }) => (
                  <input {...field} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Optional Reference ID" />
              )} />
            </div> */}

          {/* Video Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Video Link (Optional)</label>
            <Controller name="video_link" control={control} render={({ field }) => (
              <input {...field} type="url" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. https://youtube.com/..." />
            )} />
            {errors.video_link && <p className="text-red-500 text-sm mt-1">{errors.video_link.message}</p>}
          </div>

          {/* Logo Upload */}
          <FileInput name="logo" label="Company Logo (File)" />

          {/* Banner Upload */}
          <FileInput name="banner" label="Job Banner (File)*" />

          {/* Media Upload */}
          <div className="md:col-span-2">
            <UploadPhotos
              name="images"
              label="Additional Media (Photos)*"
            />
          </div>

        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button type="button" onClick={prevStep} variant="outline" className="px-6 py-2 flex items-center">
            <IoIosArrowBack className="mr-2" />
            Back
          </Button>
          {/* Final Submit Button */}
          <Button type="submit" onClick={() => handleSubmit(onSubmit, onErrors)()} className="px-6 py-2" disabled={isSubmitting}>
            {isSubmitting ? t(mode === "edit" ? "Updating..." : "Creating...") : t(mode === "edit" ? "Update Job" : "Post Job")}
          </Button>
        </div>
      </div>
    );
  };
  // --- END: UPDATED STEP COMPONENTS ---

  // Renders current step component
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <JobDetailsStep
          control={control}
          errors={errors}
          setIsModalOpen={setIsModalOpen}
          selectedCategory={selectedCategory}
          setValue={setValue}
          watch={watch}
        />;
      case 1:
        return <JobDescriptionStep control={control} errors={errors} />;
      // case 2:
      // return <RequirementsSkillsStep control={control} errors={errors} />;
      case 2:
        return <ContactMediaStep control={control} errors={errors} setValue={setValue} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {jobSteps.map((step, index) => (
            <React.Fragment key={step.key}>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index <= activeStep ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm font-medium hidden sm:block ${index <= activeStep ? "text-green-600" : "text-gray-500"}`}>
                  {step.title}
                </span>
              </div>
              {index < jobSteps.length - 1 && <div className={`flex-1 h-1 mx-4 ${index < activeStep ? "bg-green-500" : "bg-gray-200"}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {renderStepContent()}

          {isModalOpen && <CategoryModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            categoryStack={categoryStack}
            handleBackCategory={handleBackCategory}
            currentCategories={currentCategories}
            handleCategoryClick={handleCategoryClick}
            loadingCategories={loadingCategories}
          />}
        </form>
      </FormProvider>
    </div>
  );
};

export default JobListingForm;