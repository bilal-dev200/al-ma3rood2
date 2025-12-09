"use client";
import JobCard from "./JobCard";

export default function TrendingJobs({ jobListings }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div
          className="inline-block pb-1 border-b-2"
          style={{ borderColor: "#7B7B7B" }}
        >
          <h2 className="text-2xl font-bold text-gray-900">Trending Jobs</h2>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {jobListings?.length > 0 ? (
          jobListings.map((job, index) => (
            <JobCard
              key={index}
              title={job.title}
              company={job.company_name}
              location={`${job.governorate?.name},${job.region?.name}` || "Unknown"}
              date={new Date(job.created_at).toLocaleDateString()}
              description={job.short_summary}
              banner={job.banner}
              logo={job.logo}
              slug={job.slug}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-3 text-center">
            No trending jobs found.
          </p>
        )}
      </div>
    </div>
  );
}
