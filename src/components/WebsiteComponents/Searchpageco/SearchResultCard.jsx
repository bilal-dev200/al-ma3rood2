"use client";
import React from "react";
import Link from "next/link";
import { Image_URL, Image_NotFound } from "@/config/constants";
import { MapPin, Calendar, Briefcase, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";

const SearchResultCard = ({ item, viewMode = "grid" }) => {
    const { t } = useTranslation();

    const getImageSrc = () => {
        if (item.type === "listing" || item.type === "service") {
            return item?.images?.[0]?.image_path
                ? `${Image_URL}${item.images[0].image_path}`
                : Image_NotFound;
        }
        if (item.type === "job") {
            return item?.media_files?.[0]?.file_path ? `${Image_URL}${item.media_files[0].file_path}` : Image_NotFound;
        }
        return Image_NotFound;
    };

    const getLink = () => {
        // Logic from GridLayout handleSelectProduct
        const catSlug = item.category?.slug?.includes("/")
            ? item.category.slug.split("/").pop()
            : item.category?.slug || "unknown";

        if (item.type === "service") {
            return `/services/${item?.slug}`;
        }
        if (item.type === "job") {
            return `/jobs/${item?.slug}`;
        }

        // Default listing handling
        switch (item.listing_type) {
            case "marketplace":
                return `/marketplace/${catSlug}/${item?.slug}`;
            case "property":
            case "motors":
                return `/${item.listing_type}/${item?.slug}`;
            default:
                // Fallback if listing_type is missing but it is a listing
                return `/marketplace/${catSlug}/${item?.slug}`;
        }
    };

    const formatPrice = (price) => {
        if (!price) return null;
        const numPrice = parseFloat(String(price).replace(/,/g, ""));
        if (isNaN(numPrice)) return price;
        return numPrice.toLocaleString();
    }

    const renderPrice = () => {
        if (item.type === "job") return null;

        let price = null;
        let unit = "";

        if (item.type === "listing") {
            price = item.buy_now_price;
        } else if (item.type === "service") {
            price = item.price;
            unit = item.price_unit;
        }

        if (price) {
            return (
                <div className="text-right text-gray-700 flex flex-col items-end">
                    <div className="text-[9px] text-gray-400 uppercase tracking-wide">
                        {t("Price")}:
                    </div>
                    <div className="font-bold">
                        <span className="price">$</span>
                        {formatPrice(price)} {unit && <span className="text-sm text-gray-500 font-normal">/ {unit}</span>}
                    </div>
                </div>
            );
        }
        return <p className="text-gray-500 mt-2 text-sm">{t("Price on application")}</p>;
    };

    const isList = viewMode === "list";

    return (
        <Link
            href={getLink()}
            className={`
                ${isList
                    ? "flex flex-row w-full bg-[#FBFBFB] p-2 rounded hover:shadow-lg transition-shadow border border-gray-100"
                    : "block w-full bg-[#FBFBFB] p-2 rounded hover:shadow-lg transition-shadow"
                }
            `}
        >
            {/* Image Section */}
            <div className={`relative flex-shrink-0 ${isList ? 'w-48 h-48 sm:h-auto' : 'w-full h-48'} bg-white rounded overflow-hidden`}>
                <img
                    src={getImageSrc()}
                    alt={item.title || "Item Image"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = Image_NotFound;
                    }}
                />
                {/* Type Badge */}
                <div className="absolute top-2 left-2">
                    <span className="bg-black/50 text-white px-2 py-0.5 rounded text-xs capitalize backdrop-blur-sm">
                        {item.type === 'listing' ? item.listing_type || 'Item' : item.type}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className={`${isList ? "p-4 flex-grow flex flex-col justify-between" : "px-3 pt-3"}`}>
                <div>
                    {/* Metadata Row (Category / Date) akin to MarketplaceCard */}
                    <div className="flex items-center justify-between gap-2 mb-1">
                        {item.category?.name && (
                            <span className="text-xs text-gray-600 font-medium">
                                {t("Category")}: {item.category.name}
                            </span>
                        )}
                        <div className="text-xs text-gray-600 font-medium">
                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
                        </div>
                    </div>


                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1">
                        {item.title}
                    </h3>

                    <div className="border-t border-gray-200 my-1" />

                    {item.type === 'job' && item.company_name && (
                        <p className="text-sm text-gray-600 mb-2 flex items-center">
                            <Briefcase className="w-4 h-4 mr-1" /> {item.company_name}
                        </p>
                    )}
                </div>

                <div className="flex justify-between items-end mt-1">
                    {/* Location (similar to MarketplaceCard) */}
                    <div className="text-gray-700">
                        {(item.location || item.city || item.creator?.city || item.creator?.regions?.name) && (
                            <>
                                <div className="text-[10px] text-gray-400 tracking-wide">{t("Location")}:</div>
                                <div className="font-bold text-xs">{item.location || item.city || item.creator?.city || item.creator?.regions?.name}</div>
                            </>
                        )}
                    </div>

                    <div>
                        {renderPrice()}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default SearchResultCard;
