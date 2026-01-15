"use client";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { IoEyeSharp } from "react-icons/io5";
import { Country, City, State } from "country-state-city";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import debounce from "lodash.debounce"; // install: npm i lodash.debounce
import { authApi } from "@/lib/api/auth";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { useLocationStore } from "@/lib/stores/locationStore";
export default function RegisterForm({ onSubmit, isLoading }) {
  const {
    regions, fetchRegions,
    cities: storeCities, fetchCities,
    areas: storeAreas, fetchAreas,
    isLoading: isLocationLoading
  } = useLocationStore();

  const [formData, setFormData] = useState({
    name: "",
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
    country: "Saudi Arabia",
    region: "",
    city: "",
    area: "",
    password: "",
    confirmPassword: "",
  });

  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameSuggestions, setUsernameSuggestions] = useState([]);
  const [apiResponse, setApiResponse] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  // Ref to track the latest username to avoid race conditions
  const currentUsernameRef = useRef(formData.username);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  useEffect(() => {
    currentUsernameRef.current = formData.username;
  }, [formData.username]);

  const handleRegionChange = (selected) => {
    const regionId = regions.find(r => r.name === selected?.value)?.id;
    setFormData((prev) => ({
      ...prev,
      region: selected?.value || "",
      city: "",
      area: "",
    }));
    if (regionId) fetchCities(regionId);
  };

  const handleCityChange = async (selected) => {
    const cityId = storeCities.find(c => c.name === selected?.value)?.id;
    setFormData((prev) => ({
      ...prev,
      city: selected?.value || "",
      area: "",
    }));
    if (cityId) {
      const fetchedAreas = await fetchAreas(cityId);
      if (fetchedAreas?.length === 1) {
        setFormData(prev => ({ ...prev, area: fetchedAreas[0].name }));
      }
    }
  };

  const handleAreaChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      area: selected?.value || "",
    }));
  };

  const checkUsernameUnique = async (username) => {
    if (!username || username.length < 3) return;

    setCheckingUsername(true);
    setApiResponse(null);
    setUsernameSuggestions([]);

    try {
      const data = await authApi.checkusername({ username });

      // Race condition check: ignore if username changed while awaiting
      if (username !== currentUsernameRef.current) return;

      // Check for success or status property
      if (data?.success || data?.status) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.username;
          return newErrors;
        });
        setApiResponse(data);
      } else {
        setErrors(prev => ({ ...prev, username: data?.message || "Username is taken" }));
        if (data?.data?.suggestions) setUsernameSuggestions(data?.data?.suggestions);
      }
    } catch (error) {
      // Race condition check: ignore if username changed while awaiting
      if (username !== currentUsernameRef.current) return;

      const msg = error?.data?.message || "Username is unavailable";
      setErrors(prev => ({ ...prev, username: msg }));
      if (error?.data?.suggestions) {
        setUsernameSuggestions(error?.data?.suggestions);
      }
    } finally {
      // Only turn off spinner if we are still checking the same username
      if (username === currentUsernameRef.current) {
        setCheckingUsername(false);
      }
    }
  };

  const debouncedUsernameCheck = useMemo(
    () => debounce(checkUsernameUnique, 800),
    []
  );

  useEffect(() => {
    if (formData.username?.length >= 3) {
      debouncedUsernameCheck(formData.username);
    } else {
      setCheckingUsername(false);
    }
    return () => debouncedUsernameCheck.cancel();
  }, [formData.username, debouncedUsernameCheck]);

  // Re-write validate function to check for city/area instead of governorate
  const validate = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = "First Name is required";
    if (!formData.last_name.trim()) newErrors.last_name = "Last Name is required";
    if (!formData.username.trim()) newErrors.username = "User Name is required"; // Fixed key mismatch
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone is required";
    } else if (!/^[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.region) newErrors.region = "Region is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.area) newErrors.area = "Area is required";

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "first_name": if (!value.trim()) error = "First Name is required"; break;
      case "last_name": if (!value.trim()) error = "Last Name is required"; break;
      case "username": if (!value.trim()) error = "User Name is required"; break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email format";
        break;
      case "phone":
        if (!value) error = "Phone is required";
        else if (!/^\+?[0-9]{10,15}$/.test(value)) error = "Invalid phone number";
        break;
      case "country": if (!value) error = "Country is required"; break;
      case "region": if (!value) error = "Region is required"; break;
      case "city": if (!value) error = "City is required"; break;
      case "area": if (!value) error = "Area is required"; break;
      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 6) error = "Password must be at least 6 characters";
        break;
      case "confirmPassword":
        if (value && value !== formData.password) error = "Passwords do not match";
        else error = "";
        break;
      default: break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedRegionObj = regions.find(r => r.name === formData.region);
    const selectedCityObj = storeCities.find(c => c.name === formData.city);
    const selectedAreaObj = storeAreas.find(a => a.name === formData.area);
    // console.log("Selected Region Object:", selectedRegionObj?.id);
    const updatedFormData = {
      ...formData,
      name: `${formData.first_name} ${formData.last_name}`.trim(),
      country_id: 1, // Defaulting to 1 as per previous logic (Saudi Arabia)
      regions_id: selectedRegionObj?.id || null, // Changed from plural regions_id
      city_id: selectedCityObj?.id || null,
      area_id: selectedAreaObj?.id || null, // Added area_id
      // Removed governorates_id
    };

    if (validate()) {
      onSubmit(updatedFormData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {/* ... keeping name/email/phone fields same ... but need to locate them to skip ... */}
      {/* Name/Email/Phone fields remain here, just replacing the location block below */}

      {/* ... Name/Email/Phone inputs ... */}
      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block mb-1 text-sm font-medium">
            {t("First Name")}
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
            className={`w-full p-2 border rounded-md ${errors.first_name ? "border-red-500" : "border-gray-300"
              }`}
          />
          {errors.first_name && (
            <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
          )}
        </div>
        <div className="w-1/2">
          <label className="block mb-1 text-sm font-medium">
            {t("Last Name")}
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
            className={`w-full p-2 border rounded-md ${errors.last_name ? "border-red-500" : "border-gray-300"
              }`}
          />
          {errors.last_name && (
            <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="md:w-1/3 relative">
          <label className="block mb-1 text-sm font-medium">
            {t("Username")}
          </label>
          <div className="relative">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
              className={`w-full p-2 border rounded-md
                ${errors.username ? "border-red-500" : "border-gray-300"}`}
            />
            {/* ... keeping icons ... */}
            {checkingUsername && <ImSpinner2 className="absolute right-3 top-3 text-gray-400 animate-spin text-lg" />}
            {!checkingUsername && !errors.username && formData.username && <FaCheckCircle className="absolute right-3 top-3 text-green-500 text-lg" />}
            {!checkingUsername && errors.username && <FaTimesCircle className="absolute right-3 top-3 text-red-500 text-lg" />}
          </div>
          {/* {usernameSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b">
                {t("Available suggestions:")}
              </p>
              <ul className="max-h-48 overflow-y-auto">
                {usernameSuggestions.map((suggestion, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, username: suggestion }));
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.username;
                        return newErrors;
                      });
                      setUsernameSuggestions([]);
                    }}
                    className="px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-green-50 hover:text-green-700 transition-colors"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )} */}
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
          )}
        </div>

        <div className="md:w-1/3 ">
          <label className="block mb-1 text-sm font-medium">{t("Email")}</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full p-2 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div className="md:w-1/3 ">
          <label className="block mb-1 text-sm font-medium">{t("Phone Number")}</label>
          <PhoneInput
            country={"sa"}
            onlyCountries={["sa"]}
            disableDropdown={true}
            countryCodeEditable={false}
            value={formData.phone}
            onChange={(phone) => {
              setFormData((prev) => ({ ...prev, phone }));
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
            }}
            inputClass={`w-full p-2 border rounded-md ${errors.phone ? "border-red-500" : "border-gray-300"}`}
            inputStyle={{ width: "100%", height: "40px", fontSize: "14px" }}
            buttonStyle={{ border: "none", backgroundColor: "transparent" }}
            placeholder={t("5XXXXXXXX")}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>
      </div>


      {/* Updated Location Fields */}
      <div className="flex flex-col md:flex-row md:gap-4 w-full">
        <div className="md:w-1/2 md:mt-1">
          <label className="block text-sm font-medium">{t("Country")}</label>
          <input
            type="text"
            name="country"
            value="Saudi Arabia"
            disabled
            readOnly
            className="w-full mt-0.5 p-1.5 border border-gray-200 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
          />
        </div>

        <div className="md:w-1/2">
          <label className="block mb-1 text-sm font-medium">{t("Region")}</label>
          <Select
            instanceId="region"
            name="region"
            value={formData.region ? { value: formData.region, label: formData.region } : null}
            onChange={handleRegionChange}
            options={regions.map((r) => ({ value: r.name, label: r.name }))}
            placeholder={t("Select a Region")}
            className="text-sm"
            classNamePrefix="react-select"
            isClearable
          />
          {errors.region && <p className="mt-1 text-sm text-red-600">{errors.region}</p>}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:gap-4 w-full">

        <div className="w-1/2">
          <label className="block mb-1 text-sm font-medium">{t("City")}</label>
          <Select
            instanceId="city"
            name="city"
            value={formData.city ? { value: formData.city, label: formData.city } : null}
            onChange={handleCityChange}
            options={storeCities.map((c) => ({ value: c.name, label: c.name }))}
            isLoading={isLocationLoading}
            onInputChange={(inputValue) => {
              if (formData.region) {
                const regionId = regions.find(r => r.name === formData.region)?.id;
                if (regionId) fetchCities(regionId, inputValue);
              }
            }}
            placeholder={t("Select City")}
            className="text-sm"
            isDisabled={!formData.region}
          />
          {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
        </div>

        <div className="w-1/2">
          <label className="block mb-1 text-sm font-medium">{t("Area")}</label>
          <Select
            instanceId="area"
            name="area"
            value={formData.area ? { value: formData.area, label: formData.area } : null}
            onChange={handleAreaChange}
            options={storeAreas.map((a) => ({ value: a.name, label: a.name }))}
            isLoading={isLocationLoading}
            onInputChange={(inputValue) => {
              if (formData.city) {
                const cityId = storeCities.find(c => c.name === formData.city)?.id;
                if (cityId) fetchAreas(cityId, inputValue);
              }
            }}
            placeholder={t("Select Area")}
            className="text-sm"
            isDisabled={!formData.city}
          />
          {errors.area && <p className="mt-1 text-sm text-red-600">{errors.area}</p>}
        </div>
      </div>



      <div className="flex gap-4">
        {/* Password Field */}
        <div className="w-1/2 relative">
          <label className="block mb-1 text-sm font-medium">
            {t("Password")}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className={`w-full p-2 ${isArabic ? "pl-10" : "pr-10"} border rounded-md ${errors.password ? "border-red-500" : "border-gray-300"
                }`}
            />
            {/* <button
            type="button"
            className={`absolute inset-y-0 top-6 flex items-center text-gray-500 hover:text-gray-700 ${isArabic ? "left-3" : "right-3"
              }`}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <IoEyeSharp className="w-5 h-5" />
            ) : (
              <BsFillEyeSlashFill className="w-5 h-5" />
            )}
          </button> */}
            <span
              className={`absolute inset-y-0 top-0.5 flex items-center text-gray-500 hover:text-gray-700 ${isArabic ? "left-3" : "right-3"
                }`}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <BsFillEyeSlashFill /> : <IoEyeSharp />}
            </span>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="relative w-1/2">
          <label className="block mb-1 text-sm font-medium">
            {t("Confirm Password")}
          </label>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
            />

            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <BsFillEyeSlashFill /> : <IoEyeSharp />}
            </span>
          </div>

          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>

      </div>




      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${isLoading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700"
          }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {t("Creating Account...")}{" "}
          </span>
        ) : (
          t("Register")
        )}
      </button>
    </form>
  );
}
