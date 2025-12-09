// "use client";
// import React, { useState } from "react";
// import Image from "next/image";
// import { FaTimes } from "react-icons/fa";
// import { FaEye, FaUserTag } from "react-icons/fa";
// import Button from "@/components/WebsiteComponents/ReuseableComponenets/Button";

// export default function NoteModal({ isOpen, onClose, listing, onSave, showStats = true }) {
//   const [note, setNote] = useState("");

//   if (!isOpen || !listing) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
//       <div className="bg-white rounded-lg w-[90%] max-w-md p-3 shadow-xl relative">
//         <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
//           <FaTimes size={18} />
//         </button>

//         <h2 className="text-lg font-semibold mb-4">Create a private note for this listing</h2>

//         <div className="shadow rounded-lg p-1 flex items-start gap-4 mb-4">
//           <div className="relative w-20 h-24 shrink-0">
//             <Image
//               src={listing.image}
//               alt={listing.title}
//               fill
//               className="object-contain rounded"
//             />
//           </div>

//           {/* Info */}
//           <div className="flex-1 text-sm text-gray-700 mt-2">
//             <p className="text-xs text-gray-500">
//               Closed: {new Date(listing.closingDate).toLocaleString()}
//             </p>

//             <p className="font-semibold mt-1">{listing.title}</p>

//             {listing.reference && (
//               <p className="text-xs text-gray-500 mt-1">Reference #: {listing.reference}</p>
//             )}

//             {showStats && (
//               <div className="flex gap-4 text-gray-500 text-xs items-center mt-6">
//                 <span className="flex items-center gap-1">
//                   <FaUserTag size={12} /> {listing.watchers} watchers
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <FaEye size={12} /> {listing.views} views
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="text-right text-sm font-semibold text-gray-800 mt-14">
//             <p className="text-xs text-gray-500">
//               {showStats ? "Buy Now" : "Sold Now"}
//             </p>
//             <p>${listing.price}</p>
//           </div>
//         </div>

//         <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
//         <textarea
//           value={note}
//           onChange={(e) => setNote(e.target.value)}
//           maxLength={512}
//           rows={4}
//           className="w-full border shadow rounded px-3 py-2 text-sm text-gray-700 focus:outline-green-500"
//         />
//         <p className="text-xs text-gray-500 mt-1">
//           {512 - note.length} characters remaining
//         </p>

//         <div className="flex justify-center gap-4 mt-5">
//           <Button title="Cancel" onClick={onClose} className="text-sm" />
//           <Button
//             title="Save"
//             onClick={() => {
//               onSave(note);
//               setNote("");
//               onClose();
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import { Image_URL } from "@/config/constants";
// import { FaTimes, FaEye, FaUserTag } from "react-icons/fa";
// import Button from "@/components/WebsiteComponents/ReuseableComponenets/Button";

// export default function NoteModal({ isOpen, onClose, listing, onSave, showStats = true }) {
//   const [note, setNote] = useState("");
//   const [formattedDate, setFormattedDate] = useState("");

//   useEffect(() => {
//     if (listing?.closingDate) {
//       const date = new Date(listing.closingDate);
//       setFormattedDate(date.toLocaleString());
//     }
//   }, [listing]);

//   if (!isOpen || !listing) return null;

//   // Check if lost listing (nothing shows except red closed)
//   const isLost = !showStats && !listing.reference && !listing.price;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
//       <div className="bg-white rounded-lg w-[90%] max-w-md p-3 shadow-xl relative">
//         <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
//           <FaTimes size={18} />
//         </button>

//         <h2 className="text-lg font-semibold mb-4">Create a private note for this listing</h2>

//         <div className="shadow rounded-lg p-1 flex items-start gap-4 mb-4">
//           {/* Image */}
//           <div className="relative w-20 h-24 shrink-0">
//             <Image
//               src={listing.image || "/default-image.jpg"}
//               alt={listing.title}
//               fill
//               className="object-contain rounded"
//             />
//           </div>
//           <div className="flex-1 text-sm text-gray-700 mt-2">
//             {/* Closed text - red only for lost */}
//             <p className={`text-xs ${isLost ? "text-red-500" : "text-gray-500"}`}>
//               Closed: {new Date(listing.closingDate).toLocaleString()}
//             </p>

//             {/* Title */}
//             <p className="font-semibold mt-1">{listing.title}</p>

//             {/* Reference - show only if present */}
//             {listing.reference && (
//               <p className="text-xs text-gray-500 mt-1">Reference #: {listing.reference}</p>
//             )}

