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

const ContactForm = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [category, setCategory] = useState("Account");
  const [helpWith, setHelpWith] = useState("Emails");
  const [option, setOption] = useState("trouble receiving Ma3rood emails");
  const { locations, getAllLocations } = useLocationStore();

  useEffect(() => {
    getAllLocations();
  }, [getAllLocations]);

  const country = locations.find((c) => c.id == 1);
  const regions = country?.regions || [];

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedGovernorate, setSelectedGovernorate] = useState(null);

  const governorates = useMemo(() => {
    if (!selectedRegion) return [];
    const region = regions.find((r) => r.id === selectedRegion.value);
    return region?.governorates || [];
  }, [regions, selectedRegion]);

  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    phone: yup
      .string()
      .matches(/^[0-9]{10,15}$/, "Phone number must be 10 to 15 digits only")

      .required("Phone is required"),
    subject: yup.string().required("Subject is required"),
    message: yup.string().required("Message is required"),
    region: yup
      .mixed()
      .test("region-type", "Region is required", function (value) {
        // allow string or object but not null/undefined
        if (!value) return false;
        if (typeof value === "string" && value.trim() !== "") return true;
        if (typeof value === "object" && Object.keys(value).length > 0) return true;
        return false;
      }),
    governorate: yup
      .mixed()
      .test("governorate-type", "Governorate is required", function (value) {
        if (!value) return false;
        if (typeof value === "string" && value.trim() !== "") return true;
        if (typeof value === "object" && Object.keys(value).length > 0) return true;
        return false;
      }),
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
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
      governorate: "",
    },
  });




  // ✅ Populate form when user data is available
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.mobile || "",
        subject: "",
        message: "",
        country: "Saudi Arabia",
        region: user.regions,
        governorate: user.governorates,
      });

      setSelectedRegion(
        user.regions
          ? { label: user.regions.name, value: user.regions?.id }
          : null
      );

      setSelectedGovernorate(
        user.governorates
          ? {
            label: user.governorates.name,
            value: user.governorates?.id,
          }
          : null
      );
    }
  }, [user, reset]);

  const [formData, setFormData] = useState({
    state: "",
    city: "",
    address: "",
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);

    const defaultCities = City.getCitiesOfCountry("SA");
    setCities(defaultCities);
    const defaultStates = State.getStatesOfCountry("SA");
    setStates(defaultStates);
  }, []);
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
        region_id: selectedRegion?.value || null,
        governorate_id:
          selectedGovernorate?.value || null,
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
            {/* Region */}{" "}
            <div>
              {" "}
              <label className="block text-sm font-medium">
                {t("Region")}
              </label>{" "}
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
                      setSelectedGovernorate(null);
                      field.onChange(selected?.label);
                    }}
                    value={selectedRegion}
                    placeholder={t("Select region")}
                    isClearable
                  />
                )}
              />{" "}
              {errors.region && (
                <p className="text-red-600 text-sm mt-1">
                  {" "}
                  {errors.region.message}{" "}
                </p>
              )}{" "}
            </div>{" "}
            {/* Governorate */}{" "}
            <div>
              {" "}
              <label className="block text-sm font-medium">
                {" "}
                {t("Governorate")}{" "}
              </label>{" "}
              <Controller
                control={control}
                name="governorate"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={governorates.map((g) => ({
                      label: g.name,
                      value: g.id,
                    }))}
                    onChange={(selected) => {
                      setSelectedGovernorate(selected);
                      field.onChange(selected?.label);
                    }}
                    value={selectedGovernorate}
                    placeholder={
                      selectedRegion
                        ? t("Select governorate")
                        : t("Select region first")
                    }
                    isDisabled={!selectedRegion}
                    isClearable
                  />
                )}
              />{" "}
              {errors.governorate && (
                <p className="text-red-600 text-sm mt-1">
                  {" "}
                  {errors.governorate.message}{" "}
                </p>
              )}{" "}
            </div>{" "}
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
