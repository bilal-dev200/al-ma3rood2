"use client";

import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../ReuseableComponenets/Button";
import { useProfileStore } from "@/lib/stores/profileStore";
import { toast } from "react-toastify";
import { userApi } from "@/lib/api/user";
import { useAuthStore } from "@/lib/stores/authStore";
import { useTranslation } from "react-i18next";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { useLocationStore } from "@/lib/stores/locationStore";
import PhoneInput from "react-phone-input-2";

// const schema = yup.object().shape({
//   firstname: yup.string().required("Firstname is required"),
//   lastname: yup.string().required("Lastname is required"),
//   gender: yup.string().required("Gender is required"),
//   country: yup.string().required("Country is required"),
//   accountType: yup.string().required("Account type is required"),
//   businessName: yup.string().required("Business name is required"),
//   addressFinder: yup.string().required("Address finder is required"),
//   addressLine1: yup.string().required("Address line 1 is required"),
//   addressLine2: yup.string().required("Address line 2 is required"),
//   suburb: yup.string().required("Suburb is required"),
//   // city: yup.string().required("City is required"),
//   region: yup.string().required("Region is required"),
//   governorate: yup.string().required("Governorate is required"),
//   postCode: yup.string().required("Post code is required"),
//   closestDistrict: yup.string().required("Closest district is required"),
// });
const schema = yup.object().shape({
  firstname: yup.string().nullable(),
  lastname: yup.string().nullable(),
  gender: yup.string().nullable(),
  country: yup.string().nullable(),
  accountType: yup.string().nullable(),
  businessName: yup.string().when("accountType", {
    is: "business",
    then: (schema) => schema.required("Business name is required"),
    otherwise: (schema) => schema.nullable(),
  }),
  addressFinder: yup.string().nullable(),
  addressLine1: yup.string().nullable(),
  addressLine2: yup.string().nullable(),
  suburb: yup.string().nullable(),
  region: yup.string().nullable(),
  governorate: yup.string().required("Governorate is required"),
  postCode: yup.string().nullable(),
  closestDistrict: yup.string().nullable(),
});

