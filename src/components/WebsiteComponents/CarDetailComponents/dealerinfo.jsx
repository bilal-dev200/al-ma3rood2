"use client";

import { useState } from "react";
import CarListings from "./dealerotherlist";

export default function DealerInfo({ about }) {
  const [showMore, setShowMore] = useState(false);
    // Split about text into paragraphs (assuming about is a long string)
  const paragraphs = about ? about.split("\n").filter(Boolean) : [];

  // Limit first 2–3 paragraphs for preview
  const preview = paragraphs.slice(0, 2);
  const extra = paragraphs.slice(2);

  const services = [
    {
      title: "Workshop & Servicing",
      action: "View",
      image: "/workshop.png",
    },
    {
      title: "Parts and Accessories",
      action: "View",
      image: "/parts.png",
    },
    {
      title: "Trade Ins",
      action: "Inquire about Trade ins",
      image: "/trade.png",
    },
    {
      title: "Finance",
      action: "Enquire about Finance",
      image: "/finance.png",
    },
    {
      title: "Warranties",
      action: "Enquire about Warranties",
      image: "/warranty.png",
    },
    {
      title: "Insurance",
      action: "Inquire about Insurance",
      image: "/insurence.png",
    },
  ];

  return (
    <div className="">
      {/* About the dealer section */}
      <div>
        <div className="  mb-10">
          <div
            className="inline-block border-b-2"
            style={{ borderColor: "#7B7B7B" }}
          >
            <h2 className="text-xl font-semibold ">About the Seller</h2>
          </div>
        </div>
        <div className="text-gray-700 space-y-3 mt-5">
        {/* Always show first paragraphs */}
        {preview.map((para, i) => (
          <p key={i}>{para}</p>
        ))}

        {/* Conditionally render the rest */}
        {showMore &&
          extra.map((para, i) => (
            <p key={i} className="text-gray-600">
              {para}
            </p>
          ))}

        {paragraphs.length > 2 && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex items-center text-teal-600 hover:text-teal-700 font-medium"
          >
            {showMore ? "Show Less" : "Show More"}
            <svg
              className={`ml-1 h-4 w-4 transition-transform ${
                showMore ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}
      </div>
      </div>

      {/* Dealer Services section */}
      {/* <div className="mt-32">
        <div
          className="inline-block border-b-2"
          style={{ borderColor: "#7B7B7B" }}
        >
          <h2 className="text-xl font-semibold ">About the dealer</h2>
        </div>
        <div className="grid grid-cols-3 gap-8 mt-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="text-center  bg-gray-100 rounded-lg p-4  transition-shadow"
            >
              <div className="mb-4 flex justify-center">
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  className="w-5 h-5 object-contain"
                />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">
                {service.title}
              </h3>
              <button className="text-black text-sm font-medium">
                {service.action}
              </button>
            </div>
          ))}
        </div>
      </div> */}
{/* <div className="mt-14">
    <CarListings/>
</div> */}
    </div>
  );
}
