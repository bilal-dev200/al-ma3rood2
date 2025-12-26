"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Suspense } from "react";

function BookingSuccessContent() {
    const searchParams = useSearchParams();
    const name = searchParams.get("name");
    const serviceTitle = searchParams.get("service");
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
            <div className="mb-6 rounded-full bg-green-100 p-4">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>

            <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Request Submitted!
            </h1>
            <p className="mb-8 text-lg text-gray-600">
                Your service request for <span className="font-semibold">"{serviceTitle}"</span> has been successfully submitted.
            </p>

            {(name || email || phone) && (
                <div className="mb-8 w-full max-w-md rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">
                        Provider Contact Details
                    </h2>
                    <div className="space-y-3 text-left">
                        {serviceTitle && (
                            <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3 mb-2">
                                <span className="text-sm font-medium text-blue-600">Service booked</span>
                                <span className="font-semibold text-blue-900">{serviceTitle}</span>
                            </div>
                        )}
                        {name && (
                            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                <span className="text-sm font-medium text-gray-500">Provider</span>
                                <span className="font-semibold text-gray-900">{name}</span>
                            </div>
                        )}
                        {email && (
                            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                <span className="text-sm font-medium text-gray-500">Email</span>
                                <span className="font-semibold text-gray-900">{email}</span>
                            </div>
                        )}
                        {phone && (
                            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                <span className="text-sm font-medium text-gray-500">Phone</span>
                                <span className="font-semibold text-gray-900">{phone}</span>
                            </div>
                        )}
                    </div>
                    <p className="mt-4 text-xs text-gray-500 text-center">
                        Please save these details for your reference.
                    </p>
                </div>
            )}

            <div className="flex gap-4">
                <Link
                    href="/"
                    className="rounded-full border border-gray-300 px-8 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}


export default function BookingSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BookingSuccessContent />
        </Suspense>
    );
}
