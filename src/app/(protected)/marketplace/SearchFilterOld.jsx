"use client";
import { useCategoryStore } from "@/lib/stores/categoryStore";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import { listingsApi } from "@/lib/api/listings";
import Select from "react-select";
import { Image_URL } from "@/config/constants";
import { City } from "country-state-city";
import { useCityStore } from "@/lib/stores/cityStore";
import { useLocationStore } from "@/lib/stores/locationStore";

export const SearchFilterOld = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dropdownRef = useRef(null);
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(
    searchParams.get("category_id") || ""
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [cities, setCities] = useState([]);
  // const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const {
    locations,
    getAllLocations,
    selectedCountry,
    selectedRegion,
    selectedGovernorate,
    setSelectedCountry,
    setSelectedRegion,
    setSelectedGovernorate,
  } = useLocationStore();
  const country = locations.find((c) => c.id == 1);
  const regions = country?.regions || [];

  const governorates = useMemo(() => {
    // guard clause — prevents error if selectedRegion is null
    if (!selectedRegion || !selectedRegion.name) return [];

    const region = regions.find((r) => r.name === selectedRegion.name);
    return region?.governorates || [];
  }, [regions, selectedRegion]);

  const {
    categories,
    getAllCategories,
    selectedCategory,
    setSelectedCategory,
  } = useCategoryStore();

  const {
    selectedCity,
    setSelectedCity,
  } = useCityStore();

  useEffect(() => {
    getAllCategories();
    const defaultCities = City.getCitiesOfCountry("SA");
    // Remove duplicate cities by name
    const uniqueCities = defaultCities.filter(
      (city, index, self) =>
        index === self.findIndex((c) => c.name === city.name)
    );

    setCities(uniqueCities);

  }, [getAllCategories]);

  useEffect(() => {
    getAllLocations();
  }, [getAllLocations]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounce timer
  useEffect(() => {
    if (searchTerm.length > 2) {
      const timer = setTimeout(async () => {
        setLoading(true);
        // USE listingsSearchHistory as requested, hardcoding listing_type=marketplace
        const payload = {
          keyword: searchTerm,
          listing_type: "marketplace",
        };
        try {
          // const res = await listingsApi.getListingsByFilter(payload);
          const res = await listingsApi.listingsSearchHistory(payload);
          // Adjust based on response structure of listingsSearchHistory
          // It likely returns { data: [...] } or just [...] or { web_suggestions: ... } like GridLayout?
          // GridLayout uses getListingsFilterByAllCategories -> web_suggestions.
          // listingsApi.listingsSearchHistory -> returns response.
          // Let's assume response.data or response is the list.
          // Based on listings.js: return response; (which is axios result)
          // Actually listingsSearchHistory returns response (axios object or data depending on axiosClient).
          // listings.js: const response = await axiosClient.get(...) -> return response;
          // Usually axiosClient returns response.data if interceptor... wait.
          // Let's look at getListings: return response.data.
          // listingsSearchHistory: return response.
          // I should verify response structure. Assuming .data based on other usages or standard axios.

          setResults(res?.data || res?.web_suggestions || []);
          console.log("list", res);
          setShowDropdown(true);
        } catch (error) {
          console.error("Search error:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 300); // 300ms debounce

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [searchTerm]);

  const handleSearch = () => {
    // Redirect to search page with results
    const params = new URLSearchParams();
    if (searchTerm) params.set("keyword", searchTerm); // Search page usually uses 'keyword'
    params.set("listing_type", "marketplace");

    // Include other filters if needed/requested, but user focused on "search button... redirect to search page"
    if (selectedCity) params.set("city", selectedCity);
    if (selectedRegion) params.set("region_id", selectedRegion.id);
    if (selectedGovernorate) params.set("governorate_id", selectedGovernorate.id);
    if (selectedCategory) params.set("category_id", selectedCategory);

    router.push(`/search?${params.toString()}`);
  };

  const handleSelectProduct = (listing) => {
    setShowDropdown(false);
    router.push(`/marketplace/${listing.category?.slug}/${listing?.slug}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 -mt-16 relative">
      <div className="bg-white rounded-2xl shadow-md px-6 py-6 flex flex-col md:flex-row gap-3 items-center justify-center">
        <div className="flex flex-col w-full md:w-1/2">
          <label className="text-sm text-gray-500 mb-1">
            {t("Search by keyword")}
          </label>
          <input
            type="text"
            placeholder={t("What are you looking for?")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 px-4 py-1.5 rounded-md focus:outline-none"
          />
        </div>

        {/* <div className="flex flex-col w-full md:w-1/4">
          <label className="text-sm text-gray-500 mb-1">
            {t("City")}
          </label>
           {cities.length > 0 && (
          <Select
          name="city"
          value={
            cities.find((option) => option.name === selectedCity)
              ? { value: selectedCity, label: selectedCity }
              : null
          }
          onChange={(selected) => {
            setSelectedCity(selected?.value);
          }}
          options={cities.map((city) => ({
            value: city.name,
            label: city.name,
          }))}
          placeholder={t("Select a city")}
          className="text-sm"
          classNamePrefix="react-select"
          isClearable
        />
        )}
        </div> */}

        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-sm text-gray-500 mb-1">{t("Region")}</label>
          {/* {states.length > 0 && ( */}
          <Select
            name="region"
            instanceId="region"
            value={
              selectedRegion
                ? { value: selectedRegion.name, label: selectedRegion.name }
                : null
            }
            onChange={(selected) => {
              if (selected) {
                const region = regions.find((r) => r.name === selected.value);
                setSelectedRegion(region ? { id: region.id, name: region.name } : null);
              } else {
                setSelectedRegion(null);
              }
            }}
            options={regions.map((r) => ({ value: r.name, label: r.name }))}
            placeholder={t("Select a Region")}
            className="text-xs"
            classNamePrefix="react-select"
            isClearable
            styles={{
              menu: (provided) => ({
                ...provided,
                maxHeight: 200,
                overflowY: 'auto',
              }),
              menuList: (provided) => ({
                ...provided,
                maxHeight: 200,
                overflowY: 'auto',
              }),
            }}
          />
        </div>
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-sm text-gray-500 mb-1">{t("Governorate")}</label>
          {/* {cities.length > 0 && ( */}
          <Select
            name="governorate"
            instanceId="governorate"
            value={
              selectedGovernorate
                ? { value: selectedGovernorate.name, label: selectedGovernorate.name }
                : null
            }
            onChange={(selected) => {
              const gov = governorates.find((g) => g.name === selected?.value);
              setSelectedGovernorate(gov ? { id: gov.id, name: gov.name } : null);
            }}
            options={governorates.map((g) => ({ value: g.name, label: g.name }))}
            placeholder={t("Select a Governorate")}
            className="text-xs"
            classNamePrefix="react-select"
            isClearable
            styles={{
              menu: (provided) => ({
                ...provided,
                maxHeight: 200,
                overflowY: 'auto',
              }),
              menuList: (provided) => ({
                ...provided,
                maxHeight: 200,
                overflowY: 'auto',
              }),
            }}
          />
        </div>

        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-sm text-gray-500 mb-1">
            {t("Categories")}
          </label>
          {/* <select
            value={selectedCategory ?? ""}
            onChange={(e) => {
              setCategory(e.target.value);
              setSelectedCategory(e.target.value);
            }}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none"
          >
            <option value="">{t("All Categories")}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select> */}
          {categories.length > 0 && (
            <Select
              name="category"
              instanceId="category"
              value={(() => {
                const option = categories.find(
                  (option) => option.id == selectedCategory
                );
                return option ? { value: option.id, label: option.name } : null;
              })()}
              onChange={(selected) => {
                setCategory(selected?.value);
                setSelectedCategory(selected?.value);
              }}
              options={categories.map((city) => ({
                value: city.id,
                label: city.name,
              }))}
              placeholder={t("Select a Category")}
              className="text-xs"
              classNamePrefix="react-select"
              isClearable
            />
          )}
        </div>

        <div className="w-full md:w-auto ">
          <button
            className={`bg-green-600 text-white px-6 md:mt-6 py-2 rounded-md w-full md:w-auto
                            ${loading ? "text-white cursor-not-allowed" : ""}`}
            disabled={loading}
            onClick={handleSearch}
          >
            {loading ? (
              <span className="md:inline ml-2">{t("Searching")}...</span>
            ) : (
              <>
                <span className="md:inline ml-2">{t("Search")}</span>
              </>
            )}
          </button>
        </div>
      </div>
      {showDropdown && searchTerm.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-52 md:top-24 left-10 md:left-28 w-[80vw] md:w-full md:max-w-[33.5rem] bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto"
        >
          {results.length > 0 ? (
            results.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectProduct(item)}
                className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 transition-all"
              >
                <img
                  src={
                    item.images?.[0]?.image_path
                      ? `${Image_URL}/${item.images[0].image_path}`
                      : "/placeholder.png"
                  }
                  alt={item.title}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="text-sm text-black font-medium">{item.title}</p>
                  <p className="text-xs text-black">
                    <span className="price">$</span>
                    {item.start_price}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-500 text-center">
              {"No results found"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
