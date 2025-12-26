"use client";
import React, { useEffect, useState } from "react";
import {
  FiClock
} from "react-icons/fi";
import Button from "@/components/WebsiteComponents/ReuseableComponenets/Button";
import WithdrawDialog from "@/components/WebsiteComponents/ReuseableComponenets/WithdrawDialog";
import { useSearchParams } from "next/navigation";
import { listingsApi } from "@/lib/api/listings";
import { Image_URL } from "@/config/constants";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useAuthStore } from "@/lib/stores/authStore";

const Page = () => {
  const { user } = useAuthStore();
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);
  const [listing, setListing] = useState(null);
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const router = useRouter();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/");
    }
  }, [router]);

  // ✅ Protect: Only creator can edit
  useEffect(() => {
    if (listing && user) {
      if (user.id !== listing.creator.id) {
        toast.error("You are not authorized to view this listing.");
        router.replace("/");
      }
    }
  }, [listing, user]);

  useEffect(() => {
    if (slug) {
      listingsApi.getListingBySlug(slug).then((res) => {
        setListing(res?.listing);
      });
    }
  }, [slug]);

  if (!listing) return <div>Loading...</div>;

  // Helper for images
  const mainImage = listing.images?.[0]?.image_path || "";
  const thumbnails = listing.images?.map((img) => img.image_path) || [];

  // Example details array (customize as needed)
  const details = [
    {
      label: "Condition",
      value: listing?.condition
        ? listing.condition.replace(/_/g, " ").toUpperCase()
        : "N/A",
    },
    { label: "Description", value: listing.description },
    { label: "Payment Options", value: "Cash" },
  ];

  // Example meta (customize as needed)
  const meta = {
    views: listing.view_count || 0,
    inWatchlist: listing.inWatchlist || false,
    productName: listing.title,
    endDate: listing.expire_at
      ? new Date(listing.expire_at).toLocaleString()
      : "-",
    remainingTime: listing.expire_at
      ? (() => {
          const now = new Date();
          const expire = new Date(listing.expire_at);
          const diff = expire - now;
          if (diff <= 0) return "Expired";
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          let str = "";
          if (days > 0) str += `${days} days, `;
          if (hours > 0 || days > 0) str += `${hours} hours, `;
          str += `${minutes} minutes`;
          return str.trim();
        })()
      : "-",
  };
  // Example shipping (customize as needed)
  // const shipping = {
  //   destinationTitle: "Destination & description",
  //   destinationPrice: listing.price || listing.buy_now_price || "-",
  //   arrangedText: "To be arranged:",
  //   arrangedValue: "N/A",
  //   note: "The buyer must arrange pick-up or delivery with the seller.",
  //   learnMore: "Learn more about shipping & delivery options.",
  // };

  async function handleWithdraw(option) {
    try {
      await listingsApi.withdrawListing(listing.slug);
       toast.success("Listing withdrawn successfully ✅");
      setOpenWithdrawDialog(false);
      router.replace("/account/selling");
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Heading */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {t("LISTING DETAILS")}
      </h2>
      {/* <p className="text-xs mt-3 text-gray-600">
        (Only you can see this Section)
      </p> */}

      {/* <div className="mt-4 flex border-l-4 max-w-md border-green-400 bg-green-50 text-sm text-green-800 p-4 rounded">
        <FaInfoCircle className="mr-2 mt-0.5 text-green-600" />
        <div>
          <p className="font-semibold text-gray-700">
            We are upgrading some of our systems
          </p>
          <p>Some features might be temporarily unavailable.</p>
          <p>
            You can find more info{" "}
            <a href="#" className="text-green-600 underline">
              here
            </a>
            .
          </p>
        </div>
      </div> */}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* ==== LEFT COLUMN: IMAGES + DETAILS + SELLER ==== */}
        <div className="lg:col-span-2 flex flex-col lg:flex-col">
          {/* IMAGES (mobile/web) */}
          <div className="order-1">
            <div className="rounded p-4 bg-white">
              <img
                src={`${Image_URL}${mainImage}`}
                alt="product"
                className="mx-auto max-h-60 object-contain"
              />

              {/* Thumbnails - mobile carousel */}
              <div className="flex gap-2 mt-2 overflow-x-auto snap-x snap-mandatory sm:hidden">
                {thumbnails.map((thumb, idx) => (
                  <img
                    key={idx}
                    src={`${Image_URL}${thumb}`}
                    className="w-24 h-24 min-w-[6rem] border p-1 rounded object-cover snap-center"
                    alt={`thumb-${idx}`}
                  />
                ))}
              </div>

              {/* Thumbnails - static (web) */}
              <div className="gap-2 mt-2 hidden sm:flex flex-wrap">
                {thumbnails.map((thumb, idx) => (
                  <img
                    key={idx}
                    src={`${Image_URL}${thumb}`}
                    className="w-12 h-12 border p-1 rounded"
                    alt={`thumb-${idx}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* PRODUCT DETAILS */}
          <div className="order-3 mt-6 px-4">
            <h3 className="text-sm font-semibold mb-4">{t("Details")}</h3>
            {details.map((item, idx) => {
              { console.log("aaaa item", item.label);
                return (
                <div className="flex mb-4 flex-wrap" key={idx}>
                  <div className="w-48 font-semibold text-gray-600 text-sm">
                    {t(item.label)}
                    {/* {item.label} */}
                    {/* {t(`${item.label}`)} */}
                  </div>
                  <div className="text-sm  text-gray-700 max-w-md">
                    {item.label.toLowerCase() === "description" ? (
                      <div dangerouslySetInnerHTML={{ __html: item.value }} />
                    ) : (
                      item.value
                    )}
                  </div>
                </div>
              )
            }
            })}
          </div>

          {/* SELLER INFO: LAST IN MOBILE */}
          <div className="order-4 mt-10 w-full px-4">
            <h4
              className={`font-semibold text-gray-600 text-sm mb-4 ${
                i18n.language === "ar" ? "text-right" : "text-left"
              }`}
            >
              {t("About the Seller")}
            </h4>

            <div className="text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-700">
                  {listing?.creator?.profile_photo ? (
                    <img
                      src={`${Image_URL}${listing.creator.profile_photo}`}
                      alt="Seller"
                      className="w-20 h-20 object-cover rounded-full"
                    />
                  ) : (
                    listing?.creator?.username?.charAt(0)?.toUpperCase()
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-800">
                  {listing?.creator?.username}
                </h3>
                <p className="text-sm text-gray-500">
                  {t("Location")}:{" "}
                  {listing.creator?.regions?.name
                    ? `${
                        listing.creator?.address_1
                          ? `${listing.creator?.address_1}, `
                          : ""
                      }${listing.creator?.governorates?.name}, ${
                        listing.creator?.regions?.name
                      }`
                    : ""}
                </p>

                <p className="text-sm text-gray-500">
                  {t("Member Since")}:{" "}
                  {listing.creator?.created_at
                    ? new Date(listing.creator.created_at).toLocaleDateString(
                        "en-US",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ==== RIGHT COLUMN: BIDS SECTION ==== */}
        <div className="order-2 lg:order-none space-y-4">
          <h3 className="font-semibold text-4xl mb-2">{meta.productName}</h3>
          {listing.listing_type !== "property" && (
            <div className="flex items-start text-sm text-gray-700">
              <FiClock className="text-gray-500 mt-1 mr-2 text-xl" />
              <div>
                <p className="text-sm">
                  {t("Closes")}: {meta.endDate}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {meta.remainingTime}
                </p>
              </div>
            </div>
          )}
          {user.id == listing.creator.id && (
            <div className="flex flex-col gap-2">
              <p
                className="text-blue-500 text-sm cursor-pointer"
                onClick={() => router.push(`/listing/edit/${listing.slug}`)}
              >
                {t("Edit listing")}
              </p>
              <p
                className="text-red-500 text-sm cursor-pointer"
                onClick={() => setOpenWithdrawDialog(true)}
              >
                {t("Withdraw listing")}
              </p>
            </div>
          )}
          <div className="border border-gray-400 rounded overflow-hidden bg-white w-full max-w-sm">
            <div className="p-4">
              <h3 className="text-sm text-center text-gray-600">
                {t("Buy Now")}
              </h3>
              <p className="text-3xl font-bold text-center">
                <span className="price">$</span>
                {listing.buy_now_price}
              </p>
            </div>
            {listing.listing_type !== "property" && (
              <div className="p-4">
                <h3 className="text-sm text-center text-gray-600">
                  {t("Bidding Starts At")}
                </h3>
                <p className="text-3xl font-bold text-center">
                  <span className="price">$</span>
                  {listing.start_price}
                </p>
              </div>
            )}
            {listing.winning_bid && (
              <div className="p-4">
                <h3 className="text-sm text-center text-gray-600">
                  {" "}
                  {t("Winning Bid")}
                </h3>
                <p className="text-3xl font-bold text-center">
                  <span className="price">$</span>
                  {listing.winning_bid.amount}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <WithdrawDialog
        isOpen={openWithdrawDialog}
        onClose={() => setOpenWithdrawDialog(false)}
        onWithdraw={handleWithdraw}
      />
    </div>
  );
};

export default Page;
