"use client";
import Button from "@/components/WebsiteComponents/ReuseableComponenets/Button";
import React, { useState } from "react";
import { FiToggleLeft, FiToggleRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const page = () => {
  const [searchToggle, setSearchToggle] = useState(false);

  const apiFlags = {
    email: false,
    search: false,
    recentlyViewed: true,
    blacklist: false,
    payment: false,
    inTrade: false,
    firearms: true,
  };

  const sections = [
    {
      key: "email",
      title: "Email",
      description: "Manage and update your email preferences.",
      buttonText: "Update email preferences",
      onClick: () => alert("Opening email settings..."),
    },
    {
      key: "search",
      title: "Search",
      description: "Clear your search history.",
      buttonText: "Delete search history",
      onClick: () => alert("Deleting search history..."),
    },
    {
      key: "recentlyViewed",
      title: "Recently viewed listings",
      description: (
        <>
          View, update, or remove history.{" "}
          <span className="text-green-500 underline cursor-pointer">
            Learn more
          </span>
        </>
      ),
      buttonText: "Remove history",
      onClick: () => alert("Removing recently viewed listings..."),
    },
  ];

  const options = [
    {
      key: "blacklist",
      title: "Blacklist",
      description:
        "Your blacklist is private. If a blacklisted member tries to participate in your listing, they will be told that they have been blacklisted.",
      button: "Add a member to my Blacklist",
    },
    {
      key: "payment",
      title: "Payment instructions",
      description:
        "Manage and update the payment instructions that are sent when a listing sells.",
      button: "Edit payment instructions",
    },
    {
      key: "inTrade",
      title: "In-trade status",
      description:
        "You are currently set as not in-trade. If you want to find out more about being in-trade – check out our article.",
      button: "Change in trade status",
      link: {
        text: "find out more about being in-trade",
        href: "#",
      },
    },
    {
      key: "firearms",
      title: "Firearms licence",
      description:
        "You have no firearms licence saved. Your licence will be used for future firearms sales.",
      button: "Change in trade status",
      link: {
        text: "learn more",
        href: "#",
      },
    },
  ];
const { t } = useTranslation();

  return (
    <div className="mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#469BDB] mb-2 uppercase">{t("Settings")}</h1>
      <h2 className="text-xl font-medium mt-4">{t("General")}</h2>

      {/* Top section: General */}
      {sections.map((section, index) => {
        const isEnabled = apiFlags[section.key];

        return (
          <div
            key={index}
            onClick={() => {
              if (!isEnabled) {
                alert("Not allowed – Feature not available yet.");
              }
            }}
            className={`border border-[#7B7B7B] rounded-md p-6 shadow-sm space-y-4 w-[600px] bg-white transition ${
              !isEnabled
                ? "cursor-not-allowed hover:bg-gray-100 opacity-90"
                : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">{t(section.title)}</h3>
            </div>

            <div className="text-sm text-gray-600 flex items-center gap-2">
              {section.title === "Search" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent div click
                    if (!apiFlags.search) {
                      alert("Not allowed – Search toggle disabled.");
                      return;
                    }
                    setSearchToggle(!searchToggle);
                  }}
                  className={`text-xl text-gray-600 ${
                    !apiFlags.search ? "cursor-not-allowed" : ""
                  }`}
                >
                  {searchToggle ? <FiToggleRight /> : <FiToggleLeft />}
                </button>
              )}
              <p>{t(section.description)}</p>
            </div>

            <Button
              onClick={(e) => {
                e.stopPropagation(); // prevent div click
                if (!isEnabled) {
                  alert("Not allowed – Button action disabled.");
                  return;
                }
                section.onClick();
              }}
              className="w-[260px]"
              title={t(section.buttonText)}
            />
          </div>
        );
      })}

      <h2 className="text-xl font-medium mt-4">{t("Selling options")}</h2>

      {options.map((item, index) => {
        const isEnabled = apiFlags[item.key];

        return (
          <div
            key={index}
            onClick={() => {
              if (!isEnabled) {
                alert("Not allowed – Feature coming soon.");
              }
            }}
            className={`border border-[#7B7B7B] rounded-md p-6 shadow-sm space-y-4 w-[600px] bg-white transition ${
              !isEnabled
                ? "cursor-not-allowed hover:bg-gray-100 opacity-90"
                : "hover:bg-gray-50"
            }`}
          >
            <h2 className="text-lg font-medium mb-2">{t(item.title)}</h2>
            <p className="text-sm text-gray-600 mb-3">
              {t(item.description)}{" "}
              {item.link && (
                <a
                  onClick={(e) => e.stopPropagation()}
                  href={item.link.href}
                  className="text-green-500 underline"
                >
      {t(item.link.text)}
                </a>
              )}
            </p>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                if (!isEnabled) {
                  alert("Not allowed – Feature not ready.");
                  return;
                }
                alert(`Clicked: ${item.button}`);
              }}
              title={t(item.button)}
              className="w-[260px]"
            />
          </div>
        );
      })}
    </div>
  );
};

export default page;
