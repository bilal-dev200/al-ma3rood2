"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { servicesApi } from "@/lib/api/services";
import MyServiceCard from "./components/MyServiceCard";

export default function MyServicesClient() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    lastPage: 1,
    total: 0,
  });

  useEffect(() => {
    fetchServices({ page: 1 });
  }, []);

  async function fetchServices({ page = 1 }) {
    try {
      setIsLoading(true);
      setError(null);
      const response = await servicesApi.getUserServices({ page });
      const results = Array.isArray(response?.data?.data)
        ? response.data.data
        : Array.isArray(response?.data)
        ? response.data
        : [];
      setServices(results);
      setPagination({
        page: response?.data?.current_page || page,
        lastPage: response?.data?.last_page || 1,
        total: response?.data?.total || results.length,
      });
    } catch (err) {
      setError(err?.message || "Unable to load your services.");
      toast.error(err?.message || "Unable to load your services.");
    } finally {
      setIsLoading(false);
    }
  }

  function handlePageChange(nextPage) {
    if (
      nextPage < 1 ||
      nextPage > pagination.lastPage ||
      nextPage === pagination.page
    ) {
      return;
    }
    fetchServices({ page: nextPage });
  }

  async function handleDelete(serviceId) {
    if (!confirm("Are you sure you want to delete this service?")) {
      return;
    }
    try {
      // TODO: Add delete API call when endpoint is available
      toast.success("Service deleted successfully.");
      fetchServices({ page: pagination.page });
    } catch (err) {
      toast.error(err?.message || "Unable to delete service.");
    }
  }

  console.log('serviceeeeees in MyServicesClient', services);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
          Services
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">My Services</h1>
        <p className="text-sm text-slate-600">
          Manage your service listings.{" "}
          <Link href="/listing" className="text-blue-600 underline">
            Create a new service listing
          </Link>
          .
        </p>
      </header>

      {isLoading && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Loading your services…</p>
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          {error}
        </div>
      )}

      {!isLoading && !services.length && (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            You haven't created any services yet
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Start offering your services to customers on Ma3rood.
          </p>
          <Link
            href="/listing"
            className="mt-4 inline-flex items-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white"
          >
            Create a service listing
          </Link>
        </div>
      )}

      {!isLoading && services.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services?.map((service) => (
              <MyServiceCard
                key={service.id || service.service_id}
                service={service}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {pagination.lastPage > 1 && (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:justify-between">
              <p className="text-sm text-slate-600">
                Page {pagination.page} of {pagination.lastPage} · {pagination.total}{" "}
                services
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1 || isLoading}
                  className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.lastPage || isLoading}
                  className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

