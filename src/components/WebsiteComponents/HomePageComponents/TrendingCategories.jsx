import React from 'react'

const TrendingCategories = () => {
  return (
    <div><div>
      <h2 className="text-2xl mt-5 font-semibold inline-block border-b-2 border-gray-400 pb-1 mb-6">
        Trending  Categories      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="h-24 bg-[#D9D9D9] rounded" />
        <div className="h-24 bg-[#D9D9D9] rounded" />
        <div className="h-24 bg-[#D9D9D9] rounded" />
      </div>
    </div></div>
  )
}

export default TrendingCategories