import React, { useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";

const getMaxDate = () => {
  const today = new Date();

  today.setDate(today.getDate() + 60);
  return today;
};

const PriceAndPayment = () => {
  const {
    register,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useFormContext();
  const buy_now_price = watch("buy_now_price");
  const quantity = watch("quantity") || 1;
  const payment_method_id = watch("payment_method_id") || 1;
  const allow_offers = watch("allow_offers");
  const start_price = watch("start_price");
  const reserve_price = watch("reserve_price");
  const expire_at = watch("expire_at");

  // Helper function to check if a date is today
  const isToday = (date) => {
    if (!date) return false;
    const now = new Date();
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  const handleQuantityChange = (delta) => {
    setValue("quantity", Math.max(1, Number(quantity) + delta), {
      shouldValidate: true,
    });
  };
  const { t } = useTranslation();

  // Clear reserve_price when start_price is empty
  useEffect(() => {
    if (!start_price || start_price.trim() === "") {
      setValue("reserve_price", "", { shouldValidate: false });
    }
  }, [start_price, setValue]);

  return (
    // <div className="w-[800px]">
    //   <h2 className="text-3xl font-bold mb-4">Price & Payment</h2>

    //   {/* Buy Now */}
    //   <div className="relative w-[500px] mb-4">
    //     <label className="block text-sm font-medium text-gray-700 mb-1">
    //       Buy Now <span className="text-gray-400">(optional)</span>
    //     </label>
    //     <div className="absolute inset-y-0 mt-6 ml-2 left-0 pl-3 flex items-center pointer-events-none">
    //       <span className="text-gray-500">$</span>
    //     </div>
    //     <input
    //       type="number"
    //       {...register("buy_now_price")}
    //       className={`w-full border pl-8 pr-4 py-2 rounded focus:outline-none focus:ring appearance-none
    //         [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
    //         ${
    //           errors.buy_now_price
    //             ? "border-red-500 focus:border-red-500"
    //             : "border-gray-300 focus:border-green-400"
    //         }`}
    //     />
    //   </div>
    //   {errors.buy_now_price && (
    //     <p className="text-red-500 text-sm -mt-10">
    //       {errors.buy_now_price.message}
    //     </p>
    //   )}

    //   {/* Allow Offers Checkbox */}
    //   <div className="mt-4">
    //     <label className="inline-flex items-center space-x-2">
    //       <input
    //         type="checkbox"
    //         {...register("allow_offers")}
    //         className="accent-green-500"
    //       />
    //       <span className="font-bold">Allow buyers to make an offer</span>
    //     </label>
    //     <p className="text-xs ml-5 text-gray-400">
    //       Offers can be made until the reserve price is met.
    //     </p>
    //   </div>
    //   {/* Start Price & Reserve Price */}
    //   <div className="grid grid-cols-2 gap-4 mt-4">
    //     <div>
    //       <label className="block text-sm font-medium text-gray-700 mb-1">
    //         Start price <span className="text-red-500">*</span>
    //       </label>
    //       <input
    //         type="number"
    //         {...register("start_price", { required: true })}
    //         placeholder="$"
    //         className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring ${
    //           errors.start_price
    //             ? "border-red-500 focus:border-red-500"
    //             : "border-gray-300 focus:border-green-400"
    //         }`}
    //       />
    //       {errors.start_price && (
    //         <p className="text-red-500 text-sm">{errors.start_price.message}</p>
    //       )}
    //     </div>
    //     <div>
    //       <label className="block text-sm font-medium text-gray-700 mb-1">
    //         Reserve price <span className="text-red-500">*</span>
    //       </label>
    //       <input
    //         type="number"
    //         {...register("reserve_price", { required: true })}
    //         placeholder="$"
    //         className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring ${
    //           errors.reserve_price
    //             ? "border-red-500 focus:border-red-500"
    //             : "border-gray-300 focus:border-green-400"
    //         }`}
    //       />
    //       {errors.reserve_price && (
    //         <p className="text-red-500 text-sm">
    //           {errors.reserve_price.message}
    //         </p>
    //       )}
    //     </div>
    //   </div>
    //   {/* Expiry DateTime Picker */}
    //   <div className="mt-6">
    //     <label className="block text-sm font-medium text-gray-700 mb-1">
    //       Offer Expiry Date & Time <span className="text-red-500">*</span>
    //     </label>
    //     <Controller
    //       control={control}
    //       name="expire_at"
    //       rules={{ required: true }}
    //       render={({ field }) => {
    //         return (
    //           <DatePicker
    //             {...field}
    //             selected={field.value}
    //             onChange={(date) =>
    //               setValue("expire_at", date, { shouldValidate: true })
    //             }
    //             showTimeSelect
    //             timeFormat="hh:mm aa"
    //             dateFormat="yyyy-MM-dd h:mm aa"
    //             minDate={new Date()}
    //             maxDate={getMaxDate()}
    //             className={`w-full min-w-[500px] border px-4 py-2 rounded focus:outline-none focus:ring
    //             [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
    //             ${
    //               errors.expire_at
    //                 ? "border-red-500 focus:border-red-500"
    //                 : "border-gray-300 focus:border-green-400"
    //             }`}
    //             placeholderText="Select date and time"
    //           />
    //         );
    //       }}
    //     />
    //     {errors.expire_at && (
    //       <p className="text-red-500 text-sm">{errors.expire_at.message}</p>
    //     )}
    //   </div>
    //   {/* Payment Methods */}
    //   <div className="">
    //     <h3 className="text-lg font-semibold mb-2 mt-10">
    //       Select payment method
    //     </h3>
    //     <div className="space-y-2">
    //       {[{ id: 1, method: "Cash" }].map((method) => {
    //         return (
    //           <div
    //             key={method.id}
    //             className="flex items-center w-96 h-14 space-x-2 bg-white border border-black rounded px-7 py-2"
    //           >
    //             <input
    //               type="radio"
    //               value={method.id}
    //               {...register("payment_method_id", { valueAsNumber: true })}
    //               checked={payment_method_id == method.id}
    //               className="accent-green-500"
    //             />
    //             <span>{method.method}</span>
    //           </div>
    //         );
    //       })}
    //     </div>
    //   </div>
    //   {/* More Options */}
    //   <h4 className="text-lg font-semibold mb-2 mt-10">More options</h4>
    //   <div className="flex items-center mb-2 space-x-4">
    //     <div className="flex border border-gray-300 rounded overflow-hidden">
    //       <button
    //         type="button"
    //         onClick={() => handleQuantityChange(-1)}
    //         className="w-10 bg-gray-300 text-black flex justify-center items-center"
    //       >
    //         −
    //       </button>
    //       <input
    //         type="number"
    //         {...register("quantity", { valueAsNumber: true })}
    //         value={Number(quantity)}
    //         onChange={(e) =>
    //           setValue("quantity", e.target.value, { shouldValidate: true })
    //         }
    //         className="w-24 text-center border-0 focus:outline-none"
    //         min="1"
    //       />
    //       <button
    //         type="button"
    //         onClick={() => handleQuantityChange(1)}
    //         className="w-10 bg-gray-300 text-black flex justify-center items-center"
    //       >
    //         +
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <div className="w-full max-w-3xl px-4 sm:px-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">
        {t("Price & Payment")}
      </h2>

      {/* Selling Type Dropdown */}
      <div className="w-full mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("How would you like to sell?")} <span className="text-red-500">*</span>
        </label>
        <select
          {...register("selling_type")}
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring ${errors.selling_type
            ? "border-red-500 focus:border-red-500"
            : "border-gray-300 focus:border-green-400"
            }`}
        >
          <option value="">{t("Select an option")}</option>
          <option value="auction">{t("Run an auction")}</option>
          <option value="buy_now">{t("Buy Now")}</option>
          <option value="both">{t("Both")}</option>
        </select>
        {errors.selling_type && (
          <p className="text-red-500 text-sm mt-1">{errors.selling_type.message}</p>
        )}
      </div>

      {/* Buy Now Price - shown if selling_type is 'buy_now' or 'both' */}
      {(watch("selling_type") === "buy_now" || watch("selling_type") === "both") && (
        <div className="relative w-full mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Buy Now Price")} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 price">$</span>
            </div>
            <input
              type="number"
              min="0"
              {...register("buy_now_price")}
              className={`w-full border pl-8 pr-4 py-2 rounded focus:outline-none focus:ring appearance-none
                [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
                ${errors.buy_now_price
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-green-400"
                }`}
            />
          </div>
          {errors.buy_now_price && (
            <p className="text-red-500 text-sm mt-1">
              {errors.buy_now_price.message}
            </p>
          )}
        </div>
      )}

      {/* Allow Offers - shown if selling_type includes buy_now */}
      {(watch("selling_type") === "buy_now" || watch("selling_type") === "auction" || watch("selling_type") === "both") && (
        <div className="mb-6">
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              {...register("allow_offers")}
              className="accent-green-500"
            />
            <span className="font-bold">
              {t("Allow buyers to make an offer")}
            </span>
          </label>
          <p className="text-xs ml-6 text-gray-400">
            {t("Offers can be made until the reserve price is met.")}
          </p>
        </div>
      )}

      {/* Start/Reserve Price - shown if selling_type is 'auction' or 'both' */}
      {(watch("selling_type") === "auction" || watch("selling_type") === "both") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("Start price")} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 price">$</span>
              </div>
              <input
                type="number"
                min="0"
                {...register("start_price")}
                className={`w-full border pl-8 pr-4 py-2 rounded focus:outline-none focus:ring 
                  [&::-webkit-inner-spin-button]:appearance-none 
                  [&::-webkit-outer-spin-button]:appearance-none 
                  [appearance:textfield]
                  ${errors.start_price
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-green-400"
                  } placeholder-price`}
              />
            </div>
            {errors.start_price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.start_price.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("Reserve price")} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 price">$</span>
              </div>
              <input
                type="number"
                min="0"
                disabled={!start_price}
                {...register("reserve_price")}
                className={`w-full border pl-8 pr-4 py-2 rounded focus:outline-none focus:ring
                  [&::-webkit-inner-spin-button]:appearance-none 
                  [&::-webkit-outer-spin-button]:appearance-none 
                  [appearance:textfield] 
                  ${errors.reserve_price
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-green-400"
                  } placeholder-price`}
              />
            </div>
            {errors.reserve_price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.reserve_price.message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Expiry Picker */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Offer Expiry Date & Time")}{" "}
          <span className="text-red-500">*</span>
        </label>
        <Controller
          control={control}
          name="expire_at"
          render={({ field }) => (
            <DatePicker
              {...field}
              selected={field.value}
              onChange={(date) =>
                setValue("expire_at", date, { shouldValidate: true })
              }
              showTimeSelect
              timeFormat="hh:mm aa"
              dateFormat="yyyy-MM-dd h:mm aa"
              minDate={new Date()}
              maxDate={getMaxDate()}
              filterTime={(time) => {
                const now = new Date();
                const selectedDate = field.value;
                if (selectedDate && isToday(selectedDate)) {
                  return time.getTime() >= now.getTime();
                }
                return true;
              }}
              className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring
            [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
            ${errors.expire_at
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-green-400"
                }`}
              placeholderText={t("Select date and time")}
            />
          )}
        />
        {errors.expire_at && (
          <p className="text-red-500 text-sm mt-1">
            {errors.expire_at.message}
          </p>
        )}
      </div>

      {/* Payment Method */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-2">
          {t("Select Payment Method")}
        </h3>
        <div className="space-y-3">
          {[{ id: 1, method: "Cash" }].map((method) => (
            <label
              key={method.id}
              className="flex items-center w-full sm:w-[300px] h-12 border border-gray-400 rounded-md px-4 py-2 space-x-3 bg-white"
            >
              <input
                type="radio"
                value={method.id}
                {...register("payment_method_id", { valueAsNumber: true })}
                checked={payment_method_id == method.id}
                className="accent-green-500"
              />
              <span>{t(method.method)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Quantity Control */}
      {/* <h4 className="text-lg font-semibold mb-2 mt-10">{t("More options")}</h4>
      <div className="flex items-center space-x-4">
        <div className="flex border border-gray-300 rounded overflow-hidden">
          <button
            type="button"
            onClick={() => handleQuantityChange(-1)}
            className="w-10 bg-gray-200 text-black text-lg flex justify-center items-center"
          >
            −
          </button>
          <input
            type="number"
            {...register("quantity", { valueAsNumber: true })}
            value={Number(quantity)}
            onChange={(e) =>
              setValue("quantity", e.target.value, { shouldValidate: true })
            }
            className="w-20 text-center border-0 focus:outline-none"
            min="1"
          />
          <button
            type="button"
            onClick={() => handleQuantityChange(1)}
            className="w-10 bg-gray-200 text-black text-lg flex justify-center items-center"
          >
            +
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default PriceAndPayment;
