"use client";
import { Image_NotFound, Image_URL } from "@/config/constants";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/stores/authStore";
import Watch from "@/components/WebsiteComponents/HomePageComponents/Watch";

const AuctionGrid = ({ heading, cards, centerHeading = false }) => {
  const { t } = useTranslation();
  console.log('cards', cards);

  return (
    <div className="">
      <h2
        className={`text-lg sm:text-xl md:text-2xl font-semibold pb-1 mb-6 text-left whitespace-nowrap sm:whitespace-normal`}
      >
        <span className="inline-block border-b-2 border-gray-400">
          <span className="price">$</span>
          {t("1 Reserve")}
        </span>
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards?.length > 0 &&
          cards.map((card, index) => (
            <Link
              key={index}
              href={`/marketplace/${card.category?.slug?.split("/").pop() || "unknown"}/${card.slug
                }`}

              className="block bg-[#FBFBFB] p-1 md:p-2 rounded hover:shadow-lg transition-shadow w-full"
            >
              <div className="relative w-full h-44 rounded-t overflow-hidden">
                <img
                  src={
                    card.images?.[0]?.image_path
                      ? `${Image_URL}${card.images?.[0]?.image_path}`
                      : Image_NotFound
                  }
                  alt={card.images?.[0]?.alt_text || "Product Image"}
                  className="w-full h-48 object-cover rounded-t bg-white"
                  style={{ maxHeight: 400 }}
                />
              </div>
              <div className="px-3 pt-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  {card.category?.name && (
                    <span className="text-xs text-gray-600 font-medium">
                      Category: {card.category.name}
                    </span>
                  )}
                  {card.expire_at && (
                    <span className="text-xs text-gray-400">
                      Closes:{" "}
                      {new Date(card.expire_at).toLocaleDateString("en-US", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  )}
                </div>
                {/* <div className="flex flex-wrap gap-2 text-[11px] text-gray-500 mb-1">
                {card.brand && <span>{card.brand}</span>}
                {card.condition && <span>{card.condition}</span>}
                {card.category?.name && <span>{card.category.name}</span>}
                {card.size && <span>Size: {card.size}</span>}
                {card.style && <span>Style: {card.style}</span>}
              </div> */}
                {/* <div className="flex justify-between items-center text-[10px] text-gray-400 mb-1">
                {card.tags?.split("•").map((item, idx) => (
                  <span key={idx} className="mr-2">
                    {item.trim()}
                  </span>
                ))}
              </div> */}
              </div>

              <div className="px-3 text-sm font-semibold">{card.title}</div>
              <div className="border-t border-gray-200 mx-3 my-1" />

              <div className="text-gray-700 flex flex-col items-end">
                <div className="text-[9px] text-gray-400 uppercase tracking-wide">
                  Buy Now
                </div>
                <p className="font-bold"><span className="price">$</span>{card.buy_now_price}</p>
              </div>

              {/* <div className="px-3 pb-3 pt-1 text-gray-700">
              <div className="text-[9px] text-gray-400 uppercase tracking-wide">
                {card.sm}
              </div>
              {card.price}
            </div> */}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default AuctionGrid;
