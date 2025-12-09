import React from "react";

const NewCarsSection = ({ cars = [], totalOtherModels = 0 }) => {
  if (!cars.length) return null; // hide section if no cars

  return (
    <div className="mt-10">
      {/* Title */}
      <h2 className="text-lg font-semibold mb-2">
        New Cars that match your search
      </h2>
      <hr className="mb-6" />

      {/* Cars Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {cars.map((car, index) => (
          <div key={index} className="flex flex-col items-start">
            {/* Image */}
            <div className="w-full aspect-video bg-gray-200 rounded overflow-hidden">
              <img
                src={car.image || "https://via.placeholder.com/300x200?text=No+Image"}
                alt={car.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Car Name */}
            <p className="mt-2 text-sm font-medium">{car.name}</p>

            {/* Price */}
            <p className="text-sm text-gray-600">from {car.price}</p>

            {/* Link */}
            <a
              href={car.link || "#"}
              className="mt-1 text-sm text-blue-500 hover:underline"
            >
              View model specs
            </a>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="mt-6">
        <a
          href="#"
          className="text-sm text-blue-500 hover:underline font-medium"
        >
          Explore other {totalOtherModels} other new models
        </a>
      </div>
    </div>
  );
};

export default NewCarsSection;
