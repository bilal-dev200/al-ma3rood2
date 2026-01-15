"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { listingsApi } from "@/lib/api/listings";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLocationStore } from "@/lib/stores/locationStore";
import { useRouter, useSearchParams } from "next/navigation";
import Select, { components } from "react-select";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * FilterPill Component
 * Renders a button that toggles a dropdown/popover.
 */
const FilterPill = ({ label, isActive, isOpen, onClick, children, className = "" }) => {
    return (
        <div className={`relative ${className}`}>
            <button
                type="button"
                onClick={onClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors
          ${isActive
                        ? "border-green-700 bg-green-50 text-green-800"
                        : "border-green-500 bg-white text-gray-700 hover:border-green-600"
                    }
        `}
            >
                {label}
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 min-w-[280px] p-4 animate-in fade-in zoom-in-95 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
};

const SearchPageFilters = ({ categoryId, categories = [], onResults }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useTranslation();

    // -- State from URL --
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category_id") || categoryId || "");
    const [newUsed, setNewUsed] = useState(searchParams.get("condition") || "");
    const [priceFrom, setPriceFrom] = useState(searchParams.get("min_price") || "");
    const [priceTo, setPriceTo] = useState(searchParams.get("max_price") || "");

    // -- Internal Popover Logic (Open/Close) --
    const [openFilter, setOpenFilter] = useState(""); // "category", "location", "condition", "price"
    const containerRef = useRef(null);

    // -- Location Store --
    const {
        locations,
        getAllLocations,
        // formattedLocations, // If needed?
        cities,
        areas,
        fetchCities,
        fetchAreas,
        selectedRegion,
        selectedCity,
        selectedArea,
        setSelectedRegion,
        setSelectedCity,
        setSelectedArea,
    } = useLocationStore();

    useEffect(() => {
        getAllLocations();
    }, [getAllLocations]);

    // Close popovers on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpenFilter("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Sync state with URL
    useEffect(() => {
        setSelectedCategory(searchParams.get("category_id") || categoryId || "");
        setNewUsed(searchParams.get("condition") || "");
        setPriceFrom(searchParams.get("min_price") || "");
        setPriceTo(searchParams.get("max_price") || "");

        // Find region/gov if IDs are present (handled by store usually, but ensuring sync here if needed)
        // Note: The store persists state, but ideally we should sync from URL parameters to store if deep linking.
        // For brevity assuming store is handled or user interactions drive it.
    }, [searchParams, categoryId]);


    // -- Options --


    const conditions = [
        { key: "brand_new_unused", label: "Brand New / Unused" },
        { key: "like_new", label: "Like New" },
        { key: "gently_used_excellent_condition", label: "Gently Used" },
        { key: "good_condition", label: "Good Condition" },
        { key: "fair_condition", label: "Fair Condition" },
        { key: "for_parts_or_not_working", label: "For Parts" },
        { key: "not_applicable", label: "Not Applicable" },
    ];

    const pricePoints = [
        0, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000
    ];

    const priceOptions = pricePoints.map(p => ({ value: p, label: p.toLocaleString() }));

    // -- Handlers --
    const toggleFilter = (filterName) => {
        setOpenFilter(prev => prev === filterName ? "" : filterName);
    };

    const updateUrl = (newParams) => {
        const params = new URLSearchParams(searchParams.toString());
        // Update or remove params
        Object.keys(newParams).forEach(key => {
            if (newParams[key] !== null && newParams[key] !== undefined && newParams[key] !== "") {
                params.set(key, newParams[key]);
            } else {
                params.delete(key);
            }
        });
        params.delete("page");
        router.push(`/search?${params.toString()}`);
        setOpenFilter(""); // Close all
    };

    const handleApplyPrice = () => {
        updateUrl({
            min_price: priceFrom,
            max_price: priceTo
        });
    };

    const handleClearAll = () => {
        setNewUsed("");
        setPriceFrom("");
        setPriceTo("");
        setSelectedCategory("");
        setSelectedRegion(null);
        setSelectedCity(null);
        setSelectedArea(null);

        const params = new URLSearchParams(searchParams.toString());
        // Keep keyword
        const keyword = params.get("keyword");

        const newParams = new URLSearchParams();
        if (keyword) newParams.set("keyword", keyword);

        router.push(`/search?${newParams.toString()}`);
    };

    // -- Derived Labels for Pills --
    const categoryLabel = selectedCategory
        ? (categories.find(c => c.id == selectedCategory)?.name || "Category")
        : "Category";

    // Default label: "Category: All" or "Category: [Name]"
    const categoryButtonLabel = selectedCategory
        ? `Category: ${categories.find(c => c.id == selectedCategory)?.name || "Selected"}`
        : "Category: All categories";

    const conditionLabel = newUsed
        ? `Condition: ${conditions.find(c => c.key === newUsed)?.label || "Selected"}`
        : "New & Used";

    const locationLabel = selectedRegion
        ? `Location: ${selectedRegion.name}`
        : "All Locations";

    const priceLabel = (priceFrom || priceTo) ? (
        <span className="flex items-center">
            Price:&nbsp;
            {priceFrom ? <><span className="text-gray-500 price">$</span>{priceFrom}</> : "0"}
            &nbsp;-&nbsp;
            {priceTo ? <><span className="text-gray-500 price">$</span>{priceTo}</> : "Any"}
        </span>
    ) : "Price: Any";


    const selectStyles = {
        control: (base) => ({ ...base, minHeight: '40px', borderColor: '#e5e7eb', boxShadow: 'none', '&:hover': { borderColor: '#d1d5db' } }),
        option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#f0fdf4' : 'white', color: state.isSelected ? 'white' : '#374151', padding: '10px 12px' }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    };

    // Specific styles for price inputs to accommodate prefix
    const priceSelectStyles = {
        ...selectStyles,
        control: (base) => ({
            ...base,
            minHeight: '40px',
            borderColor: '#e5e7eb',
            boxShadow: 'none',
            '&:hover': { borderColor: '#d1d5db' },
            paddingLeft: '28px' // Space for currency symbol
        }),
    };

    const hasActiveFilters = newUsed || selectedRegion || selectedCategory || priceFrom || priceTo;

    return (
        <div className="w-full relative" ref={containerRef}>
            <div className="flex gap-3 flex-wrap items-center">

                {/* 1. Category Pill */}
                <FilterPill
                    label={categoryButtonLabel}
                    isOpen={openFilter === "category"}
                    isActive={!!selectedCategory}
                    onClick={() => toggleFilter("category")}
                >
                    <div className="w-64">
                        <h4 className="font-semibold mb-2 text-gray-700">{t("Category")}</h4>
                        <Select
                            options={categories.map(c => ({ value: c.id, label: c.name }))}
                            value={selectedCategory ? { value: selectedCategory, label: categories.find(c => c.id == selectedCategory)?.name } : null}
                            onChange={(val) => {
                                updateUrl({ category_id: val?.value });
                            }}
                            placeholder="Select Category"
                            styles={selectStyles}
                            isClearable
                            menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                        />
                    </div>
                </FilterPill>

                {/* 2. Location Pill */}
                <FilterPill
                    label={locationLabel}
                    isOpen={openFilter === "location"}
                    isActive={!!selectedRegion}
                    onClick={() => toggleFilter("location")}
                >
                    <div className="w-72 flex flex-col gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Region</label>
                            <Select
                                options={locations.map(r => ({ value: r.name, label: r.name, id: r.id }))}
                                value={selectedRegion ? { value: selectedRegion.name, label: selectedRegion.name } : null}
                                onChange={(val) => {
                                    if (val) {
                                        const r = locations.find(reg => reg.id === val.id);
                                        setSelectedRegion(r);
                                        setSelectedCity(null);
                                        setSelectedArea(null);
                                        fetchCities(r.id);
                                        updateUrl({ region_id: r?.id, city_id: null, area_id: null });
                                    } else {
                                        setSelectedRegion(null);
                                        setSelectedCity(null);
                                        setSelectedArea(null);
                                        updateUrl({ region_id: null, city_id: null, area_id: null });
                                    }
                                }}
                                placeholder="All Regions"
                                styles={selectStyles}
                                isClearable
                                menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                            />
                        </div>
                        {selectedRegion && (
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">City</label>
                                <Select
                                    options={cities.map(c => ({ value: c.name, label: c.name, id: c.id }))}
                                    value={selectedCity ? { value: selectedCity.name, label: selectedCity.name } : null}
                                    onInputChange={(inputValue) => {
                                        if (selectedRegion?.id) {
                                            fetchCities(selectedRegion.id, inputValue);
                                        }
                                    }}
                                    onChange={async (val) => {
                                        if (val) {
                                            const c = cities.find(city => city.id === val.id);
                                            setSelectedCity(c);
                                            setSelectedArea(null);
                                            updateUrl({ city_id: c?.id, area_id: null });

                                            // Auto-select area logic
                                            if (c?.id) {
                                                const fetchedAreas = await fetchAreas(c.id);
                                                if (fetchedAreas?.length === 1) {
                                                    const area = fetchedAreas[0];
                                                    setSelectedArea(area);
                                                    updateUrl({ area_id: area.id });
                                                }
                                            } else {
                                                fetchAreas(c.id);
                                            }

                                        } else {
                                            setSelectedCity(null);
                                            setSelectedArea(null);
                                            updateUrl({ city_id: null, area_id: null });
                                        }
                                    }}
                                    placeholder="Select City"
                                    styles={selectStyles}
                                    isClearable
                                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                                />
                            </div>
                        )}
                        {selectedCity && (
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Area</label>
                                <Select
                                    options={areas.map(a => ({ value: a.name, label: a.name, id: a.id }))}
                                    value={selectedArea ? { value: selectedArea.name, label: selectedArea.name } : null}
                                    onInputChange={(inputValue) => {
                                        if (selectedCity?.id) {
                                            fetchAreas(selectedCity.id, inputValue);
                                        }
                                    }}
                                    onChange={(val) => {
                                        if (val) {
                                            const a = areas.find(area => area.id === val.id);
                                            setSelectedArea(a);
                                            updateUrl({ area_id: a?.id });
                                        } else {
                                            setSelectedArea(null);
                                            updateUrl({ area_id: null });
                                        }
                                    }}
                                    placeholder="Select Area"
                                    styles={selectStyles}
                                    isClearable
                                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                                />
                            </div>
                        )}
                    </div>
                </FilterPill>

                {/* 3. Condition Pill */}
                <FilterPill
                    label={conditionLabel}
                    isOpen={openFilter === "condition"}
                    isActive={!!newUsed}
                    onClick={() => toggleFilter("condition")}
                >
                    <div className="w-64">
                        <h4 className="font-semibold mb-2 text-gray-700">{t("Condition")}</h4>
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={() => updateUrl({ condition: null })}
                                className={`text-left px-3 py-2 rounded-md text-sm ${!newUsed ? 'bg-green-50 text-green-700 font-medium' : 'hover:bg-gray-50'}`}
                            >
                                Any
                            </button>
                            {conditions.map(c => (
                                <button
                                    key={c.key}
                                    onClick={() => updateUrl({ condition: c.key })}
                                    className={`text-left px-3 py-2 rounded-md text-sm ${newUsed === c.key ? 'bg-green-50 text-green-700 font-medium' : 'hover:bg-gray-50'}`}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </FilterPill>

                {/* 4. Price Pill */}
                <FilterPill
                    label={priceLabel}
                    isOpen={openFilter === "price"}
                    isActive={!!(priceFrom || priceTo)}
                    onClick={() => toggleFilter("price")}
                >
                    <div className="w-80">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-lg text-gray-800">{t("Price")}</h4>
                        </div>

                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex-1 relative">
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">From</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                        <span className="text-gray-500 price">$</span>
                                    </div>
                                    <Select
                                        options={priceOptions}
                                        value={priceFrom ? { value: priceFrom, label: parseInt(priceFrom).toLocaleString() } : null}
                                        onChange={(val) => setPriceFrom(val ? val.value : "")}
                                        placeholder=""
                                        styles={priceSelectStyles}
                                        // isClearable
                                        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                                    />
                                </div>
                            </div>
                            <span className="text-gray-400 mt-5">-</span>
                            <div className="flex-1 relative">
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">To</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                        <span className="text-gray-500 price">$</span>
                                    </div>
                                    <Select
                                        options={priceOptions}
                                        value={priceTo ? { value: priceTo, label: parseInt(priceTo).toLocaleString() } : null}
                                        onChange={(val) => setPriceTo(val ? val.value : "")}
                                        placeholder=""
                                        styles={priceSelectStyles}
                                        // isClearable
                                        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => {
                                    setPriceFrom("");
                                    setPriceTo("");
                                    updateUrl({
                                        min_price: null,
                                        max_price: null
                                    });
                                }}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Clear
                            </button>
                            <button
                                onClick={handleApplyPrice}
                                className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition-colors"
                            >
                                View Results
                            </button>
                        </div>
                    </div>
                </FilterPill>


                {/* Clear All Link */}
                {hasActiveFilters && (
                    <button
                        onClick={handleClearAll}
                        className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 ml-2"
                    >
                        <RiDeleteBin6Line size={16} />
                        Clear all filters
                    </button>
                )}

            </div>
        </div>
    );
};

export default SearchPageFilters;