const EditContactDetails = () => {
  const hideComponent = useProfileStore((state) => state.hideComponent);
  const { user, logout, updateUser } = useAuthStore();
  const { locations, getAllLocations } = useLocationStore();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstname: user?.first_name || "",
      lastname: user?.last_name || "",
      name: `${user?.firstname} ${user?.lastname}` || "",
      phone: user?.landline || "",
      mobile: user?.mobile || user?.phone || "",
      gender: user?.gender || "",
      accountType: user?.account_type || "",
      country: user?.country || "",
      businessName: user?.business_name || "",
      addressFinder: user?.address_finder || "",
      addressLine1: user?.address_1 || "",
      addressLine2: user?.address_2 || "",
      suburb: user?.suburb || "",
      postCode: user?.post_code || "",
      closestDistrict: user?.closest_district || "",
      city: user?.city || "",
      governorate: user?.governorates?.name || "",
      region: user?.regions?.name || "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();

    const regions_id = regions.find((r) => r.name == data.region);
    const governorates_id = governorates.find(
      (r) => r.name == data.governorate
    );

    // Validate region and governorate
    if (!regions_id) {
      toast.error("Please select a valid region");
      setLoading(false);
      return;
    }

    if (!governorates_id) {
      toast.error("Please select a valid governorate");
      setLoading(false);
      return;
    }

    formData.append("first_name", data.firstname);
    formData.append("last_name", data.lastname);
    formData.append("name", `${data.firstname} ${data.lastname}`);
    // formData.append("email", "abdullah@example.com"); // Replace with dynamic value if needed
    formData.append("phone", data.phone || "");
    formData.append("landline", data.mobile || "");
    formData.append("gender", data.gender || "");
    formData.append("account_type", data.accountType || "");
    formData.append("country", data.country || "");
    formData.append("business_name", data.businessName || "");
    formData.append("country_id", 1);
    formData.append("regions_id", regions_id.id);
    formData.append("governorates_id", governorates_id.id);
    formData.append("address_finder", data.addressFinder);
    formData.append("address_1", data.addressLine1);
    formData.append("address_2", data.addressLine2);
    formData.append("suburb", data.suburb);
    formData.append("post_code", data.postCode || "");
    formData.append("closest_district", data.closestDistrict || "");
    // formData.append(
    //   "billing_address",
    //   data.billingAddress || "Ma3rood Billing, XYZ Plaza"
    // );
    // formData.append("street_address", data.streetAddress || "Shahrah-e-Faisal");
    // formData.append("apartment", data.apartment || "Apartment 12B");
    // formData.append("city", data.city || "");
    // formData.append("state", data.state || "Sindh");
    formData.append("zip_code", data.postCode || "");
    formData.append("state", selectedState?.label || "");
    // formData.append("city", selectedCity?.label || "");

    try {
      const res = await userApi.contactDetail(user.id, formData);
      // updateUser({
      //   occupation: res.occupation,
      //   favourite_quote: res.favourite_quote,
      //   about_me: res.about_me
      //  });
      toast.success("Contact Detail updated successfully!");
      updateUser({
        first_name: res.data?.first_name || "",
        last_name: res.data?.last_name || "",
        name: `${res.data?.first_name} ${res.data?.last_name}` || "",
        mobile: res.data?.landline || "",
        phone: res.data?.phone || "",
        gender: res.data?.gender || "",
        account_type: res.data?.account_type || "",
        country: res.data?.country || "",
        business_name: res.data?.business_name || "",
        address_finder: res.data?.address_finder || "",
        address_1: res.data?.address_1 || "",
        address_2: res.data?.address_2 || "",
        suburb: res.data?.suburb || "",
        post_code: res.data?.post_code || "",
        closest_district: res.data?.closest_district || "",
        city: res.data?.city || "",
        governorates: res.data?.governorates || "",
        regions: res.data?.regions || "",
      });
      // Navigate back to previous page
      hideComponent();
    } catch (err) {
      const errorMessage =
        err?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      console.error("Contact Detail update error:", err);
    } finally {
      setLoading(false);
    }
  };
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState({
    label: "Saudi Arabia",
    value: "SA",
  });
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // const [states, setStates] = useState([]);
  // const [cities, setCities] = useState([]);
  const country = locations.find((c) => c.id == 1); // Saudi Arabia
  const regions = country?.regions || [];

  const governorates =
    regions.find((r) => r?.name === watch("region"))?.governorates || [];

  const cities =
    governorates.find((g) => g?.name === watch("governorate"))?.cities || [];

  useEffect(() => {
    getAllLocations();
  }, [getAllLocations]);

  // Watch region changes
  const currentRegion = watch("region");
  const prevRegionRef = React.useRef(currentRegion);

  // Reset governorate when region changes
  useEffect(() => {
    // Only reset if region actually changed (not on initial mount)
    if (prevRegionRef.current !== currentRegion && prevRegionRef.current !== undefined) {
      setValue("governorate", "");
    }
    prevRegionRef.current = currentRegion;
  }, [currentRegion, setValue]);
  // useEffect(() => {
  //   const allStates = State.getStatesOfCountry(selectedCountry.value);
  //   setStates(
  //     allStates.map((state) => ({
  //       label: state.name,
  //       value: state.isoCode,
  //     }))
  //   );
  //   const defaultCities = City.getCitiesOfCountry("SA");
  //   // setCities(
  //   //   defaultCities.map((city) => ({
  //   //     label: city.name,
  //   //     value: city.isoCode,
  //   //   }))
  //   // );
  //     const uniqueCities = defaultCities.filter(
  //   (city, index, self) =>
  //     index === self.findIndex((c) => c.name === city.name)
  // );

  // // setCities(uniqueCities);
  //     setCities(
  //       uniqueCities.map((city) => ({
  //         label: city.name,
  //         value: city.name,
  //       }))
  //     );
  //   const selectedCities = defaultCities.find((s) => s.name == user.city);
  //   // console.log("User",user.city)

  //   // console.log("Sele",selectedCities)
  //   const city = {
  //     label: selectedCities.name,
  //     value: selectedCities.name
  //   }
  //   setSelectedCity(city);

  //   // console.log("final", city)
  //   // setSelectedState(null);
  //   // setCities([]);
  // }, [selectedCountry]);
  // useEffect(() => {
  //   const selectedCities = cities.find((s) => s.name == user.city);
  //   setSelectedCity(selectedCities);
  //   console.log("selected", selectedCities);
  // }, [cities]);
  // useEffect(() => {
  //   if (selectedState) {
  //     const allCities = City.getCitiesOfState(
  //       selectedCountry.value,
  //       selectedState.value
  //     );
  //               // Remove duplicate cities by name
  // const uniqueCities = allCities.filter(
  //   (city, index, self) =>
  //     index === self.findIndex((c) => c.name === city.name)
  // );

  // // setCities(uniqueCities);
  //     setCities(
  //       uniqueCities.map((city) => ({
  //         label: city.name,
  //         value: city.name,
  //       }))
  //     );
  //     // setSelectedCity(null);
  //   }
  // }, [selectedState]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 ">
      <h2 className="text-2xl font-semibold mb-6">
        {t("Edit contact details")}
      </h2>

      <div className="-mt-3 p-6 bg-gray-50 rounded-lg">
        {/* Account Type */}
        {/* <h3 className="text-1xl font-semibold mb-2">{t("Account type")}</h3>
        <div className="mb-6 mt-2 p-4 bg-white rounded border border-gray-300">
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                {...register("accountType")}
                value="personal"
              />
              <span>{t("Personal use")}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                {...register("accountType")}
                value="business"
              />
              <span>{t("Business use")}</span>
            </label>
            {errors.accountType && (
              <p className="text-red-500 text-xs mt-1">
                {errors.accountType.message}
              </p>
            )}

            <p className="text-sm mt-3">
              {t(
                "Your account will have in-trade status, requiring additional obligations to buyers. A business account can't be manually changed back to a personal account"
              )}
            </p>
          </div>
        </div> */}

        {/* Primary Contact Person */}
        <h3 className="text-md font-semibold mb-4">
          {t("Primary contact person")}
        </h3>
        <div className="mb-6 p-4 bg-white rounded">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstname" className="block text-sm mb-1">
                {t("Firstname")} <span className="text-red-500">*</span>
              </label>
              <input
                id="firstname"
                {...register("firstname")}
                className="w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors?.firstname && (
                <p className="text-red-500 text-xs mt-1">
                  {errors?.firstname.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="lastname" className="block text-sm mb-1">
                {t("Lastname")} <span className="text-red-500">*</span>
              </label>
              <input
                id="lastname"
                {...register("lastname")}
                className="w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors?.lastname && (
                <p className="text-red-500 text-xs mt-1">
                  {errors?.lastname.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Landline */}
            <div className="mt-4">
              <h4 className="text-sm mb-2">{t("Landline")} (optional)</h4>
              <div className="flex items-center gap-2">
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      {...field}
                      value={field.value || ""}
                      className="w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  )}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Mobile */}
            <div className="mt-4 pt-1">
              {/* <h4 className="text-sm font-semibold mb-2">
                {t("Mobile")} (optional)
              </h4> */}
              <Controller
                name="mobile"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    country="sa"
                    onlyCountries={["sa"]}
                    disableDropdown
                    countryCodeEditable={false}
                    value={field.value || ""}
                    onChange={(value) => field.onChange(value)} // ✅ update field value properly
                    inputClass={`w-full p-2 border rounded-md ${
                      errors.mobile ? "border-red-500" : "border-gray-300"
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
            </div>
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">
                {errors.mobile.message}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="mt-4">
            <h4 className="text-sm mb-2">{t("Gender")}</h4>
            <div className="flex flex-wrap gap-6 items-center">
              <label className="flex items-center space-x-2">
                <input type="radio" {...register("gender")} value="male" />
                <span>{t("Male")}</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" {...register("gender")} value="female" />
                <span>{t("Female")}</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" {...register("gender")} value="other" />
                <span>{t("Rather not say")}</span>
              </label>
            </div>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>
        </div>

        {/* Business Name */}
        {/* {watch("accountType") === "business" && (
          <>
        <h3 className="text-md font-semibold mb-2">{t("Business details")}</h3>
        <div className="mb-6 p-4 bg-white rounded border border-gray-300">
          <h3 className="text-md font-semibold mb-2">{t("Business Name")}</h3>
          <input
            type="text"
            {...register("businessName")}
            placeholder={t("Business name")}
            className="border border-gray-300 rounded-[10px] px-3 py-2 w-64"
          />
          {errors.businessName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.businessName.message}
            </p>
          )}
        </div>
        </>
        )} */}

        {/* Street address */}
        <h3 className="text-md mb-2 font-semibold">{t("Street address")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 p-4 bg-white rounded">
          <div className="mb-4 w-full">
            <label className="text-sm mb-1 block">{t("Country")}</label>
            <Select
              isDisabled
              value={selectedCountry}
              options={[{ label: t("Saudi Arabia"), value: "SA" }]}
              className="w-full"
              onChange={setSelectedCountry}
            />
          </div>

          <div className="mb-4 w-full">
            <label className="text-sm mb-1 block">{t("Region")}</label>
            <Controller
              name="region"
              control={control} // from useForm()
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
            {errors.region && (
              <p className="text-red-500 text-xs mt-1">
                {errors.region.message}
              </p>
            )}
          </div>

          <div className="mb-4 w-full">
            <label className="text-sm mb-1 block">
              {t("Governorate")} <span className="text-red-500">*</span>
            </label>
            <Controller
              name="governorate"
              control={control} // from useForm()
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
            {errors.governorate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.governorate.message}
              </p>
            )}
          </div>

          {/* <div className="mt-6 space-y-4"> */}
          {/* <div>
              <h4 className="text-sm mb-1">
                {t("Address Finder")}
              </h4>
              <input
                type="text"
                {...register("addressFinder")}
                placeholder={t("Search for your address")}
                className="w-64 border border-gray-300 rounded-[10px] px-3 py-2"
              />
              {errors.addressFinder && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.addressFinder.message}
                </p>
              )}
            </div> */}
          <div className="col-span-full">
            <h4 className="text-sm mb-1">{t("Address")}</h4>
            <textarea
              {...register("addressLine1")}
              placeholder={t("Enter address")}
              className="w-full border border-gray-300 rounded-[10px] px-3 py-2 h-24"
            />
            {errors.addressLine1 && (
              <p className="text-red-500 text-xs mt-1">
                {errors.addressLine1.message}
              </p>
            )}

            {/* <br />
              <input
                type="text"
                {...register("addressLine2")}
                placeholder={t("Address line 2")}
                className="w-64 border mt-3 border-gray-300 rounded-[10px] px-3 py-2"
              />
              {errors.addressLine2 && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.addressLine2.message}
                </p>
              )} */}
          </div>
          {/* <div>
              <h4 className="text-sm font-semibold mb-1">
                {t("Suburb (optional)")}
              </h4>
              <input
                type="text"
                {...register("suburb")}
                placeholder={t("Suburb")}
                className="w-64 border border-gray-300 rounded-[10px] px-3 py-2"
              />
              {errors.suburb && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.suburb.message}
                </p>
              )}
            </div> */}
          {/* <div>
              <h4 className="text-sm font-semibold mb-1">{t("City")}</h4>
              <input
                type="text"
                {...register("city")}
                placeholder={t("City")}
                className="w-64 border border-gray-300 rounded-[10px] px-3 py-2"
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.city.message}
                </p>
              )}
            </div> */}
          {/* <div>
              <h4 className="text-sm font-semibold mb-1">{t("State")}</h4>
              <Select
                options={states}
                value={selectedState}
                onChange={setSelectedState}
                className="w-64"
                placeholder="Select state"
                isSearchable
              />
            </div> */}

          {/* <div className="mt-4">
              <h4 className="text-sm font-semibold mb-1">{t("City")}</h4>
              <Select
                options={cities}
                value={selectedCity}
                onChange={setSelectedCity}
                className="w-64"
                placeholder="Select city"
                isSearchable
              />
            </div> */}

          {/* <div>
              <h4 className="text-sm font-semibold mb-1">{t("Post Code")}</h4>
              <input
                type="text"
                {...register("postCode")}
                placeholder={t("Post Code")}
                className="w-64 border border-gray-300 rounded-[10px] px-3 py-2"
              />
              {errors.postCode && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.postCode.message}
                </p>
              )}
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-1">
                {t("Closest District")}
              </h4>
              <input
                type="text"
                {...register("closestDistrict")}
                placeholder={t("Closest District")}
                className="w-64 border border-gray-300 rounded-[10px] px-3 py-2"
              />
              {errors.closestDistrict && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.closestDistrict.message}
                </p>
              )}
            </div> */}
          {/* </div> */}
        </div>

        <div className="md:col-span-2 flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? t("Saving...") : t("Save")}
          </Button>
          <Button type="button" onClick={hideComponent}>
            {t("Go Back")}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EditContactDetails;
