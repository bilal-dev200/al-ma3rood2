"use client";

import React from "react";
import Image from "next/image";

export default function NeedHelp() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 mt-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div
          className="inline-block pb-1 border-b-2 "
          style={{ borderColor: "#7B7B7B" }}
        >
          <h2 className="text-2xl font-bold text-gray-900">
            Need Help With Something?
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left Column: Car Buying Advice */}
         <div className="md:col-span-3 flex flex-col justify-between bg-white rounded-xl shadow-md overflow-hidden">
          <Image
            src="/placeholder.svg"
            alt="Car buying advice"
            width={400}
            height={192}
            className="w-full h-70 object-cover bg-gray-200"
          />
          <div className="p-4 mb-4">
            <h3 className="text-lg font-semibold mb-2">Car buying advice</h3>
            <p className="text-sm text-gray-600">
              simply dummy text of the printing and typesetting industry. Lorem
              Ipsum has been the industry's standard dummy text ever since the
              1500s, when an unknown printer took a galley of type and scrambled
              it to make a type specimen book.
            </p>
          </div>
        </div>

        {/* Middle Column: Top - Car Reviews | Bottom - Two Cards */}
        <div className="md:col-span-6 flex flex-col gap-6">
          {/* Car Reviews - full width */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Image
              src="/placeholder.svg"
              alt="Car Reviews"
              width={400}
              height={192}
              className="w-full h-48 object-cover bg-gray-200"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">Car Reviews</h3>
            </div>
          </div>

          {/* Nested cards under Car Reviews */}
          <div className="grid grid-cols-2 gap-4">
            {/* Eyes on EVs */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100  h-[220px] sm:h-[250px] flex flex-col">
              <Image
                src="/placeholder.svg"
                alt="Eyes on EVs"
                width={400}
                height={192}
                className="w-full h-55 object-cover bg-gray-200"
              />
              <div className="p-2">
                <h4 className="text-sm font-medium">Eyes on EVs</h4>
              </div>
            </div>

            {/* Features article */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100  h-[220px] sm:h-[250px] flex flex-col">
              <Image
                src="/placeholder.svg"
                alt="Features article"
                width={400}
                height={192}
                className="w-full h-55 object-cover bg-gray-200"
              />
              <div className="p-2">
                <h4 className="text-sm font-medium">Features article</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Car Selling Advice */}
       <div className="md:col-span-3 flex flex-col justify-between bg-white rounded-lg shadow-md overflow-hidden">  
          <Image
            src="/placeholder.svg?height=192&width=400"
            alt="Car selling advice"
            width={400}
            height={192}
            className="w-full h-70 object-cover bg-gray-200"
          />
          <div className="p-4 mb-4">
            <h3 className="text-lg font-semibold mb-2">Car selling advice</h3>
            <p className="text-sm text-gray-600">
              simply dummy text of the printing and typesetting industry. Lorem
              Ipsum has been the industry's standard dummy text ever since the
              1500s, when an unknown printer took a galley of type and scrambled
              it to make a type specimen book.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
