"use client";
import { Image_NotFound, Image_URL } from "@/config/constants";
import React, { useState } from "react";
import { listingsApi } from "@/lib/api/listings";
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';

const PlaceBidModal = ({ isOpen, onClose, product, onBidPlaced }) => {
  const [amount, setAmount] = useState("");
  const [autoBid, setAutoBid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [agreeToPayment, setAgreeToPayment] = useState(false);
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    console.log("product", product);
    e.preventDefault();
    setError("");
    setSuccess("");

    // Client-side bid validation
    const bidValue = parseFloat(amount);
    if (isNaN(bidValue) || bidValue <= 0) {
      toast.error("Please enter a valid bid amount.");
      return;
    }
    if (product?.bids?.length > 0) {
      const highestBid = parseFloat(product.bids[0].amount);
      if (bidValue <= highestBid) {
        toast.error(
          `Your bid must be higher than the current highest bid ($${highestBid}).`
        );
        return;
      }
    } else {
      const startPrice = parseFloat(product?.start_price || 0);
      if (bidValue <= startPrice) {
        toast.error(
          `Your bid must be higher than the starting price ($${startPrice}).`
        );
        return;
      }
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append(
        "amount",
        autoBid
          ? product?.bids.length > 0
            ? Math.round(product?.bids[0]?.amount) + 1
            : Math.round(product?.start_price) + 1
          : amount
      );
      formData.append("type", autoBid ? "auto" : "manual");
      formData.append("max_auto_bid_amount", autoBid ? amount : "");
      await listingsApi.placeBid(product.id, formData);
      // setSuccess("Bid placed successfully!");
      toast.success('Bid placed successfully!')
      setAmount("");
      setAutoBid(false);
      if (onBidPlaced) onBidPlaced();
      setTimeout(() => {
        setSuccess("");
        onClose();
      }, 1200);
    } catch (err) {
      // setError(err?.message || "Failed to place bid");
      toast.error(err?.message || "Failed to place bid")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 text-gray-900 text-left">
          {t("Place a bid")}
        </h2>

        {/* Product Info */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <img
            src={
              product?.images?.[0]?.image_path
                ? `${Image_URL}${product?.images?.[0]?.image_path}`
                : Image_NotFound
            }
            alt={product?.title || "Product"}
            className="w-24 h-24 object-cover rounded-lg border border-gray-200 bg-gray-100"
            loading="lazy"
          />
          <div>
            <p className="font-semibold text-gray-800 text-sm sm:text-base">
              {product?.title || "Product"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {product?.location || ""}
            </p>
            <div className="flex gap-3 mt-2">
              <div>
                <span className="text-lg font-bold text-green-600">
                  <span className="mr-1 price">$</span>
                  {product.bids[0]?.amount ||
                    product?.start_price ||
                    product?.reserve_price ||
                    "0.00"}
                </span>

                {product?.old_price && (
                  <span className="text-lg font-semibold text-gray-400 line-through ml-2">
                    <span className="mr-1 price">$</span>
                    {product.old_price}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bid Input */}
        <form onSubmit={handleSubmit} className="mb-6">
          <label className="block mb-2 font-medium text-gray-700 text-sm text-left">
            {autoBid ? t("Your Maximum Bid") : t("Your bid")}
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 price">$</span>
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value;
                  const numValue = parseFloat(value);
                  if (value === "" || (!isNaN(numValue) && numValue >= 0)) {
                    setAmount(value);
                  }
                }}
                placeholder={t("Enter bid amount")}
                className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pl-8 pr-10 py-2
      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
                disabled={loading}
              />
              {amount && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 text-lg"
                  tabIndex={-1}
                  aria-label="Clear"
                  onClick={() => setAmount("")}
                  disabled={loading}
                >
                  &times;
                </button>
              )}
            </div>

            {/* Auto Bid Checkbox */}
            <div className="flex items-center gap-2 sm:gap-1 w-full sm:w-auto">
              <input
                type="checkbox"
                id="autobid"
                className="accent-green-600 w-4 h-4 rounded"
                checked={autoBid}
                onChange={(e) => setAutoBid(e.target.checked)}
                disabled={loading}
              />
              <label
                htmlFor="autobid"
                className="text-xs text-gray-600 select-none"
              >
                {t("Auto-bid")}
              </label>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="text-red-500 text-xs mt-2 text-left pl-2">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-600 text-xs mt-2">{success}</div>
          )}

          {/* Payment Method Note */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">{t("Payment Method Notice")}</p>
                <p className="text-blue-700">{t("Currently, the only available payment method is cash. Please ensure you can complete the transaction using cash before proceeding.")}</p>
              </div>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="mt-4 flex items-start gap-3">
            <input
              type="checkbox"
              id="agreePayment"
              className="mt-1 accent-green-600 w-4 h-4 rounded"
              checked={agreeToPayment}
              onChange={(e) => setAgreeToPayment(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="agreePayment" className="text-sm text-gray-700 select-none">
              {t("I understand and agree that the only available payment method is cash, and I can complete this transaction using cash.")}
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="submit"
              className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
              disabled={loading || !agreeToPayment || amount == ""}
            >
              {loading ? t("Placing...") : t("Place bid")}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition"
              disabled={loading}
            >
              {t("Cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceBidModal;
