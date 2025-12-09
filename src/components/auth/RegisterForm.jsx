"use client";
import { useEffect, useState } from "react";
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
  const { locations, getAllLocations } = useLocationStore();
  const [formData, setFormData] = useState({
    name: "",
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
    // billing_address: "",
    country: "Saudi Arabia", 
    governorate: '',
    city: "",
    region: "",
    state: "",
    password: "",
    confirmPassword: "",
  });
  const [countries, setCountries] = useState([]);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameSuggestions, setUsernameSuggestions] = useState([]);
  const [apiResponse, setApiResponse] = useState(null);

  // const [cities, setCities] = useState([]);
  // const [states, setStates] = useState([])
  const country = locations.find((c) => c.id == 1);
  const regions = country?.regions || [];
  const selectedRegion = regions.find((r) => r.name === formData.region);
  const governorates =
    regions.find((r) => r.name == formData.region)?.governorates || [];
    const selectedGovernorate = governorates.find(
  (g) => g.name == formData.governorate
);
  const cities =
    governorates.find((g) => g.name === formData.city)?.cities || [];
    const selectedCity = cities.find((c) => c.name === formData.area);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

    useEffect(() => {
    getAllLocations(); 
  }, [getAllLocations]);
console.log('res', formData.region)
  // useEffect(() => {
  //   const allCountries = Country.getAllCountries();
  //   setCountries(allCountries);

  //   const defaultCities = City.getCitiesOfCountry("SA");
  //   // setCities(defaultCities);
  //   // Remove duplicate cities by name
  //   const uniqueCities = defaultCities.filter(
  //     (city, index, self) =>
  //       index === self.findIndex((c) => c.name === city.name)
  //   );

  //   setCities(uniqueCities);
  //   const defaultStates = State.getStatesOfCountry("SA");
  //   // Remove duplicate cities by name
  //   const uniqueStates = defaultStates.filter(
  //     (state, index, self) =>
  //       index === self.findIndex((s) => s.name === state.name)
  //   );

  //   setStates(uniqueStates);
  //   // setStates(defaultStates);
  // }, []);
  // useEffect(() => {
  //   if (formData.state) {
  //     const selectedState = states.find((s) => s.name == formData.state);
  //     const selectedCountry = countries.find((s) => s.name == formData.country);
  //     const allCities = City.getCitiesOfState(
  //       selectedCountry.isoCode,
  //       selectedState.isoCode
  //     );

  //     setCities(allCities);
  //   }
  // }, [formData.state]);



  const checkUsernameUnique = debounce(async (username) => {
    if (!username.trim()) return;

    setCheckingUsername(true);
    try {
      const res = await authApi.checkusername({ username });

      if (res.data?.success === false) {
        setErrors((prev) => ({
          ...prev,
          username: res.data?.message || "Username is already taken"
        }));
      } else {
        setErrors((prev) => ({ ...prev, username: "" }));
      }
    } catch (err) {
      console.error("❌ Username check failed:", err);
      console.log("✅ Full Response:", err.data);
      setApiResponse(err.response?.data || err);
      console.log(apiResponse,)

      console.log("Messagesss:", err.data?.message);
      console.log("Suggestionsss:", err.data?.suggestions);
      setUsernameSuggestions(err.data?.suggestions || []);
      // console.log(usernameSuggestions, 'ddd')

      setErrors((prev) => ({ ...prev, username: "Error checking username" }));
      // setUsernameSuggestions([]);
    } finally {
      setCheckingUsername(false);
    }
  }, 500);

  // const handleChange = (e) => {

  //   const { name, value } = e.target;
  //   setFormData((prev) => {
  //     const updated = { ...prev, [name]: value };

  //     // After updating formData, revalidate current field
  //     validateField(name, value, updated); // pass updated formData
  //     // if (name === "username") {
  //     //   checkUsernameUnique(value); // 🔑 call username check here
  //     // }
  //     if (name === "username") {
  //       setErrors((prev) => ({ ...prev, username: "" })); // 🟢 clear old error
  //       setUsernameSuggestions([]); // 🟢 clear old suggestions
  //       checkUsernameUnique(value); // 🔑 naya API call
  //     }
  //     if (name === "password" || name === "confirmPassword") {
  //       validateField("confirmPassword", updated.confirmPassword, updated);
  //     }
  //     // If password becomes empty, reset confirmPassword too
  //     if (name === "password" && value === "") {
  //       updated.confirmPassword = "";
  //     }

  //     return updated;
  //   });
  //   validateField(name, value);
  //   if (name === "password" && formData.password.length < 1) {
  //     setFormData({ ...prev, confirmPassword: "" });
  //   }
  //   // Clear error when user types
  //   if (errors[name]) {
  //     setErrors((prev) => ({ ...prev, [name]: "" }));
  //   }
  // };

  //   const handleChange = (e) => {
  //   const { name, value } = e.target;

  //   setFormData((prev) => {
  //     const updated = { ...prev, [name]: value };

  //     // Revalidate current field
  //     validateField(name, value, updated);

  //     if (name === "password" || name === "confirmPassword") {
  //       validateField("confirmPassword", updated.confirmPassword, updated);
  //     }

  //     // If password is cleared → reset confirmPassword
  //     if (name === "password" && value === "") {
  //       updated.confirmPassword = "";
  //     }

  //     return updated;
  //   });

  //   // Clear error for current field when typing
  //   if (errors[name]) {
  //     setErrors((prev) => ({ ...prev, [name]: "" }));
  //   }
  // };
