"use client";
import React, { useEffect, useState, useMemo } from "react";
import InputField from "../ReuseableComponenets/InputField";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { userApi } from "@/lib/api/user";
import { Country, City, State } from "country-state-city";
import Select from "react-select";
import { useAuthStore } from "@/lib/stores/authStore";
import { useLocationStore } from "@/lib/stores/locationStore";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaEnvelope } from "react-icons/fa";

const ContactForm = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [category, setCategory] = useState("Account");
  const [helpWith, setHelpWith] = useState("Emails");
  const [option, setOption] = useState("trouble receiving Ma3rood emails");
  const {
    regions, cities, areas,
    fetchRegions, fetchCities, fetchAreas
  } = useLocationStore();

  useEffect(() => {
    fetchRegions();
  }, []);

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);

  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    phone: yup.string().matches(/^[0-9]{10,15}$/, "Phone number must be 10 to 15 digits only").required("Phone is required"),
    subject: yup.string().required("Subject is required"),
    message: yup.string().required("Message is required"),
    region: yup.string().required("Region is required"),
    city: yup.string().required("City is required"),
    area: yup.string().required("Area is required"),
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      country: "Saudi Arabia",
      region: "",
      city: "",
      area: "",
    },
  });

  // Watch for changes to trigger fetches if needed, or rely on Select onChange

  // Populate form when user data is available
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.mobile || "",
        subject: "",
        message: "",
        country: "Saudi Arabia",
        region: user.region?.name || "",
        city: user.city?.name || "",
        area: user.area?.name || "",
      });

      // If we have IDs we might want to pre-fetch cities/areas, but for now let's just set values
      // Logic to pre-select dropdowns might be complex if we only have names or if we need to fetch first.
      // Assuming user object has flat structure now or similar.
    }
  }, [user, reset]);

  const [formData, setFormData] = useState({
    state: "",
    city: "",
    address: "",
  });

  // Removing old country-state-city logic effectively by not using it
  // const [states, setStates] = useState([]);
  // const [cities, setCities] = useState([]);
  // const [countries, setCountries] = useState([]);
  useEffect(() => {
    if (formData.state) {
      const selectedState = states.find((s) => s.name == formData.state);
      const selectedCountry = countries.find((s) => s.name == formData.country);
      const allCities = City.getCitiesOfState(
        selectedCountry.isoCode,
        selectedState.isoCode
      );

      setCities(allCities);
    }
  }, [formData.state]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone_number: data.phone,
        subject: data.subject,
        message: data.message,
        country: data.country,
        region_id: selectedRegion?.value || regions.find(r => r.name === data.region)?.id,
        city_id: selectedCity?.value || cities.find(c => c.name === data.city)?.id,
        area_id: selectedArea?.value || areas.find(a => a.name === data.area)?.id,
      };

      const response = await userApi.contactmessage(payload);

      console.log("API response:", response);

      if (response?.status) {
        toast.success("Message sent successfully! ");
        reset();
      } else {
        const errorMsg = response?.message || "Something went wrong ❌";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Submit error:", error);
      const errorMsg =
        error?.response?.data?.message ||
        "Failed to send message. Please try again later.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="bg-[#FAFAFA] md:p-5 p-3  rounded-2xl">
      <h1 className="text-3xl mb-2">{t("Contact us")}</h1>
      <p className="text-black mb-6">
        {t(
          "We’ll ask a few questions – so we can help you find the answer, or to get in touch with us."
        )}
      </p>

      <div className="flex items-center gap-3 mb-8 p-4 bg-white border border-gray-100 rounded-xl shadow-sm w-full md:w-fit">
        <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-full text-green-600">
          <FaEnvelope size={20} />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{t("For more information you can reach us directly at")}</p>
          <a href="mailto:mubashir@ma3rood.com" className="text-base font-bold text-gray-800 hover:text-green-600 transition-colors">
            mubashir@ma3rood.com
          </a>
        </div>
      </div>

      <div className="flex">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-4xl rounded-lg border-green-600"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-green-600 font-semibold mb-1">
                {t("Name")}
              </label>
              <input
                type="text"
                {...register("name")}
                className="w-full p-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder={t("Enter your name")}
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-green-600 font-semibold mb-1">
                {t("Email")}
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full p-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder={t("Enter your email")}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Phone & Subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-green-600 font-semibold mb-1">
                {t("Phone Number")}
              </label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    country="sa"
                    onlyCountries={["sa"]}
                    disableDropdown
                    countryCodeEditable={false}
                    value={field.value || ""}
                    onChange={(value) => field.onChange(value)}
                    inputClass={`w-full p2 py-6 border border-green-300 rounded-md ${errors.phone ? "border-red-500" : "border-green-300"
                      }`}
                    inputStyle={{
                      width: "100%",
                      height: "44px", // Adjusted height to match other inputs (p-3 usually ~44-48px)
                      fontSize: "16px",
                    }}
                    buttonStyle={{
                      border: "none",
                      backgroundColor: "transparent",
                    }}
                    placeholder={t("Enter your phone number")}
                  />
                )}
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-green-600 font-semibold mb-1">
                {t("Subject")}
              </label>
              <input
                type="text"
                {...register("subject")}
                className="w-full p-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder={t("Enter subject")}
              />
              {errors.subject && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.subject.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Country */}
            <div>
              <label className="block text-sm font-medium">
                {t("Country")}
              </label>
              <input
                type="text"
                value="Saudi Arabia"
                readOnly
                disabled
                className="w-full p-1.5 border border-gray-200 rounded bg-gray-100 cursor-not-allowed"
              />
            </div>
            {/* Region */}
            <div>
              <label className="block text-sm font-medium">
                {t("Region")}
              </label>
              <Controller
                control={control}
                name="region"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={regions.map((r) => ({
                      label: r.name,
                      value: r.id,
                    }))}
                    onChange={(selected) => {
                      setSelectedRegion(selected);
                      setSelectedCity(null);
                      setSelectedArea(null);
                      setValue("city", "");
                      setValue("area", "");
                      field.onChange(selected?.label);
                      if (selected?.value) fetchCities(selected.value);
                    }}
                    value={selectedRegion || (field.value ? { label: field.value, value: field.value } : null)}
                    placeholder={t("Select region")}
                    isClearable
                  />
                )}
              />
              {errors.region && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.region.message}
                </p>
              )}
            </div>
            {/* City */}
            <div>
              <label className="block text-sm font-medium">
                {t("City")}
              </label>
              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={cities.map((c) => ({
                      label: c.name,
                      value: c.id,
                    }))}
                    onChange={async (selected) => {
                      setSelectedCity(selected);
                      setSelectedArea(null);
                      setValue("area", "");
                      field.onChange(selected?.label);
                      if (selected?.value) {
                        const fetchedAreas = await fetchAreas(selected.value);
                        if (fetchedAreas?.length === 1) {
                          const area = fetchedAreas[0];
                          const areaOption = { label: area.name, value: area.id };
                          setSelectedArea(areaOption);
                          field.onChange(area.name); // ContactForm uses controller with 'area' name but value seems to be label string based on line 362: field.onChange(selected?.label)
                          // Wait, line 362 in original file handles Area onChange.
                          // line 325: field.onChange(selected?.label) - City field stores label?
                          // ContactForm seems to store strings in form data based on usage.
                          setValue("area", area.name);
                        }
                      }
                    }}
                    onInputChange={(inputValue) => {
                      if (selectedRegion?.value) {
                        fetchCities(selectedRegion.value, inputValue);
                      }
                    }}
                    value={selectedCity || (field.value ? { label: field.value, value: field.value } : null)}
                    placeholder={
                      selectedRegion
                        ? t("Select city")
                        : t("Select region first")
                    }
                    isDisabled={!selectedRegion && !watch("region")}
                    isClearable
                  />
                )}
              />
              {errors.city && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
            {/* Area */}
            <div>
              <label className="block text-sm font-medium">
                {t("Area")}
              </label>
              <Controller
                control={control}
                name="area"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={areas.map((a) => ({
                      label: a.name,
                      value: a.id,
                    }))}
                    onChange={(selected) => {
                      setSelectedArea(selected);
                      field.onChange(selected?.label);
                    }}
                    onInputChange={(inputValue) => {
                      if (selectedCity?.value) {
                        fetchAreas(selectedCity.value, inputValue);
                      }
                    }}
                    value={selectedArea || (field.value ? { label: field.value, value: field.value } : null)}
                    placeholder={
                      selectedCity
                        ? t("Select area")
                        : t("Select city first")
                    }
                    isDisabled={!selectedCity && !watch("city")}
                    isClearable
                  />
                )}
              />
              {errors.area && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.area.message}
                </p>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="mb-4">
            <label className="block text-green-600 font-semibold mb-1">
              {t("Message")}
            </label>
            <textarea
              rows="4"
              {...register("message")}
              className="w-full p-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder={t("Write your message")}
            />
            {errors.message && (
              <p className="text-red-600 text-sm mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-44 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded transition"
          >
            {t("Send Message")}
          </button>
        </form>
      </div>
      {/* 🚀 Future Enhancements (Planned): */}
      {/* <div className="space-y-6 max-w-xl">
        <InputField
          label={t("What does your question relate to?")}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={[t("Account"), t("Buying"), t("Selling"), t("Shipping")]}
        />

        <InputField
          label={t("What can we help with?")}
          value={helpWith}
          onChange={(e) => setHelpWith(e.target.value)}
          options={[t("Emails"), t("Payments"), t("Listings")]}
        />

        <InputField
          label={t("Select the most relevant option")}
          value={option}
          onChange={(e) => setOption(e.target.value)}
          options={[
            t("trouble receiving Ma3rood emails"),
            t("email preferences"),
            t("unsubscribe help"),
          ]}
        />

        <div className="border rounded-md p-4 shadow-sm">
          <h2 className="font-semibold mb-1">{t("Managing Book a courier")}</h2>
          <p className="text-sm text-gray-600 mb-3">
            {t("If you're having issues with your courier booking, we can help")}
          </p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            {t("Read more")}
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default ContactForm;
