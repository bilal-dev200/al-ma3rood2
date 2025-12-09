"use client";
import { useRef, useState } from "react";

export default function ImageCarousel({ images }) {
  const [currentImage, setCurrentImage] = useState(0);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 120; // adjust thumbnail scroll step
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="w-full max-w-[600px] mx-auto">
      {/* Main Image */}
      <div className="bg-gray-200 rounded-lg overflow-hidden mb-3 aspect-[16/10]">
        <img
          src={images[currentImage]}
          alt="Car"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails + Arrows */}
      <div className="flex items-center justify-between">
        {/* Prev Button */}
        <button
          onClick={() => scroll("left")}
          className="bg-gray-200 rounded p-2 flex items-center justify-center"
        >
          ‹
        </button>

        {/* Thumbnails Slider */}
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto px-2 scrollbar-hide"
        >
          {images?.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={`flex-shrink-0 w-24 cursor-pointer rounded overflow-hidden border-2 transition-all ${
                currentImage === idx
                  ? "border-green-700"
                  : "border-transparent hover:border-gray-400"
              }`}
              style={{
                aspectRatio: "4 / 3",
                backgroundColor: "#e5e7eb",
              }}
            >
              {img ? (
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => scroll("right")}
          className="bg-gray-200 rounded p-2 flex items-center justify-center"
        >
          ›
        </button>
      </div>
    </div>
  );
}
