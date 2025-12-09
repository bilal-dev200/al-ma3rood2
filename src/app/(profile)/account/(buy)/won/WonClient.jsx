"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listingsApi } from "@/lib/api/listings";
import { Image_URL } from "@/config/constants";
import ListingCard from "../lost/ListingCard";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";
import NoteModal from "../../(sell)/unsold/NoteModal";
import { useTranslation } from "react-i18next";
import FeedbackModal from "@/components/WebsiteComponents/FeedbackModel/FeedbackModal";
import { useAuthStore } from "@/lib/stores/authStore";
import { userApi } from "@/lib/api/user";

const filters = [
  { label: "All Time", value: "all" },
  { label: "Last 45 days", value: "45d" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 1 hours", value: "1h" },
];
const WonClient = () => {
  const [filter, setFilter] = useState("all");
  const router = useRouter();
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [noteMap, setNoteMap] = useState({});
  const { t } = useTranslation();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedFeedbackListing, setSelectedFeedbackListing] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filter, allListings]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await listingsApi.getUserWonListings({});
      const listData = response || [];
      console.log(listData, "ff");
      setAllListings(listData);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };
  const items = [
    { label: "Home", href: "/" },
    { label: "Account", href: "/account" },
    { label: "Won" },
  ];

  const applyFilter = () => {
    const now = new Date();
    let threshold;

    if (filter === "45d") {
      threshold = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000);
    } else if (filter === "7d") {
      threshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (filter === "24h") {
      threshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else if (filter === "1h") {
      threshold = new Date(now.getTime() - 60 * 60 * 1000);
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

  const handleCloseModal = () => {
    setIsNoteModalOpen(false);
    setSelectedListing(null);
  };
  const handleAddFeedback = (listing) => {
    setSelectedFeedbackListing(listing);
    setIsFeedbackModalOpen(true);
  };
  const handleAddNote = (listing) => {
    const image = listing?.images?.[0]?.image_path
      ? `${Image_URL}${listing.images[0].image_path}`
      : "/default-image.jpg";

    const selected = {
      id: listing.id,
      title: listing.title,
      closingDate: listing.expire_at,
      image,
      note: listing.note || "",
    };

    setSelectedListing(selected);
    setIsNoteModalOpen(true);
  };

  // const handleSaveFeedback = async ({ feedback, rating }) => {
  //   if (!selectedFeedbackListing?.id || !user?.id) {
  //     toast.error("Missing user or listing ID.");
  //     return;
  //   }

  //   const formData = new FormData();
  // formData.append("reviewed_user_id", selectedFeedbackListing?.creator?.id);
  //   formData.append("listing_id", selectedFeedbackListing.id);
  //   formData.append("rating", rating);
  //   formData.append("feedback_text", feedback);
  //   formData.append("feedback_type", "buying");

  //   console.log("formData values:");
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
  //   if (!selectedFeedbackListing?.id || !selectedFeedbackListing?.created_by) {
  //     toast.error("Missing listing or creator ID.");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("reviewed_user_id", selectedFeedbackListing.created_by); // ✅ Corrected
  //   formData.append("listing_id", selectedFeedbackListing.id);
  //   formData.append("rating", rating);
  //   formData.append("feedback_text", feedback);
  //   formData.append("feedback_type", "buying");

  //   try {
  //     await userApi.addFeedback(formData);
  //     toast.success(t("Feedback submitted successfully"));
  //     setIsFeedbackModalOpen(false);
  //     setSelectedFeedbackListing(null);
  //     console.log()
  //   } catch (error) {
  //     console.error("Failed to submit feedback:", error);
  //     toast.error(t("Failed to submit feedback"));
  //   }
  // };

  const handleSaveFeedback = async ({ feedback, rating }) => {
    if (!selectedFeedbackListing?.id || !selectedFeedbackListing?.created_by) {
      toast.error("Missing listing or creator ID.");
      return;
    }
    const formData = new FormData();
    formData.append("reviewed_user_id", selectedFeedbackListing.created_by); // ✅ Corrected
    formData.append("listing_id", selectedFeedbackListing.id);
    formData.append("rating", rating);
    formData.append("feedback_text", feedback);
    formData.append("feedback_type", "buying");

    // ✅ Print all formData entries
    console.log("Form Data:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      await userApi.addFeedback(formData);
      toast.success(t("Feedback submitted successfully"));
      setIsFeedbackModalOpen(false);
      setSelectedFeedbackListing(null);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast.error(t("Failed to submit feedback"));
    }
  };

  const handleUpdateFeedback = async (feedbackId, { feedback, rating }) => {
    if (!selectedFeedbackListing?.id || !selectedFeedbackListing?.created_by) {
      toast.error("Missing listing or creator ID.");
      return;
    }

    const formData = new FormData();
    formData.append("reviewed_user_id", selectedFeedbackListing.created_by);
    formData.append("listing_id", selectedFeedbackListing.id);
    formData.append("rating", rating);
    formData.append("feedback_text", feedback);
    formData.append("feedback_type", "buying");

    // ✅ Print all formData entries
    console.log("Update Form Data:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      await userApi.updateFeedback(feedbackId, formData);
      toast.success(t("Feedback updated successfully"));
      setIsFeedbackModalOpen(false);
      setSelectedFeedbackListing(null);
    } catch (error) {
      console.error("Failed to update feedback:", error);
      toast.error(t("Failed to update feedback"));
    }
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

      // ✅ update selectedListing.note directly:
      setSelectedListing((prev) => ({
        ...prev,
        note: note,
      }));

      toast.success("Note added successfully.");
      setIsNoteModalOpen(false);
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
      setIsNoteModalOpen(false);
      fetchListings();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  return (
    <>
      <Breadcrumbs
        items={items.map((item) => ({ ...item, label: t(item.label) }))}
        styles={{
          nav: "flex justify-start text-sm font-medium bg-white border-b border-gray-200 py-2",
        }}
      />
      <div className="min-h-screen text-gray-800 px-1 py-6">
        <h1 className="text-2xl font-bold text-green-600 uppercase mb-1">
          {" "}
          {t("Won")}
        </h1>

        <div className="mb-4">
          <select
            className="border border-green-500 text-green-500 px-4 py-1 rounded-full text-sm hover:bg-green-50"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {filters.map((item) => (
              <option key={item.value} value={item.value}>
                {t(item.label)}{" "}
              </option>
            ))}
          </select>
        </div>

        {/* Listings */}
        <div className="grid gap-4">
          {loading ? (
            <p className="text-sm text-gray-500">{t("Loading Listings")}</p>
          ) : filteredListings.length === 0 ? (
            <p className="text-sm text-gray-500">{t("noListingsFound")}</p>
          ) : (
            filteredListings.map((listing) => {
              return (
                <ListingCard
                  key={listing.id}
                  listing={{
                    id: listing.id,
                    title: listing.title,
                    price: listing.buy_now_price || "N/A",
                    views: listing.view_count || 0,
                    watchers: 0,
                    closingDate: listing.expire_at,
                    image: listing.images?.[0]?.image_path
                      ? `${Image_URL}${listing.images[0].image_path}`
                      : "/default-image.jpg",
                    link: `/marketplace/${
                      listing.category?.slug?.split("/").pop() || "unknown"
                    }/${listing.slug}`,
                  }}
                  actions={[
                    {
                      label: (
                        <span className="flex items-center gap-1">
                          {listing.note
                            ? listing.note.split(" ").slice(0, 3).join(" ") +
                              "..."
                            : t("Add note")}
                          {listing.note && <FaEdit className="text-xs" />}
                        </span>
                      ),

                      onClick: () => handleAddNote(listing),
                    },
                    {
                      label: t("View new listing"),
                      onClick: () =>
                        router.push(
                          listing?.listing_type === "marketplace"
                            ? `/marketplace`
                            : listing?.listing_type === "property"
                            ? `/property`
                            : listing?.listing_type === "motors"
                            ? `/motors`
                            : `/${listing?.listing_type}`
                        ),
                    },
                    // {
                    //   label: t("Add feedback"),
                    //   onClick: () => handleAddFeedback(listing),
                    // },
                    // {
                    //   label: t(listing.feedback ? "Edit feedback" : "Add feedback"),
                    //   onClick: () => handleAddFeedback(listing),
                    // }
                    // {
                    //   label: t(
                    //     listing.feedbacks && listing.feedbacks.length > 0 && listing.feedbacks[0].feedback_text
                    //       ? "Edit feedback"
                    //       : "Add feedback"
                    //   ),
                    //   onClick: () => handleAddFeedback(listing),
                    // }
                    {
                      label: t(
                        listing.feedbacks &&
                          listing.feedbacks.length > 0 &&
                          listing.feedbacks.some(
                            (fb) => fb.reviewer_id === user?.id
                          ) // ✅ check if logged in user already gave feedback
                          ? "Edit feedback"
                          : "Add feedback"
                      ),
                      onClick: () => handleAddFeedback(listing),
                    },
                  ]}
                />
              );
            })
          )}
        </div>
        {/* 
        <FeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
          onSave={
            selectedFeedbackListing?.feedbacks?.length > 0
              ? (data) => handleUpdateFeedback(
                selectedFeedbackListing.feedbacks[0].id,
                data
              )
              : handleSaveFeedback
          }
          initialFeedback={selectedFeedbackListing?.feedbacks?.[0]?.feedback_text || ""}
          initialRating={selectedFeedbackListing?.feedbacks?.[0]?.rating || 0} /> */}
        <FeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
          listing={selectedFeedbackListing}
          perspective="buyer"
          onSave={
            selectedFeedbackListing?.feedbacks?.some(
              (fb) => fb.reviewer_id === user?.id
            )
              ? (data) => {
                  const existingFeedback =
                    selectedFeedbackListing.feedbacks.find(
                      (fb) => fb.reviewer_id === user?.id
                    );
                  return handleUpdateFeedback(existingFeedback.id, data);
                }
              : handleSaveFeedback
          }
          initialFeedback={
            selectedFeedbackListing?.feedbacks?.find(
              (fb) => fb.reviewer_id === user?.id
            )?.feedback_text || ""
          }
          initialRating={
            selectedFeedbackListing?.feedbacks?.find(
              (fb) => fb.reviewer_id === user?.id
            )?.rating || 0
          }
        />

        {/* ✅ NoteModal */}
        <NoteModal
          isOpen={isNoteModalOpen}
          onClose={handleCloseModal}
          listing={selectedListing}
          onDelete={handleNoteDelete}
          onSave={handleNoteSave}
          showStats={false}
          initialNote={selectedListing?.note || ""}
        />
      </div>
    </>
  );
};

export default WonClient;
