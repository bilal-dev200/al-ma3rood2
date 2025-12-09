import React, { useState } from 'react'

const Payment = () => {
  const [formData, setFormData] = useState({
    loanYears: 30,
    loanMonths: 0,
    frequency: "Monthly",
    propertyPrice: 198000,
    deposit: 154000,
    interestRate: 7.0,
  });

  const {
    loanYears,
    loanMonths,
    frequency,
    propertyPrice,
    deposit,
    interestRate,
  } = formData;

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const repaymentAmount = 3726;

  return (
    <div className="p-2 rounded px-4 sm:px-8 lg:px-16 w-full max-w-4xl mx-auto mt-10">
      <h2 className="text-lg sm:text-xl font-semibold mb-6 text-center sm:text-left">
        What will my mortgage repayments be?
      </h2>

      <div className="bg-[#FAFAFA] p-3 sm:p-6 rounded-md">
        <div className="flex flex-col md:flex-row md:flex-wrap justify-between items-start gap-6">
          {/* Loan Term */}
          <div>
            <label className="block text-sm font-medium mb-1">Loan term</label>
            <div className="flex space-x-4">
              {/* Year Input */}
              <div className="relative w-24 sm:w-28">
                <input
                  type="number"
                  value={loanYears}
                  onChange={(e) => handleChange("loanYears", +e.target.value)}
                  className="border rounded px-2 py-1 pr-10 w-full appearance-none no-spinner"
                  style={{ MozAppearance: "textfield" }}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
                  Year
                </span>
              </div>

              {/* Month Input */}
              <div className="relative w-24 sm:w-28">
                <input
                  type="number"
                  value={loanMonths}
                  onChange={(e) => handleChange("loanMonths", +e.target.value)}
                  className="border rounded px-2 py-1 pr-12 w-full appearance-none no-spinner"
                  style={{ MozAppearance: "textfield" }}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
                  Months
                </span>
              </div>
            </div>
          </div>

          {/* Payment Frequency */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Payment frequency
            </label>
            <div className="flex space-x-2">
              {["Monthly", "Fortnightly"].map((freq) => (
                <button
                  key={freq}
                  onClick={() => handleChange("frequency", freq)}
                  className={`px-4 py-1 rounded border text-sm ${
                    frequency === freq
                      ? "bg-[#469BDB] text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Repayment Display */}
          <div className="text-left sm:text-right ml-0 sm:ml-auto">
            <p className="text-lg font-bold">
              ${repaymentAmount.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">/ month</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Property Price */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Property price
            </label>
            <input
              type="number"
              value={propertyPrice}
              onChange={(e) => handleChange("propertyPrice", +e.target.value)}
              className="border rounded w-full px-3 py-2"
            />
            <input
              type="range"
              min={100000}
              max={2000000}
              step={1000}
              value={propertyPrice}
              onChange={(e) => handleChange("propertyPrice", +e.target.value)}
              className="w-full mt-2 text-[#469BDB]"
            />
          </div>

          {/* Deposit */}
          <div>
            <label className="block text-sm font-medium mb-1">My deposit</label>
            <input
              type="number"
              value={deposit}
              onChange={(e) => handleChange("deposit", +e.target.value)}
              className="border rounded w-full px-3 py-2"
            />
            <input
              type="range"
              min={0}
              max={propertyPrice}
              step={1000}
              value={deposit}
              onChange={(e) => handleChange("deposit", +e.target.value)}
              className="w-full mt-2 text-[#469BDB]"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Interest% p.a.
            </label>
            <input
              type="number"
              step="0.01"
              value={interestRate}
              onChange={(e) => handleChange("interestRate", +e.target.value)}
              className="border rounded w-full px-3 py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
