"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";
import { listingsApi } from "@/lib/api/listings";
import { JobsApi } from "@/lib/api/job-listing";
import { Image_URL } from "@/config/constants";
import JobListCard from "./JobListCard";
import WithdrawDialog from "@/components/WebsiteComponents/ReuseableComponenets/WithdrawDialog";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

export default function JobsListClient() {
  const router = useRouter();
  const { t } = useTranslation();

  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await JobsApi.getUserListingsApplied();
      setAllListings(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetails = (listing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedListing(null);
    setIsModalOpen(false);
  };

  const items = [
    { label: "Home", href: "/" },
    { label: "Account", href: "/account" },
    { label: "Applied Job Listings" },
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
        {t("Applied Jobs List")}
      </h1>
      <p className="text-sm mb-4 mt-3">
        {allListings.length} {t("listings")}
      </p>

      {loading ? (
        <p className="text-sm text-gray-500">{t("loadingListings...")}</p>
      ) : allListings.length === 0 ? (
        <p className="text-sm text-gray-500">{t("No listings found.")}</p>
      ) : (
        allListings.map((listing) => {
          const rawPath = listing.job.media_files?.[0]?.file_path;
          const cleanedPath = rawPath ? rawPath.replace(/\\/g, "/") : null;
          const finalImageUrl = cleanedPath
            ? `${Image_URL}${cleanedPath}`
            : "/default-image.jpg";

          return (
            <JobListCard
              key={listing.id}
              listing={{
                id: listing.id,
                title: listing?.job?.title,
                company: listing?.job?.company_name,
                price: listing.minimum_pay_amount || "N/A",
                short_summary: listing.job?.short_summary,
                views: listing.view_count || 0,
                watchers: 0,
                offers: listing.selling_offers || [],
                slug: listing.job?.slug,
                closingDate: listing.created_at || "",
                image: finalImageUrl,
                link: `/jobs/${listing.job?.slug}`,
              }}
              actions={[
                { label: t("View listing"), href: `/jobs/${listing.job?.slug}` },
                {
                  label: (
                    <span className="flex items-center gap-1">
                      {t("Show Details")}
                    </span>
                  ),
                  onClick: () => handleShowDetails(listing),
                },
              ]}
            />
          );
        })
      )}

      {/* Withdraw Dialog */}
      <WithdrawDialog
        isOpen={openWithdrawDialog}
        onClose={() => setOpenWithdrawDialog(false)}
        onWithdraw={() => handleWithdraw(selectedListing)}
      />

      {/* Details Modal */}
      {isModalOpen && selectedListing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
              <X size={22} />
            </button>

            <h2 className="text-xl font-semibold text-green-700 mb-4">
             Submitted Details
            </h2>

            <div className="space-y-3">
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {selectedListing.full_name || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {selectedListing.email || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {selectedListing.phone || "N/A"}
              </p>

              <div className="flex flex-col gap-2 mt-3">
                {selectedListing.cv?.file_path && (
                    <div className="flex gap-2">
                          <span className="font-semibold">CV:</span>{" "}
                  <a
                    href={`${Image_URL}${selectedListing.cv.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View CV
                  </a>
                  </div>
                )}

                {selectedListing.cl?.file_path && (
                    <div className="flex gap-2">  
                    <span className="font-semibold">Cover Letter:</span>{" "}
                  <a
                    href={`${Image_URL}${selectedListing.cl.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Cover Letter
                  </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
