import React from "react";
import Button from "../ReuseableComponenets/Button";
import { FaPaypal, FaCcVisa } from "react-icons/fa";
import { SiVisa } from "react-icons/si";
import { useTranslation } from "react-i18next";

const UserBalance = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left: Balance Box */}
      <div className="bg-[#FAFAFA] rounded-lg p-6 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-2">{t("My balances")}</h2>
        <p className="text-2xl font-semibold mt-5 mb-1">
          {t("Ma3rood balance")}
        </p>
        <h1 className="text-3xl font-semibold mb-4 price">$</h1>
        <a href="#" className="text-green-500 text-sm mb-4 underline">
          {t("View account statement")}
        </a>
        {/* <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-4">
          Credit my account
        </button> */}
        <Button className="mt-4" title={t("Credit My account")} />
      </div>

      {/* Right: PayPal & Visa Cards */}
      <div className="md:col-span-2 flex flex-col gap-4">
        {/* PayPal Card */}
        <div className="bg-[#FAFAFA]  rounded-md p-7 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">
              {t("Safe/instant payments")}
            </p>
            <div className=" items-center mb-1">
              <FaPaypal className="text-green-600 text-4xl mr-2" />
              {/* <span className="price">$</span>{Number(bid.amount).toLocaleString()} */}

              <span className="text-2xl font-semibold mt-10 price">$</span>

              <span className="text-2xl font-semibold">0000</span>
            </div>
            <a href="#" className="text-green-500 font-semibold text-sm">
              {t("what is pay pal?")}
            </a>
          </div>
          {/* <button className="border border-green-500 text-green-500 px-4 py-2 rounded-md hover:bg-green-50">
            manage paypal
          </button> */}
          <Button className="mt-20" title={t("manage paypal")} />
        </div>

        {/* Visa Card */}
        <div className="bg-[#FAFAFA] rounded-md p-8 flex items-center justify-between">
          <div>
            <div className="flex items-center mb-1">
              <SiVisa className="text-green-800 text-7xl" />
            </div>
            <a href="#" className="text-green-500 text-sm font-semibold ">
              {t("what's visa")}
            </a>
          </div>
          {/* <button className="border border-green-500 text-green-500 px-4 py-2 rounded-md hover:bg-green-50">
             paypalmanage
          </button> */}
          <Button className="mt-14" title={t("manage paypal")} />
        </div>
      </div>
    </div>
  );
};

export default UserBalance;
