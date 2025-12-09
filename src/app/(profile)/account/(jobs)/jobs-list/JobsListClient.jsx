"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import JobListCard from "./JobListCard";
import { Image_URL } from "@/config/constants";
import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";
import { useTranslation } from "react-i18next";
import { JobsApi } from "@/lib/api/job-listing";

export default function JobsListClient() {
  const router = useRouter();
  const { t } = useTranslation();
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await JobsApi.getUserListings({});
      setAllListings(response || []);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const items = [
    { label: "Home", href: "/" },
    { label: "Account", href: "/account" },
    { label: "Job Listings" },
  ];

  return (
    <div className="min-h-screen text-gray-800">
      <Breadcrumbs
        items={items}
        styles={{
          nav: "flex justify-start text-sm font-medium bg-white border-b border-gray-200 py-2",
        }}
      />

      <h1 className="text-2xl font-bold text-green-600 uppercase mb-1 mt-5">
        {t("Jobs List")}
      </h1>
      <p className="text-sm mb-4 mt-3">
        {allListings.length} {t("listings")}
      </p>

      {loading ? (
        <p className="text-sm text-gray-500">{t("Loading Listings...")}</p>
      ) : allListings.length === 0 ? (
        <p className="text-sm text-gray-500">{t("No listings found.")}</p>
      ) : (
        allListings.map((listing) => {
          const rawPath = listing.media_files?.[0]?.file_path;
          const cleanedPath = rawPath ? rawPath.replace(/\\/g, "/") : null;
          const finalImageUrl = cleanedPath
            ? `${Image_URL}${cleanedPath}`
            : "/default-image.jpg";

          return (
            <JobListCard
              key={listing.id}
              listing={{
                id: listing.id,
                title: listing.title,
                price: listing.minimum_pay_amount || "N/A",
                views: listing.view_count || 0,
                job_applications_count: listing.job_applications_count || 0,
                watchers: 0,
                short_summary: listing?.short_summary,
                offers: listing.selling_offers || [],
                slug: listing.slug,
                closingDate: listing.created_at || "",
                image: finalImageUrl,
                link: `/jobs/${listing.slug}`,
              }}
              actions={[
                {
                  label: t("Edit listing"),
                  href: `/listing/viewJob?slug=${listing?.slug}`,
                },
                {
                  label: (
                    <span className="flex items-center gap-1">
                      {t("Show Applicants")}
                    </span>
                  ),
                  href: `/account/jobs-list/${listing?.id}/applicantsForMyJob`,
                },
              ]}
            />
          );
        })
      )}
    </div>
  );
}
