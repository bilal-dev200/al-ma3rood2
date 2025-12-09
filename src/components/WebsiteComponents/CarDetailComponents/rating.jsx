import React from 'react';

const Rating = () => {
  const ratings = [
    { title: "Energy Economy", score: 4.5, reviews: 297 },
    { title: "Energy Economy", score: 4.2, reviews: 245 },
    { title: "Energy Economy", score: 4.4, reviews: 276 },
    { title: "Energy Economy", score: 4.3, reviews: 312 },
  ];

  return (
    <div className="bg-white  relative">
      {/* Ratings Section */}
      <div className="px-6 pb-0">
     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
          <div
            className="inline-block pb- border-b-2"
            style={{ borderColor: "#7B7B7B" }}
          >
            <h2 className="text-2xl font-bold text-gray-900 ">
              Ratings
            </h2>
          </div>
          </div>

        {/* Flex Row with bigger cards */}
        <div className="flex gap-4">
          {ratings.map((item, idx) => (
            <div
              key={idx}
              className="flex-1 p-6 border border-gray-900 rounded-md  bg-white"
            >
              <h3 className="text-base font-medium text-gray-900 mb-3">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-yellow-400">
                  <span className="text-sm">★★★★</span>
                  <span className="text-sm text-gray-300">★</span>
                </div>
                <span className="text-sm text-gray-600">{item.score}</span>
                <span className="text-sm text-gray-600">
                  {item.reviews} reviews
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Overall score • {item.score}/5
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rating;
