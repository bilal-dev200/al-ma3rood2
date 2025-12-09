"use client";
import { useTranslation } from "react-i18next";
import Pagination from "@/components/WebsiteComponents/ReuseableComponenets/Pagination";
import {
  filterCategories as categoryFilters, // renamed imported variable if needed
  Image_NotFound,
  Image_URL,
} from "@/config/constants";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const Market = ({
  heading,
  cards,
  categories,
  centerHeading = false,
  showCategoryFilters = false,
  layout = "grid", // 'grid' or 'list'
  pagination, // { currentPage, totalPages }
  onPageChange,
}) => {
  const { t } = useTranslation();
  const categoryNames = categories?.data?.map((category) => category.name);

  return (
    <div className="">
      <h2
        className={`text-2xl font-semibold pb-1 mb-6 ${centerHeading ? "text-center" : ""
          }`}
      >
        <span className="inline-block border-b-2 border-gray-400">
          {t(
            decodeURIComponent(heading)
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          )}
        </span>
      </h2>

      {showCategoryFilters && (
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {categoryNames?.map((category, index) => (
            <button
              key={index}
              className="px-4 py-2 text-sm rounded-full border border-black-600 hover:bg-black-100 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div
        className={
          layout === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            : "flex flex-col gap-4"
        }
      >
        {cards?.length > 0 ? (
          cards.map((card, index) => (
            <Link
              key={index}
              href={`/marketplace/${card.category?.slug?.split("/").pop() || "unknown"}/${card.slug
                }`}
              className={
                layout === "grid"
                  ? "block bg-[#FBFBFB] p-2 rounded hover:shadow-lg transition-shadow w-full"
                  : "flex bg-[#FBFBFB] p-2 rounded hover:shadow-lg transition-shadow w-full max-w-2xl"
              }
            >
              <img
                src={
                  card.images?.[0]?.image_path
                    ? `${Image_URL}${card.images?.[0]?.image_path}`
                    : Image_NotFound
                }
                alt={card.images?.[0]?.alt_text || "Product Image"}
                className={
                  layout === "grid"
                    ? "w-full h-48 object-cover rounded-t bg-white"
                    : "w-32 h-32 object-cover rounded bg-white mr-4"
                }
              />

              <div
                className={
                  layout === "grid"
                    ? "px-3 pt-3"
                    : "flex-1 flex flex-col justify-between py-2"
                }
              >
                <div className="flex items-start justify-between gap-2 mb-1 line-clamp-2 min-h-[2.5rem]">
                  {card.category?.name && (
                    <span className="text-xs text-gray-600 font-medium">
                      {t("Category")}: {card.category.name}
                    </span>
                  )}

                  <div className="text-xs text-gray-600 font-medium">
                    {card.expire_at ? (
                      <>
                        <span className="">{t("Closes")}</span>:{" "}
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

                <div className="text-lg font-semibold">
                  <div className="text-lg font-semibold">
                    {card.title.length > 18
                      ? `${card.title.slice(0, 18)}...`
                      : card.title}

                    <div className="border-t border-gray-200 my-1" />

                    <div className="flex justify-between mt-1">
                      {/* {(card.creator?.city ||
                        card.creator?.billing_address) && (
                          <div className="text-gray-700">
                            <div className="text-[10px] text-gray-400  tracking-wide">
                              {t("City")}:{" "}
                            </div>
                            <div className="font-bold text-xs">
                              {card.creator.city || card.creator.billing_address}
                            </div>
                          </div>
                        )} */}
                        <div className="text-gray-700">
                         {(card.creator?.regions?.name || card.creator?.city) && (
                          <>
                        <div className="text-[10px] text-gray-400 tracking-wide">
                          {t("Location")}:
                        </div>
                        <div className="font-bold text-xs">
                          {(`${card?.creator?.address_1 ? `${card?.creator?.address_1}, ` : ""} ${card?.creator?.governorates?.name}, ${card?.creator?.regions?.name}`)}
                        </div>
                        </>
                         )}
                      </div>

                     {card.bids_count === 0
                      ? card.buy_now_price && (
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
                      : card.bids_count &&
                        card.bids?.length > 0 && (
                          <div className="text-right text-gray-700 flex flex-col items-end">
                            <div className="text-[9px] text-gray-400 uppercase tracking-wide">
                              {t("Current Bid")}:
                            </div>
                            <div className="font-bold">
                              <span className="price">$</span>
                              {card.bids?.[0]?.amount}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* {(card.creator?.city || card.creator?.billing_address) && (
                      <div className="text-sm text-green-600 font-bold mt-1">
                        {t("City")}:{" "}
                        {card.creator.city || card.creator.billing_address}
                      </div>
                    )} */}
                  {/* {card.expire_at && (
                      <span className="text-xs text-gray-400">
                        {t("Closes")}:{" "}
                        {new Date(card.expire_at).toLocaleDateString("en-US", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    )} */}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center col-span-full text-gray-500 py-6">
            {t("No products found")}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default Market;
