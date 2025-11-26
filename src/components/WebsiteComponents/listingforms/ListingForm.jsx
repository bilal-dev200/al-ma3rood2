"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "@/components/WebsiteComponents/ReuseableComponenets/Button";
import StepTitleCategory from "@/components/WebsiteComponents/listingforms/StepTitleCategory";
import ItemDetail, {
  categoryFields,
} from "@/components/WebsiteComponents/listingforms/ItemDetail";
import UploadPhotos from "@/components/WebsiteComponents/listingforms/UploadPhotos";
import PriceAndPayment from "@/components/WebsiteComponents/listingforms/PriceAndPayment";
import { categoriesApi } from "@/lib/api/category";
import CategoryModal from "@/components/WebsiteComponents/listingforms/CategoryModal";
import { IoIosArrowForward } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export function toFieldName(label) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function getCategorySchema(selectedCategoryName) {
  const key = (selectedCategoryName || "").toLowerCase();
  const fields = categoryFields[key] || [];
  const shape = {};
  for (const f of fields) {
    const fieldName = toFieldName(f.field);
    if (f.required) {
      shape[fieldName] = z.string().min(1, `${f.field} is required`);
    } else {
      shape[fieldName] = z.string().optional();
    }
  }
  return z.object(shape);
}

const baseListingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional().nullable(),
  category_id: z.number({ invalid_type_error: "Category is required" }),
  description: z.string().min(1, "Description is required"),
  // condition: z.enum(["new", "used"]),
  condition: z.enum([
  "brand_new_unused",
  "like_new",
  "gently_used_excellent_condition",
  "good_condition",
  "fair_condition",
  "for_parts_or_not_working",
]),
  images: z.array(z.any()).min(1, "At least one image is required"),
  buy_now_price: z.string().optional(),
  allow_offers: z.boolean().optional(),
  start_price: z.string().optional(),
  reserve_price: z.string().optional(),
  expire_at: z.date().optional(),
  payment_method_id: z.string().optional(),
  quantity: z.number().optional(),
  parentCategoryName: z.string().optional(),
})
const steps = [
  { title: "Title & category", key: "title-category" },
  { title: "Item details", key: "item-details" },
  { title: "Photos", key: "photos" },
  { title: "Price & payment", key: "price-payment" },
];

