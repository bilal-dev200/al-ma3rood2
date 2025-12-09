import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import MotorsClient from './MotorsClient';
import Breadcrumbs from '@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs';

const MotorSearchPage = () => {
   const items = [
    { label: "Home", href: "/" },
    { label: "Motors", href: "/motors" },
    {
      label: "Search Results",
      href: `/search`,
    },
  ];


  return (
    <div className="bg-white min-h-screen relative">
      {/* Header */}
      {/* <div className="text-black relative z-20">
        <div className="border-b border-gray-800 text-black relative z-20">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex justify-between items-center py-1 md:py-1 text-sm">
          
            <div className="hidden sm:flex items-center space-x-6">
              <div className="relative group flex items-center cursor-pointer">
                <span className="hover:text-blue-500 flex items-center">
                  Browse Motors
                </span>
                <ChevronDown className="w-4 h-4 ml-1" />
                <div className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg hidden group-hover:block bg-gray-100 z-10">
                  <Link
                    href="/motors/cars"
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-200"
                  >
                    Cars
                  </Link>
                  <Link
                    href="/motors/motorbikes"
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-200"
                  >
                    Motorbikes
                  </Link>
                </div>
              </div>

              <Link href="/reviews-&-advice" className="hover:text-blue-500">
                Reviews & Advice
              </Link>
              <Link href="/dealer-directory" className="hover:text-blue-500">
                Dealer Directory
              </Link>
              <Link href="/value-my-car" className="hover:text-blue-500">
                Value my Car
              </Link>
              <Link href='/find-a-mechanic'>
                Find a Mechanic
              </Link>
              <Link href='/new-car-showroom'>
                New Car showroom
              </Link>
            </div>

            <div className="hidden sm:flex items-center space-x-6">
              <Link href="/listing" className="hover:text-blue-500">
                Sell my Vehicle
              </Link>
            </div>

          </div>
        </div>
      </div> */}
     {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={items}
        styles={{
          nav: "flex justify-start text-sm font-medium bg-white border-b border-gray-200 px-10 py-3",
        }}
      />
      <MotorsClient />
    </div>
  );
};

export default MotorSearchPage;
