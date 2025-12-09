import React from "react";


export default function AppointmentBooking() {

    // In the same file

const Card = ({ children, className = "" }) => (
  <div className={`bg-gray-100 rounded-2xl  ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`inline-flex items-center justify-center font-medium rounded-full transition-colors duration-200 px-9 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
  >
    {children}
  </button>

  
);

const beforeYouBuyItems = [
  {
    id: 1,
    icon: "/my.png",
    title: "Pre-purchase Inspection",
    description: "Book pre-purchase inspection",
  },
  {
    id: 2,
    icon: "/TRADEME.png",
    title: "Car Insurance",
    description: "Get 15% off car insurance with Trade Me",
  },
];

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
            <div
              className="inline-block border-b-2"
              style={{ borderColor: "#7B7B7B" }}
            >
              <h2 className="text-2xl font-bold text-gray-900">
                Arrange a Viewing
              </h2>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm border-b border-gray-200 pb-4">
            <span className="text-gray-600">Appointment</span>
            <span className="text-gray-400">›</span>
            <span className="text-green-500 font-medium">Your Details</span>
            <span className="text-gray-400">›</span>
            <span className="text-gray-600">Summary</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Form Fields */}
          <div className="col-span-2 space-y-6">
            {/* Preferred Date & Time */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Preferred Date
                </label>
                <div className="relative">
                  <select className="w-full bg-gray-100 rounded px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-green-500">
                    <option>Select an option</option>
                    <option value="today">Today</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="next-week">Next Week</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#175f48]">
                    ▼
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Preferred Time
                </label>
                <div className="relative">
                  <select className="w-full bg-gray-100 rounded px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-green-500">
                    <option>Select an option</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#175f48]">
                    ▼
                  </span>
                </div>
              </div>
            </div>

            {/* Message Section */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Message <span className="text-gray-500">(Optional)</span>
              </label>
              <textarea
                placeholder="Any message for the dealer"
                className="w-full max-w-[300px] min-h-[80px] bg-gray-100 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-green-500"
              ></textarea>
            </div>

            {/* Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 border-gray-300 rounded accent-green-500 focus:ring-green-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the terms and conditions
              </label>
            </div>

            {/* Next Button */}
            <button className="bg-green-500 hover:bg-green-700 text-white px-6 py-2 rounded text-sm font-medium">
              Next
            </button>
          </div>

          {/* Right Column - View Location + Map */}
          <div className="col-span-1 space-y-3">
            <label className="block text-sm font-medium text-gray-900">
              View Location
            </label>
            <div className="bg-gray-300 rounded h-64 w-full flex items-center justify-center">
              <span className="text-gray-600 text-sm">Map placeholder</span>
            </div>
          </div>
        </div>
      </div>
<div className="mt-32">
    <div className="text-center  sm:gap-0 mb-10">
            <div
              className="inline-block border-b-2"
              style={{ borderColor: "#7B7B7B" }}
            >
              <h2 className="text-2xl font-bold text-gray-900">
                Before you Buy
              </h2>
            </div>
          </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
    {beforeYouBuyItems.map((item) => (
      <Card
        key={item.id}
        className="text-center p-6 flex flex-col h-full"
      >
        <CardContent className="flex flex-col flex-1 justify-between">
          
          {/* Top: Logo + Text */}
          <div>
            {/* Logo */}
            <div className="flex justify-center">
              <img src={item.icon} alt={item.title} />
            </div>

            {/* Text */}
            <div className="mt-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          </div>

          {/* Bottom: Button */}
          <Button className="bg-green-500 hover:bg-green-600 text-white mt-6">
            Book Now
          </Button>
        </CardContent>
      </Card>
    ))}
  </div>
</div>



    </div>
  );
}