const ListingForm = ({ initialValues, mode = "create", onSubmit }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryStack, setCategoryStack] = useState([]);
  const [currentCategories, setCurrentCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { t } = useTranslation();

  // Helper to get parent category name (for extra fields logic)
  const parentCategoryName =
    categoryStack.length > 0 ? categoryStack?.[0]?.name : null;

  // Dynamically merge schemas based on selected category
  // const fullSchema = useMemo(() => {
  //   const merged = baseListingSchema.merge(
  //     getCategorySchema(parentCategoryName)
  //   );
  //   return merged;
  // }, [parentCategoryName]);
  //   const fullSchema = useMemo(() => {
  //   const categorySchema = getCategorySchema(parentCategoryName);

  //   return baseListingSchema
  //     .merge(categorySchema)
  //     .refine(
  //       (data) => {
  //         if (!data.start_price) {
  //           return !!data.buy_now_price;
  //         }
  //         return true;
  //       },
  //       {
  //         message: "Buy now price is required if start price is not provided",
  //         path: ["buy_now_price"],
  //       }
  //     );
  // }, [parentCategoryName]);

  const fullSchema = useMemo(() => {
    const categorySchema = getCategorySchema(parentCategoryName);

    return baseListingSchema
      .merge(categorySchema)
      .refine(
        (data) => {
          if (!data.buy_now_price) {
            return !!data.start_price && !!data.reserve_price;
          }
          return true;
        },
        {
          message:
            "Start price and Reserve price are required if Buy now price is not provided",
          path: ["start_price"],
        }
      )
      .refine(
        (data) => {
          // Start Price cannot be greater than Buy Now Price
          if (
            data.buy_now_price &&
            data.buy_now_price.trim() !== "" &&
            data.start_price &&
            data.start_price.trim() !== ""
          ) {
            const buyNow = parseFloat(data.buy_now_price);
            const start = parseFloat(data.start_price);
            if (!isNaN(buyNow) && !isNaN(start) && start > buyNow) {
              return false;
            }
          }
          return true;
        },
        {
          message: "Start Price cannot be greater than Buy Now Price",
          path: ["start_price"],
        }
      )
      .refine(
        (data) => {
          // Reserve Price cannot be greater than Buy Now Price
          if (
            data.buy_now_price &&
            data.buy_now_price.trim() !== "" &&
            data.reserve_price &&
            data.reserve_price.trim() !== ""
          ) {
            const buyNow = parseFloat(data.buy_now_price);
            const reserve = parseFloat(data.reserve_price);
            if (!isNaN(buyNow) && !isNaN(reserve) && reserve > buyNow) {
              return false;
            }
          }
          return true;
        },
        {
          message: "Reserve Price cannot be greater than Buy Now Price",
          path: ["reserve_price"],
        }
      );
  }, [parentCategoryName]);

  const normalizedInitialValues = useMemo(() => {
    if (!initialValues) return {};
    const copy = { ...initialValues };
    if (copy.expire_at && typeof copy.expire_at === "string") {
      const date = new Date(copy.expire_at);
      copy.expire_at = isNaN(date.getTime()) ? null : date;
    }
    return copy;
  }, [initialValues]);

  const methods = useForm({
    resolver: zodResolver(fullSchema),
    defaultValues: normalizedInitialValues || {},
    mode: "onTouched",

  });
  const { handleSubmit, setValue, watch, reset } = methods;

  // console.log('initialValues', initialValues);

  useEffect(() => {
    if (initialValues) {
      const copy = { ...initialValues };
      if (copy.expire_at && typeof copy.expire_at === "string") {
        const date = new Date(copy.expire_at);
        copy.expire_at = isNaN(date.getTime()) ? null : date;
      }
      reset(copy);
    }
  }, [initialValues, reset]);

  useEffect(() => {
    async function initCategoryForEdit() {
      if (
        mode === "edit" &&
        initialValues &&
        initialValues.category_id &&
        !selectedCategory
      ) {
        const res = await categoriesApi.getAllCategories(
          initialValues.category.parent_id
        );
        const allCategories = res.data || res;
        const found = allCategories.find(
          (cat) => cat.id == initialValues.category.id
        );
        if (found) {
          setSelectedCategory(found);
          setCategoryStack([found?.parent, found]);
        }
      }
    }
    initCategoryForEdit();

      if (mode === "edit") {
      // Wait a tick to ensure reset is applied before marking touched
      setTimeout(() => {
        const allFields = Object.keys(methods.getValues());
        allFields.forEach((field) => {
          methods.setValue(field, methods.getValues(field), {
            shouldTouch: true,
          });
        });
      }, 0);
    }
    // eslint-disable-next-line
  }, [mode, initialValues, selectedCategory]);

  useEffect(() => {
    if (isModalOpen) {
      setLoadingCategories(true);
      categoriesApi
        .getAllCategories()
        .then((cats) => {
          setCurrentCategories(cats.data || cats); // fallback for array
          setCategoryStack([]);
        })
        .finally(() => setLoadingCategories(false));
    }
  }, [isModalOpen]);

  // Add these handlers if not already present
  const handleCategoryClick = async (cat) => {
    setLoadingCategories(true);
    try {
      const result = await categoriesApi.getAllCategories(cat.id);
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
    const result = await categoriesApi.getAllCategories(parentId);
    setCurrentCategories(result.data || result);
    setCategoryStack(newStack);
    setLoadingCategories(false);
  };

  // Map step index to field names for validation
  const getStepFields = (activeStep, parentCategoryName) => {
    if (activeStep === 0) return ["title", "subtitle", "category_id"];
    if (activeStep === 1) {
      // Item details: description, condition, plus dynamic fields
      const categoryKey = (parentCategoryName || "").toLowerCase();
      const extraFields = (categoryFields[categoryKey] || []).map((f) =>
        toFieldName(f.field)
      );
      return ["description", "condition", ...extraFields];
    }
    if (activeStep === 2) return ["images"];
    if (activeStep === 3)
      return [
        "buy_now_price",
        "allow_offers",
        "start_price",
        "reserve_price",
        "expire_at",
        "quantity",
      ];
    return [];
  };

  // Stepper navigation
  // const handleNext = async () => {
  //   const fields = getStepFields(activeStep, parentCategoryName);
  //   const valid = await methods.trigger(fields);
  //   if (valid) setActiveStep((prev) => prev + 1);
  // };
  const handleNext = async () => {
  const fields = getStepFields(activeStep, parentCategoryName);
  console.log("Checking fields:", fields);
  const valid = await methods.trigger(fields);
  console.log("Validation result:", valid, methods.formState.errors);

  if (valid) {
    setActiveStep((prev) => prev + 1);
  } else {
    console.warn("Validation failed for step:", activeStep);
  }
};


  const categoryFieldNames = useMemo(() => {
    // Always use toFieldName for consistency
    return Object.values(categoryFields)
      .flat()
      .map((f) => toFieldName(f.field));
  }, []);

  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Form submit
  const internalSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.subtitle) formData.append("subtitle", data.subtitle);
      formData.append("category_id", data.category_id);
      formData.append("description", data.description);
      formData.append("condition", data.condition);
      formData.append("buy_now_price", data.buy_now_price);
      formData.append("allow_offers", data.allow_offers ? "1" : "0");
      formData.append("start_price", data.start_price);
      formData.append("reserve_price", data.reserve_price);
      formData.append(
        "expire_at",
        data.expire_at ? new Date(data.expire_at).toISOString() : ""
      );
      formData.append("payment_method_id", data.payment_method_id || 1);
      formData.append("quantity", data.quantity || 1);
      formData.append("pickup_option", 1);
      formData.append("listing_type", "marketplace");
      // Append dynamic category fields if present
      categoryFieldNames.forEach((fieldName) => {
        if (data[fieldName] !== undefined && data[fieldName] !== "") {
          formData.append(fieldName, data[fieldName]);
        }
      });
      // images (array of File)
      if (data.images && Array.isArray(data.images)) {
        data.images.forEach((file, idx) => {
          if (file instanceof File) {
            formData.append(`images[${idx}]`, file);
          }
          // Do NOT append images that are objects with image_path or id
        });
      }

      // if (methods && methods.formState && methods.formState.errors) {
      //   console.log("Validation Errors:", methods.formState.errors);
      // }

      await onSubmit(formData);
      const logFormData = (formData) => {
        for (let [key, value] of formData.entries()) {
          console.log("valuesssss", `${key}:`, value);
        }
      };
      console.log("formdtaaa", logFormData(formData));



      // TODO: Show success toast, redirect, or reset form as needed
    } catch (error) {
      console.error("Error submitting listing:", error);
      
      // Handle API validation errors
      const validationErrors = error?.data?.data || error?.response?.data?.data;
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
          "Failed to create listing. Please try again.";
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <StepTitleCategory
            setIsModalOpen={setIsModalOpen}
            selectedCategory={selectedCategory}
            watch={watch}
          />
        );
      case 1:
        return <ItemDetail parentCategoryName={parentCategoryName} />;
      case 2:
        return <UploadPhotos />;
      case 3:
        return <PriceAndPayment />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <form>
        <div className="w-full mx-auto md:px-6 py-10">
          {/* Stepper UI */}
          <div className="w-full overflow-x-auto scrollbar-hide mb-6 border-b border-gray-200">
            <div className="flex min-w-max gap-6 sm:gap-10 px-4 sm:px-0 text-sm sm:text-lg">
              {steps.map((step, index) => (
                <button
                  key={step.key}
                  type="button"
                  disabled={index > activeStep}
                  onClick={() => index <= activeStep && setActiveStep(index)}
                  className={`relative pb-2 transition-all duration-200 whitespace-nowrap 
          ${index === activeStep ? "text-black font-semibold" : "text-gray-400"}
        `}
                >
                  {t(step.title)}

                  {/* Underline indicator */}
                  <span
                    className={`absolute left-0 bottom-0 h-[2px] w-full rounded bg-black transition-all duration-300 
            ${index === activeStep ? "opacity-100" : "opacity-0"}
          `}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Step Content */}
          {renderStep()}
        </div>
      </form>
      <div className="w-full mx-auto px-6 ">
        <div className="flex justify-between">
          {activeStep > 0 && (
            <Button title={t("Back")} type="button" onClick={handleBack} />
          )}
          {activeStep < steps.length - 1 ? (
            <Button title={t("Next")} type="button" onClick={handleNext} />
          ) : (
            <Button
              title={
                isSubmitting ? (
                  <div className="flex items-center gap-2">
                    {/* Spinning circle loader */}
                    <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    {t(mode === "edit" ? "Updating..." : "Creating...")}
                  </div>
                ) : (
                  t(mode === "edit" ? "Update Listing" : "Create Listing")
                )
              }
              onClick={handleSubmit(internalSubmit)}
              disabled={isSubmitting}
            />
          )}
        </div>
      </div>
      {isModalOpen && <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryStack={categoryStack}
        handleBackCategory={handleBackCategory}
        currentCategories={currentCategories}
        handleCategoryClick={handleCategoryClick}
        loadingCategories={loadingCategories}
      />}
    </FormProvider>
  );
};

export default ListingForm;
