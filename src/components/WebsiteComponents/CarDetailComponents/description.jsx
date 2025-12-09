"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function DescriptionSection({ description }) {
  const [isExpanded, setIsExpanded] = useState(false)

  // If description is a string (single text block)
  // you can split it into paragraphs
  const paragraphs = description
    ? description.split("\n").filter(p => p.trim() !== "")
    : []

  return (
    <div className="max-w-4xl py-6 space-y-8">
      {/* Description Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 border-b-2 border-gray-300 pb-2 inline-block">
          Description
        </h2>

        <div className="space-y-4 text-gray-700">
          {paragraphs.slice(0, 2).map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}

          {/* Collapsible extra content */}
          {paragraphs.length > 2 && (
            <div
              className={`transition-all duration-300 overflow-hidden ${
                isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {paragraphs.slice(2).map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          )}

          {/* Show More Button */}
          {paragraphs.length > 2 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              {isExpanded ? "Show Less" : "Show More"}
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Shipping & pick-up options Section */}
      {/* <div className="flex flex-col items-center mt-20">
        <h2 className="text-xl font-semibold mb-6 border-b-2 border-gray-300 pb-2 inline-block text-center">
          Shipping & pick-up options
        </h2>

        <div className="bg-gray-50 rounded-lg overflow-hidden w-full max-w-xl">
          <div className="grid grid-cols-2 bg-gray-200 p-4 font-medium text-gray-700">
            <div>Destination & description</div>
            <div className="text-right">Price</div>
          </div>

          <div className="divide-y divide-gray-200">
            <div className="grid grid-cols-2 p-4">
              <div className="text-gray-700">To be arranged</div>
              <div className="text-right text-gray-700">N/A</div>
            </div>

            <div className="grid grid-cols-2 p-4">
              <div className="text-gray-700">Pick-up available Manukau, City</div>
              <div className="text-right text-gray-700">Free</div>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-4">Shipping price include GST.</p>
      </div> */}
    </div>
  )
}
