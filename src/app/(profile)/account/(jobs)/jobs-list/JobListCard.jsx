"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { listingsApi } from "@/lib/api/listings";
import { useTranslation } from "react-i18next";
import { Eye, Users } from "lucide-react";

export default function JobListCard({ listing, actions }) {

  const { t } = useTranslation();

  return (
    <div className="bg-white rounded w-full max-w-[300px] sm:max-w-full shadow mb-6 mx-auto">
      <Link href={listing.link} className="block cursor-pointer">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center px-4">
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
            <p className="text-xs text-gray-500 mb-1">
             {t("Posted At:")} {new Date(listing.closingDate).toDateString()}
            </p>
            <p className="text-md font-semibold text-gray-800 mb-1">
              {listing.title}
            </p>
            <p className="text-xs text-gray-500 mb-1">
             {t("Description:")}  {listing.short_summary
    ? listing.short_summary.length > 250
      ? `${listing.short_summary.slice(0, 250)}...`
      : listing.short_summary
    : ""}
            </p>
          </div>
        </div>
      </Link>

      {/* Views / Watchers / Price */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-gray-600 px-4 sm:px-6">
        <div className="flex gap-6 mt-2 items-center">
          {/* <span>👁️‍🗨️ {listing.watchers} {t("watchers")}</span> */}
       <div className="flex items-center gap-4 text-gray-600 text-sm mt-2">
  <span className="flex items-center gap-1">
    <Eye size={16} className="text-gray-500" /> {listing.views} {t("views")}
  </span>
  <span className="flex items-center gap-1">
    <Users size={16} className="text-gray-500" /> {listing.job_applications_count} {t("Applicants")}
  </span>
</div>
        </div>
        <div className="text-right sm:text-left mt-2 sm:mt-0">
          <span className="text-xs text-gray-500 block">{t("Minimum Pay Amount")}</span>
          <span className="font-semibold text-gray-800 text-base">
            <span className="price">$</span>
            <span className="ml-1">{listing.price}</span>
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white border-t rounded-b-md shadow px-4 py-2 flex flex-col sm:flex-row justify-between text-sm text-gray-600 mt-2 gap-2">
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
