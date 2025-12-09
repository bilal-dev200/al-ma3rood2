// import Button from "@/components/WebsiteComponents/ReuseableComponenets/Button";
// import ChangeEmail from "@/components/WebsiteComponents/UserProfile/ChangeEmail";
// import ChangePassword from "@/components/WebsiteComponents/UserProfile/ChangePassword";
// import ChangeUsername from "@/components/WebsiteComponents/UserProfile/ChangeUsername";
// import CvDocuments from "@/components/WebsiteComponents/UserProfile/CvDocuments";
// import EditContactDetails from "@/components/WebsiteComponents/UserProfile/EditContactDetails";
// import EditDeliveryaddress from "@/components/WebsiteComponents/UserProfile/EditDeliveryaddress";
// import FeedbackCard from "@/components/WebsiteComponents/UserProfile/FeedbackCard";
// import JobProfile from "@/components/WebsiteComponents/UserProfile/JobProfile";
// import ProfileComponentRenderer from "@/components/WebsiteComponents/UserProfile/ProfileComponentRenderer";
// import Reviews from "@/components/WebsiteComponents/UserProfile/Reviews";
// import UpdateDetails from "@/components/WebsiteComponents/UserProfile/UpdateDetails";
// import UserBalance from "@/components/WebsiteComponents/UserProfile/UserBalance";
// import UserDetails from "@/components/WebsiteComponents/UserProfile/UserDetails";
// import { useCategoryStore } from "@/lib/stores/categoryStore";
// import { useProfileStore } from "@/lib/stores/profileStore";
// import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";

// export async function generateMetadata(){
//   return {
//     title: "Account|Ma3rood",
//     description:
//       "Browse and discover the best deals on Ma3rood Marketplace. Find products, categories, and more.",
//     // openGraph: {
//     //   title: "Marketplace | Ma3rood",
//     //   description: "Browse and discover the best deals on Ma3rood Marketplace. Find products, categories, and more.",
//     //   url: "https://yourdomain.com/marketplace", // to be replaced with the actual domain
//     //   siteName: "Ma3rood",
//     //   images: [
//     //     {
//     //       url: "https://yourdomain.com/og-marketplace.jpg",
//     //       width: 1200,
//     //       height: 630,
//     //       alt: "Marketplace | Ma3rood",
//     //     },
//     //   ],
//     //   locale: "en_US",
//     //   type: "website",
//     // },
//     robots: "index, follow",
//   };
// }

// const page = () => {
//   const activeComponent = useProfileStore((state) => state.activeComponent);

//   return (
//     <>
//       {/* <Breadcrumbs
//         items={[
//           { label: "Home", href: "/" },
//           { label: "Account" },
//         ]}
//         styles={{
//           nav: "flex justify-start text-sm font-medium bg-white border-b border-gray-200 px-10 py-3",
//         }}
//       /> */}
//       <ProfileComponentRenderer />
//       {/* Show main content when no component is active */}
//       {!activeComponent && (
//         <>
//           <UserDetails />
//           <UserBalance />
//           <UpdateDetails />
//           <Reviews />
//           <FeedbackCard />
//         </>
//       )}
//     </>
//   );
// };

// export default page;

// // <div>
// //   <div className="flex items-start p-7 text-black">
// //     <Sidebar />

// //     <main className="p-5 w-full">
// //       {!activeComponent && (
// //         <>
// //           <UserDetails />
// //           <UserBalance />
// //           <UpdateDetails setActiveComponent={setActiveComponent} />
// //         </>
// //       )}

// //       {/* Show selected component if any */}

// //       {activeComponent && (
// //         <div className="">
// //           <button onClick={() => setActiveComponent(null)}></button>
// //           {componentMap[activeComponent]}
// //         </div>
// //       )}
// //     </main>
// //   </div>
// // </div>
import React from 'react'
import AccountClientPage from './AccountClientPage';
export async function generateMetadata() {
  return {
    title: "Account | Ma3rood",
    description: "Manage your account information, update personal details, and view your activity – all in one place on your Ma3rood account dashboard..",
    robots: "index, follow",
  };
}

// export const metadata = {
//   title: "Account | Ma3rood",
//   description: "Manage your account information, update personal details, and view your activity – all in one place on your Ma3rood account dashboard..",
// };

const page = () => {
  return (
  <AccountClientPage/>
  )
}

export default page