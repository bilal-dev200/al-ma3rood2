"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import {
  FaRegHeart,
  FaHeart,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaBed,
  FaBath,
  FaRulerCombined,
} from "react-icons/fa";
import { Image_URL } from "@/config/constants";
import { Image_NotFound } from "@/config/constants";
import { useWatchlistStore } from "@/lib/stores/watchlistStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { useSellerFavoritesStore } from "@/lib/stores/sellerFavoritesStore";
import { commentsApi, listingsApi } from "@/lib/api/listings";
import PlaceBidModal from "@/components/WebsiteComponents/ReuseableComponenets/PlaceBidModal";
import MakeOfferModal from "./MakeOfferModal";
import { userApi } from "@/lib/api/user";
import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import ImageCarousel from "./ImageCarousel";
import PropertyMapSection from "../PropertyMapSection";

function BidHistoryModal({ bids, open, onClose }) {
  const { t } = useTranslation();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto p-4 sm:p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-lg sm:text-xl font-bold mb-4">
          {t("Bid History")}
        </h2>

        {bids?.length === 0 ? (
          <div className="text-gray-500 text-sm">{t("No bids yet.")}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-3 border whitespace-nowrap">
                    {t("Bidder")}
                  </th>
                  <th className="py-2 px-3 border whitespace-nowrap">
                    {t("Amount")}
                  </th>
                  <th className="py-2 px-3 border whitespace-nowrap">
                    {t("Type")}
                  </th>
                  <th className="py-2 px-3 border whitespace-nowrap">
                    {t("Bid Time")}
                  </th>
                  <th className="py-2 px-3 border whitespace-nowrap">
                    {t("Status")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...bids]
                  .sort((a, b) => new Date(b.bid_time) - new Date(a.bid_time))
                  .map((bid) => (
                    <tr key={bid.id} className="border-b">
                      <td className="py-2 px-3 border whitespace-nowrap">
                        {bid.user?.name || "Unknown"}
                      </td>
                      <td className="py-2 px-3 border whitespace-nowrap">
                        <span className="price">$</span>
                        {Number(bid.amount).toLocaleString()}
                      </td>
                      <td className="py-2 px-3 border capitalize whitespace-nowrap">
                        {bid.type}
                      </td>
                      <td className="py-2 px-3 border whitespace-nowrap">
                        {new Date(bid.bid_time).toLocaleString("en-US", {
                          timeZone: "Asia/Riyadh",
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-2 px-3 border whitespace-nowrap">
                        {bid.status === 1 ? t("Active") : t("Inactive")}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function BuyNowModal({ isOpen, onClose, product, onBuyNow }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [agreeToPayment, setAgreeToPayment] = useState(false);
  const { t } = useTranslation();

  if (!isOpen) return null;
  const handleBuyNow = async () => {
    setError("");
    setLoading(true);
    try {
      // TODO: Replace with your real buy now API call
      const res = await listingsApi.buyNow(product.slug);
      toast.success(res?.message || "Buy Requested Successfully!");
      if (onBuyNow) onBuyNow();
      setTimeout(() => {
        setSuccess("");
        onClose();
      }, 1200);
    } catch (err) {
      toast.error(err?.message || "Failed to buy now");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-5 xs:p-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 text-left">
          {t("Buy Now")}
        </h2>

        <div className="mb-5 text-center">
          <p className="text-base sm:text-lg text-gray-700 mb-2">
            {t("Are you sure you want to buy this item now for")}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
            <span className="price">$</span>
            {product.buy_now_price}
          </p>
          <p className="text-sm sm:text-base text-gray-500 truncate">
            {product.title}
          </p>
        </div>

        {error && (
          <div className="text-red-500 text-xs mb-2 text-center">{error}</div>
        )}
        {success && (
          <div className="text-green-600 text-xs mb-2 text-center">
            {success}
          </div>
        )}

        {/* Payment Method Note */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">{t("Payment Method Notice")}</p>
              <p className="text-blue-700">
                {t(
                  "Currently, the only available payment method is cash. Please ensure you can complete the transaction using cash before proceeding."
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Agreement Checkbox */}
        <div className="mb-4 flex items-start gap-3">
          <input
            type="checkbox"
            id="agreePayment"
            className="mt-1 accent-green-600 w-4 h-4 rounded"
            checked={agreeToPayment}
            onChange={(e) => setAgreeToPayment(e.target.checked)}
            disabled={loading}
          />
          <label
            htmlFor="agreePayment"
            className="text-sm text-gray-700 select-none"
          >
            {t(
              "I understand and agree that the only available payment method is cash, and I can complete this transaction using cash."
            )}
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={handleBuyNow}
            className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
            disabled={loading || !agreeToPayment}
          >
            {loading ? "Processing..." : t("Confirm Buy Now")}
          </button>
          <button
            onClick={onClose}
            className="w-full sm:flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition"
            disabled={loading}
          >
            {t("Cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

function LoginConfirmationModal({ isOpen, onClose, onLogin }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={(e) => {
        // Close only if clicking on the backdrop (not modal content)
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transition-all duration-300 animate-fade-in text-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Login Required
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-sm md:text-base mb-6">
          You need to log in to perform this action. Please sign in to continue.
        </p>

        {/* Action buttons */}
        <div className="flex justify-center gap-4">
          <button
            className="bg-green-600 hover:bg-green-700 w-full sm:flex-1 text-white py-2 rounded-lg transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 w-full sm:flex-1 text-white py-2 rounded-lg transition"
            onClick={onLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailsClient({
  product: initialProduct,
  initialnearBy,
  feedbackPercentage,
}) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [isBidHistoryOpen, setBidHistoryOpen] = useState(false);
  const [isBuyNowOpen, setBuyNowOpen] = useState(false);
  const [isMakeOfferOpen, setMakeOfferOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [replyText, setReplyText] = useState({});

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [product, setProduct] = useState(initialProduct);
  const [nearBy, setNearBy] = useState(initialnearBy);

  const { watchlist, addToWatchlist, removeFromWatchlist } =
    useWatchlistStore();
  const {
    favoriteSellers,
    fetchSellerFavorites,
    toggleSellerFavorite,
    isSellerFavorite: checkIsSellerFavorite,
    isLoading: isFavoritesLoading,
  } = useSellerFavoritesStore();
  const isInWatchlist = watchlist?.some(
    (item) => item.listing?.slug === product.slug
  );
  const currentUser = useAuthStore((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenContact, setIsOpenContact] = useState(false);
  const dealer = product?.creator;
  const images = product?.images?.length
    ? product.images.map((img) => `${Image_URL}${img.image_path}`)
    : ["/placeholder.svg?height=400&width=600"];

  // Seller check
  const isSeller = currentUser?.id === product?.seller_id;
  const isSellerFavorite = product?.creator?.id
    ? checkIsSellerFavorite(product.creator.id)
    : false;

  // Fetch seller favorites on mount
  useEffect(() => {
    if (currentUser && product?.creator?.id) {
      fetchSellerFavorites();
    }
  }, [currentUser, product?.creator?.id, fetchSellerFavorites]);

  //   const handlePostQuestion = async () => {
  //   if (!newQuestion.trim()) {
  //     toast.error("Question cannot be empty");
  //     return;
  //   }

  //   try {
  //     const res = await commentsApi.postComment(product.id, newQuestion);

  //     toast.success("Question posted successfully!");
  //     if (res?.comment) {
  //       setProduct((prev) => ({
  //         ...prev,
  //         comments: [...(prev.comments || []), res.comment],
  //       }));
  //     }

  //     setNewQuestion("");
  //   } catch (e) {
  //     toast.error(e.message || "Failed to post question");
  //   }
  // };
  const handlePostQuestion = async () => {
    if (!newQuestion.trim()) {
      toast.error("Question cannot be empty");
      return;
    }

    try {
      const res = await commentsApi.postComment(product.id, newQuestion);

      toast.success("Question posted successfully!");

      // Refetch product data to get updated comments
      await refreshProduct();

      setNewQuestion("");
    } catch (e) {
      // Handle API validation errors
      const validationErrors = e?.data?.data || e?.response?.data?.data;
      if (validationErrors && typeof validationErrors === "object") {
        Object.entries(validationErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => {
              toast.error(msg);
            });
          } else {
            toast.error(messages);
          }
        });
      } else {
        toast.error(e?.message || "Failed to post question");
      }
    }
  };
  const handleReply = async (commentId) => {
    if (!replyText[commentId]?.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      const res = await commentsApi.postReply(commentId, replyText[commentId]);

      toast.success("Reply posted successfully!");

      // Refetch product data to get updated comments with replies
      await refreshProduct();

      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
    } catch (e) {
      // Handle API validation errors
      const validationErrors = e?.data?.data || e?.response?.data?.data;
      if (validationErrors && typeof validationErrors === "object") {
        Object.entries(validationErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => {
              toast.error(msg);
            });
          } else {
            toast.error(messages);
          }
        });
      } else {
        toast.error(e?.message || "Failed to post reply");
      }
    }
  };
  const handleDeleteComment = async (commentId) => {
    try {
      await commentsApi.deleteComment(commentId);

      // local state se comment delete kar do
      const updatedComments = product.comments.filter(
        (c) => c.id !== commentId
      );
      setProduct({ ...product, comments: updatedComments });

      toast.success("Comment deleted successfully!");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  const handleUpdateReply = async (commentId, replyId) => {
    if (!editReplyText.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }
    try {
      await commentsApi.updatecommnet(replyId, editReplyText);

      // Update reply in local state
      const updatedComments = product.comments.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === replyId ? { ...r, comment_text: editReplyText } : r
            ),
          };
        }
        return c;
      });

      setProduct({ ...product, comments: updatedComments });
      setEditReplyId(null);
      setEditReplyText("");
      toast.success("Reply updated successfully! ✅");
    } catch (error) {
      console.error("Error updating reply:", error);
      toast.error("Failed to update reply ❌");
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editCommentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    try {
      await commentsApi.updatecommnet(commentId, editCommentText);

      // Local state update so page reload na karna pare
      const updatedComments = product.comments.map((c) =>
        c.id === commentId ? { ...c, comment_text: editCommentText } : c
      );

      setProduct({ ...product, comments: updatedComments });
      setEditCommentId(null); // edit mode se bahar
      setEditCommentText("");
      toast.success("Comment updated successfully!");
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment ❌");
    }
  };
  // ✅ Delete Reply Handler
  const handleDeleteReply = async (commentId, replyId) => {
    try {
      await commentsApi.deleteComment(replyId); // <-- backend API call

      // Local state update
      const updatedComments = product.comments.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: c.replies.filter((r) => r.id !== replyId),
          };
        }
        return c;
      });

      setProduct({ ...product, comments: updatedComments });

      toast.success("Reply deleted successfully! ✅");
    } catch (error) {
      console.error("Error deleting reply:", error);
      toast.error("Failed to delete reply ❌");
    }
  };

  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [favoriteStatus, setFavoriteStatus] = useState(null);
  const [editReplyId, setEditReplyId] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");

  const { user, token } = useAuthStore();
  const isLoggedIn = !!user && !!token;
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const isLister = product?.creator?.id === user?.id;
  const router = useRouter();

  console.log("product", product);

  // Handler to refresh product data (bids, bid_count)
  const refreshProduct = async () => {
    try {
      const listingsData = await listingsApi.getListingBySlug(product.slug);
      setProduct(listingsData?.listing);
      console.log(listingsData, "data");
    } catch (e) {
      // Optionally handle error
    }
  };

  const items = [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/property" },
    {
      label: product.category?.name || "Category",
      href: `/property/${product?.slug}`,
    },
    { label: product.title || "Product" },
  ];
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === "ar";

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumbs
        items={items}
        styles={{
          nav: "flex justify-start text-sm font-medium bg-white border-b border-gray-200 px-10 py-3",
        }}
      />

      <section className="mx-auto px-4 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4 w-full max-w-[700px] mx-auto">
            {/* Carousel */}
            <div className="relative w-full h-[400px] flex items-center justify-center">
              {/* Left Arrow (hide on mobile if only 1 image) */}
              {images.length > 1 && (
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 z-10 hidden sm:block"
                  onClick={() =>
                    setCarouselIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                  aria-label="Previous image"
                >
                  <svg
                    className="h-6 w-6 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}

              <img
                src={
                  images[carouselIndex]
                    ? `${images[carouselIndex]}`
                    : Image_NotFound
                }
                alt={`Product Image ${carouselIndex + 1}`}
                className="object-contain rounded-lg w-full h-full cursor-pointer"
                style={{ maxHeight: 400 }}
                onClick={() => {
                  setModalImageIndex(carouselIndex);
                  setImageModalOpen(true);
                }}
              />

              {/* Right Arrow */}
              {images.length > 1 && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 z-10 hidden sm:block"
                  onClick={() =>
                    setCarouselIndex((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }
                  aria-label="Next image"
                >
                  <svg
                    className="h-6 w-6 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}

              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 sm:hidden">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      className={`w-2.5 h-2.5 rounded-full ${carouselIndex === idx ? "bg-green-600" : "bg-gray-300"
                        }`}
                      onClick={() => setCarouselIndex(idx)}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails — hide on mobile */}
            <div className="hidden sm:flex justify-center gap-4 mt-10 flex-wrap">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative w-24 mt-10 h-20 rounded-lg border cursor-pointer ${carouselIndex === idx
                    ? "border-green-500"
                    : "border-gray-300"
                    }`}
                  onClick={() => setCarouselIndex(idx)}
                >
                  <img
                    src={`${img}`}
                    alt={`thumb-${idx}`}
                    className="object-cover rounded-md w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {product.listing_type == "motors" ? (
            <div className="space-y-6 mt-5">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {product.title}
              </h1>
              {product?.creator?.address && (
                <div
                  className={`flex items-center gap-2 text-sm text-gray-500 mt-1 ${i18n.language === "ar" ? "right" : ""
                    }`}
                >
                  <FaMapMarkerAlt className="text-green-600" />
                  <span>{product?.address ? product?.address : ""}</span>
                </div>
              )}
              {product?.expire_at && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 border border-gray-200 rounded-full px-4 py-2">
                  <span className="font-medium">{t("Closes")}:</span>
                  <span className="font-bold">
                    {new Date(product.expire_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="mx-2 text-gray-400">|</span>
                  <span className="font-medium">{t("Time remaining")}:</span>
                  <span className="font-bold">
                    {(() => {
                      const now = new Date();
                      const expire = new Date(product.expire_at);
                      const diff = expire - now;
                      if (diff <= 0) return "Expired";
                      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                      const minutes = Math.floor((diff / (1000 * 60)) % 60);
                      let str = "";
                      if (days > 0) str += `${days}d `;
                      if (hours > 0 || days > 0) str += `${hours}h `;
                      str += `${minutes}m`;
                      return str.trim();
                    })()}
                  </span>
                </div>
              )}
              {!isLister && (
                <div className="flex space-x-2">
                  <button
                    className="flex-1 bg-black text-white py-3 rounded-full cursor-pointer hover:bg-gray-800"
                    onClick={() => {
                      if (!isLoggedIn) {
                        setShowLoginModal(true);
                        return;
                      }

                      if (isInWatchlist) {
                        removeFromWatchlist(product.slug);
                      } else {
                        addToWatchlist(product.slug);
                      }
                    }}
                  >
                    {isInWatchlist
                      ? t("Remove from Watchlist")
                      : t("Add to Watchlist")}
                  </button>

                  <button
                    className="rounded-full"
                    onClick={() => {
                      if (!isLoggedIn) {
                        setShowLoginModal(true);
                        return;
                      }

                      if (isInWatchlist) {
                        removeFromWatchlist(product.slug);
                      } else {
                        addToWatchlist(product.slug);
                      }
                    }}
                    aria-label={
                      isInWatchlist
                        ? "Remove from Watchlist"
                        : "Add to Watchlist"
                    }
                  >
                    {isInWatchlist ? (
                      <FaHeart className="text-red-500 text-3xl cursor-pointer" />
                    ) : (
                      <FaRegHeart className="text-3xl cursor-pointer" />
                    )}
                  </button>
                </div>
              )}
              {/* Bid Section */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center space-y-4">
                {/* Buy Now Section */}
                {product.buy_now_price && product.bids.length == 0 && (
                  <>
                    <div className="mb-2">
                      <span className="block text-sm text-gray-600">
                        Buy Now
                      </span>
                      <span className="block text-4xl font-bold text-gray-900">
                        <span className="price">$</span>
                        {product.buy_now_price}
                      </span>
                    </div>
                    {!isLister && (
                      <button
                        className="w-full py-3 text-lg font-semibold rounded-full transition-colors bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                        onClick={() => {
                          // if (new Date() <= new Date(product.expire_at))
                          // setBuyNowOpen(true);
                          if (!isLoggedIn) return setShowLoginModal(true);
                          setBuyNowOpen(true);
                        }}
                      // disabled={new Date() > new Date(product.expire_at)}
                      >
                        {t("Buy Now")}
                      </button>
                    )}
                  </>
                )}
                {/* Current Bid */}
                {product.bids && product.bids.length > 0 ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {t("Current Bid")}
                    </p>
                    <p className="text-4xl font-bold text-gray-900">
                      <span className="price">$</span>
                      {product.bids[0]?.amount || "0.00"}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {t("Starting From")}
                    </p>
                    <p className="text-4xl font-bold text-gray-900">
                      <span className="price">$</span>
                      {product.start_price || "0.00"}
                    </p>
                  </div>
                )}
                {!isLister && (
                  <button
                    className={`w-full py-3 text-lg font-semibold rounded-full transition-colors ${new Date() > new Date(product.expire_at)
                      ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                      }`}
                    onClick={() => {
                      if (!isLoggedIn) {
                        setShowLoginModal(true);
                        return;
                      }
                      if (new Date() <= new Date(product.expire_at))
                        setModalOpen(true);
                    }}
                    disabled={new Date() > new Date(product.expire_at)}
                  >
                    {t("Place bid")}
                  </button>
                )}
                <PlaceBidModal
                  product={product}
                  isOpen={isModalOpen}
                  onClose={() => {
                    setModalOpen(false);
                  }}
                  onBidPlaced={refreshProduct}
                />
                <BuyNowModal
                  product={product}
                  isOpen={isBuyNowOpen}
                  onClose={() => setBuyNowOpen(false)}
                  onBuyNow={refreshProduct}
                />
                <p className="text-xs text-gray-500">
                  <span className="font-medium text-gray-700">
                    {product.bids &&
                      product.bids[0]?.amount > product?.reserve_price
                      ? t("Reserve Met")
                      : t("Reserve Not Met")}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  <span className="text-green-600 font-medium">
                    {" "}
                    {product?.bids_count || 0} {t("bids so far")}
                  </span>{" "}
                  –{" "}
                  <span
                    className="text-green-600 underline cursor-pointer hover:text-green-800"
                    onClick={() => setBidHistoryOpen(true)}
                  >
                    {t("view history")}
                  </span>
                </p>
                {product?.allow_offers && product.bids.length == 0 && (
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-600">
                      {t("The seller is open to offers on this listing")}
                    </span>
                    {!isLister && (
                      <button
                        className="bg-gray-100 text-green-600 border border-green-600 font-semibold px-4 py-2 rounded hover:bg-gray-200 transition"
                        onClick={() => {
                          if (!isLoggedIn) {
                            setShowLoginModal(true);
                            return;
                          }
                          setMakeOfferOpen(true);
                        }}
                      >
                        {t("Make an Offer")}
                      </button>
                    )}
                  </div>
                )}
              </div>
              {/*User Details*/}
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-4 mt-3 flex flex-col sm:flex-row sm:items-center sm:gap-4 relative shadow-sm">
                {/* Avatar */}
                <div className="flex items-center justify-center mb-3 sm:mb-0 sm:order-1">
                  <div className="w-14 h-14 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                    {product?.creator?.profile_photo ? (
                      <img
                        src={`${Image_URL}${product.creator.profile_photo}`}
                        alt={product?.creator?.username || "Seller Avatar"}
                        className="w-full h-full object-cover rounded-md"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-lg font-bold text-gray-700">
                        {product?.creator?.username?.charAt(0)?.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Seller Info */}
                <div
                  className={`flex-1 ${i18n.language === "ar" ? "text-right" : "text-left"
                    } sm:order-2`}
                >
                  <div className="text-base font-semibold text-black break-words">
                    {product.creator?.username || t("Seller")}
                  </div>
                  {/* <div className="text-sm text-green-600 font-medium mt-1">
                  100% {t("positive feedback")}
                </div> */}
                  <div className="text-xs text-gray-500 mt-0.5">
                    {product.creator?.city ? (
                      <>
                        {t("City")}: {product.creator.city}
                      </>
                    ) : (
                      <>
                        {t("Location")}:{" "}
                        {product.creator?.billing_address || "Unknown"}
                      </>
                    )}
                  </div>
                </div>

                {/* Add to Favorite */}
                <div
                  className={`mt-4 sm:mt-0 sm:absolute sm:top-1/2 sm:-translate-y-1/2 w-full sm:w-auto ${i18n.language === "ar" ? "sm:left-4" : "sm:right-4"
                    } sm:order-3`}
                >
                  {isLoggedIn && !isLister && !isFavoritesLoading && (
                    <>
                      {isSellerFavorite ? (
                        <div className="flex flex-col items-center sm:items-start gap-2">
                          <p className="text-green-600 text-sm font-semibold text-center sm:text-left">
                            {t("Seller added to favorites")}
                          </p>
                          <button
                            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-semibold transition"
                            onClick={async () => {
                              try {
                                await toggleSellerFavorite(product.creator?.id);
                                toast.success(
                                  t("Seller removed from favorites")
                                );
                              } catch (e) {
                                toast.error(
                                  t("Failed to remove seller from favorites")
                                );
                              }
                            }}
                          >
                            {t("Remove from Favorites")}
                          </button>
                        </div>
                      ) : (
                        <button
                          className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-semibold transition"
                          onClick={async () => {
                            try {
                              await toggleSellerFavorite(product.creator?.id);
                              toast.success(t("Seller added to favorites!"));
                            } catch (e) {
                              toast.error(
                                t("Failed to add seller to favorites")
                              );
                            }
                          }}
                        >
                          {t("Add Seller to Favorites")}
                        </button>
                      )}
                    </>
                  )}
                  {isFavoritesLoading && isLoggedIn && !isLister && (
                    <p className="text-gray-500 text-xs text-center sm:text-left">
                      {t("Loading...")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Title */}
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold">{product?.title}</h1>
              </div>
              {/* <p className="text-gray-500 text-sm mb-4">
                {product?.description}
              </p> */}

              {/* Location & Specs */}
              <div className="flex flex-wrap gap-4 text-sm mb-3">
                <span className="flex items-center gap-1 text-green-500">
                  <FaMapMarkerAlt />{" "}
                  {`${product?.address}` || "Unknown Location"}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm mb-3">
                {/* Bedrooms */}
                {product?.bedrooms && (
                  <span className="flex items-center gap-1">
                    <FaBed /> Bedrooms:{" "}
                    <span className="text-gray-500"> {product.bedrooms}</span>
                  </span>
                )}

                {/* Bathrooms */}
                {product?.bathrooms && (
                  <span className="flex items-center gap-1">
                    <FaBath /> Bathrooms:{" "}
                    <span className="text-gray-500"> {product.bathrooms}</span>
                  </span>
                )}

                {/* Plot Size */}
                {product?.plot_size && (
                  <span className="flex items-center gap-1">
                    <FaRulerCombined /> Plot Size:{" "}
                    <span className="text-gray-500">
                      {" "}
                      {product.plot_size} sqft
                    </span>
                  </span>
                )}
              </div>

              {product?.expire_at && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 border border-gray-200 rounded-full px-4 py-2">
                  <span className="font-medium">{t("Closes")}:</span>
                  <span className="font-bold">
                    {new Date(product.expire_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="mx-2 text-gray-400">|</span>
                  <span className="font-medium">{t("Time remaining")}:</span>
                  <span className="font-bold">
                    {(() => {
                      const now = new Date(
                        new Date().toLocaleString("en-US", {
                          timeZone: "Asia/Riyadh",
                        })
                      );

                      const expire = new Date(
                        new Date(product.expire_at).toLocaleString("en-US", {
                          timeZone: "Asia/Riyadh",
                        })
                      );

                      const diff = expire - now;
                      if (diff <= 0) return "Expired";

                      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                      const minutes = Math.floor((diff / (1000 * 60)) % 60);

                      let str = "";
                      if (days > 0) str += `${days}d `;
                      if (hours > 0 || days > 0) str += `${hours}h `;
                      str += `${minutes}m`;
                      return str.trim();
                    })()}
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="my-6">
                <p className="text-gray-500 text-sm">{t("Asking price")}:</p>
                <p className="text-3xl font-bold text-black">
                  <span className="price">$</span>
                  {product?.buy_now_price}{" "}
                </p>
              </div>

              <button
                onClick={() => setIsOpen(true)}
                className="w-full cursor-pointer bg-green-500 text-white py-2 rounded-3xl font-medium flex items-center justify-center gap-2"
              >
                <FaPhoneAlt /> Contact Seller
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ======= PRODUCT DETAILS ======= */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg px-6 md:px-20 py-10">
        <h2 className="text-xl font-bold mb-3">{t("Details")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 text-sm">
          {Object.entries({
            condition: product.condition,
            Category: product.brand || product.category?.name,
            color: product.color,
            storage: product.storage,
          })
            // Filter out null, undefined, or empty string values
            .filter(
              ([_, value]) =>
                value !== null && value !== undefined && value !== ""
            )
            .map(([key, value]) => (
              <div key={key}>
                <div className="font-bold uppercase">
                  {t(key.toLocaleUpperCase())}
                </div>
                <div className="text-gray-700 uppercase">{String(value).replace(/_/g, " ")}</div>
              </div>
            ))}
        </div>
      </div>

      {/* ======= PRODUCT DESCRIPTION ======= */}
      <div className="max-w-7xl mx-auto  bg-white rounded-lg px-6 md:px-20 py-10 space-y-4">
        <h2 className="text-xl font-semibold">{t("Description")}</h2>
        {/* <div className="text-sm text-gray-600 space-y-2">
          <p>{product.description}</p>
        </div> */}
        <div
          className="text-gray-700 text-md space-y-1"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
        {/*  */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold border-b pb-3">
            {t("Questions & Answers")}
          </h3>

          {/* Question box (only for buyers) */}
          {!isSeller && (
            <div className="space-y-2 mt-4">
              <textarea
                placeholder={t("Ask a question...")}
                className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500"
                rows="3"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
              <button
                onClick={handlePostQuestion}
                className="px-4 py-2  bg-green-500 cursor-pointer text-white rounded-lg hover:bg-green-600"
              >
                {t("Post Question")}
              </button>
            </div>
          )}

          {/* Comments list */}
          {/*  */}
          <div className="mt-6 space-y-6">
            {product.comments?.length > 0 ? (
              product.comments.map((c) => (
                <div key={c.id} className="border-b pb-4">
                  {/* Question Row */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-full shadow text-sm font-semibold text-gray-800 uppercase">
                      {c.user?.name?.charAt(0) || "U"}
                    </div>

                    <div className="w-full">
                      {/* Agar edit mode me hai */}
                      {editCommentId === c.id ? (
                        <>
                          <textarea
                            className="w-full border rounded-lg p-2 text-sm"
                            rows="2"
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                          />
                          <button
                            onClick={() => handleUpdateComment(c.id)}
                            className="mt-2 px-3 py-1 cursor-pointer bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
                          >
                            {t("Save")}
                          </button>
                          <button
                            onClick={() => setEditCommentId(null)}
                            className="mt-2 ml-2 cursor-pointer px-3 py-1 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600"
                          >
                            {t("Cancel")}
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="font-medium text-gray-800">
                            Q: {c.comment_text}
                          </p>
                          <p className="text-gray-600 text-sm mt-1">
                            {t("Asked by")}{" "}
                            <span className="font-medium">
                              {c.user?.username}
                            </span>{" "}
                            – {new Date(c.created_at).toLocaleDateString()}{" "}
                            {new Date(c.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>

                          {/* Show edit/delete if current user === comment user */}
                          {currentUser?.id === c.user?.id && (
                            <div className="mt-2 space-x-3">
                              <button
                                onClick={() => {
                                  setEditCommentId(c.id);
                                  setEditCommentText(c.comment_text);
                                }}
                                className="text-green-600 cursor-pointer text-sm hover:underline"
                              >
                                {t("Edit")}
                              </button>
                              {/* <button
                                onClick={() => handleDeleteComment(c.id)}
                                className="text-red-600 text-sm hover:underline"
                              >
                                Delete
                              </button> */}
                              <button
                                onClick={() => {
                                  setDeleteTarget({
                                    type: "comment",
                                    commentId: c.id,
                                  });
                                  setIsDeleteModalOpen(true);
                                }}
                                className="text-red-600 text-sm hover:underline cursor-pointer"
                              >
                                {t("Delete")}
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Replies */}
                  {c.replies?.length > 0 &&
                    c.replies.map((r, index) => {
                      const borderColor =
                        index % 2 === 0
                          ? "border-yellow-500"
                          : "border-green-500";

                      return (
                        <div
                          key={r.id}
                          className={`ml-12 mt-4 ${isRTL ? "border-r-2 pr-4" : "border-l-2 pl-4"
                            } ${borderColor}`}
                        >
                          <div className="flex items-start gap-5">
                            <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-full shadow text-base font-bold text-gray-800 uppercase">
                              {r.user?.username?.charAt(0) || "U"}
                            </div>

                            <div className="w-full">
                              {editReplyId === r.id ? (
                                <>
                                  <textarea
                                    className="w-full border rounded-lg p-2 text-sm"
                                    rows="2"
                                    value={editReplyText}
                                    onChange={(e) =>
                                      setEditReplyText(e.target.value)
                                    }
                                  />
                                  <button
                                    onClick={() =>
                                      handleUpdateReply(c.id, r.id)
                                    }
                                    className="mt-2 px-3 py-1 bg-green-600 text-white cursor-pointer text-sm rounded-lg hover:bg-green-700"
                                  >
                                    {t("Save")}
                                  </button>
                                  <button
                                    onClick={() => setEditReplyId(null)}
                                    className="mt-2 ml-2 px-3 py-1 bg-gray-500 text-white cursor-pointer text-sm rounded-lg hover:bg-gray-600"
                                  >
                                    {t("Cancel")}
                                  </button>
                                </>
                              ) : (
                                <>
                                  <p className="font-medium text-gray-800">
                                    {r.user?.username}{" "}
                                    <span className="text-gray-500">
                                      {t("replied:")}
                                    </span>
                                  </p>
                                  <p className="text-gray-700 text-sm mt-1">
                                    {r.comment_text}
                                  </p>
                                  <p className="text-gray-500 text-xs mt-1">
                                    {new Date(
                                      r.created_at
                                    ).toLocaleDateString()}{" "}
                                    {new Date(r.created_at).toLocaleTimeString(
                                      [],
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )}
                                  </p>

                                  {/* Reply edit/delete only for reply owner */}
                                  {currentUser?.id === r.user?.id && (
                                    <div className="mt-2 space-x-3">
                                      <button
                                        onClick={() => {
                                          setEditReplyId(r.id);
                                          setEditReplyText(r.comment_text);
                                        }}
                                        className="text-blue-600 text-sm hover:underline cursor-pointer"
                                      >
                                        {t("Edit")}
                                      </button>
                                      {/* <button
                                        onClick={() => handleDeleteReply(c.id, r.id)}
                                        className="text-red-600 text-sm hover:underline"
                                      >
                                        Delete
                                      </button> */}
                                      <button
                                        onClick={() => {
                                          setDeleteTarget({
                                            type: "reply",
                                            commentId: c.id,
                                            replyId: r.id,
                                          });
                                          setIsDeleteModalOpen(true);
                                        }}
                                        className="text-red-600 text-sm hover:underline cursor-pointer"
                                      >
                                        {t("Delete")}
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  {isLoggedIn && (
                    <div className="ml-12 mt-2">
                      <textarea
                        placeholder={t("Write a reply...")}
                        className="w-full border rounded-lg p-2 text-sm"
                        rows="2"
                        value={replyText[c.id] || ""}
                        onChange={(e) =>
                          setReplyText({ ...replyText, [c.id]: e.target.value })
                        }
                      />
                      <button
                        className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        onClick={() => handleReply(c.id)}
                      >
                        {t("Reply")}
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic mt-4">
                {t("No questions yet. Be the first to ask!")}
              </p>
            )}
          </div>
          {/* {isDeleteModalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
    <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
      <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
      <p className="text-sm text-gray-600 mb-6">
        Are you sure you want to delete this {deleteTarget?.type}?
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={async () => {
            if (deleteTarget?.type === "comment") {
              await handleDeleteComment(deleteTarget.commentId);
            } else if (deleteTarget?.type === "reply") {
              await handleDeleteReply(deleteTarget.commentId, deleteTarget.replyId);
            }
            setIsDeleteModalOpen(false);
            setDeleteTarget(null);
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
        <button
          onClick={() => {
            setIsDeleteModalOpen(false);
            setDeleteTarget(null);
          }}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)} */}
          {isDeleteModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative animate-fadeIn">
                {/* Close Icon */}
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteTarget(null);
                  }}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                  <RxCross2 className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="p-6 text-center">
                  {/* <div className="mx-auto mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
          <RxCross2 className="w-6 h-6 text-red-600" />
        </div> */}

                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    {t("Confirm Delete")}
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    {t("Are you sure you want to delete this ?")}
                    <span className="font-medium"></span>
                  </p>

                  <div className="flex justify-center gap-3">
                    <button
                      onClick={async () => {
                        if (deleteTarget?.type === "comment") {
                          await handleDeleteComment(deleteTarget.commentId);
                        } else if (deleteTarget?.type === "reply") {
                          await handleDeleteReply(
                            deleteTarget.commentId,
                            deleteTarget.replyId
                          );
                        }
                        setIsDeleteModalOpen(false);
                        setDeleteTarget(null);
                      }}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                      {t("Delete")}
                    </button>
                    <button
                      onClick={() => {
                        setIsDeleteModalOpen(false);
                        setDeleteTarget(null);
                      }}
                      className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                    >
                      {t("Cancel")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Modal */}
          {isOpenContact && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              {/* Background Overlay */}
              <div
                className="absolute inset-0 bg-black opacity-50"
                onClick={() => setIsOpen(false)}
              ></div>

              {/* Modal Content */}
              <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full p-6 z-10">
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>

                {/* Dealer Info */}
                <h2 className="text-xl font-semibold mb-4">
                  Seller Information
                </h2>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  {/* Left Side - Profile Photo */}
                  <div className="bg-[#113f2e] w-36 h-36 rounded-full overflow-hidden border border-gray-300 flex justify-center items-center">
                    {dealer?.profile_photo ? (
                      <img
                        src={`${Image_URL}${dealer.profile_photo}`}
                        alt={dealer?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-5xl">
                        {dealer?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Right Side - Details */}
                  <div className="flex-1 space-y-2 text-gray-700 text-md md:text-md">
                    <p>
                      <strong>Name:</strong> {dealer?.name || "N/A"}
                    </p>
                    <p>
                      <strong>Email:</strong> {dealer?.email || "N/A"}
                    </p>
                    <p>
                      <strong>Phone:</strong> {dealer?.phone || "N/A"}
                    </p>
                    <p>
                      <strong>Feedback:</strong> {feedbackPercentage || "No Feedbacks Yet"}
                    </p>
                    <p>
                      <strong>City:</strong> {dealer?.city || "N/A"}
                    </p>
                    <p>
                      <strong>Country:</strong> {dealer?.country || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <a
                    href={`mailto:${dealer?.email}`}
                    className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-3xl font-medium flex items-center justify-center gap-2"
                  >
                    <FaEnvelope /> Email
                  </a>
                  <a
                    href={`tel:${dealer?.phone}`}
                    className="flex-1 bg-green-500 text-white py-2 rounded-3xl font-medium flex items-center justify-center gap-2"
                  >
                    <FaPhoneAlt /> Call
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======= PROPERTY MAP SECTION ======= */}
      {product.listing_type === "property" && (
        <PropertyMapSection property={product} nearBy={nearBy} />
      )}

      <BidHistoryModal
        bids={product.bids || []}
        open={isBidHistoryOpen}
        onClose={() => setBidHistoryOpen(false)}
      />
      <MakeOfferModal
        isOpen={isMakeOfferOpen}
        onClose={() => setMakeOfferOpen(false)}
        product={product}
        onOfferMade={refreshProduct}
      />
      <LoginConfirmationModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={() => {
          setShowLoginModal(false);
          router.push("/login");
        }}
      />
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <button
            className="absolute top-6 right-8 text-white text-4xl font-bold"
            onClick={() => setImageModalOpen(false)}
            aria-label="Close"
          >
            &times;
          </button>
          <button
            className="absolute left-8 top-1/2 -translate-y-1/2 text-white text-3xl"
            onClick={() =>
              setModalImageIndex((prev) =>
                prev === 0 ? images.length - 1 : prev - 1
              )
            }
            aria-label="Previous"
          >
            &#8592;
          </button>
          <img
            src={
              images[modalImageIndex]
                ? `${images[modalImageIndex]}`
                : Image_NotFound
            }
            alt={`Full Image ${modalImageIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
          />
          <button
            className="absolute right-8 top-1/2 -translate-y-1/2 text-white text-3xl"
            onClick={() =>
              setModalImageIndex((prev) =>
                prev === images.length - 1 ? 0 : prev + 1
              )
            }
            aria-label="Next"
          >
            &#8594;
          </button>
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Background Overlay */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full p-6 z-10">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            {/* Dealer Info */}
            <h2 className="text-xl font-semibold mb-4">Seller Information</h2>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Left Side - Profile Photo */}
              <div className="bg-[#113f2e] w-36 h-36 rounded-full overflow-hidden border border-gray-300 flex justify-center items-center">
                {dealer?.profile_photo ? (
                  <img
                    src={`${Image_URL}${dealer.profile_photo}`}
                    alt={dealer?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-5xl">
                    {dealer?.name?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Right Side - Details */}
              <div className="flex-1 space-y-2 text-gray-700 text-md md:text-md">
                <p>
                  <strong>Name:</strong> {dealer?.name}
                </p>
                <p>
                  <strong>Email:</strong> {dealer?.email}
                </p>
                <p>
                  <strong>Phone:</strong> {dealer?.phone}
                </p>
                <p>
                  <strong>Region:</strong> {dealer?.city}
                </p>
                <p>
                  <strong>Country:</strong> {dealer?.country}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <a
                href={`mailto:${dealer?.email}`}
                className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-3xl font-medium flex items-center justify-center gap-2"
              >
                <FaEnvelope /> Email
              </a>
              <a
                href={`tel:${dealer?.phone}`}
                className="flex-1 bg-green-500 text-white py-2 rounded-3xl font-medium flex items-center justify-center gap-2"
              >
                <FaPhoneAlt /> Call
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
