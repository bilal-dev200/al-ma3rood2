"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import ListingCard from "../selling/ListingCard";
import NoteModal from "./NoteModal";
import { listingsApi } from "@/lib/api/listings";
import { Image_URL } from "@/config/constants";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import RelistModal from "./RelistModal";
import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";
import { useTranslation } from "react-i18next";

const filters = [
  { label: "All Time", value: "all" },
  { label: "Last 45 days", value: "45d" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 1 hours", value: "1h" },
];

export default function UnsoldClient() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [noteMap, setNoteMap] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedRelistListing, setSelectedRelistListing] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filter, allListings]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await listingsApi.getUserListings({
        status: [4, 5],
      });
      const listData = response || [];
      setAllListings(listData);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
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
      views: listing.view_count,
      watchers: 0,
      closingDate: listing.expire_at,
      image,
      note: listing.note || "",
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
      toast.success("Note Add successfully.");
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

  const commonActions = (listing) => [
    {
      label: (
        <span className="flex items-center gap-1">
          {listing.note
            ? listing.note.split(" ").slice(0, 3).join(" ") + "..."
            : "Add note"}
          {listing.note && <FaEdit className="text-xs" />}
        </span>
      ),

      onClick: () => handleOpenNoteModal(listing),
    },
    ,
    { label: "Relist", href: `/edit/${listing.id}` },
    { label: "Sell similar item", onClick: () => alert("Selling similar...") },
  ];

  const handleRelist = async (listingId) => {
    try {
      await listingsApi.userReList(listingId);
      toast.success("Listing relisted successfully.");
      fetchListings(); // Refresh the listings
    } catch (error) {
      console.error("Failed to relist:", error);
      toast.error("Failed to relist the listing.");
    }
  };

  const items = [
    { label: "Home", href: "/" },
    { label: "Account", href: "/account" },
    { label: "Unsold" },
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
        {t("UNSOLD")}
      </h1>
      <p className="text-sm mb-4 mt-3">
        {filteredListings.length} {t("listings")}
      </p>

      {/* Filter Dropdown */}
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

      {/* Listings */}
      {loading ? (
        <p className="text-sm text-gray-500">{t("Loading Listings...")}</p>
      ) : filteredListings.length === 0 ? (
        <p className="text-sm text-gray-500">{t("No listings found.")}</p>
      ) : (
        filteredListings.map((listing) => {
          const handleSeeSimilarClick = (listing) => {

            switch (listing.listing_type) {
              case "marketplace":
                router.push(`/marketplace`);
                break;
                case "property":
                router.push(`/property`);
                break;
              case "motors":
                router.push(`/motors`);
                break;
            default:
              console.warn("Unknown listing type:", listing.listing_type);
              break;
          }
        };
          return (
          <ListingCard
            key={listing.id}
            listing={{
              id: listing.id,
              title: listing.title,
              listing_type: listing.listing_type,
              reserve_price: listing.reserve_price,
              bids: listing.bids,
              status: listing.status,
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
            // actions={commonActions(listing)}
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

                onClick: () => handleOpenNoteModal(listing),
              },
              ,
              // { label: "Relist", onClick: () => {handleRelist(listing.slug)} },
              // { label: "Relist", onClick: () => setShowModal(true) },
              // {
              //   label: "Relist",
              //   onClick: () => {
              //     setSelectedRelistSlug(listing.slug);
              //     setShowModal(true);
              //   },
              // },
              {
                label: t("Relist"),
                onClick: () => {
                  setSelectedRelistListing(listing); // Save the listing object
                  setShowModal(true); // Open modal
                },
              },

              {
                label: t("See similar"),
                onClick: () => handleSeeSimilarClick(listing),
              },
            ]}
          />
        )})
      )}

      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        listing={selectedListing}
        onSave={handleNoteSave}
        initialNote={selectedListing?.note || ""}
        onDelete={handleNoteDelete}
      />
      <RelistModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onQuickRelist={() => {
          if (selectedRelistListing) {
            handleRelist(selectedRelistListing.slug);
            setShowModal(false);
          }
        }}
        onEdit={() => {
          if (selectedRelistListing) {
            router.push(`/listing/edit/${selectedRelistListing.slug}`);
            setShowModal(false);
          }
        }}
        quickRelistLabel={t("Quick Relist")}
        editLabel={t("Edit Listing")}
      />
    </div>
  );
}
