"use client";
import React from 'react';
import Link from 'next/link';

// Mock Data behaving like Aggregations
const mockCategories = [
    { id: 1, name: "Motors", count: 1240, slug: "motors" },
    { id: 2, name: "Property", count: 850, slug: "property" },
    { id: 3, name: "Marketplace", count: 15420, slug: "marketplace" },
    { id: 4, name: "Jobs", count: 120, slug: "jobs" },
    { id: 5, name: "Services", count: 340, slug: "services" },
    { id: 6, name: "Home & Living", count: 2223, slug: "marketplace/home-living" },
    { id: 7, name: "Electronics & Photography", count: 1257, slug: "marketplace/electronics-photography" },
    { id: 8, name: "Computers", count: 1826, slug: "marketplace/computers" },
    { id: 9, name: "Clothing & Fashion", count: 151, slug: "marketplace/clothing-fashion" },
];

const CategoryBreakdown = ({ categories = [] }) => {
    if (!categories || categories.length === 0) return null;

    return (
        <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4 tracking-wider">
                Categories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-8">
                {categories.map((cat, index) => (
                    <Link
                        key={index}
                        // For now, linking to a generic search for that category name since we don't have slug
                        href={`/search?keyword=${encodeURIComponent(cat.category_name)}`}
                        className="text-green-700 hover:underline flex items-baseline group"
                    >
                        <span className="text-base font-medium">{cat.category_name}</span>
                        <span className="ml-1 text-gray-500 text-sm group-hover:text-gray-700">({cat.count.toLocaleString()})</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryBreakdown;
