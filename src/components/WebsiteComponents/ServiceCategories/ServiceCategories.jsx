const categories = [
  {
    title: "Domestic services",
    items: [
      "Animals & pets",
      "Architecture & design",
      "Babysitters",
      "Computing",
      "Moving & storage",
      "Nannies & carers",
      "Repairs & maintenance",
      "Other domestic services",
      "Outdoor & garden",
      "Cleaning",
    ],
  },
  {
    title: "Events & entertainment",
    items: [
      "Animals & pets",
      "Architecture & design",
      "Babysitters",
      "Computing",
      "Moving & storage",
      "Nannies & carers",
      "Repairs & maintenance",
      "Other domestic services",
      "Outdoor & garden",
      "Cleaning",
    ],
  },
  {
    title: "Health & wellbeing",
    items: [
      "Animals & pets",
      "Architecture & design",
      "Babysitters",
      "Computing",
      "Moving & storage",
      "Nannies & carers",
      "Repairs & maintenance",
      "Other domestic services",
      "Outdoor & garden",
      "Cleaning",
    ],
  },
  {
    title: "Trades",
    items: [
      "Animals & pets",
      "Architecture & design",
      "Babysitters",
      "Computing",
      "Moving & storage",
      "Nannies & carers",
      "Repairs & maintenance",
      "Other domestic services",
      "Outdoor & garden",
      "Cleaning",
    ],
  },
  {
    title: "Other services",
    items: [
      "Animals & pets",
      "Architecture & design",
      "Babysitters",
      "Computing",
      "Moving & storage",
      "Nannies & carers",
      "Repairs & maintenance",
      "Other domestic services",
      "Outdoor & garden",
      "Cleaning",
    ],
  },
];

export default function ServiceCategories() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-sans">
      <h2 className="text-xl font-semibold mb-6">Browse service listings</h2>
      <div className="space-y-10 mt-10">
        {categories.map((category, index) => (
          <div key={index}>
            <div
              className="inline-block pb-1 border-b-1 mb-3"
              style={{ borderColor: "#000000" }}
            >
              <h3 className="text-lg font-medium">{category.title}</h3>
            </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-5">
                {category.items.map((item, idx) => (
                  <p
                    key={idx}
                    className="hover:text-blue-600 cursor-pointer bg-gray-100 px-2 py-1 rounded-md text-xs flex items-center justify-center text-center"
                  >
                    {item}
                  </p>
                ))}
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
