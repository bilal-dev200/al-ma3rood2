// src/app/(profile)/account/favourite/FavouriteClientPage.js

"use client";
import { userApi } from "@/lib/api/user";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";
import Image from "next/image";
import { Image_URL } from "@/config/constants";
import { useTranslation } from "react-i18next";
import { useSellerFavoritesStore } from "@/lib/stores/sellerFavoritesStore";

const items = [
  { label: "Home", href: "/" },
  { label: "Account", href: "/account" },
  { label: "Favourite" },
];

const FavouriteClientPage = () => {
  const [activeTab, setActiveTab] = useState("sellers");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [favouriteCategories, setFavouriteCategories] = useState([]);
  const { 
    favoriteSellers, 
    fetchSellerFavorites, 
    toggleSellerFavorite 
  } = useSellerFavoritesStore();
  const favouriteSeller = favoriteSellers;

  useEffect(() => {
    fetchListings();
  }, []);
  const { t } = useTranslation();
  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await userApi.categoryFavorites();
      await fetchSellerFavorites();

      setFavouriteCategories(response.data || []);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!favouriteSeller && !favouriteCategories) {
    return (
      <div className="min-h-screen px-4 py-6 text-gray-800">
        <p>Loading notifications...</p>
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
      <div className="mt-5 min-h-screen font-sans w-full mx-auto">
        <h1 className="text-2xl font-bold text-green-600 mb-2">
          {" "}
          {t("FAVOURITES")}
        </h1>

        <div className="flex flex-wrap gap-1 text-sm text-gray-600 mb-4">
          {t("Manage additional email settings on your")}{" "}
          <div className="text-green-500 underline cursor-not-allowed opacity-50">
            {t("email preferences page.")}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-6 text-gray-600 border-b mb-4">
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-1 pb-2 ${
              activeTab === "categories"
                ? "font-semibold border-b-2 border-black text-black"
                : "hover:text-black"
            }`}
          >
            🗂️ <span>{t("Categories")}</span>
          </button>
          <button
            onClick={() => setActiveTab("sellers")}
            className={`flex items-center gap-1 pb-2 ${
              activeTab === "sellers"
                ? "font-semibold border-b-2 border-black text-black"
                : "hover:text-black"
            }`}
          >
            👤 <span>{t("Sellers")}</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === "sellers" ? (
          <>
            <p className="text-sm text-gray-700 mb-3">
              {favouriteSeller.length} {t("Favourite seller")}
              {favouriteSeller.length > 1 && "s"}
            </p>

            {favouriteSeller.map((seller) => (
              <div
                key={seller.id}
                className="bg-white p-4 rounded-md shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-3"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#469BDB] text-green-50 flex items-center justify-center text-xl font-bold">
                    {seller?.profile_photo ? (
                      <Image
                        src={`${Image_URL}${seller.profile_photo}`}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="object-cover rounded-full"
                      />
                    ) : (
                      seller?.name?.charAt(0)?.toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-green-600 font-medium flex items-center gap-1 flex-wrap">
                      {seller.name}{" "}
                      <span className="text-black">({seller.rating}</span>
                      <span>{"🌟".repeat(seller.stars)})</span>
                    </p>
                    <div 
                      className="text-green-500 text-sm underline cursor-pointer hover:text-green-700"
                      onClick={() => {
                        router.push(`/marketplace/creator?creator_id=${seller.id}&status=1`);
                      }}
                    >
                      {t("View current listings")}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start sm:items-end text-sm text-green-600">
                  {/* <button className="mr-2 cursor-not-allowed opacity-50">
                    {t("Email me weekly")}
                  </button> */}
                  <button
                    className="underline cursor-pointer"
                    onClick={async () => {
                      try {
                        await toggleSellerFavorite(seller.id);
                        toast.success(t("Seller removed from favourites"));
                      } catch (error) {
                        console.error("Error removing Seller", error);
                        toast.error(t("Failed to remove Seller"));
                      }
                    }}
                  >
                    {t("Remove")}
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <p className="text-sm text-gray-700 mb-3">
              {favouriteCategories.length} {t("Favourite categor")}
              {favouriteCategories.length > 1 ? "ies" : "y"}
            </p>

            {favouriteCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white p-4 rounded-md shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-3"
              >
                <div>
                  <p className="font-semibold text-green-600">
                    {category.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {category.listings_count} {t("items")}
                  </p>
                </div>
                <div className="flex flex-col text-sm text-green-600 items-start sm:items-end">
                  <div
                    className="mb-2 underline cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/marketplace/${category.slug}?categoryId=${category.id}`
                      )
                    }
                  >
                    {t("View listings")}
                  </div>
                  <button
                    className="underline cursor-pointer"
                    onClick={async () => {
                      try {
                        await userApi.addAndDeleteFavorities(category.id);
                        setFavouriteCategories((prev) =>
                          prev.filter((item) => item.id !== category.id)
                        );
                        toast.success("Category removed from favourites");
                      } catch (error) {
                        console.error("Error removing category", error);
                        toast.error("Failed to remove category");
                      }
                    }}
                  >
                    {t("Remove")}
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default FavouriteClientPage;
