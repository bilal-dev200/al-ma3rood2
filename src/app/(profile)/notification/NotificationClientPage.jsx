// src/app/(profile)/account/notification/NotificationClientPage.js

"use client";
import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import Image from "next/image";
import Button from "@/components/WebsiteComponents/ReuseableComponenets/Button";
import { userApi } from "@/lib/api/user";
import { toast } from "react-toastify";
import { Image_NotFound, Image_URL } from "@/config/constants";
import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

const NotificationClientPage = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await userApi.userNotification();
      setNotifications(response.data || []);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const items = [
    { label: "Home", href: "/" },
    { label: "Account", href: "/account" },
    { label: "Notification" },
  ];

  const handleRemove = async (id) => {
    try {
      await userApi.userReadNotification(id);
      toast.success(t("Notification marked as read!"));
      setNotifications((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      toast.error(t("Failed to mark notification as read."));
    }
  };
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const markAllAsRead = async () => {
    try {
      const ids = notifications.map((n) => n.id);
      await Promise.all(ids.map((id) => userApi.userReadNotification(id)));
      toast.success(t("Notification marked as read!"));
      setNotifications([]);
    } catch (error) {
      toast.error(t("Failed to mark notification as read."));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-6 text-gray-800">
        <p>{t("Loading Notifications")}</p>
      </div>
    );
  }
  return (
    <>
      <Breadcrumbs
        items={items.map((item) => ({ ...item, label: t(item.label) }))}
        styles={{
          nav: "flex justify-start text-sm font-medium bg-white border-b border-gray-200 py-2",
        }}
      />

      <div className="min-h-screen px-4 py-6 text-gray-800">
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <h2 className="text-2xl font-bold text-green-700">
            {t("NOTIFICATIONS")}
          </h2>
          <button
            onClick={markAllAsRead}
            className="text-sm text-green-600 hover:underline"
          >
            {t("Mark all as read")}
          </button>
        </div>

        <p className="mb-6">
          {t("You have")} {notifications.length} {t("new notification(s).")}
        </p>

        {notifications.map((item) => {
          const isRead = item.read_at !== null;
          
          const handleNotificationClick = () => {
            if (!item.listing) return;
            
            const listing = item.listing;

            // console.log("notification listing", listing);
            
            // Check listing.type first for service and job
            if (listing.type === "service") {
              router.push(`/services/${listing?.slug}`);
              return;
            }
            
            if (listing.type === "job") {
              router.push(`/jobs/${listing?.slug}`);
              return;
            }

            // Then check listing_type for marketplace, property, and motors
            const catSlug = listing.category?.slug?.includes("/")
              ? listing.category.slug.split("/").pop()
              : listing.category?.slug || "unknown";

            switch (listing.listing_type) {
              case "marketplace":
                router.push(`/marketplace/${catSlug}/${listing?.slug}`);
                break;
              case "property":
              case "motors":
                router.push(`/${listing.listing_type}/${listing?.slug}`);
                break;
              default:
                console.warn("Unknown listing type:", listing.listing_type, listing.type);
                break;
            }
          };

          return (
            <div
              key={item.id}
              onClick={handleNotificationClick}
              className={`bg-white rounded-md shadow p-4 relative w-full max-w-xl mb-6 cursor-pointer hover:shadow-lg transition-shadow ${
                isRead ? "opacity-75" : ""
              }`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(item.id);
                }}
                className={`absolute top-2 ${
                  isRTL ? "left-2" : "right-2"
                } ${isRead ? "text-gray-400 hover:text-gray-600" : "text-green-600 hover:text-green-800"} z-10`}
                title={t("Mark as read")}
              >
                <FaBell />
              </button>

              {/* <p className="text-sm font-semibold text-gray-600 mb-2">
                {item.status || item.type || t("Notification")}
              </p> */}

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Image
                  src={
                    item.listing?.images?.[0]?.image_path
                      ? `${Image_URL}${item.listing.images[0].image_path}`
                      : Image_NotFound
                  }
                  alt={item.data?.title || item.listing?.title || "Notification"}
                  width={100}
                  height={100}
                  className="object-cover rounded"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className={`font-bold text-md mb-1 ${
                      isRead ? "text-gray-500" : "text-black"
                    }`}>
                      {item.data?.title || item.listing?.title || t("Notification")}
                    </h3>
                    <p className="text-sm text-gray-700 mb-4">
                      {item.data?.message || item.message || item.listing?.title || t("No message available")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default NotificationClientPage;
