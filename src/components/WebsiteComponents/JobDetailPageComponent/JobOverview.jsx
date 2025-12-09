"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";
import JobApplicationModal from "./modals/job-application-modal";
import ShareListingModal from "./modals/share-listing-modal";
import { useAuthStore } from "@/lib/stores/authStore";

export default function JobOverview({ product }) {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  if (!product) return null;

  // ✅ Extract data from API response
  const {
    title,
    company_name,
    region,
    governorate,
    work_type,
    minimum_pay_amount,
    minimum_pay_type,
    company_benefits,
    short_summary
  } = product;

  // ✅ Create info list dynamically
  const details = [
    {
      label: "Location",
      value: `${governorate?.name || "N/A"}, ${region?.name || "N/A"}`,
    },
    { label: "Job Type", value: work_type ? work_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "N/A" || "N/A" },
    {
      label: "Pay",
      value: minimum_pay_amount
        ? `${minimum_pay_amount} ${minimum_pay_type}`
        : "Not specified",
    },
    { label: "Company Benefits", value: company_benefits || "N/A" },
  ];

  const handleApplyClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          {/* Left Side */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>

            <div className="flex items-center text-gray-500 text-sm flex-wrap gap-2">
              <span>{company_name}</span>
              <span>|</span>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>
                  {governorate?.name}, {region?.name}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side Buttons */}
          <div className="flex space-x-3 mt-6 md:mt-0">
            <button
              onClick={() => setShowShareModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md text-sm"
            >
              Share
            </button>
            {console.log(product?.user?.id, user?.id)}
            {product?.user?.id !== user?.id && (
            <button
              onClick={handleApplyClick}
              className="bg-[#175f48] hover:bg-blue-600 text-white px-5 py-2 rounded-md text-sm"
            >
              Apply Now
            </button>
            )}
          </div>
        </div>

        {/* Job Info Grid */}
        <div className="mt-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {details.map((item, index) => (
              <div key={index} className="border-l-2 pl-4">
                <h4 className="text-base font-semibold text-gray-900">
                  {item.label}
                </h4>
                <p className="text-sm text-gray-500">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Job Description */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Job Description
          </h3>
          <p className="text-gray-600 leading-relaxed">{short_summary}</p>
        </div>

        {/* Recruiter Info */}
        <div className="mt-10 bg-gray-50 p-4 rounded-md">
          <h4 className="text-lg font-semibold text-gray-800 mb-1">
            Recruiter: {product?.user?.name}
          </h4>
          <p className="text-gray-600 text-sm">
            Contact: {product.contact_email || "N/A"} |{" "}
            {product.contact_phone || "N/A"}
          </p>
        </div>
      </div>

      {/* Modals */}
      <JobApplicationModal isOpen={isModalOpen} onClose={handleCloseModal} jobId={product.id} />
      <ShareListingModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </>
  );
}
