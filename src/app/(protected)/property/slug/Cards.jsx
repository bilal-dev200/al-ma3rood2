import React from "react";

const Cards = ({ cards }) => {
  return (
    <div className="w-full flex justify-center mt-8">
      <div className="grid gap-6 sm:gap-8 lg:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full px-4 sm:px-8 md:px-12 lg:px-20 justify-items-center">
        {cards.map((card, index) => (
          <div
            key={index}
            className="w-full max-w-sm border rounded-md p-4 flex flex-col justify-between min-h-[150px]"
          >
            <div>
              <h3 className="text-lg sm:text-xl mb-2">{card.title}</h3>
              <p className="text-sm font-semibold">{card.subtitle}</p>
              {card.description && (
                <p className="text-sm text-gray-600">{card.description}</p>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button className="bg-[#469BDB] text-white text-sm px-4 py-2 rounded hover:bg-green-600 transition">
                {card.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
