"use client";
import React, { useState, useEffect, useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IoIosAdd, IoIosTrash } from "react-icons/io";

// Predefined attribute templates with common attributes for various categories
export const attributeTemplates = [
  // Common attributes
  { key: "brand", type: "text", label: "Brand", placeholder: "e.g., Apple, Samsung, Nike" },
  { key: "model", type: "text", label: "Model", placeholder: "e.g., iPhone 14, Galaxy S23" },
  { key: "color", type: "text", label: "Color", placeholder: "e.g., Black, White, Red" },
  { key: "size", type: "text", label: "Size", placeholder: "e.g., Large, 42, 10x10" },
  { key: "weight", type: "text", label: "Weight", placeholder: "e.g., 1.5 kg, 3 lbs" },
  { key: "material", type: "text", label: "Material", placeholder: "e.g., Cotton, Leather, Metal" },
  
  // Electronics & Computers
  { key: "memory", type: "text", label: "Memory/RAM", placeholder: "e.g., 8GB, 16GB, 32GB" },
  { key: "storage", type: "text", label: "Storage", placeholder: "e.g., 128GB, 256GB, 1TB" },
  { key: "hard_drive_size", type: "text", label: "Hard Drive Size", placeholder: "e.g., 500GB, 1TB, 2TB" },
  { key: "processor", type: "text", label: "Processor", placeholder: "e.g., Intel i7, AMD Ryzen 5" },
  { key: "cores", type: "text", label: "Cores", placeholder: "e.g., 4, 6, 8, 12" },
  { key: "screen_size", type: "text", label: "Screen Size", placeholder: "e.g., 15.6 inch, 27 inch" },
  { key: "resolution", type: "text", label: "Resolution", placeholder: "e.g., 1920x1080, 4K" },
  { key: "battery_capacity", type: "text", label: "Battery Capacity", placeholder: "e.g., 4000mAh, 5000mAh" },
  { key: "operating_system", type: "text", label: "Operating System", placeholder: "e.g., Windows 11, macOS, Android" },
  
  // Mobile Phones
  { key: "network_type", type: "text", label: "Network Type", placeholder: "e.g., 4G, 5G, Dual SIM" },
  { key: "camera", type: "text", label: "Camera", placeholder: "e.g., 12MP, 48MP Triple Camera" },
  { key: "battery_life", type: "text", label: "Battery Life", placeholder: "e.g., Up to 24 hours" },
  
  // Clothing & Fashion
  { key: "size_clothing", type: "text", label: "Size", placeholder: "e.g., S, M, L, XL, XXL" },
  { key: "gender", type: "select", label: "Gender", options: ["Male", "Female", "Unisex", "Kids"] },
  { key: "season", type: "select", label: "Season", options: ["Spring", "Summer", "Fall", "Winter", "All Season"] },
  
  // Vehicles
  { key: "year", type: "text", label: "Year", placeholder: "e.g., 2020, 2023" },
  { key: "mileage", type: "text", label: "Mileage", placeholder: "e.g., 50000 km, 30000 miles" },
  { key: "fuel_type", type: "select", label: "Fuel Type", options: ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"] },
  { key: "transmission", type: "select", label: "Transmission", options: ["Manual", "Automatic", "CVT"] },
  
  // Furniture
  { key: "dimensions", type: "text", label: "Dimensions", placeholder: "e.g., 200cm x 150cm x 80cm" },
  { key: "condition_detail", type: "textarea", label: "Condition Details", placeholder: "Describe any wear or defects" },
  
  // General
  { key: "warranty", type: "text", label: "Warranty", placeholder: "e.g., 1 year, 6 months, None" },
  { key: "accessories", type: "textarea", label: "Accessories Included", placeholder: "List any accessories or items included" },
  { key: "location", type: "text", label: "Location", placeholder: "Item location if different from profile" },
];

function toDisplayName(key) {
  return key
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function DynamicAttributes() {
  const { control, watch, setValue, formState: { errors } } = useFormContext();
  const { t } = useTranslation();
  
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "attributes",
  });

  const attributes = watch("attributes") || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [showTemplateDropdown, setShowTemplateDropdown] = useState({});
  const dropdownRefs = useRef({});

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      Object.keys(showTemplateDropdown).forEach((index) => {
        if (showTemplateDropdown[index] && dropdownRefs.current[index]) {
          if (!dropdownRefs.current[index].contains(event.target)) {
            setShowTemplateDropdown((prev) => ({ ...prev, [index]: false }));
            setSearchTerm("");
          }
        }
      });
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTemplateDropdown]);

  // Filter templates based on search
  const filteredTemplates = attributeTemplates.filter(
    (template) =>
      template.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAttribute = () => {
    append({ key: "", value: "", type: "text" });
  };

  const handleTemplateSelect = (index, template) => {
    update(index, {
      key: template.key,
      value: "",
      type: template.type,
      options: template.options,
      placeholder: template.placeholder,
    });
    setShowTemplateDropdown({ ...showTemplateDropdown, [index]: false });
    setSearchTerm("");
  };

  const renderValueInput = (attribute, index) => {
    const { register } = control;
    const fieldName = `attributes.${index}.value`;
    const error = errors?.attributes?.[index]?.value;

    if (attribute.type === "select" && attribute.options) {
      return (
        <select
          {...register(fieldName)}
          className={`w-full border rounded px-4 py-2 focus:outline-none ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:border-green-400 focus:ring"
          }`}
        >
          <option value="">{t("Select")} {attribute.label || toDisplayName(attribute.key)}</option>
          {attribute.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    if (attribute.type === "textarea") {
      return (
        <textarea
          {...register(fieldName)}
          placeholder={attribute.placeholder || `Enter ${attribute.label || toDisplayName(attribute.key)}`}
          rows={3}
          className={`w-full border rounded px-4 py-2 focus:outline-none resize-none ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:border-green-400 focus:ring"
          }`}
        />
      );
    }

    // Default text input
    return (
      <input
        type="text"
        {...register(fieldName)}
        placeholder={attribute.placeholder || `Enter ${attribute.label || toDisplayName(attribute.key)}`}
        className={`w-full border rounded px-4 py-2 focus:outline-none ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-400"
            : "border-gray-300 focus:border-green-400 focus:ring"
        }`}
      />
    );
  };

  return (
    <div className="w-full mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Additional Attributes")}
          </label>
          <p className="text-xs text-gray-500">
            {t("Add specific details about your item (e.g., brand, size, color, specifications)")}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddAttribute}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
        >
          <IoIosAdd className="w-5 h-5" />
          {t("Add Attribute")}
        </button>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 text-sm mb-2">
            {t("No attributes added yet")}
          </p>
          <p className="text-gray-400 text-xs">
            {t("Click 'Add Attribute' to start adding item details")}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => {
          const attribute = attributes[index] || {};
          const isTemplateVisible = showTemplateDropdown[index];
          const hasTemplate = attributeTemplates.find((t) => t.key === attribute.key);

          return (
            <div
              key={field.id}
              className="border border-gray-300 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex items-start gap-4">
                {/* Key Input Section */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("Attribute Name")}
                  </label>
                  <div className="relative" ref={(el) => (dropdownRefs.current[index] = el)}>
                    <input
                      type="text"
                      {...control.register(`attributes.${index}.key`)}
                      placeholder={t("Select or type attribute name")}
                      onFocus={() => setShowTemplateDropdown({ ...showTemplateDropdown, [index]: true })}
                      onChange={(e) => {
                        const matchingTemplate = attributeTemplates.find(
                          (t) => t.key.toLowerCase() === e.target.value.toLowerCase()
                        );
                        if (matchingTemplate) {
                          handleTemplateSelect(index, matchingTemplate);
                        }
                      }}
                      className={`w-full border rounded px-4 py-2 focus:outline-none ${
                        errors?.attributes?.[index]?.key
                          ? "border-red-500 focus:border-red-500 focus:ring-red-400"
                          : "border-gray-300 focus:border-green-400 focus:ring"
                      }`}
                    />
                    
                    {/* Template Dropdown */}
                    {isTemplateVisible && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        <div className="sticky top-0 p-2 border-b border-gray-200 bg-gray-50">
                          <input
                            type="text"
                            placeholder={t("Search attributes...")}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="p-1">
                          {filteredTemplates.length > 0 ? (
                            filteredTemplates.map((template) => (
                              <button
                                key={template.key}
                                type="button"
                                onClick={() => handleTemplateSelect(index, template)}
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm transition-colors"
                              >
                                <div className="font-medium text-gray-900">{template.label}</div>
                                <div className="text-xs text-gray-500">{template.key}</div>
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              {t("No matching attributes found")}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {hasTemplate && (
                    <p className="text-xs text-gray-500 mt-1">
                      {t("Template selected")}: {hasTemplate.label}
                    </p>
                  )}
                </div>

                {/* Value Input Section */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("Value")}
                  </label>
                  {renderValueInput(attribute, index)}
                  {errors?.attributes?.[index]?.value && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.attributes[index].value.message}
                    </p>
                  )}
                </div>

                {/* Remove Button */}
                <div className="pt-7">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    title={t("Remove attribute")}
                  >
                    <IoIosTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {fields.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>{t("Tip")}:</strong> {t("Add relevant attributes to help buyers find your item. Common attributes include brand, model, size, color, and specifications specific to your item category.")}
          </p>
        </div>
      )}
    </div>
  );
}

export default DynamicAttributes;

