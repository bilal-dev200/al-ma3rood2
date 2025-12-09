"use client"
import { ChevronDown } from "lucide-react"

export default function MoreOptionsButton({ onClick, isExpanded }) {
  return (
<button
  type="button"
  className="inline-flex justify-center items-center gap-1 text-sm font-medium text-[#175f48] hover:text-blue-600"
  onClick={onClick}
  aria-expanded={isExpanded}
  aria-controls="more-filters-section"
>
  {isExpanded ? "Fewer Option" : "More Option"}
  <ChevronDown
    className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
  />
</button>
  )
}
