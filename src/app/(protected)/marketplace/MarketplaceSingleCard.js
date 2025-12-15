"use client";
import { useTranslation } from "react-i18next";
import { Image_NotFound, Image_URL } from "@/config/constants";
import Link from "next/link";

const MarketplaceSingleCard = ({ card, className = "", viewMode = "grid" }) => {
    const { t } = useTranslation();

    const lastSlug = card.category?.slug?.includes("/")
        ? card.category.slug.split("/").pop()
        : card.category?.slug || "unknown";

    const href =
        card.listing_type === "motors"
            ? `/motors/${card.slug}`
            : card.listing_type === "property"
                ? `/property/${card.slug}`
                : `/marketplace/${lastSlug}/${card.slug}`;

    // LIST VIEW
    if (viewMode === "list") {
        return (
            <Link
                href={href}
                className={`flex flex-col sm:flex-row bg-white border border-gray-100 p-3 rounded-xl hover:shadow-md transition-all gap-4 mb-4 ${className}`}
            >
                {/* Image Section */}
                <div className="relative w-full sm:w-60 h-48 sm:h-36 flex-shrink-0">
                    <img
                        src={
                            card.images?.[0]?.image_path
                                ? `${Image_URL}${card.images?.[0]?.image_path}`
                                : Image_NotFound
                        }
                        alt={card.images?.[0]?.alt_text || "Product Image"}
                        className="w-full h-full object-cover rounded-lg bg-gray-100"
                    />
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col sm:flex-row w-full">

                    {/* Left Info: Category, Title, Location */}
                    <div className="flex-1 flex flex-col items-start justify-start gap-1 pr-2">
                        {card.category?.name && (
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                <span>{t("Category")}:</span>
                                <span className="text-gray-600 font-medium">{card.category.name}</span>
                            </div>
                        )}

                        <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">
                            {card.title}
                        </h3>

                        <div className="mt-auto pt-2">
                            {(card.creator?.regions?.name || card.creator?.billing_address || card.creator?.address_1) && (
                                <div>
                                    <div className="text-[10px] text-gray-400">
                                        {t("Location")}:
                                    </div>
                                    <div className="text-sm font-semibold text-gray-800">
                                        {`${card?.creator?.address_1
                                            ? `${card?.creator?.address_1}, `
                                            : ""
                                            } ${card?.creator?.governorates?.name}, ${card?.creator?.regions?.name
                                            }`}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Info: Date, Price */}
                    <div className="flex flex-row sm:flex-col justify-between items-end text-right pl-0 sm:pl-4 mt-4 sm:mt-0 min-w-[120px]">

                        {/* Date */}
                        <div className="text-xs text-gray-400 mb-1">
                            {/* {card.created_at ? new Date(card.created_at).toLocaleDateString("en-GB") : (card.expire_at ? new Date(card.expire_at).toLocaleDateString("en-GB") : "")} */}
                            {card.expire_at ? (
                                <>
                                    <span>{t("Closes")}</span>:{" "}
                                    {new Date(card.expire_at).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        day: "numeric",
                                        month: "short",
                                    })}
                                </>
                            ) : (
                                <span className="invisible">placeholder</span>
                            )}
                        </div>

                        {/* Price */}
                        <div className="mt-auto">
                            {card.bids_count === 0 ? (
                                card.buy_now_price && (
                                    <div className="flex flex-col items-end">
                                        <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">
                                            {t("Buy Now")}:
                                        </div>
                                        <div className="text-xl font-bold text-gray-900 flex items-center gap-0.5">
                                            <span className="price">$</span>
                                            {card.buy_now_price}
                                        </div>
                                    </div>
                                )
                            ) : card.bids_count && card.bids?.length > 0 ? (
                                <div className="flex flex-col items-end">
                                    <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">
                                        {t("Current Bid")}:
                                    </div>
                                    <div className="text-xl font-bold text-gray-900 flex items-center gap-0.5">
                                        <span className="price">$</span>
                                        {card.bids?.[0]?.amount}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>

                </div>
            </Link>
        );
    }

    // GRID VIEW (Default)
    return (
        <Link
            href={href}
            className={`bg-[#FBFBFB] p-2 rounded hover:shadow-lg transition-shadow flex-shrink-0 flex flex-col ${className}`}
        >
            <div className="relative">
                <img
                    src={
                        card.images?.[0]?.image_path
                            ? `${Image_URL}${card.images?.[0]?.image_path}`
                            : Image_NotFound
                    }
                    alt={card.images?.[0]?.alt_text || "Product Image"}
                    className="w-full h-48 object-cover rounded-t bg-white"
                />
                {/* Only showing badge if specifically requested for grid too, but image only showed list view badge. Assuming fine to add for consistency or leave out. Added for consistency based on image logic. */}
                {/* <div className="absolute top-2 left-2 bg-[#4A4B57] text-white text-[10px] px-2 py-0.5 rounded opacity-90">
                    {t("Marketplace")}
                </div> */}
            </div>

            <div className="px-3 pt-3 flex-grow flex flex-col justify-between">
                <div>
                    <div className="flex items-start justify-between gap-2 line-clamp-2 min-h-[2.5rem]">
                        {card.category?.name && (
                            <span className="text-xs text-gray-600 font-medium">
                                {t("Category")}: {card.category.name}
                            </span>
                        )}
                        <div className="text-xs text-gray-600 font-medium">
                            {card.expire_at ? (
                                <>
                                    <span>{t("Closes")}</span>:{" "}
                                    {new Date(card.expire_at).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        day: "numeric",
                                        month: "short",
                                    })}
                                </>
                            ) : (
                                <span className="invisible">placeholder</span>
                            )}
                        </div>
                    </div>

                    <div className="text-lg font-semibold my-1">
                        {card.title.length > 18
                            ? `${card.title.slice(0, 18)}...`
                            : card.title}
                    </div>

                    <div className="border-t border-gray-200 my-1" />
                </div>

                <div className="flex justify-between mt-1 items-end">
                    <div className="text-gray-700">
                        {(card.creator?.regions?.name || card.creator?.billing_address || card.creator?.address_1) && (
                            <>
                                <div className="text-[10px] text-gray-400 tracking-wide">
                                    {t("Location")}:
                                </div>
                                <div className="font-bold text-xs">
                                    {`${card?.creator?.address_1 ? `${card?.creator?.address_1}, ` : ""
                                        } ${card?.creator?.governorates?.name || ''}, ${card?.creator?.regions?.name || ''
                                        }`}
                                </div>
                            </>
                        )}
                    </div>

                    {card.bids_count === 0 ? (
                        card.buy_now_price && (
                            <div className="text-right text-gray-700 flex flex-col items-end">
                                <div className="text-[9px] text-gray-400 uppercase tracking-wide">
                                    {t("Buy Now")}:
                                </div>
                                <div className="font-bold">
                                    <span className="price">$</span>
                                    {card.buy_now_price}
                                </div>
                            </div>
                        )
                    ) : card.bids_count && card.bids?.length > 0 ? (
                        <div className="text-right text-gray-700 flex flex-col items-end">
                            <div className="text-[9px] text-gray-400 uppercase tracking-wide">
                                {t("Current Bid")}:
                            </div>
                            <div className="font-bold">
                                <span className="price">$</span>
                                {card.bids?.[0]?.amount}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </Link>
    );
};

export default MarketplaceSingleCard;
