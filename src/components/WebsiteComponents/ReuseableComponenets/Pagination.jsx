
"use client";

import React from "react";

function getPageNumbers(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  if (current > 3) pages.push(1);
  if (current > 4) pages.push('...');
  for (let i = Math.max(1, current - 1); i <= Math.min(total, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 3) pages.push('...');
  if (current < total - 2) pages.push(total);
  return pages;
}

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <nav className="flex flex-wrap justify-center items-center gap-1 mt-6 select-none text-base">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={`px-2 py-1 rounded-md font-medium transition-colors ${currentPage === 1 ? 'text-gray-300' : 'text-green-600 hover:bg-green-100'}`}
        aria-label="First Page"
      >
        «
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-2 py-1 rounded-md font-medium transition-colors ${currentPage === 1 ? 'text-gray-300' : 'text-green-600 hover:bg-green-100'}`}
        aria-label="Previous Page"
      >
        ‹
      </button>
      {pageNumbers.map((page, idx) =>
        page === '...'
          ? <span key={idx} className="px-2 text-gray-400">…</span>
          : <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? "page" : undefined}
              className={`w-9 h-9 rounded-full border-2 transition-colors duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-green-400 ${currentPage === page ? 'bg-gradient-to-r from-purple-600 to-green-500 text-white border-transparent shadow-lg' : 'border-green-500 text-green-600 hover:bg-green-100'}`}
            >
              {page}
            </button>
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-2 py-1 rounded-md font-medium transition-colors ${currentPage === totalPages ? 'text-gray-300' : 'text-green-600 hover:bg-green-100'}`}
        aria-label="Next Page"
      >
        ›
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`px-2 py-1 rounded-md font-medium transition-colors ${currentPage === totalPages ? 'text-gray-300' : 'text-green-600 hover:bg-green-100'}`}
        aria-label="Last Page"
      >
        »
      </button>
    </nav>
  );
};

export default Pagination;