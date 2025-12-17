import React from "react";
import Link from "next/link";
import { Image_URL } from "@/config/constants";
import { FaBath, FaBed, FaRulerCombined } from "react-icons/fa";
import { House } from "lucide-react";

const PropertyCard = ({ listing, viewMode }) => {
  const getAttributeValue = (key) => {
    const attribute = listing.attributes?.find((attr) => attr.key === key);
    return attribute ? attribute.value : null;
  };

  return (
    //  <div
    //             key={key}
    //             className={`relative rounded-lg overflow-visible ${viewMode == 'grid' ? 'flex flex-col' : 'flex flex-row justify-center items-center'}`}
    //           >
    //             <Link href={`/property/${listing.slug}`} >
    //             {listing.images && listing.images.length > 0 ? (
    //     <img
    //       src={`${Image_URL}/${listing.images[0].image_path}`}
    //       alt={listing.title}
    //       className="w-[500px] h-52 object-cover"
    //     />
    //   ) : (
    //     <div className="w-full h-full flex items-center justify-center text-gray-400">
    //       <House className="w-16 h-16" />
    //     </div>
    //   )}

    //             <div className={`flex flex-col ${viewMode == 'grid' ?  'mx-auto' : 'mx-0 h-44'} bg-[#175f48] text-white p-2 shadow-lg z-14 `}>
    //               <h3 className="text-sm font-semibold">{listing.title}</h3>
    //               <p className="text-xs">{listing.city}</p>
    //               <div className="flex justify-between text-[11px] text-start flex-wrap gap-y-5 mt-5">
    //                 {listing?.bedrooms &&  (
    //                 <div className="flex items-center gap-1">
    //                 <FaBed /> {listing?.bedrooms}

    //                 </div>
    //                    ) }
    //                  {listing?.land_area &&  (
    //                 <div className="flex items-center gap-1">

    //                <FaBed />
    //                  {listing?.land_area ? ` ${listing?.land_area} sqft` : ''}

    //                 </div>
    //                  ) }
    //                   {listing?.bathrooms &&  (
    //                 <div className="flex items-center gap-1">

    //                   <FaBath /> {listing?.bathrooms}

    //                 </div>

    //               ) }

    //               </div>
    //               <div className="mt-2 text-[10px]">
    //                   {listing.description}
    //                 </div>
    //             </div>
    //             </Link>
    //           </div>
    <div
      // key={key}
      className={`relative rounded-lg overflow-visible ${
        viewMode == "grid"
          ? "flex flex-col"
          : "flex flex-row justify-center items-center"
      }`}
    >
      <Link href={`/property/${listing.slug}`} className="w-full h-full">
        {/* Image */}
        {listing.images && listing.images.length > 0 ? (
          <img
            src={`${Image_URL}/${listing.images[0].image_path}`}
            alt={listing.title}
            className={`h-52 w-full object-cover"}`}
          />
        ) : (
          <div
            className={`flex items-center justify-center text-gray-400 bg-gray-100 
        ${
          viewMode === "grid"
            ? "w-[500px] h-52 "
            : "w-[500px] h-52  rounded-l-lg"
        }`}
          >
            <House className="w-10 h-10" />
          </div>
        )}

        {/* Card Body */}
        <div
          className={`flex flex-col justify-between bg-[#175f48] text-white p-3 
      ${viewMode === "grid" ? "h-[160px]" : "flex-1 h-44"} `}
        >
          {/* Title + City */}
          <div>
            <h3 className="text-sm font-semibold truncate">{listing.title}</h3>
            <p className="text-xs opacity-80">{listing.city}</p>

            <p className="text-xs opacity-80">
              <span className="price mr-2 mt-2">$</span>
              {listing.buy_now_price}
            </p>
          </div>

          {/* Property Details */}
          <div className="flex justify-between text-[11px] my-2 flex-wrap gap-3">
            {listing?.bedrooms && (
              <div className="flex items-center gap-1">
                <FaBed /> {listing.bedrooms}
              </div>
            )}

            {listing?.bathrooms && (
              <div className="flex items-center gap-1">
                <FaBath /> {listing.bathrooms}
              </div>
            )}

            {listing?.land_area && (
              <div className="flex items-center gap-1">
                <FaRulerCombined /> {listing.land_area} sqft
              </div>
            )}
          </div>

          {/* Description */}
          {listing.description && (
            <p
              className="text-[12px] line-clamp-2 leading-snug opacity-90"
              dangerouslySetInnerHTML={{ __html: listing.description }}
            />
          )}
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
