"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { listingsApi } from "@/lib/api/listings";
import SearchResultCard from "@/components/WebsiteComponents/Searchpageco/SearchResultCard";
import SearchPageFilters from "@/components/WebsiteComponents/Searchpageco/SearchPageFilters";
import { useTranslation } from "react-i18next";
import { Loader2, ArrowUp } from "lucide-react";
import { FaThList, FaTh } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import CategoryBreakdown from "@/components/WebsiteComponents/Searchpageco/CategoryBreakdown";

const SearchPageContent = () => {
    const searchParams = useSearchParams();
    const keyword = searchParams.get("keyword") || "";
    const pageParam = searchParams.get("page") || "1";

    const [results, setResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState(null); // Store results from FilterComponent
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState("grid"); // grid | list
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 2
    });

    const { t } = useTranslation();
    const router = useRouter();

    const [categories, setCategories] = useState([]);

    // Initial Fetch (when keyword changes, reset filters essentially by re-fetching base results)
    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            setFilteredResults(null); // Reset filtered results on new keyword search
            try {
                // Calculate offset based on page number
                // User requirement: 1->1, 2->3, 3->5 (for limit 2)
                // Formula: (page - 1) * limit + 1
                const limit = 20; // Fixed limit as per user request/testing
                const currentPage = parseInt(pageParam) || 1;
                const offset = (currentPage - 1) * limit;

                const res = await listingsApi.listingsSearchHistory({
                    keyword: keyword,
                    limit: limit,
                    offset: offset
                });

                console.log("Search Page Results:", res);

                setResults(res.data || []);
                setCategories(res.categories || []);

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

        if (keyword) {
            fetchResults();
        } else {
            setResults([]);
            setLoading(false);
        }
    }, [keyword, pageParam]);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > pagination.last_page) return;
        router.push(`/search?keyword=${encodeURIComponent(keyword)}&page=${newPage}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const [searchTerm, setSearchTerm] = useState(keyword);

    useEffect(() => {
        setSearchTerm(keyword);
    }, [keyword]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/search?keyword=${encodeURIComponent(searchTerm)}`);
        }
    };

    // Determine which results to show
    const displayResults = filteredResults || results;
    const resultCount = displayResults.length;
    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* <Navbar /> */}
            <div className="container mx-auto px-4 py-8 max-w-7xl">

                {/* 1. Page Title */}
                <h1 className="text-3xl font-bold text-[#2d2e2f] mb-6 uppercase tracking-tight">
                    {t("All Categories")}
                    {/* Dynamic title based on context could go here, e.g. "Search Results" or category name */}
                </h1>

                {/* 2. Search Input (Styled like TradeMe) */}
                <div className="mb-4">
                    <div className="flex w-full shadow-sm rounded-md overflow-hidden border border-gray-300 bg-white">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={t("Search all categories...")}
                                className="w-full pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-lg"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    <IoClose className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleSearchSubmit}
                            className="bg-green-600 px-6 text-white font-medium hover:bg-green-700 transition-colors"
                        >
                            {t("Search")}
                        </button>
                    </div>
                </div>

                {/* 3. Filters & Toggles Row */}
                {/* <div className="flex flex-col md:flex-row gap-4 mb-8 items-center bg-transparent">
                    <div className="flex-grow w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <SearchPageFilters
                            categoryId={null}
                            onResults={(data) => setFilteredResults(data)}
                        />
                    </div>
                </div> */}

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
                                <SearchResultCard key={item.id || index} item={item} viewMode={viewMode} />
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
