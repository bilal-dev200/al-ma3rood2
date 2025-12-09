"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function SoldListingCard({ listingObj, listing, actions }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded w-full max-w-[300px] sm:max-w-full shadow mb-6 mx-auto">
      <Link href={listing.link} className="block cursor-pointer">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4">
          {/* Image */}
          <div className="w-full sm:w-28 h-40 relative">
            <Image
              src={listing.image}
              alt={listing.title}
              fill
              className="object-contain rounded"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <p className="text-md font-semibold text-gray-800 mb-1">
              {listing.title}
            </p>
            <p className="text-xs text-gray-500 mb-1">
              {t("Sold on")}{" "}
              {new Date(listing.soldDate).toLocaleString("en-US", {
                timeZone: "Asia/Riyadh", // Use Saudi Arabia's timezone
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <p className="text-xs text-gray-600 mb-1">
              Customer Name:{" "}
              <span className="text-red-400 text-xs">
                {listing?.winner_name || "Not Available"}
              </span>
            </p>

            {/* {listing?.winner_name ? (
              <p className="text-sm text-gray-600 mb-1">
                 {t("Customer Name")}:{" "}
                <span className="font-medium">{listing.winner_name}</span>
              </p>
            ) : (
              <p className="text-sm text-gray-600 mb-1">
               {t("Customer Name")}:{" "}
                <span className="text-red-400">{t("Not Available")}</span>
              </p>
            )} */}
          </div>

          {/* Price */}
          <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 sm:ml-auto text-sm text-gray-600">
            <span className="text-xs text-gray-500">{t("Sold Now")}</span>
            <span className="font-semibold text-gray-800 text-base">
              <span className="price">$</span>
              <span className="ml-1">
                {listing.price || listingObj.winning_bid?.amount}
              </span>
            </span>
          </div>
        </div>
      </Link>

      {/* Actions */}
      <div
        className={`border-t rounded-b-md px-4 py-2 flex flex-col sm:flex-row items-center text-sm text-gray-600 gap-2 sm:gap-4 ${
          actions.length === 1 ? "justify-center" : "justify-between"
        }`}
      >
        {actions.map((action, idx) =>
          action.href ? (
            <Link key={idx} href={action.href} className="hover:underline">
              {action.label}
            </Link>
          ) : (
            <button
              key={idx}
              onClick={action.onClick}
              className="hover:underline"
            >
              {action.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}