//             {/* Watchers & Views - only if showStats is true */}
//             {showStats && (
//               <div className="flex gap-4 text-gray-500 text-xs items-center mt-6">
//                 <span className="flex items-center gap-1">
//                   <FaUserTag size={12} /> {listing.watchers} watchers
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <FaEye size={12} /> {listing.views} views
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Buy Now / Sold Now / Nothing */}
//           {!isLost && (
//             <div className="text-right text-sm font-semibold text-gray-800 mt-14">
//               <p className="text-xs text-gray-500">
//                 {showStats ? "Buy Now" : "Sold Now"}
//               </p>
//               <p>${listing.price}</p>
//             </div>
//           )}
//         </div>

//         {/* Note Input */}
//         <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
//         <textarea
//           value={note}
//           onChange={(e) => setNote(e.target.value)}
//           maxLength={512}
//           rows={4}
//           className="w-full border shadow rounded px-3 py-2 text-sm text-gray-700 focus:outline-green-500"
//         />
//         <p className="text-xs text-gray-500 mt-1">{512 - note.length} characters remaining</p>

//         {/* Buttons */}
//         <div className="flex justify-center gap-4 mt-5">
//           <Button title="Cancel" onClick={onClose} className="text-sm" />
//           <Button
//             title="Save"
//             onClick={() => {
//               onSave(note);
//               setNote("");
//               onClose();
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaTimes, FaEye, FaUserTag } from "react-icons/fa";
import Button from "@/components/WebsiteComponents/ReuseableComponenets/Button";
import { useTranslation } from "react-i18next";

export default function NoteModal({
  isOpen,
  onClose,
  listing,
  onSave,
  onDelete,
  initialNote = "",
  showStats = true,
}) {
  const [note, setNote] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar"; // Check if current language is Arabic

  useEffect(() => {
    if (listing?.closingDate) {
      const date = new Date(listing.closingDate);
      setFormattedDate(date.toLocaleString());
    }
  }, [listing]);

  useEffect(() => {
    setNote(initialNote);
  }, [initialNote, isOpen]);

  if (!isOpen || !listing) return null;

  const isEditing = initialNote.trim().length > 0;
  const isLost = !showStats && !listing.reference && !listing.price;
  console.log("listing", listing);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-white rounded-lg w-[90%] max-w-md p-4 shadow-xl relative">
        {/* Close Button */}
        <div className="relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-2 ${
              isArabic ? "left-4" : "right-4"
            } text-gray-400 hover:text-gray-600`}
          >
            <FaTimes size={18} />
          </button>

          {/* Heading */}
          <h2
            className={`text-lg font-semibold mb-4 ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            {isEditing
              ? t("Edit note for this listing")
              : t("Create a private note for this listing")}
          </h2>
        </div>

        {/* Listing Info */}
        <div className="shadow rounded-lg p-2 flex items-start gap-4 mb-4">
          <div className="relative w-20 h-24 shrink-0">
            <Image
              src={listing.image || "/default-image.jpg"}
              alt={listing.title}
              fill
              className="object-contain rounded"
            />
          </div>

          <div className="flex-1 text-sm text-gray-700 mt-1">
            <p
              className={`text-xs ${isLost ? "text-red-500" : "text-gray-500"}`}
            >
              {t("Closed")}: {formattedDate}
            </p>

            <p className="font-semibold mt-1">{listing.title}</p>

            {listing?.winner_name && (
              <p className="text-sm text-gray-600 mb-1">
                {t("Customer Name")}:{" "}
                <span className="font-medium">{listing.winner_name}</span>
              </p>
            )}

            {showStats && (
              <div className="flex gap-4 text-gray-500 text-xs items-center mt-6">
                <span className="flex items-center gap-1">
                  <FaUserTag size={12} /> {listing.watchers} {t("watchers")}
                </span>
                <span className="flex items-center gap-1">
                  <FaEye size={12} /> {listing.views} {t("views")}
                </span>
              </div>
            )}
          </div>

          {!isLost && (
            <div className="text-right text-sm font-semibold text-gray-800 mt-14">
              <p className="text-xs text-gray-500">
                {showStats ? t("Buy Now") : t("Sold Now")}
              </p>
              <p>
                <span className="price">$</span>
                {listing.price}
              </p>
            </div>
          )}
        </div>

        {/* Note Input */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Note")}
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={512}
          rows={4}
          className="w-full border shadow rounded px-3 py-2 text-sm text-gray-700 focus:outline-green-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          {512 - note.length} {t("characters remaining")}
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-5">
          {isEditing ? (
            <Button
              title={t("Delete")}
              onClick={() => {
                onDelete();
                setNote("");
              }}
              className="bg-red-100 text-red-600 text-sm"
            />
          ) : (
            <Button
              title={t("Cancel")}
              onClick={() => {
                onClose();
                setNote("");
              }}
              className="text-sm"
            />
          )}
          <Button
            title={t("Save")}
            onClick={() => {
              onSave(note);
              setNote("");
            }}
          />
        </div>
      </div>
    </div>
  );
}
