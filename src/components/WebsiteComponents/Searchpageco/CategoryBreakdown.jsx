"use client";
import React from 'react';
import Link from 'next/link';

import { useSearchParams } from 'next/navigation';

const CategoryBreakdown = ({ categories = [] }) => {
    const searchParams = useSearchParams();

    if (!categories || categories.length === 0) return null;

    const createCategoryLink = (categoryId) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('selected_category', categoryId);
        params.delete('page'); // Reset to page 1 when changing category
        return `/search?${params.toString()}`;
    };

    return (
        <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4 tracking-wider">
                Categories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-8">
                {categories.map((cat, index) => (
                    <Link
                        key={index}
                        href={createCategoryLink(cat.id)}
                        className="text-green-700 hover:underline flex items-baseline group"
                    >
                        <span className="text-base font-medium">{cat.name}</span>
                        <span className="ml-1 text-gray-500 text-sm group-hover:text-gray-700">({cat.listing_count !== undefined ? cat.listing_count.toLocaleString() : 0})</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryBreakdown;
