import { Image_URL } from "@/config/constants";
import Image from "next/image";
import Link from "next/link";
import { FaBriefcase } from "react-icons/fa";

export default function JobCard({ title, company, location, date, description, logo, banner, slug }) {
 const parseDateSafely = (dateStr) => {
  // ISO format (2025-01-20 or 2025-01-20T10:30:00Z)
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    return new Date(dateStr);
  }

  // Slash format
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [part1, part2, year] = dateStr.split("/").map(Number);

    // If first part > 12 → must be DD/MM/YYYY
    if (part1 > 12) {
      return new Date(Date.UTC(year, part2 - 1, part1));
    }

    // If second part > 12 → must be MM/DD/YYYY
    if (part2 > 12) {
      return new Date(Date.UTC(year, part1 - 1, part2));
    }

    // Ambiguous (01/02/2025) → assume backend is DD/MM
    return new Date(Date.UTC(year, part2 - 1, part1));
  }

  return new Date(dateStr);
};

  // Function to get "Listed X hours/days ago"
const getRelativeTime = (createdAt) => {
  if (!createdAt) return "Date not available";

  const posted = parseDateSafely(createdAt);
  if (isNaN(posted)) return "Invalid date";

  const now = new Date();
  const diffMs = now.getTime() - posted.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Listed just now";
  if (diffMinutes < 60) return `Listed ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `Listed ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Listed 1 day ago";

  return `Listed ${diffDays} days ago`;
};



  return (
    <Link href={`/jobs/${slug}`} className="cursor-pointer bg-[#F8F8F8] border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col">


      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="flex items-center text-gray-600 text-sm mb-4">

        <div className="flex items-center text-xs w-fit">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          {location}
        </div>
        <span className="mx-2">|</span>
        <span className="text-[#175f48] text-sm">{getRelativeTime(date)}</span>

      </div>

      <p className="text-gray-600 text-sm mb-6 leading-relaxed flex-grow">
        {description
          ? description.length > 250
            ? `${description.slice(0, 250)}...`
            : description
          : "No description available..."}
      </p>

      <div className="flex justify-between">
        <div></div>
        {/* Company Logo */}
        <div className="flex flex-col justify-center items-center">
          {logo ? (
            <Image
              src={`${Image_URL}${logo}`}
              alt={company}
              width={60}
              height={60}
              className="object-contain rounded-md"
            />
          ) : (
            <div className="bg-gray-200 p-2 rounded-md">
              <FaBriefcase className="text-gray-600 text-xl" />
            </div>
          )}
          <span className="font-medium mt-2 text-sm text-gray-800">{company}</span>
        </div>
      </div>

      {/* <button className="w-full bg-[#175f48] hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors">
        Apply Now
      </button> */}
    </Link>
  );
}
