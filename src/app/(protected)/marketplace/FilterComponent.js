"use client";
import React, { useEffect, useMemo, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiChevronDown } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { listingsApi } from "@/lib/api/listings";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLocationStore } from "@/lib/stores/locationStore";
import { useSearchParams } from "next/navigation";
import Select from "react-select";

const FilterComponent = ({ categoryId, onResults }) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const [newUsed, setNewUsed] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openTab, setOpenTab] = useState(null);
  const { t } = useTranslation();

  // Location Store
  const {
    cities,
    areas,
    getAllLocations,
    selectedRegion,
    selectedCity,
    selectedArea,
    setSelectedRegion,
    setSelectedCity,
    setSelectedArea,
    fetchCities,
    fetchAreas,
  } = useLocationStore();

  useEffect(() => {
    getAllLocations();
  }, [getAllLocations]);

  // const country = locations.find((c) => c.id == 1);
  const regions = locations; // Assuming locations are regions based on store structure or locations[0].regions
  // If locations is countries, we need to find Saudi Arabia. 
  // Based on your store, locations might be regions directly or countries. 
  // Let's assume the store handles it or locations = regions. 
  // Actually in store: setLocations matches API response.
  // We'll stick to existing pattern but use 'locations' as regions list source if it was working.
  // The previous code: const country = locations.find((c) => c.id == 1); const regions = country?.regions || [];
  // I will keep using 'locations' to find country 1 if that's how it is.

  const country = locations.find((c) => c.id == 1);
  const regionsList = country?.regions || [];

  const conditions = [
    { key: "brand_new_unused", label: "Brand New / Unused", fullLabel: "Brand New / Unused – never opened or used." },
    { key: "like_new", label: "Like New", fullLabel: "Like New – opened but looks and works like new." },
    { key: "gently_used_excellent_condition", label: "Gently Used / Excellent Condition", fullLabel: "Gently Used / Excellent Condition – minor signs of use." },
    { key: "good_condition", label: "Good Condition", fullLabel: "Good Condition – visible wear but fully functional." },
    { key: "fair_condition", label: "Fair Condition", fullLabel: "Fair Condition – heavily used but still works." },
    { key: "for_parts_or_not_working", label: "For Parts or Not Working", fullLabel: "For Parts or Not Working – damaged or needs repair." },
    {
      key: "not_applicable",
      label: "Not Applicable – condition does not apply to this item.",
    },
  ];

  // Price range options
  const priceRanges = [
    { value: "0-100", label: "0 - 100", min: 0, max: 100 },
    { value: "100-500", label: "100 - 500", min: 100, max: 500 },
    { value: "500-1000", label: "500 - 1,000", min: 500, max: 1000 },
    { value: "1000-5000", label: "1,000 - 5,000", min: 1000, max: 5000 },
    { value: "5000-10000", label: "5,000 - 10,000", min: 5000, max: 10000 },
    { value: "10000-50000", label: "10,000 - 50,000", min: 10000, max: 50000 },
    { value: "50000-", label: "50,000+", min: 50000, max: null },
  ];

  const handleFilter = async (params, fromClear) => {
    try {
      const response = await listingsApi.getListingsByFilter(params);
      if (onResults) onResults(response.data || response);
      if (!fromClear) {
        toast.success("Listings filtered successfully!");
      }
    } catch {
      toast.error("Failed to filter listings.");
    }
  };

  const clearFilters = async () => {
    setNewUsed("");
    setPriceFrom("");
    setPriceTo("");
    setSelectedPriceRange(null);
    setSelectedRegion(null);
    setSelectedCity(null);
    setSelectedArea(null);
    setOpenTab(null);

    const params = { category_id: categoryId, ...(search ? { search } : {}) };
    await handleFilter(params, true);
  };


  const removeFilter = async (type) => {
    let updatedFilters = {
      category_id: categoryId,
      ...(newUsed ? { condition: newUsed } : {}),
      ...(selectedRegion ? { region_id: selectedRegion.id } : {}),
      ...(selectedCity ? { city_id: selectedCity.id } : {}),
      ...(selectedArea ? { area_id: selectedArea.id } : {}),
      ...(priceFrom ? { min_price: priceFrom } : {}),
      ...(priceTo ? { max_price: priceTo } : {}),
      ...(search ? { search } : {}),
    };

    if (type === "condition") {
      setNewUsed("");
      delete updatedFilters.condition;
    }
    if (type === "region") {
      setSelectedRegion(null);
      setSelectedCity(null);
      setSelectedArea(null);
      delete updatedFilters.region_id;
      delete updatedFilters.city_id;
      delete updatedFilters.area_id;
    }
    if (type === "city") {
      setSelectedCity(null);
      setSelectedArea(null);
      delete updatedFilters.city_id;
      delete updatedFilters.area_id;
    }
    if (type === "area") {
      setSelectedArea(null);
      delete updatedFilters.area_id;
    }
    if (type === "price") {
      setPriceFrom("");
      setPriceTo("");
      setSelectedPriceRange(null);
      delete updatedFilters.min_price;
      delete updatedFilters.max_price;
    }

    await handleFilter(updatedFilters);
  };


  return (
    <div className="w-full bg-white px-4">
      <style dangerouslySetInnerHTML={{
        __html: `
          .filter-select .react-select__menu-list {
            scrollbar-width: thin;
            scrollbar-color: #888 #f1f1f1;
          }
          .filter-select .react-select__menu-list::-webkit-scrollbar {
            width: 8px;
          }
          .filter-select .react-select__menu-list::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          .filter-select .react-select__menu-list::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
          }
          .filter-select .react-select__menu-list::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `
      }} />
      {/* Header with Active Filters & Clear All */}


      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap items-center">
        {/* Condition Select */}
        <div className="min-w-[200px]">
          <Select
            name="condition"
            value={
              newUsed
                ? {
                  value: newUsed,
                  label: conditions.find((item) => item.key === newUsed)?.label || t("Condition"),
                }
                : null
            }
            onChange={(selected) => {
              if (selected) {
                setNewUsed(selected.value);
              } else {
                setNewUsed("");
              }
            }}
            options={conditions.map((item) => ({
              value: item.key,
              label: item.label,
              fullLabel: item.fullLabel,
            }))}
            placeholder={t("Condition")}
            className="text-sm filter-select"
            classNamePrefix="react-select"
            isClearable
            formatOptionLabel={({ label, fullLabel }) => (
              <div>
                <div className="font-medium">{label}</div>
                {fullLabel && (
                  <div className="text-xs text-gray-500 mt-0.5">{fullLabel.split("–")[1]?.trim()}</div>
                )}
              </div>
            )}
            styles={{
              control: (provided) => ({
                ...provided,
                minHeight: '36px',
                fontSize: '14px',
                borderColor: newUsed ? '#10b981' : provided.borderColor,
              }),
              menu: (provided) => ({
                ...provided,
                maxHeight: 250,
                overflowY: 'auto',
                zIndex: 9999,
              }),
              menuList: (provided) => ({
                ...provided,
                maxHeight: 250,
                overflowY: 'auto',
                padding: '4px',
              }),
              option: (provided, state) => ({
                ...provided,
                padding: '10px 12px',
                backgroundColor: state.isSelected
                  ? '#10b981'
                  : state.isFocused
                    ? '#f0fdf4'
                    : 'white',
                color: state.isSelected ? 'white' : '#374151',
                '&:hover': {
                  backgroundColor: state.isSelected ? '#10b981' : '#f0fdf4',
                },
              }),
            }}
          />
        </div>

        {/* Region Select */}
        <div className="min-w-[150px]">
          <Select
            name="region"
            value={
              selectedRegion
                ? { value: selectedRegion.name, label: selectedRegion.name }
                : null
            }
            onChange={(selected) => {
              if (selected) {
                const region = regionsList.find((r) => r.name === selected.value);
                setSelectedRegion(region ? { id: region.id, name: region.name } : null);
                if (region) fetchCities(region.id);
                setSelectedCity(null);
                setSelectedArea(null);
              } else {
                setSelectedRegion(null);
                setSelectedCity(null);
                setSelectedArea(null);
              }
            }}
            options={regionsList.map((r) => ({ value: r.name, label: r.name }))}
            placeholder={t("Region")}
            className="text-sm filter-select"
            classNamePrefix="react-select"
            isClearable
            // ... styles (kept generic or need to copy large block? defaulting to standard props for brevity if styles match above)
            // Reusing existing styles prop would be better but it's defined below. 
            // I'll copy the styles prop from the original code block to be safe.
            styles={{
              control: (provided) => ({
                ...provided,
                minHeight: '36px',
                fontSize: '14px',
                borderColor: selectedRegion ? '#10b981' : provided.borderColor,
              }),
              menu: (provided) => ({
                ...provided,
                maxHeight: 200,
                overflowY: 'auto',
                zIndex: 9999,
              }),
              menuList: (provided) => ({
                ...provided,
                maxHeight: 200,
                overflowY: 'auto',
                padding: '4px',
              }),
              option: (provided, state) => ({
                ...provided,
                padding: '8px 12px',
                backgroundColor: state.isSelected
                  ? '#10b981'
                  : state.isFocused
                    ? '#f0fdf4'
                    : 'white',
                color: state.isSelected ? 'white' : '#374151',
                '&:hover': {
                  backgroundColor: state.isSelected ? '#10b981' : '#f0fdf4',
                },
              }),
            }}
          />
        </div>

        {/* City Select */}
        <div className="min-w-[150px]">
          <Select
            name="city"
            value={
              selectedCity
                ? { value: selectedCity.name, label: selectedCity.name }
                : null
            }
            onInputChange={(inputValue) => {
              if (selectedRegion) fetchCities(selectedRegion.id, inputValue);
            }}
            onChange={(selected) => {
              if (selected) {
                const city = cities.find((c) => c.name === selected.value);
                setSelectedCity(city ? { id: city.id, name: city.name } : null);
                if (city) fetchAreas(city.id);
                setSelectedArea(null);
              } else {
                setSelectedCity(null);
                setSelectedArea(null);
              }
            }}
            options={cities.map((g) => ({ value: g.name, label: g.name }))}
            placeholder={t("City")}
            className="text-sm filter-select"
            classNamePrefix="react-select"
            isClearable
            isDisabled={!selectedRegion}
            styles={{
              control: (provided, state) => ({
                ...provided,
                minHeight: '36px',
                fontSize: '14px',
                borderColor: selectedCity ? '#10b981' : provided.borderColor,
                backgroundColor: state.isDisabled ? '#f3f4f6' : provided.backgroundColor,
              }),
              menu: (provided) => ({
                ...provided,
                maxHeight: 200,
                overflowY: 'auto',
                zIndex: 9999,
              }),
              menuList: (provided) => ({
                ...provided,
                maxHeight: 200,
                overflowY: 'auto',
                padding: '4px',
              }),
              option: (provided, state) => ({
                ...provided,
                padding: '8px 12px',
                backgroundColor: state.isSelected
                  ? '#10b981'
                  : state.isFocused
                    ? '#f0fdf4'
                    : 'white',
                color: state.isSelected ? 'white' : '#374151',
                '&:hover': {
                  backgroundColor: state.isSelected ? '#10b981' : '#f0fdf4',
                },
              }),
            }}
          />
        </div>

        {/* Area Select */}
        <div className="min-w-[150px]">
          <Select
            name="area"
            value={
              selectedArea
                ? { value: selectedArea.name, label: selectedArea.name }
                : null
            }
            onInputChange={(inputValue) => {
              if (selectedCity) fetchAreas(selectedCity.id, inputValue);
            }}
            onChange={(selected) => {
              if (selected) {
                const area = areas.find((a) => a.name === selected.value);
                setSelectedArea(area ? { id: area.id, name: area.name } : null);
              } else {
                setSelectedArea(null);
              }
            }}
            options={areas.map((g) => ({ value: g.name, label: g.name }))}
            placeholder={t("Area")}
            className="text-sm filter-select"
            classNamePrefix="react-select"
            isClearable
            isDisabled={!selectedCity}
            styles={{
              control: (provided, state) => ({
                ...provided,
                minHeight: '36px',
                fontSize: '14px',
                borderColor: selectedArea ? '#10b981' : provided.borderColor,
                backgroundColor: state.isDisabled ? '#f3f4f6' : provided.backgroundColor,
              }),
              menu: (provided) => ({
                ...provided,
                maxHeight: 200,
                overflowY: 'auto',
                zIndex: 9999,
              }),
              menuList: (provided) => ({
                ...provided,
                maxHeight: 200,
                overflowY: 'auto',
                padding: '4px',
              }),
              option: (provided, state) => ({
                ...provided,
                padding: '8px 12px',
                backgroundColor: state.isSelected
                  ? '#10b981'
                  : state.isFocused
                    ? '#f0fdf4'
                    : 'white',
                color: state.isSelected ? 'white' : '#374151',
                '&:hover': {
                  backgroundColor: state.isSelected ? '#10b981' : '#f0fdf4',
                },
              }),
            }}
          />
        </div>

        {/* Price Range Select */}
        <div className="min-w-[180px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <span className="text-gray-500 price">$</span>
            </div>
            <Select
              name="price"
              value={selectedPriceRange}
              onChange={(selected) => {
                if (selected) {
                  setSelectedPriceRange(selected);
                  setPriceFrom(selected.min.toString());
                  setPriceTo(selected.max ? selected.max.toString() : "");
                } else {
                  setSelectedPriceRange(null);
                  setPriceFrom("");
                  setPriceTo("");
                }
              }}
              options={priceRanges.map((range) => ({
                value: range.value,
                label: range.label, // Label already updated in separate chunk
                min: range.min,
                max: range.max,
              }))}
              placeholder={t("Price")}
              className="text-sm filter-select"
              classNamePrefix="react-select"
              isClearable
              styles={{
                control: (provided) => ({
                  ...provided,
                  minHeight: '36px',
                  fontSize: '14px',
                  borderColor: selectedPriceRange ? '#10b981' : provided.borderColor,
                  paddingLeft: "28px",
                }),
                menu: (provided) => ({
                  ...provided,
                  maxHeight: 200,
                  overflowY: 'auto',
                  zIndex: 9999,
                }),
                menuList: (provided) => ({
                  ...provided,
                  maxHeight: 200,
                  overflowY: 'auto',
                  padding: '4px',
                }),
                option: (provided, state) => ({
                  ...provided,
                  padding: '8px 12px',
                  backgroundColor: state.isSelected
                    ? '#10b981'
                    : state.isFocused
                      ? '#f0fdf4'
                      : 'white',
                  color: state.isSelected ? 'white' : '#374151',
                  '&:hover': {
                    backgroundColor: state.isSelected ? '#10b981' : '#f0fdf4',
                  },
                }),
              }}
            />
          </div>
        </div>

        {/* Show Results */}
        <button
          type="button"
          onClick={async () => {
            setLoading(true);
            const params = {
              category_id: categoryId,
              ...(newUsed ? { condition: newUsed } : {}),
              ...(selectedRegion ? { region_id: selectedRegion.id } : {}),
              ...(selectedCity ? { city_id: selectedCity.id } : {}),
              ...(selectedArea ? { area_id: selectedArea.id } : {}),
              ...(priceFrom ? { min_price: priceFrom } : {}),
              ...(priceTo ? { max_price: priceTo } : {}),
              ...(search ? { search } : {}),
            };
            await handleFilter(params);
            setLoading(false);
          }}
          disabled={
            loading ||
            (!newUsed && !selectedRegion && !selectedCity && !selectedArea && !priceFrom && !priceTo)
          }
          className="px-4 py-1.5 rounded-full bg-green-600 text-white text-sm font-semibold shadow-sm hover:bg-green-700 disabled:opacity-50 transition"
        >
          {loading ? t("Loading...") : t("Show Results")}
        </button>
        {/* Clear All */}
        {(newUsed || selectedRegion || selectedCity || selectedArea || priceFrom || priceTo) && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm text-gray-500 border border-red-400 hover:text-red-500 min-w-20"
          >
            <RiDeleteBin6Line size={18} />
            {t("Clear All")}
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterComponent;
