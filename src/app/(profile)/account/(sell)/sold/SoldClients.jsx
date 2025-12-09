"use client";
import React, { useEffect, useState } from "react";
import NoteModal from "../unsold/NoteModal";
import SoldListingCard from "./SoldListingCard";
import { listingsApi } from "@/lib/api/listings";
import { Image_URL } from "@/config/constants";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";
import { useTranslation } from "react-i18next";
import FeedbackModal from "@/components/WebsiteComponents/FeedbackModel/FeedbackModal";
import { userApi } from "@/lib/api/user";
import { useAuthStore } from "@/lib/stores/authStore";


const filters = [
  { label: "All Time", value: "all" },
  { label: "Last 45 days", value: "45d" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 1 hours", value: "1h" },
];

const SoldClients = () => {
  const [filter, setFilter] = useState("all");
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteMap, setNoteMap] = useState({});
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedFeedbackListing, setSelectedFeedbackListing] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const { user } = useAuthStore();
const loginUserId = user?.id;

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filter, allListings]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await listingsApi.getUserListings({ status: 3 });
      const listData = response || [];
      setAllListings(listData);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleAddFeedback = (listing) => {

  //   setSelectedFeedbackListing(listing);
  //   setIsFeedbackModalOpen(true);
  //   console.log("listbdbd", listing);
  // };
  const handleAddFeedback = (listing) => {
    setSelectedFeedbackListing(listing);
    setIsFeedbackModalOpen(true);

    // ✅ Console full listing object
    console.log("Selected Listing for Feedback:", listing);
    console.log("Listing ID:", listing?.id);
    console.log("Buyer ID:", listing?.buyer?.id);
    console.log("Winning Bid User ID:", listing?.winning_bid?.user?.id);
    console.log("Selling Offers User ID:", listing?.selling_offers?.[0]?.user?.id);
  };

  const applyFilter = () => {
    const now = new Date();
    let threshold;

    if (filter === "45d") {
      threshold = new Date(now.setDate(now.getDate() - 45));
    } else if (filter === "7d") {
      threshold = new Date(now.setDate(now.getDate() - 7));
    } else if (filter === "24h") {
      threshold = new Date(now.setHours(now.getHours() - 24));
    } else if (filter === "1h") {
      threshold = new Date(now.setHours(now.getHours() - 1));
    } else {
      setFilteredListings(allListings);
      return;
    }

    const filtered = allListings.filter((listing) => {
      const createdAt = new Date(listing.created_at);
      return createdAt >= threshold;
    });

    setFilteredListings(filtered);
  };

  const handleOpenNoteModal = (listing) => {
    const image = listing?.images?.[0]?.image_path
      ? `${Image_URL}${listing.images[0].image_path}`
      : "/default-image.jpg";

    const selected = {
      id: listing.id,
      title: listing.title,
      price: listing.buy_now_price,
      views: listing.view_count || 0,
      watchers: 0,
      closingDate: listing.expire_at,
      image,
      note: listing.note || "",
      winner_name: listing?.winning_bid?.user?.name,
    };

    setSelectedListing(selected);
    setIsModalOpen(true);
  };

  const handleNoteSave = async (note) => {
    if (!selectedListing?.id) return;

    try {
      const formData = new FormData();
      formData.append("note", note);

      await listingsApi.PostNote(formData, selectedListing.id);

      const preview = note.split(" ").slice(0, 3).join(" ") + "...";

      setNoteMap((prev) => ({
        ...prev,
        [selectedListing.id]: { note },
      }));
      toast.success("Note Added Successfully.");
      setIsModalOpen(false);
      fetchListings();
    } catch (error) {
      console.error("Failed to post note:", error);
    }
  };
  const handleNoteDelete = async () => {
    if (!selectedListing?.id) return;

    try {
      await listingsApi.DeleteNote(selectedListing.id);

      setNoteMap((prev) => {
        const copy = { ...prev };
        delete copy[selectedListing.id];
        return copy;
      });
      console.log("Note deleted successfully.");

      toast.success("Note deleted successfully.");
      setIsModalOpen(false);
      fetchListings();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };
  // const handleSaveFeedback = async ({ feedback, rating }) => {

  //   if (
  //     !selectedFeedbackListing?.id ||
  //     !selectedFeedbackListing?.winning_bid?.user?.id
  //   ) {
  //     toast.error("Missing listing or creator ID.");
  //     return;
  //   }

  //   const formData = new FormData();
  //   // formData.append("reviewed_user_id", selectedFeedbackListing?.winning_bid?.user?.id);
  //   formData.append(
  //     "reviewed_user_id",
  //     selectedFeedbackListing?.buyer?.id ??
  //       selectedFeedbackListing?.winning_bid?.user?.id ??
  //       selectedFeedbackListing?.selling_offers?.[0]?.id
  //   );

  //   formData.append("listing_id", selectedFeedbackListing.id);
  //   formData.append("rating", rating);
  //   formData.append("feedback_text", feedback);
  //   formData.append("feedback_type", "selling");

  //   // ✅ Print all formData entries
  //   console.log("Form Data:",formData);
  //   for (let pair of formData.entries()) {
  //     console.log(`${pair[0]}: ${pair[1]}`);
  //   }

  //   try {
  //     await userApi.addFeedback(formData);
  //     toast.success(t("Feedback submitted successfully"));
  //     setIsFeedbackModalOpen(false);
  //     setSelectedFeedbackListing(null);
  //   } catch (error) {
  //     console.error("Failed to submit feedback:", error);
  //     toast.error(t("Failed to submit feedback"));
  //   }
  // };
  // const handleSaveFeedback = async ({ feedback, rating }) => {
  //   if (
  //     !selectedFeedbackListing?.id ||
  //     !(
  //       selectedFeedbackListing?.buyer?.id ||
  //       selectedFeedbackListing?.winning_bid?.user?.id ||
  //       selectedFeedbackListing?.selling_offers?.[0]?.id
  //     )
  //   ) {
  //     console.error("❌ Missing listing_id or reviewed_user_id", {
  //       listing: selectedFeedbackListing,
  //     });
  //     toast.error("Missing listing or creator ID.");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append(
  //     "reviewed_user_id",
  //     selectedFeedbackListing?.buyer?.id ??
  //     selectedFeedbackListing?.winning_bid?.user?.id ??
  //     selectedFeedbackListing?.selling_offers?.[0]?.id
  //   );
  //   formData.append("listing_id", selectedFeedbackListing.id);
  //   formData.append("rating", rating);
  //   formData.append("feedback_text", feedback);
  //   formData.append("feedback_type", "selling");

  //   // ✅ Print final data being sent
  //   console.log("🚀 Submitting Feedback with Data:");
  //   for (let [key, value] of formData.entries()) {
  //     console.log(`${key}: ${value}`);
  //   }

  //   try {
  //     await userApi.addFeedback(formData);
  //     toast.success(t("Feedback submitted successfully"));
  //     setIsFeedbackModalOpen(false);
  //     setSelectedFeedbackListing(null);
  //   } catch (error) {
  //     console.error("❌ Failed to submit feedback:", error);
  //     toast.error(t("Failed to submit feedback"));
  //   }
  // };
  const handleSaveFeedback = async ({ feedback, rating }) => {
  if (
    !selectedFeedbackListing?.id ||
    !(
      selectedFeedbackListing?.buyer?.id ||
      selectedFeedbackListing?.winning_bid?.user?.id ||
      selectedFeedbackListing?.selling_offers?.[0]?.user?.id
    )
  ) {
    console.error("❌ Missing listing_id or reviewed_user_id", {
      listing: selectedFeedbackListing,
    });
    toast.error("Missing listing or creator ID.");
    return;
  }

  const reviewedUserId =
    selectedFeedbackListing?.buyer?.id ??
    selectedFeedbackListing?.winning_bid?.user?.id ??
    selectedFeedbackListing?.selling_offers?.[0]?.user?.id;

  const formData = new FormData();
  formData.append("reviewed_user_id", reviewedUserId);
  formData.append("listing_id", selectedFeedbackListing.id);
  formData.append("rating", rating);
  formData.append("feedback_text", feedback);
  formData.append("feedback_type", "selling");

  console.log("🚀 Submitting Feedback with Data:");
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  try {
    await userApi.addFeedback(formData);
    toast.success("Feedback submitted successfully");
    setIsFeedbackModalOpen(false);
    setSelectedFeedbackListing(null);
  } catch (error) {
    console.error("❌ Failed to submit feedback:", error);
    toast.error("Failed to submit feedback");
  }
};

  //  const handleUpdateFeedback = async (feedbackId, { feedback, rating }) => {
  //     if (!selectedFeedbackListing?.id || !selectedFeedbackListing?.created_by) {
  //       toast.error("Missing listing or creator ID.");
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append("reviewed_user_id", selectedFeedbackListing.created_by);
  //     formData.append("listing_id", selectedFeedbackListing.id);
  //     formData.append("rating", rating);
  //     formData.append("feedback_text", feedback);
  //     formData.append("feedback_type", "buying");

  //     // ✅ Print all formData entries
  //     console.log("Update Form Data:");
  //     for (let pair of formData.entries()) {
  //       console.log(`${pair[0]}: ${pair[1]}`);
  //     }

  //     try {
  //       await userApi.updateFeedback(feedbackId, formData);
  //       toast.success(t("Feedback updated successfully"));
  //       setIsFeedbackModalOpen(false);
  //       setSelectedFeedbackListing(null);
  //     } catch (error) {
  //       console.error("Failed to update feedback:", error);
  //       toast.error(t("Failed to update feedback"));
  //     }
  //   };
  // const handleUpdateFeedback = async (feedbackId, { feedback, rating }) => {
  //   if (
  //     !selectedFeedbackListing?.id ||
  //     !(
  //       selectedFeedbackListing?.buyer?.id ||
  //       selectedFeedbackListing?.winning_bid?.user?.id ||
  //       selectedFeedbackListing?.selling_offers?.[0]?.user?.id
  //     )
  //   ) {
  //     toast.error("Missing listing or reviewed user ID.");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append(
  //     "reviewed_user_id",
  //     selectedFeedbackListing?.buyer?.id ??
  //     selectedFeedbackListing?.winning_bid?.user?.id ??
  //     selectedFeedbackListing?.selling_offers?.[0]?.user?.id
  //   );
  //   formData.append("listing_id", selectedFeedbackListing.id);
  //   formData.append("rating", rating);
  //   formData.append("feedback_text", feedback);
  //   formData.append("feedback_type", "selling"); // ✅ selling hi rahega

  //   // ✅ Print data for debugging
  //   console.log("🚀 Update Feedback with Data:");
  //   for (let [key, value] of formData.entries()) {
  //     console.log(`${key}: ${value}`);
  //   }

  //   try {
  //     await userApi.updateFeedback(feedbackId, formData);
  //     toast.success("Feedback updated successfully");
  //     setIsFeedbackModalOpen(false);
  //     setSelectedFeedbackListing(null);
  //   } catch (error) {
  //     console.error("❌ Failed to update feedback:", error);
  //     toast.error("Failed to update feedback");
  //   }
  // };
const handleUpdateFeedback = async (feedbackId, { feedback, rating }) => {
  if (!selectedFeedbackListing?.id) {
    toast.error("Missing listing ID.");
    return;
  }

  // ✅ reviewedUserId ko safe tarike se calculate karo
  const reviewedUserId =
    selectedFeedbackListing?.buyer?.id ??
    selectedFeedbackListing?.winning_bid?.user?.id ??
    selectedFeedbackListing?.selling_offers?.[0]?.user?.id;

  if (!reviewedUserId) {
    toast.error("Missing reviewed user ID.");
    return;
  }

  const formData = new FormData();
  formData.append("reviewed_user_id", reviewedUserId);
  formData.append("listing_id", selectedFeedbackListing.id);
  formData.append("rating", rating);
  formData.append("feedback_text", feedback);
  formData.append("feedback_type", "selling"); // ✅ selling hi rahega

  console.log("🚀 Update Feedback with Data:");
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  try {
    await userApi.updateFeedback(feedbackId, formData);
    toast.success("Feedback updated successfully");
    setIsFeedbackModalOpen(false);
    setSelectedFeedbackListing(null);
  } catch (error) {
    console.error("❌ Failed to update feedback:", error);
    toast.error("Failed to update feedback");
  }
};

  const handleOpenNote = (listing) => {
    const image = listing?.images?.[0]?.image_path
      ? `${Image_URL}${listing.images[0].image_path}`
      : "/default-image.jpg";

    // console.log('listing.winning_bid', listing.winning_bid);

    const selected = {
      id: listing.id,
      title: listing.title,
      price: listing.buy_now_price,
      views: 0,
      watchers: 0,
      closingDate: listing.expire_at,
      image,
      note: listing.note || "",
      winner_name:
        listing?.winning_bid?.user?.name ||
        listing?.selling_offers?.[0]?.user?.name ||
        "",
    };

    setSelectedListing(selected);
    setIsModalOpen(true);
  };

  const items = [
    { label: "Home", href: "/" },
    { label: "Account", href: "/account" },
    { label: "Sold" },
  ];
  const { t } = useTranslation();

  return (
    <div className="min-h-screen text-gray-800">
      <Breadcrumbs
        items={items}
        styles={{
          nav: "flex justify-start text-sm font-medium bg-white border-b border-gray-200 py-2",
        }}
      />

      <h1 className="text-2xl font-bold text-green-600 mb-2 uppercase">
        {t("SOLD")}
      </h1>
      <p className="text-sm mb-4">
        {filteredListings.length} {t("listings")}
      </p>

      <div className="mb-4">
        <select
          className="border border-green-500 text-green-500 px-4 py-1 rounded-full text-sm hover:bg-green-50"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {filters.map((item) => (
            <option key={item.value} value={item.value}>
              {t(item.label)}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p className="text-sm text-gray-500">{t("Loading Listings...")}</p>
      ) : filteredListings.length === 0 ? (
        <p className="text-sm text-gray-500">{t("No listings found.")}</p>
      ) : (
        filteredListings.map((listing) => (
          <SoldListingCard
            key={listing.id}
            listingObj={listing}
            listing={{
              id: listing.id,
              title: listing.title,
              price: listing.buy_now_price,
              views: 0,
              watchers: 0,
              soldDate:
                listing?.buy_now_purchases?.purchased_at ||
                listing?.sold_at ||
                listing?.buy_now_purchases?.[0]?.purchased_at,
              winner_name:
                listing?.winning_bid?.user?.username ||
                listing?.buyer?.username ||
                listing?.selling_offers?.[0]?.user?.username ||
                "N/A",
              image: listing.images?.[0]?.image_path
                ? `${Image_URL}${listing.images[0].image_path}`
                : "/default-image.jpg",
              link: `/marketplace/${listing.category?.slug?.split("/").pop() || "unknown"}/${listing.slug
                }`,
            }}
            actions={[
              {
                label: (
                  <span className="flex items-center gap-1">
                    {listing.note
                      ? listing.note.split(" ").slice(0, 3).join(" ") + "..."
                      : t("Add note")}
                    {listing.note && <FaEdit className="text-xs" />}
                  </span>
                ),

                onClick: () => handleOpenNote(listing),
              },
              // {
              //   label: t("Add feedback"),
              //   onClick: () => handleAddFeedback(listing),
              // },
              //  {
              //       label: t(
              //         listing.feedbacks && listing.feedbacks.length > 0 && listing.feedbacks[0].feedback_text
              //           ? "Edit feedback"
              //           : "Add feedback"
              //       ),
              //       onClick: () => handleAddFeedback(listing),
              //     }
              {
                label: t(
                  listing.feedbacks?.some(
                    (fb) => fb.reviewer_id === loginUserId
                  )
                    ? "Edit feedback"
                    : "Add feedback"
                ),
                onClick: () => handleAddFeedback(listing),
              }

            ]}
          />
        ))
      )}

      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        listing={{
          ...selectedListing,
          // winner_name: selectedListing?.listing?.winning_bid?.user?.name,
        }}
        onSave={handleNoteSave}
        onDelete={handleNoteDelete}
        showStats={false}
        initialNote={selectedListing?.note || ""}
      />
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        listing={selectedFeedbackListing}
        // onSave={handleSaveFeedback}
        perspective="seller"
        onSave={
          selectedFeedbackListing?.feedbacks?.some(
            (fb) => fb.reviewer_id === loginUserId
          )
            ? (data) => {
              const myFeedback = selectedFeedbackListing.feedbacks.find(
                (fb) => fb.reviewer_id === loginUserId
              );
              handleUpdateFeedback(myFeedback.id, data);
            }
            : handleSaveFeedback
        }
        initialFeedback={
          selectedFeedbackListing?.feedbacks?.find(
            (fb) => fb.reviewer_id === loginUserId
          )?.feedback_text || ""
        }
        initialRating={
          selectedFeedbackListing?.feedbacks?.find(
            (fb) => fb.reviewer_id === loginUserId
          )?.rating || 0
        }
      />


      {/* <div className="mt-6 text-center text-sm text-green-600 hover:underline cursor-pointer">
        ↑ Back to top
      </div> */}
    </div>
  );
};

export default SoldClients;