const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => {
    const updated = { ...prev, [name]: value };

    // If user edits password after confirmPassword was already filled
    if (name === "password") {
      updated.confirmPassword = ""; // reset confirm password
      setErrors((prev) => ({ ...prev, confirmPassword: "" })); // clear error
    }

    // Live validation
    validateField(name, value, updated);
    if (name === "confirmPassword") {
      validateField("confirmPassword", updated.confirmPassword, updated);
    }

    return updated;
  });

  // Clear error for current field
  if (errors[name]) {
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }
};


  const handleStateChange = (e) => {
    const selectedState = e.target.value;

    // Step 1: Update state in form data and reset city
    setFormData((prev) => ({
      ...prev,
      state: selectedState,
      city: "", // reset city when state changes
    }));

    // Step 2: Get state's ISO code
    const stateList = State.getStatesOfCountry("SA"); // SA = Saudi Arabia
    const matchedState = stateList.find(
      (state) => state.name === selectedState
    );
    const isoCode = matchedState?.isoCode;

    // Step 3: Get cities based on selected state ISO code
    const selectedCities = City.getCitiesOfState("SA", isoCode);
    setCities(selectedCities); // set dropdown values

    // Step 4: Clear validation error if present
    if (errors.state) {
      setErrors((prev) => ({ ...prev, state: "" }));
    }
  };

  const handleCountryChange = (e) => {
    const selectedCountryCode = e.target.value;
    setFormData((prev) => ({
      ...prev,
      country: selectedCountryCode,
      state: "",
      city: "", // Reset city
    }));
    const selectedCities = City.getCitiesOfCountry(selectedCountryCode);
    const selectedStates = State.getStatesOfCountry(selectedCountryCode);
    setCities(selectedCities);
    setStates(selectedStates);

    if (errors.country) {
      setErrors((prev) => ({ ...prev, country: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.first_name.trim())
      newErrors.first_name = "First Name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last Name is required";
    if (!formData.username.trim())
      newErrors.last_name = "User Name is required";
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
    // if (!formData.billing_address)
    //   newErrors.billing_address = "Address is required";
    if (!formData.country) newErrors.country = "Country is required";
    // if (!formData.city) newErrors.city = "City is required";
    if (!formData.region) newErrors.region = "Region is required";
    if (!formData.governorate) newErrors.governorate = "Governorate is required";



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
      case "first_name":
        if (!value.trim()) error = "First Name is required";
        break;
      case "last_name":
        if (!value.trim()) error = "Last Name is required";
        break;
      case "username":
        if (!value.trim()) error = "User Name is required";
        break;
      case "email":
        if (!value) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Invalid email format";
        }
        break;
      case "phone":
        if (!value) {
          error = "Phone is required";
        } else if (!/^\+?[0-9]{10,15}$/.test(value)) {
          error = "Invalid phone number";
        }
        break;
      case "billing_address":
        if (!value) error = "Address is required";
        break;
      case "country":
        if (!value) error = "Country is required";
        break;
      case "region":
        if (!value) error = "Region is required";
        break;
          case "governorate":
        if (!value) error = "Governorate is required";
        break;
      // case "city":
      //   if (!value) error = "City is required";
      //   break;

      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
        }
        break;
      // case "confirmPassword":
      //   if (value !== formData.password) {
      //     error = "Passwords do not match";
      //   }
      //   break;
      case "confirmPassword":
  if (value && value !== formData.password) {
    error = "Passwords do not match";
  } else {
    error = "";
  }
  break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(selectedGovernorate)
    const updatedFormData = {
      ...formData,
      name: `${formData.first_name} ${formData.last_name}`.trim(),
      country_id: country?.id || null,
    regions_id: selectedRegion?.id || null,
    governorates_id: selectedGovernorate?.id || null,
    // city_id: selectedCity?.id || null,
    };
    console.log(updatedFormData);
    if (validate()) {
      onSubmit(updatedFormData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {/* Name Field */}
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
        ${errors.username
          ? "border-red-500"
          : "border-gray-300"
        }`}
    />

    {/* Loader / Success / Error Icons */}
    {checkingUsername && (
      <ImSpinner2 className="absolute right-3 top-3 text-gray-400 animate-spin text-lg" />
    )}

    {!checkingUsername && !errors.username && formData.username && (
      <FaCheckCircle className="absolute right-3 top-3 text-green-500 text-lg" />
    )}

    {!checkingUsername && errors.username && (
      <FaTimesCircle className="absolute right-3 top-3 text-red-500 text-lg" />
    )}
  </div>

  {/* Error + Suggestions */}
  {!checkingUsername && errors.username && (
    <div className="mt-2 ">
      {/* <p className="text-red-600 flex items-center gap-1 mb-1">
        ❌ {errors.username}
      </p> */}

      {usernameSuggestions.length > 0 && (
        <>
          <p className="text-gray-600 mb-1 text-xs">
            Try one of these:
          </p>
          <div className="flex flex-wrap gap-1">
            {usernameSuggestions.slice(0, 3).map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, username: sug }));
                  setErrors((prev) => ({ ...prev, username: "" }));
                  setUsernameSuggestions([]);
                }}
                className="px-2 py-1 rounded-full text-[10px] font-medium bg-green-100 text-green-700 
                           hover:bg-green-200 transition-colors duration-200"
              >
                {sug}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
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
            className={`w-full p-2 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"
              }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        {/* Phone Field */}
        {/* <div className="w-1/2">
          <label className="block mb-1 text-sm font-medium">
            {t("Phone Number")}
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            pattern="[0-9]{10,15}"
            className={`w-full p-2 border rounded-md ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div> */}

        {/* Phone Number Field */}
        <div className="md:w-1/3 ">
          <label className="block mb-1 text-sm font-medium">
            {t("Phone Number")}
          </label>
          <PhoneInput
            country={"sa"}
            onlyCountries={["sa"]}
            disableDropdown={true}
            countryCodeEditable={false}
            value={formData.phone}
            onChange={(phone) => {
              setFormData((prev) => ({ ...prev, phone }));
              if (errors.phone) {
                setErrors((prev) => ({ ...prev, phone: "" }));
              }
            }}
            inputClass={`w-full p-2 border rounded-md ${errors.phone ? "border-red-500" : "border-gray-300"
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
            placeholder={t("5XXXXXXXX")}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>


      </div>


      <div className="flex flex-col md:flex-row md:gap-4 w-full">
        <div className="md:w-1/3 md:mt-1">
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

        <div className="md:w-1/3">
          <label className="block mb-1 text-sm font-medium">{t("Region")}</label>
          {/* {states.length > 0 && ( */}
            <Select
              name="region"
              value={formData.region ? { value: formData.region, label: formData.region } : null}
          onChange={(selected) =>
            setFormData((prev) => ({
              ...prev,
              region: selected?.value || "",
              governorate: "",
              city: "",
            }))
          }
          options={regions.map((r) => ({ value: r.name, label: r.name }))}
              placeholder={t("Select a Region")}
              className="text-sm"
              classNamePrefix="react-select"
              isClearable
            />
          {/* )} */}
          {errors.region && (
            <p className="mt-1 text-sm text-red-600">{errors.region}</p>
          )}
        </div>

        <div className="md:w-1/3">
          <label className="block mb-1 text-sm font-medium">{t("Governorate")}</label>
          {/* {cities.length > 0 && ( */}
            <Select
              name="governorate"
              value={
            formData.governorate
              ? { value: formData.governorate, label: formData.governorate }
              : null
          }
          onChange={(selected) =>
            setFormData((prev) => ({
              ...prev,
              governorate: selected?.value || "",
              city: "",
            }))
          }
          options={governorates.map((g) => ({ value: g.name, label: g.name }))}
              placeholder={t("Select a Governorate")}
              className="text-sm"
              classNamePrefix="react-select"
              isClearable
            />
          {/* )} */}
          {errors.governorate && (
            <p className="mt-1 text-sm text-red-600">{errors.governorate}</p>
          )}
        </div>
      </div>

      {/* <div className="flex flex-col md:flex-row md:gap-4 w-full">
<div className="mt-2 md:w-1/2">
          <label className="block mb-1 text-sm font-medium">{t("Governorate")}</label>
          
            <Select
              name="governorate"
              value={
            formData.governorate
              ? { value: formData.governorate, label: formData.governorate }
              : null
          }
          onChange={(selected) =>
            setFormData((prev) => ({
              ...prev,
              governorate: selected?.value || "",
              city: "",
            }))
          }
          options={governorates.map((g) => ({ value: g.name, label: g.name }))}
              placeholder={t("Select a Governorate")}
              className="text-sm"
              classNamePrefix="react-select"
              isClearable
            />
       
          {errors.governorate && (
            <p className="mt-1 text-sm text-red-600">{errors.governorate}</p>
          )}
        </div>

        <div className="mt-2 md:w-1/2">
          <label className="block mb-1 text-sm font-medium">{t("City")}</label>
    
            <Select
              name="city"
              value={
                cities.find((option) => option.name === formData.city)
                  ? { value: formData.city, label: formData.city }
                  : null
              }
              onChange={(selected) => {
                setFormData((prev) => ({
                  ...prev,
                  city: selected?.value || "",
                }));
                if (errors.city) {
                  setErrors((prev) => ({ ...prev, city: "" }));
                }
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
      
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city}</p>
          )}
        </div>
      </div> */}

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
      className={`w-full p-2 border rounded-md ${
        errors.confirmPassword ? "border-red-500" : "border-gray-300"
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
