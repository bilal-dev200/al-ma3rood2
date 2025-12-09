"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { listingsApi } from "@/lib/api/listings";
import { useTranslation } from "react-i18next";

function OffersModal({ offers = [], open, onClose, onAccept, onDecline }) {
  if (!open) return null;
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative flex flex-col">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">{t("Offers")}</h2>

        {offers.length === 0 ? (
          <div className="text-gray-500">{t("No offers.")}</div>
        ) : (
          <div className="divide-y max-h-[70vh] overflow-y-auto">
            {offers.map((offer, idx) => (
              <div
                key={idx}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 rounded transition-shadow hover:shadow-lg mb-2"
              >
                <div className="flex-1">
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    <span className="price">$</span>
                    {offer.amount}
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    {(() => {
                      function getTimeLeft(expiresAt) {
                        const expireDate = new Date(expiresAt);
                        const now = new Date();
                        const diffMs = expireDate - now;
                        if (expiresAt && diffMs <= 0) return "Expired";
                        const hours = Math.floor(diffMs / (1000 * 60 * 60));
                        const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
                        const seconds = Math.floor((diffMs / 1000) % 60);
                        return expiresAt
                          ? `Expires in ${hours
                              .toString()
                              .padStart(2, "0")}:${minutes
                              .toString()
                              .padStart(2, "0")}:${seconds
                              .toString()
                              .padStart(2, "0")}`
                          : "Expires in: -";
                      }
                      return getTimeLeft(offer.expires_at);
                    })()}
                  </div>
                  <div className="flex flex-col text-sm gap-1 mb-1">
                    <span className="text-green-700 font-medium cursor-pointer hover:underline">
                      {t("User")}: {offer.user?.name}
                    </span>
                    <span className="text-xs text-orange-500">
                      {t("Message")}: {offer.message}
                    </span>
                  </div>
                </div>
                {offer.status === "pending" ? (
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      onClick={() => onAccept(offer)}
                    >
                      {t("Accept offer")}{" "}
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                      onClick={() => onDecline(offer)}
                    >
                      {t("Decline")}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <span className="text-xs text-gray-500">
                      {offer.status}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AcceptBidModal({
  open,
  onClose,
  bid,
  reservePrice,
  onAccept,
  onReject,
}) {
  if (!open) return null;
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">{t("Highest Bid")}</h2>
        <div className="mb-4 text-gray-700">
          <p className="mb-2">
            The reserve price (<span className="price">$</span>
            {reservePrice}){t("was")}{" "}
            <span className="font-bold text-red-600">{t("not met")}</span>.
          </p>
          <p className="mb-2">
            {t("The highest bid is")}{" "}
            <span className="font-bold">
              <span className="price">$</span>
              {bid?.amount}
            </span>{" "}
            {t("by")}{" "}
            <span className="font-semibold">
              {bid?.user?.username || "Unknown"}
            </span>
            .
          </p>
          {/* <p className="mb-2">
            The highest bid is{" "}
            <span className="font-bold">
              <span className="price">$</span>
              {bid?.amount}
            </span>{" "}
            by{" "}
            <span className="font-semibold">
              {bid?.user?.name || "Unknown"}
            </span>
            .
          </p> */}
          <p className="mb-2">
            {t("You can choose to accept or reject this bid.")}
          </p>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            onClick={() => onAccept()}
          >
            {t("Accept Bid")}
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            onClick={() => onReject()}
          >
            {t("Reject Bid")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ListingCard({ listing, actions }) {
  const [offersOpen, setOffersOpen] = useState(false);
  const [acceptBidOpen, setAcceptBidOpen] = useState(false);
  const offers = listing.offers || [];
  const bids = listing.bids || [];
  const highestBid = bids[0];
  const isExpired = new Date(listing.closingDate) < new Date();
  const belowReserve =
    highestBid && Number(highestBid.amount) < Number(listing.reserve_price);

  const handleAccept = async (offer) => {
    await listingsApi.acceptOffer(offer.id);
    toast.success("Offer accepted successfully");
    setOffersOpen(false);
  };
  const handleDecline = async (offer) => {
    await listingsApi.declineOffer(offer.id);
    toast.success("Offer declined successfully");
    setOffersOpen(false);
  };

  const handleAcceptBid = async () => {
    try {
      await listingsApi.acceptBid(listing.id);
      toast.success("Bid accepted successfully");
      setAcceptBidOpen(false);
    } catch (e) {
      toast.error("Failed to accept bid");
    }
  };
  const handleRejectBid = async () => {
    try {
      await listingsApi.rejectBid(listing.id);
      toast.success("Bid rejected successfully");
      setAcceptBidOpen(false);
    } catch (e) {
      toast.error("Failed to reject bid");
    }
  };
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
              // width={400}
              // height={400}
              className="object-contain rounded"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs text-gray-500 mb-1 uppercase">
                {t("Listing Type:")} {listing.listing_type}
              </span>
              {listing.closingDate && (<span className="text-xs text-gray-500 mb-1 uppercase">
                {t("Closing Date:")}{" "}
                {new Date(listing.closingDate).toDateString()}
              </span>)}
            </div>
            <p className="text-md font-semibold text-gray-800 my-1">
              {listing.title}
            </p>
          </div>
        </div>
      </Link>

      {/* Views / Watchers / Price */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-gray-600 px-4 sm:px-6">
        <div className="flex gap-6 mt-2 items-center">
          {/* <span>👁️‍🗨️ {listing.watchers} {t("watchers")}</span> */}
          <span>
            👁️ {listing.views} {t("views")}
          </span>
          {offers.length > 0 && (
            <span
              className="bg-green-100 text-green-700 px-2 py-1 rounded cursor-pointer hover:bg-green-200 ml-2 text-xs font-semibold"
              onClick={() => setOffersOpen(true)}
              title="View offers"
            >
              {offers.length} {t("Offer")}
              {offers.length !== 1 ? "s" : ""}
            </span>
          )}
          {/* Accept Bid Tag */}
          {isExpired && highestBid && belowReserve && listing.status == 5 && (
            <span
              className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded cursor-pointer hover:bg-yellow-200 ml-2 text-xs font-semibold"
              onClick={() => setAcceptBidOpen(true)}
              title="Highest Bid"
            >
              {t("Show Highest Bid")}
            </span>
          )}
        </div>
        <div className="text-right sm:text-left mt-2 sm:mt-0">
          <span className="text-xs text-gray-500 block">{t("Buy Now")}</span>
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

      <OffersModal
        offers={offers}
        open={offersOpen}
        onClose={() => setOffersOpen(false)}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
      <AcceptBidModal
        open={acceptBidOpen}
        onClose={() => setAcceptBidOpen(false)}
        bid={highestBid}
        reservePrice={listing.reserve_price}
        onAccept={handleAcceptBid}
        onReject={handleRejectBid}
      />
    </div>
  );
}
