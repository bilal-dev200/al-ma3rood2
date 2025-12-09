"use client";
import React, { useEffect, useState } from "react";
import { listingsApi } from "@/lib/api/listings";
import { Image_URL } from "@/config/constants";
import ListingCard from "../lost/ListingCard";
import NoteModal from "../../(sell)/unsold/NoteModal";
import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { FaEdit } from "react-icons/fa";

import Link from "next/link";
import { toast } from "react-toastify";

const filters = [
  { label: "All Time", value: "all" },
  { label: "Last 45 days", value: "45d" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 1 hours", value: "1h" },
];
const ListofferClient = () => {
  const [filter, setFilter] = useState("all");
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [noteMap, setNoteMap] = useState({});

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filter, allListings]);
  const { t } = useTranslation();

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await listingsApi.getUserListingsOffer({});
      const listData = response?.buying_offers || [];
      setAllListings(listData);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleOpenNoteModal = (listing) => {
    console.log(listing, "list");
    const image = listing?.listing?.images?.[0]?.image_path
      ? `${Image_URL}${listing?.listing?.images[0]?.image_path}`
      : "/default-image.jpg";

    const selected = {
      id: listing?.listing.id,
      title: listing?.listing.title,
      price: listing?.listing.buy_now_price,
      views: 0,
      watchers: 0,
      closingDate: listing?.expires_at,
      image,
      note: listing?.listing?.note || "",
    };

    setSelectedListing(selected);
    setIsNoteModalOpen(true);
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

    const filtered = (allListings || []).filter((listing) => {
      const createdAt = new Date(listing.created_at);
      return createdAt >= threshold;
    });

    setFilteredListings(filtered);
  };

  const handleCloseModal = () => {
    setIsNoteModalOpen(false);
    setSelectedListing(null);
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

      toast.success(t("Note deleted successfully."));
      setIsNoteModalOpen(false);
      fetchListings();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleSaveNote = async (note) => {
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
    // You can store note to DB if needed
  };
  const items = [
    { label: "Home", href: "/" },
    { label: "Account", href: "/account" },
    { label: "Listoffer" },
  ];

  return (
    <>
      <Breadcrumbs
        items={items.map((item) => ({ ...item, label: t(item.label) }))}
        styles={{
          nav: "flex justify-start text-sm font-medium bg-white border-b border-gray-200 py-2",
        }}
      />
      <div className="min-h-screen text-gray-800 px-2 py-6">
        {/* <div className="text-sm text-gray-600 mb-2">
        Home / My Ma3rood / Buyss/ <span className="text-black">Offers</span>
      </div> */}

        <h1 className="text-2xl font-bold text-green-600 uppercase mb-1">
          {t("Offers")}
        </h1>

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
        <div className="grid gap-4">
          {loading ? (
            <p className="text-sm text-gray-500"> {t("loadingListings")}</p>
          ) : filteredListings.length === 0 ? (
            <p className="text-sm text-gray-500">{t("NoListingsFound")}</p>
          ) : (
            filteredListings.map((listing, index) => {
              const catSlug = listing?.listing?.category?.slug?.includes("/")
                ? listing?.listing.category.slug.split("/").pop()
                : listing?.listing.category?.slug || "unknown";
              return (
                <ListingCard
                  key={index}
                  listing={{
                    id: listing.listing.id,
                    title: listing.listing.title,
                    price: listing.amount || "N/A",
                    offerStatus: listing.status,
                    views: 0,
                    watchers: 0,
                    closingDate: listing.expires_at,
                    image: listing.listing.images?.[0]?.image_path
                      ? `${Image_URL}${listing.listing.images[0].image_path}`
                      : "/default-image.jpg",
                    link: `/marketplace/${catSlug}/${listing.listing.slug}`,
                  }}
                  //               actions={[
                  //                 {
                  //                   label: t("Add note"),
                  //                   onClick: () => handleOpenNoteModal(listing),
                  //                 },
                  //                 {
                  //                   label: t("View new listing"),
                  // onClick: () =>
                  //   router.push(`/marketplace/${listing?.listing?.category?.slug}/${listing?.listing?.id}`),
                  //                 },
                  //               ]}
                  actions={[
                    {
                      label: (
                        <span className="flex items-center gap-1">
                          {listing?.listing.note
                            ? listing.listing.note
                                .split(" ")
                                .slice(0, 3)
                                .join(" ") + "..."
                            : t("Add note")}
                          {listing?.listing.note && (
                            <FaEdit className="text-xs" />
                          )}
                        </span>
                      ),

                      onClick: () => handleOpenNoteModal(listing),
                    },
                    {
                      label: (
                        <Link
                          href={
                            listing?.listing_type === "marketplace"
                              ? `/marketplace`
                              : listing?.listing_type === "property"
                              ? `/property`
                              : listing?.listing_type === "motors"
                              ? `/motors`
                              : `/${listing?.listing_type}`
                          }
                          className="text-blue-600 hover:underline"
                        >
                          {t("View new listing")}
                        </Link>
                      ),
                    },
                  ]}
                />
              );
            })
          )}
        </div>

        {/* ✅ NoteModal */}
        <NoteModal
          isOpen={isNoteModalOpen}
          onClose={handleCloseModal}
          listing={selectedListing}
          initialNote={selectedListing?.note || ""}
          onSave={handleSaveNote}
          onDelete={handleNoteDelete}
          showStats={false}
        />
      </div>
    </>
  );
};

export default ListofferClient;
