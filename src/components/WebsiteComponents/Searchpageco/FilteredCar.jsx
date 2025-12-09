"use client";
import React from "react";
import { FaMapMarkerAlt, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { GiGearStickPattern } from "react-icons/gi";
import { PiEngine, PiSpeedometer } from "react-icons/pi";
import { FaRegImages } from "react-icons/fa6";

const FilteredCars = () => {
  const cars = [
    {
      title: "2025 GWM Tank 300",
      subtitle: "Hybrid / Available Immediately / Factory Warranty",
      location: "Manukau City, Auckland",
      km: "35km",
      fuel: "Hybrid",
      transmission: "Automatic",
      engine: "1,998 cc",
      category: "New",
      warranty: "12 Months",
      price: "$59,990",
      oldPrice: "$61,990",
      rating: 4.4,
      reviews: 235,
      image: "/bmw.png",
      imagesCount: "1/12",
    },
    {
      title: "2025 GWM Tank 300",
      subtitle: "Diesel / Top Condition / 3-Year Warranty",
      location: "Sydney, Australia",
      km: "15,000km",
      fuel: "Diesel",
      transmission: "Automatic",
      engine: "2,800 cc",
      category: "Used",
      warranty: "36 Months",
      price: "$85,500",
      oldPrice: "$88,000",
      rating: 4.8,
      reviews: 512,
      image: "/bmw.jpg",
      imagesCount: "1/15",
    },
     {
      title: "2025 GWM Tank 300",
      subtitle: "Diesel / Top Condition / 3-Year Warranty",
      location: "Sydney, Australia",
      km: "15,000km",
      fuel: "Diesel",
      transmission: "Automatic",
      engine: "2,800 cc",
      category: "Used",
      warranty: "36 Months",
      price: "$85,500",
      oldPrice: "$88,000",
      rating: 4.8,
      reviews: 512,
      image: "/bmw.png",
      imagesCount: "1/15",
    },
   
  ];

  return (
    <div className="space-y-6">
      {cars.map((car, index) => (
        <div
          key={index}
          className="bg-gray-100 rounded-xl shadow-sm hover:shadow-lg overflow-hidden flex flex-col sm:flex-row w-full max-w-4xl mx-auto"
        >
          {/* Image Section */}
          <div className="relative w-full sm:w-[40%] h-56 sm:h-auto">
            <img
              src={car.image}
              alt={car.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow">
              <FaRegImages /> {car.imagesCount}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold">{car.title}</h2>
              <p className="text-gray-500 text-sm mb-2">{car.subtitle}</p>

              {/* Specs */}
              <div className="flex flex-wrap items-center text-gray-600 text-sm gap-x-4 gap-y-1 mb-3">
                <span className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-gray-700" /> {car.location}
                </span>
                <span className="flex items-center gap-1">
                  <PiSpeedometer className="text-gray-700" /> {car.km}
                </span>
                <span className="flex items-center gap-1">{car.fuel}</span>
                <span className="flex items-center gap-1">
                  <GiGearStickPattern className="text-gray-700" /> {car.transmission}
                </span>
                <span className="flex items-center gap-1">
                  <PiEngine className="text-gray-700" /> {car.engine}
                </span>
              </div>

              {/* Category + Warranty */}
              <div className="flex gap-6 text-sm mb-2">
                <p>
                  <span className="text-gray-600">Category :</span>{" "}
                  <span className="font-semibold">{car.category}</span>
                </p>
                <p>
                  <span className="text-gray-600">Warranty :</span>{" "}
                  <span className="font-semibold">{car.warranty}</span>
                </p>
              </div>

              {/* Price */}
              <div className="mb-3">
                <span className="font-semibold text-lg mr-2">
                  Asking price {car.price}
                </span>
                <span className="line-through text-gray-500">{car.oldPrice}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 text-sm text-gray-700 mb-2">
                <span className="font-semibold">{car.rating}</span>
                {Array.from({ length: 5 }, (_, i) => {
                  const full = i + 1 <= Math.floor(car.rating);
                  const half = i + 0.5 === Math.round(car.rating * 2) / 2;
                  return full ? (
                    <FaStar key={i} className="text-yellow-500" />
                  ) : half ? (
                    <FaStarHalfAlt key={i} className="text-yellow-500" />
                  ) : (
                    <FaRegStar key={i} className="text-yellow-500" />
                  );
                })}
                <span className="ml-1">({car.reviews} review)</span>
              </div>

              <p className="text-xs text-gray-500">Exclude on road costs</p>
            </div>

            {/* Button */}
            <div className="mt-4 flex justify-end">
              <button className="bg-green-800 hover:bg-green-900 text-white px-6 py-2 rounded-full text-sm">
                View Deal
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilteredCars;
