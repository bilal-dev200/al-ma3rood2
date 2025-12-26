"use client";
import { Search, List } from "lucide-react";
import TrendingJobs from "@/components/WebsiteComponents/JobsPageComponents/TrendingJobs";
import { useEffect, useMemo, useState } from "react";
import { useLocationStore } from "@/lib/stores/locationStore";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import {
  JobsApi,
} from "@/lib/api/job-listing.js";
import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";

// --- CONSTANTS ---
const JOBS_PER_PAGE = 10; 

const JobsClient = ({ category, initialProducts }) => {
    const { locations, getAllLocations } = useLocationStore();
    const { t } = useTranslation();

    // --- STATE ---
    const [jobListings, setJobListings] = useState(initialProducts || []);
    const [loading, setLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [hasMore, setHasMore] = useState(true); 
    const [filters, setFilters] = useState({
      type: "search",
      search: "",
      category_id: null,
      // Removed unnecessary price/area/condition fields for jobs context, added job-specific ones:
      region: "",
      governorate: "",
      work_type: "",
      minimum_pay_type: "",
      min_amount: "",
      max_amount: "",
      // Pagination
      limit: JOBS_PER_PAGE, 
      offset: 0, 
    });

    // --- MEMOIZED DATA ---
    const country = locations.find((c) => c.id == 1);
    const regions = country?.regions || [];
    
    const governorates = useMemo(() => {
      const region = regions.find((r) => r.name === filters.region);
      return region?.governorates || [];
    }, [regions, filters.region]);

    // --- API FETCHER ---
    const fetchJobs = async (currentFilters, append = false) => {
      console.log('fetch', currentFilters)
        if (!append) setJobListings([]); // Clear list on new filter search
        setLoading(true);
        setIsInitialLoad(false);

        try {
            // Find IDs for API payload
            const regionObj = regions.find(r => r.name === currentFilters.region);
            const governorateObj = governorates.find(g => g.name === currentFilters.governorate);
            
            const payload = {
                ...currentFilters,
                region_id: regionObj?.id || "",
                governorate_id: governorateObj?.id || "",
            };

            const response = await JobsApi.getListingsByFilter(payload);
            const newJobs = response || []; // Adjust to match your API response structure

            setJobListings(prev => (append ? [...prev, ...newJobs] : newJobs));
            setHasMore(newJobs.length === currentFilters.limit); 

        } catch (error) {
            console.error("Failed to fetch job listings:", error);
        } finally {
            setLoading(false);
        }
    };


    // --- EFFECTS ---

    // 1. Load Locations on Mount
    useEffect(() => {
        getAllLocations(); 
    }, [getAllLocations]);

    // 2. Trigger fetch when offset/limit changes (for pagination/initial load)
    useEffect(() => {
        // Only fetch if it's not the very first mount or if offset > 0 (for scroll)
        if (filters.offset === 0 && isInitialLoad && jobListings.length > 0) {
          // If initial data is provided and offset is 0, don't refetch
          setIsInitialLoad(false);
          return; 
        }

        fetchJobs(filters, filters.offset > 0); 
    }, [filters.offset]); // Only re-run when offset changes

    // 3. Reset offset when any main filter changes
    const handleFilterChange = (key, value) => {
      setFilters(prev => ({
        ...prev,
        [key]: value,
        // Reset offset to 0 when any filter changes
        offset: 0, 
      }));
    };

    // 4. Intersection Observer for Scroll Pagination
    useEffect(() => {
      const loadMoreTrigger = document.querySelector("#load-more-trigger");
      if (!loadMoreTrigger) return;

      const observer = new IntersectionObserver(
          (entries) => {
              if (entries[0].isIntersecting && hasMore && !loading) {
                  // Increment offset to trigger the fetch in useEffect(filters.offset)
                  setFilters(prev => ({ ...prev, offset: prev.offset + prev.limit }));
              }
          },
          { threshold: 1.0 }
      );

      observer.observe(loadMoreTrigger);

      return () => {
          if (observer) {
              observer.unobserve(loadMoreTrigger);
          }
      };
    }, [hasMore, loading]);


  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div
        className="w-full h-64 sm:h-72 lg:h-80 rounded-b-[60px] text-white px-4 sm:px-8 py-4 sm:py-12 relative flex flex-col items-start justify-start"
        style={{ background: "rgb(23, 95, 72)" }}
      >
        <div className=' pb-6 w-full'>
        <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Jobs" }]}
        styles={{
          nav: "flex justify-start px-2 md:px-10 text-sm font-medium",
        }}
      />
          <div className="mt-3 border-b border-white opacity-40 mx-2 md:mx-8"></div>
      </div>
        <div className="max-w-6xl mx-auto w-full">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug mb-6 sm:mb-8">
            FIND YOUR NEXT JOB IN <br className="hidden sm:block" /> SAUDI ARABIA
          </h1>
        </div>
      </div>

      {/* Filter Card */}
      <div className="max-w-5xl mx-auto -mt-20 relative z-10 px-4">
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
         {/* Top Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
            {/* Search Button */}
            <button
              onClick={() =>
                handleFilterChange("type", filters.type === "search" ? "all" : "search")
              }
              className={`w-full sm:w-auto border border-gray-300 px-6 py-2 rounded-md flex items-center justify-center transition text-black
                ${filters.type === "search" ? "bg-[#175f48] text-white" : "bg-white "}`}
            >
              <Search className="w-4 h-4 mr-2" /> Search for jobs
            </button>

            {/* Browse Categories Button */}
            <button
              onClick={() =>
                handleFilterChange("type", filters.type === "category" ? "all" : "category")
              }
              className={`w-full sm:w-auto border border-gray-300 px-6 py-2 rounded-md flex items-center justify-center transition
                ${filters.type === "category" ? "bg-[#175f48] text-white" : "bg-white text-black"}`}
            >
              <List className="w-4 h-4 mr-2" /> Browse Job Categories
            </button>
          </div>


          {/* Filter Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {/* Keywords */}
            <div>
              <label className="block text-sm mb-1">
                Keywords
              </label>
              <input
                type="text"
                placeholder="e.g. Nurse"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-sm bg-[#FAFAFA] text-sm text-gray-700 focus:outline-none "
              />
            </div>

            {filters?.type == "category" && (
              <>
                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <Select
                    name="category_id"
                    value={
                      filters.category_id
                        ? { value: filters.category_id, label: category?.find(c => c.id === filters.category_id)?.name || filters.category_id }
                        : null
                    }
                    onChange={(selected) =>
                      handleFilterChange("category_id", selected?.value || "")
                    }
                    options={category?.map((cat) => ({
                      value: cat.id,
                      label: cat.name,
                    })) || []}
                    placeholder="Select a Category"
                    className="text-sm"
                    classNamePrefix="react-select"
                    isClearable
                  />
                </div>
              </>
            )}

            {/* Work Type */}
            <div>
              <label className="block mb-1 text-sm font-medium">Work Type</label>
              <Select
                name="work_type"
                value={
                  filters.work_type
        ? [
            { value: "full_time", label: "Full Time" },
            { value: "part_time", label: "Part Time" },
            { value: "remote", label: "Remote" },
            { value: "freelance", label: "Freelance" },
            { value: "contract", label: "Contract" },
          ].find((opt) => opt.value === filters.work_type) || null
        : null
                }
                onChange={(selected) =>
                  handleFilterChange("work_type", selected?.value || "")
                }
                options={[
                  { value: "full_time", label: "Full Time" },
                  { value: "part_time", label: "Part Time" },
                  { value: "remote", label: "Remote" },
                  { value: "freelance", label: "Freelance" },
                  { value: "contract", label: "Contract" },
                ]}
                placeholder="Select Work Type"
                className="text-sm"
                classNamePrefix="react-select"
                isClearable
              />
            </div>

            {/* Minimum Pay Type */}
            <div>
              <label className="block mb-1 text-sm font-medium">Minimum Pay Type</label>
              <Select
                name="minimum_pay_type"
                value={
                   filters.minimum_pay_type
        ? [
            { value: "hourly", label: "Hourly" },
            { value: "daily", label: "Daily" },
            { value: "monthly", label: "Monthly" },
          ].find((opt) => opt.value === filters.minimum_pay_type) || null
        : null
                }
                onChange={(selected) =>
                  handleFilterChange("minimum_pay_type", selected?.value || "")
                }
                options={[
                  { value: "hourly", label: "Hourly" },
                  { value: "daily", label: "Daily" },
                  { value: "monthly", label: "Monthly" }, // Added common type
                ]}
                placeholder="Select Pay Type"
                className="text-sm"
                classNamePrefix="react-select"
                isClearable
              />
            </div>

            {/* Minimum Amount */}
            <div>
              <label className="block mb-1 text-sm font-medium">Minimum Amount</label>
              <Select
                name="min_amount"
                value={
                  filters.min_amount
                    ? { value: filters.min_amount, label: `${filters.min_amount}` }
                    : null
                }
                onChange={(selected) =>
                  handleFilterChange("min_amount", selected?.value || "")
                }
                options={[
                  { value: 10, label: "10" },
                  { value: 100, label: "100" },
                  { value: 1000, label: "1k" },
                  { value: 5000, label: "5k" },
                  { value: 10000, label: "10k+" },
                ]}
                placeholder="Select Minimum"
                className="text-sm"
                classNamePrefix="react-select"
                isClearable
              />
            </div>

            {/* Maximum Amount */}
            <div>
              <label className="block mb-1 text-sm font-medium">Maximum Amount</label>
              <Select
                name="max_amount"
                value={
                  filters.max_amount
                    ? { value: filters.max_amount, label: `${filters.max_amount}` }
                    : null
                }
                onChange={(selected) =>
                  handleFilterChange("max_amount", selected?.value || "")
                }
                options={[
                  { value: 1000, label: "1k" },
                  { value: 5000, label: "5k" },
                  { value: 10000, label: "10k" },
                  { value: 20000, label: "20k" },
                  { value: 50000, label: "50k+" },
                ]}
                placeholder="Select Maximum"
                className="text-sm"
                classNamePrefix="react-select"
                isClearable
              />
            </div>

            {/* Region */}
            <div className="relative">
              <label className="block mb-1 text-sm font-medium">{t("Region")}</label>
              <Select
                name="region"
                value={
                  filters.region ? { value: filters.region, label: filters.region } : null
                }
                onChange={(selected) => {
                  // Reset governorate and city when region changes
                  setFilters(prev => ({
                    ...prev,
                    region: selected?.value || "",
                    governorate: "",
                    city: "",
                    offset: 0,
                  }));
                }}
                options={regions.map((r) => ({ value: r.name, label: r.name }))}
                placeholder={t("Select a Region")}
                className="text-sm"
                classNamePrefix="react-select"
                isClearable
              />
            </div>

            {/* Governorate */}
            <div>
              <label className="block mb-1 text-sm font-medium">{t("Governorate")}</label>
              <Select
                name="governorate"
                value={
                  filters.governorate
                    ? { value: filters.governorate, label: filters.governorate }
                    : null
                }
                onChange={(selected) =>
                  handleFilterChange("governorate", selected?.value || "")
                }
                options={governorates.map((g) => ({ value: g.name, label: g.name }))}
                placeholder={t("Select a Governorate")}
                className="text-sm"
                classNamePrefix="react-select"
                isClearable
              />
            </div>
          </div>


          {/* Actions */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            {/* The rest of your md/lg layout (shown on sm and up) */}
            <div className="hidden sm:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 w-full">
              <div></div>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto sm:justify-end">
                <button 
                  onClick={() => fetchJobs({...filters, offset: 0}, false)} // Force search on button click
                  className="w-full sm:w-auto bg-[#175f48] hover:bg-blue-600 text-white px-6 py-2 rounded-md"
                >
                  Search Jobs
                </button>
              </div>
            </div>

            {/* Search Jobs Button for mobile (below everything) */}
            <div className="sm:hidden mt-2">
              <button 
                onClick={() => fetchJobs({...filters, offset: 0}, false)} // Force search on mobile click
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
              >
                Search Jobs
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <TrendingJobs jobListings={jobListings}/>
        
        {/* Loading Indicator */}
        {loading && <div className="text-center py-4 text-[#175f48] font-semibold">
          {/* Loading more jobs... */}
          </div>} 
        
        {/* Intersection Observer target for scroll pagination */}
        {hasMore && !loading && (
          // This invisible div is the anchor for the Intersection Observer
          <div id="load-more-trigger" className="h-1 my-8"></div>
        )}
        
        {/* End of results message */}
        {!hasMore && jobListings.length > 0 && !loading && (
            <div className="text-center py-4 text-gray-500">
                You've reached the end of the job listings.
            </div>
        )}

        {/* No results message */}
        {!loading && jobListings.length === 0 && !isInitialLoad && (
            <div className="text-center py-12 text-gray-600 text-xl">
                No jobs found matching your filters. Try adjusting your search!
            </div>
        )}
      </section>
    </div>
  );
};

export default JobsClient;