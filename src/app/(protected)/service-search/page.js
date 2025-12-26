"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { listingsApi } from "@/lib/api/listings";
import { categoriesApi } from "@/lib/api/category";
import SearchResultCard from "@/components/WebsiteComponents/Searchpageco/SearchResultCard";
import SearchPageFilters from "@/components/WebsiteComponents/Searchpageco/SearchPageFilters";
import { useTranslation } from "react-i18next";
import { Loader2, ArrowUp } from "lucide-react";
import { FaThList, FaTh } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import CategoryBreakdown from "@/components/WebsiteComponents/Searchpageco/CategoryBreakdown";
import Select from "react-select";

const SearchPageContent = () => {
    const searchParams = useSearchParams();
    const pageParam = searchParams.get("page") || "1";
    const keyword = searchParams.get("keyword") || "";
    const condition = searchParams.get("condition");
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");
    const categoryId = searchParams.get("category_id") || searchParams.get("selected_category");
    const sortBy = searchParams.get("sort_by") || "latest";
    const type = searchParams.get("listing_type") || "";


    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState("grid"); // grid | list
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 20
    });

    const { t } = useTranslation();
    const router = useRouter();

    const [categories, setCategories] = useState([]);

    // Sort Options
    const sortOptions = [
        { value: "latest", label: "Latest Listings" },
        { value: "most_bids", label: "Most Bids" },
        { value: "closing_soon", label: "Closing Soon" },
        { value: "start_price_lowest", label: "Start Price: Low to High" },
        { value: "start_price_highest", label: "Start Price: High to Low" },
        { value: "buy_now_lowest", label: "Buy Now: Low to High" },
        { value: "buy_now_highest", label: "Buy Now: High to Low" },
    ];

    const sortSelectStyles = {
        control: (base) => ({
            ...base,
            minHeight: '32px',
            height: '32px',
            fontSize: '13px',
            minWidth: '180px',
            borderColor: '#e5e7eb',
            boxShadow: 'none',
            '&:hover': { borderColor: '#d1d5db' }
        }),
        valueContainer: (base) => ({
            ...base,
            height: '32px',
            padding: '0 8px'
        }),
        input: (base) => ({
            ...base,
            margin: '0',
            padding: '0'
        }),
        indicatorsContainer: (base) => ({
            ...base,
            height: '32px'
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#f0fdf4' : 'white',
            color: state.isSelected ? 'white' : '#374151',
            fontSize: '13px',
            padding: '8px 12px'
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    };

    const handleSortChange = (selectedOption) => {
        const params = new URLSearchParams(searchParams.toString());
        if (selectedOption) {
            params.set("sort_by", selectedOption.value);
        } else {
            params.delete("sort_by");
        }
        router.push(`/search?${params.toString()}`);
    };

    // Initial Fetch
    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                // Calculate offset based on page number
                const limit = 20;
                const currentPage = parseInt(pageParam) || 1;
                const offset = (currentPage - 1) * limit;

                const queryParams = {
                    ...(keyword && { keyword: keyword }),
                    ...(type && { listing_type: type }),
                    limit: limit,
                    offset: offset,
                    sort_by: sortBy,
                    ...(categoryId && { selected_category: categoryId }),
                    ...(condition && { condition: condition }),
                    ...(minPrice && { min_price: minPrice }),
                    ...(maxPrice && { max_price: maxPrice }),
                };

                const res = await listingsApi.listingsSearchHistory(queryParams);

                console.log("Search Page Results:", res);

                setResults(res.data || []);
                setCategories(res.categories || []); // Don't rely on search results for categories dropdown

                // Handle pagination
                setPagination({
                    current_page: res.current_page || 1,
                    last_page: res.total_pages || 1,
                    total: res.total_record || 0,
                    per_page: res.limit || limit
                });

            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [keyword, pageParam, categoryId, condition, minPrice, maxPrice, sortBy]);

    // Fetch Categories Separately to ensure dropdown always has data
    // useEffect(() => {
    //     const loadCategories = async () => {
    //         try {
    //             const listing_type = type;
    //             const res = await categoriesApi.getAllCategoriesSearches(null, listing_type);
    //             setCategories(res.data || []); // Assuming API returns { data: [...] } or array
    //         } catch (err) {
    //             console.error("Failed to load categories", err);
    //         }
    //     };
    //     loadCategories();
    // }, []);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > pagination.last_page) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage);

        router.push(`/search?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const [searchTerm, setSearchTerm] = useState(keyword);

    useEffect(() => {
        setSearchTerm(keyword);
    }, [keyword]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) {
            params.set("keyword", searchTerm);
        } else {
            params.delete("keyword");
        }
        params.set("page", "1"); // Reset to page 1
        router.push(`/search?${params.toString()}`);
    };

    // Determine which results to show
    const displayResults = results;
    const resultCount = displayResults.length;
    return (
        <div className="bg-white min-h-screen pb-20">
            {/* <Navbar /> */}
            <div className="container mx-auto px-4 py-8 max-w-7xl">

                {/* 1. Page Title */}
                {/* <h1 className="text-3xl font-bold mb-6 text-gray-800">{t("Search Results")} {keyword && `for "${keyword}"`}</h1> */}

                {/* Sticky Header Wrapper */}
                <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm pt-2 pb-2 border-b border-gray-100 mb-8 px-2 -mx-2">
                    {/* 2. Search Input */}
                    <div className="mb-4">
                        <form onSubmit={handleSearchSubmit} className="flex w-full shadow-sm rounded-full overflow-hidden border border-gray-300 bg-white focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-all">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={t("Search all categories...")}
                                    className="w-full pl-12 pr-10 py-1.5 text-gray-900 placeholder-gray-400 focus:outline-none sm:text-lg"
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchTerm('');
                                            const params = new URLSearchParams(searchParams.toString());
                                            params.delete("keyword");
                                            params.set("page", "1");
                                            router.push(`/search?${params.toString()}`);
                                        }}
                                        className="absolute inset-y-0 right-2 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <IoClose className="h-6 w-6" />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="bg-green-600 px-8 text-white font-semibold hover:bg-green-700 transition-colors"
                            >
                                {t("Search")}
                            </button>
                        </form>
                    </div>

                    {/* 3. Filters & Toggles Row */}
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-grow w-full md:w-auto">
                            <SearchPageFilters categoryId={categoryId} categories={categories} />
                        </div>
                    </div>
                </div>

                {/* 4. Category Breakdown */}
                <Suspense fallback={null}>
                    <CategoryBreakdown categories={categories} />
                </Suspense>

                {/* 5. Results Header & Toggles */}
                <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                    <h2 className="text-gray-600 text-sm font-medium">
                        {/* Simple count display */}
                        {pagination.total || resultCount > 0 ? (
                            <span>
                                {t("Showing")} <span className="font-bold text-gray-900">{pagination.total || resultCount}</span> {t("results")}
                            </span>
                        ) : (
                            <span>{t("Results")}</span>
                        )}
                    </h2>

                    <div className="flex items-center gap-4">
                        {/* Sorting Dropdown */}
                        <div className="min-w-[180px]">
                            <Select
                                options={sortOptions}
                                value={sortOptions.find(opt => opt.value === sortBy)}
                                onChange={handleSortChange}
                                styles={sortSelectStyles}
                                isSearchable={false}
                                menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                            />
                        </div>

                        {/* View Toggles - made more subtle */}
                        <div className="flex items-center gap-1 bg-white border border-gray-300 rounded p-0.5">
                            <button
                                className={`p-1.5 rounded ${viewMode === "list" ? "bg-gray-100 text-green-700" : "text-gray-500 hover:text-gray-700"}`}
                                onClick={() => setViewMode("list")}
                                title={t("List View")}
                            >
                                <FaThList size={16} />
                            </button>
                            <div className="w-px h-4 bg-gray-300 mx-0.5"></div>
                            <button
                                className={`p-1.5 rounded ${viewMode === "grid" ? "bg-gray-100 text-green-700" : "text-gray-500 hover:text-gray-700"}`}
                                onClick={() => setViewMode("grid")}
                                title={t("Grid View")}
                            >
                                <FaTh size={16} />
                            </button>
                        </div>
                    </div>
                </div>


                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-10 h-10 animate-spin text-green-600" />
                    </div>
                ) : displayResults.length > 0 ? (
                    <>
                        <div className={`grid gap-4 ${viewMode === 'grid'
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                            : 'grid-cols-1'
                            }`}>
                            {displayResults.map((item, index) => (
                                <SearchResultCard key={`${item.id}-${index}`} item={item} viewMode={viewMode} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {pagination.last_page > 1 && (
                            <div className="flex justify-center mt-10 gap-2 items-center">
                                <button
                                    onClick={() => handlePageChange(Number(pagination.current_page) - 1)}
                                    disabled={Number(pagination.current_page) <= 1}
                                    className="px-3 py-1 border rounded bg-white disabled:opacity-50 hover:bg-gray-100 text-sm"
                                >
                                    {t("Previous")}
                                </button>

                                {/* Page Numbers */}
                                <div className="flex gap-1 overflow-x-auto">
                                    {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((pageNum) => (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`px-3 py-1 border rounded text-sm ${Number(pagination.current_page) === pageNum
                                                ? "bg-green-600 text-white border-green-600"
                                                : "bg-white text-gray-700 hover:bg-gray-50"
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handlePageChange(Number(pagination.current_page) + 1)}
                                    disabled={Number(pagination.current_page) >= pagination.last_page}
                                    className="px-3 py-1 border rounded bg-white disabled:opacity-50 hover:bg-gray-100 text-sm"
                                >
                                    {t("Next")}
                                </button>
                            </div>
                        )}

                        {/* Back to Top */}
                        <div className="flex justify-center mt-8 mb-4">
                            <button
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors text-sm font-medium"
                            >
                                <ArrowUp className="w-4 h-4" />
                                {t("Back to top")}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                        <div className="text-4xl mb-4">🔍</div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">
                            {t("No results found")}
                        </h2>
                        <p className="text-gray-500">
                            {t("Try checking your spelling or use different keywords")}
                        </p>
                    </div>
                )}
            </div>
            {/* <Footer /> */}
        </div>
    );
};

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
            <SearchPageContent />
        </Suspense>
    )
}
