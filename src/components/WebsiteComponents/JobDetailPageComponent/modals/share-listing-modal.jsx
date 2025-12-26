"use client";

import { useEffect } from "react";
import { X as CloseIcon, Mail, Copy } from "lucide-react";
import { FacebookIcon, XIcon } from "../SVGicons/SVGIcons";
import { toast } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";

const ShareListingModal = ({ isOpen, onClose, shareUrl, title }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  if (!isOpen) return null;

  // ✅ URL + title
  const urlToShare = shareUrl || window.location.href;
  const jobTitle = title || "Check out this listing!";

  /* =========================
     SHARE HANDLERS
  ========================= */

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(urlToShare);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Check this out: ${jobTitle}`);
    const body = encodeURIComponent(`Hey! Take a look:\n${urlToShare}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`${jobTitle} — ${urlToShare}`);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}`,
      "_blank"
    );
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        urlToShare
      )}`,
      "_blank"
    );
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`${jobTitle}\n${urlToShare}`);
    window.open(
      `https://wa.me/?text=${text}`,
      "_blank"
    );
  };

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl max-h-[80vh] overflow-y-auto custom-scroll p-4 sm:p-6 shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Share this listing
          </h2>
          <button
            onClick={onClose}
            className="text-[#175f48] hover:text-green-600"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <ul className="space-y-4">
          <li
            onClick={handleShareEmail}
            className="flex items-center space-x-3 cursor-pointer border-b border-gray-300 pb-3 hover:bg-gray-50 rounded-md px-2 transition"
          >
            <Mail className="w-5 h-5 text-[#175f48]" />
            <span className="text-black">Email</span>
          </li>

          <li
            onClick={handleShareWhatsApp}
            className="flex items-center space-x-3 cursor-pointer border-b border-gray-300 pb-3 hover:bg-gray-50 rounded-md px-2 transition"
          >
            <FaWhatsapp className="w-5 h-5 text-green-500" />
            <span className="text-black">WhatsApp</span>
          </li>

          <li
            onClick={handleShareTwitter}
            className="flex items-center space-x-3 cursor-pointer border-b border-gray-300 pb-3 hover:bg-gray-50 rounded-md px-2 transition"
          >
            <XIcon className="w-5 h-5 text-[#175f48]" />
            <span className="text-black">Share on X (Twitter)</span>
          </li>

          <li
            onClick={handleShareFacebook}
            className="flex items-center space-x-3 cursor-pointer border-b border-gray-300 pb-3 hover:bg-gray-50 rounded-md px-2 transition"
          >
            <FacebookIcon className="w-5 h-5 text-[#175f48]" />
            <span className="text-black">Facebook</span>
          </li>

          <li
            onClick={handleCopyLink}
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-md px-2 transition"
          >
            <Copy className="w-5 h-5 text-[#175f48]" />
            <span className="text-black">Copy Link</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ShareListingModal;
