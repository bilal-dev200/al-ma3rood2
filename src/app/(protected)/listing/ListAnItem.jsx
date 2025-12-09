"use client";

import React from "react";
import Link from "next/link";
import Sidebar from "../ReuseableComponenets/Sidebar";

const ListAnItem = () => {
  const categories = [
    {
      title: "General item",
      description: "List for free – only pay when it sells",
      path: "/list/general-item",
    },
    {
      title: "Car, motorbike or boat",
      description: "Vehicles, or planes",
      path: "/list/vehicles",
    },
    {
      title: "Property",
      description: "List for free – only pay when it sells",
      path: "/list/property",
    },
    {
      title: "Job",
      description: "Advertise a vacancy.",
      path: "/list/job",
    },
    {
      title: "Flatmates wanted",
      description: "Find a flatmate",
      path: "/list/flatmates",
    },
    {
      title: "Service",
      description: "Offer a service",
      path: "/list/service",
    },
  ];

  return (
          <div className="flex items-start p-10 text-black">
 <Sidebar />
  <main className="flex-1 p-5">
    <div className="bg-white text-gray-800 p-8">
      <h2 className="text-2xl font-semibold mb-6">List an item</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((item, idx) => (
          <Link
            key={idx}
            href={item.path}
            className="hover:bg-gray-100 p-3 rounded-md transition block"
          >
            <h3 className="font-medium text-base text-green-600">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
    </main>
    </div>
  );
};

export default ListAnItem;
