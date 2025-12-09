"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { userApi } from "@/lib/api/user";
import { useAuthStore } from "@/lib/stores/authStore";
import Image from "next/image";
import { Image_URL, Image_NotFound } from "@/config/constants";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Link from "next/link";

export default function FeedbackCard() {
  const [activeTab, setActiveTab] = useState("all");
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    if (!user?.id) return;

    setLoading(true);
    userApi
      .userFeedback(user.id)
      .then((res) => {
        const apiFeedbacks = res?.data?.feedbacks || [];

        const processed = apiFeedbacks.map((fb) => ({
          ...fb,
          username: fb.reviewer?.username || "Anonymous",
        }));

        setFeedbacks(processed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching feedbacks:", err);
        setLoading(false);
      });
  }, [user?.id]);

  // Filtered data
  const filteredData =
    activeTab === "all"
      ? feedbacks
      : feedbacks.filter((item) => item.type === activeTab);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      {/* Tabs */}
      <div className="flex items-center gap-6 mb-6">
        {["all", "buying", "selling"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1); // reset page on tab change
            }}
            className={`capitalize ${
              activeTab === tab
                ? "text-green-600 border-b-2 border-green-600 font-semibold"
                : "text-gray-500 hover:text-green-600"
            }`}
          >
            {t(tab)}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <p className="text-center text-gray-500">Loading feedback...</p>
      )}

      {/* Feedback Grid */}
      {!loading && currentData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentData.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 flex items-start gap-4"
            >
              {/* <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0">
                <Image
                  src={
                    item.reviewer?.profile_picture
                      ? `${Image_URL}/${item.reviewer.profile_picture}`
                      : Image_NotFound
                  }
                  alt={item.username}
                  width={48}
                  height={48}
                  className="rounded-full object-cover w-12 h-12"
                />
              </div> */}
              <div className="w-12 h-12 flex-shrink-0">
                {item.reviewer?.profile_picture ? (
                  <Image
                    src={`${Image_URL}/${item.reviewer.profile_picture}`}
                    alt={item.username}
                    width={48}
                    height={48}
                    className="rounded-full object-cover w-12 h-12"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                    {item.username?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold`">{item.username}</span>

                  <span className="text-yellow-500 flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => {
                      const full = Math.floor(item.rating);
                      const isHalf = item.rating - full >= 0.5;
                      if (i < full) {
                        return <FaStar key={i} />;
                      } else if (i === full && isHalf) {
                        return <FaStarHalfAlt key={i} />;
                      } else {
                        return <FaRegStar key={i} />;
                      }
                    })}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mt-2">{item.review}</p>
                <div className="flex justify-between w-full">
                  <p className="text-xs text-gray-500 mt-2">{item.date}</p>

                  <Link
                    key={item?.id}
                    href={`/marketplace/${item?.listing?.category?.slug}/${item?.listing?.slug}`}
                  >
                    <p className="text-xs text-blue-600 hover:underline mt-2">
                      {item?.listing?.title}
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <p className="text-center text-gray-400">No feedback found.</p>
        )
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <FiChevronLeft />
          </button>

          {/* Current Page Number Only */}
          <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded">
            {currentPage}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
