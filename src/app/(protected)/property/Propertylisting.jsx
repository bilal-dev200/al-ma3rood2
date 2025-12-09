import React from "react";
import { FaBed, FaBath } from "react-icons/fa";

const properties = [
  {
    id: 1,
    title: "Grand Oak Residence",
    location: "1234 Oak Lane, Lexington Heights, Wellington",
    bedrooms: "4 bedrooms",
    area: "5,025 Sq. Ft.",
    bathrooms: "5 bathroom",
    description:
      "Stay ahead with industry news, smart property tips, and design inspiration crafted to guide you at every step of your real estate journey",
    image:
      "https://www.mashvisor.com/blog/wp-content/uploads/2018/04/bigstock-Row-Of-New-Suburban-Homes-55511546.jpg",
  },
  {
    id: 2,
    title: "Grand Oak Residence",
    location: "1234 Oak Lane, Lexington Heights, Wellington",
    bedrooms: "4 bedrooms",
    area: "5,025 Sq. Ft.",
    bathrooms: "5 bathroom",
    description:
      "Stay ahead with industry news, smart property tips, and design inspiration crafted to guide you at every step of your real estate journey",
    image:
      "https://www.mashvisor.com/blog/wp-content/uploads/2018/04/bigstock-Row-Of-New-Suburban-Homes-55511546.jpg",
  },
  {
    id: 3,
    title: "Grand Oak Residence",
    location: "1234 Oak Lane, Lexington Heights, Wellington",
    bedrooms: "4 bedrooms",
    area: "5,025 Sq. Ft.",
    bathrooms: "5 bathroom",
    description:
      "Stay ahead with industry news, smart property tips, and design inspiration crafted to guide you at every step of your real estate journey",
    image:
      "https://www.mashvisor.com/blog/wp-content/uploads/2018/04/bigstock-Row-Of-New-Suburban-Homes-55511546.jpg",
  },
  {
    id: 4,
    title: "Grand Oak Residence",
    location: "1234 Oak Lane, Lexington Heights, Wellington",
    bedrooms: "4 bedrooms",
    area: "6,025 Sq. Ft.",
    bathrooms: "5 bathroom",
    description:
      "Stay ahead with industry news, smart property tips, and design inspiration crafted to guide you at every step of your real estate journey",
    image:
      "https://www.mashvisor.com/blog/wp-content/uploads/2018/04/bigstock-Row-Of-New-Suburban-Homes-55511546.jpg",
  },
];

const Propertylisting = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold border-b-2 border-black inline-block">
          Property listings in your Watchlist
        </h2>
        <button className="bg-green-500 text-white px-3 sm:px-5 lg:px-6 py-2 rounded text-sm sm:text-base">
          View All
        </button>
      </div>

      {/* Cards */}
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:mt-12">
  {properties.map((property) => (
    <div
      key={property.id}
      className="relative rounded-lg overflow-hidden bg-white shadow-md"
    >
      {/* Image */}
      <img
        src={property.image}
        alt={property.title}
        className="w-full h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96 object-cover"
      />

      {/* Card Content */}
      <div className="p-4 bg-[#469BDB] text-white">
        <h3 className="text-sm sm:text-base font-semibold">
          {property.title}
        </h3>
        <p className="text-xs sm:text-sm">{property.location}</p>
        <div className="flex justify-between text-[11px] sm:text-xs flex-wrap gap-y-3 mt-3 sm:mt-4">
          <div className="flex items-center gap-1">
            <FaBed /> {property.bedrooms}
          </div>
          <div className="flex items-center gap-1">
            <FaBed /> {property.area}
          </div>
          <div className="flex items-center gap-1">
            <FaBath /> {property.bathrooms}
          </div>
          <div className="w-full text-[10px] sm:text-xs mt-2">
            {property.description}
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

    </div>
  );
};

export default Propertylisting;
