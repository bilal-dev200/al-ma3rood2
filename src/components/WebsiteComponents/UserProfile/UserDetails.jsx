// "use client";
// import React from "react";
// import { FaEnvelope, FaCheckCircle } from "react-icons/fa";
// import { FaMapMarkerAlt, FaUser } from "react-icons/fa";
// import Button from "../ReuseableComponenets/Button";
// import { useAuthStore } from "@/lib/stores/authStore";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { userApi } from "@/lib/api/user";
// import { toast } from "react-toastify";
// import { Image_URL } from "@/config/constants";
// import { useProfileStore } from "@/lib/stores/profileStore";

// const UserDetails = ({ profile }) => {
//   const { user, logout, updateUser } = useAuthStore();
//   const router = useRouter();
//   const showComponent = useProfileStore((state) => state.showComponent);

//   // Profile Upload Handler
//   const handleProfileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     toast.info("File selected");
//     const formData = new FormData();
//     formData.append("profile_photo", file);

//     try {
//       const res = await userApi.uploadProfileImage(formData);
//       updateUser({ profile_photo: res.data.profile_photo });
//       toast.success("Profile uploaded successfully!");
//     } catch (err) {
//       toast.error("Profile upload failed!");
//       console.error("Profile upload failed:", err.message);
//     }
//   };

//   // Cover Upload Handler
//   const handleCoverUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file || !user?.id) return;

//     toast.info("File selected");
//     const formData = new FormData();
//     formData.append("background_photo", file);

//     try {
//       const res = await userApi.uploadCoverImage(user.id, formData);
//       updateUser({ background_photo: res.data.background_photo });
//       toast.success("Cover photo uploaded!");
//     } catch (err) {
//       toast.error("Cover upload failed!");
//       console.error("Cover upload failed:", err.message);
//     }
//   };

//   return (
//     <div className="w-full mx-auto bg-[#FAFAFA] rounded-lg  overflow-hidden relative">
//       <div className="h-64 bg-transparent relative z-50 rounded-t-lg overflow-visible">
//         <div className="h-64 bg-gray-200 relative z-50 rounded-t-lg overflow-visible">
//           {user?.background_photo && (
//             <Image
//               src={`${Image_URL}${user.background_photo}`}
//               alt="Cover"
//               fill
//               sizes="100vw"
//               className="object-cover"
//             />
//           )}

//           <input
//             type="file"
//             id="cover-upload"
//             className="hidden"
//             accept="image/*"
//             onChange={handleCoverUpload}
//           />
//           <label
//             htmlFor="cover-upload"
//             className="absolute bottom-2 right-2 p-1 rounded-full cursor-pointer"
//             title="Change cover"
//           >
//             <Image
//               src="/Profile/camera.png"
//               alt="Edit"
//               width={20}
//               height={20}
//             />
//           </label>
//         </div>

//         {/* Profile Image */}
//         <div className="absolute left-6 -bottom-16">
//           <div className="relative z-50 w-32 h-32 rounded-full border-4 border-white overflow-hidden flex items-center justify-center bg-[#469BDB] text-green-50 text-7xl font-semibold">
//             {user?.profile_photo ? (
//               <Image
//                 src={`${Image_URL}${user.profile_photo}`}
//                 alt="Profile"
//                 fill
//                 sizes="128px"
//                 className="object-cover"
//               />
//             ) : (
//               user?.name?.charAt(0)?.toUpperCase()
//             )}

//             <input
//               type="file"
//               id="profile-upload"
//               className="hidden"
//               accept="image/*"
//               onChange={handleProfileUpload}
//             />

//             <label
//               htmlFor="profile-upload"
//               className="absolute bottom-1 right-8 bg-white rounded-full cursor-pointer"
//               title="Change profile picture"
//             >
//               <Image
//                 src="/Profile/camera.png"
//                 alt="Edit"
//                 width={16}
//                 height={16}
//               />
//             </label>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="pt-14 px-4 pb-6">
//         {/* Name + Feedback */}
//         <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
//           {/* Name */}
//           <div className="ml-0 md:ml-7 mt-2 md:mt-5">
//             <h2 className="text-lg font-semibold">{user?.name}</h2>
//           </div>

//           {/* Feedback */}
//           {/* <div className="md:text-right mt-4 md:mt-0">
//             <p className="text-4xl font-semibold md:absolute md:top-[265px] md:right-4 z-50">
//               78+
//             </p>
//             <div className="text-yellow-400 text-2xl md:text-3xl">★★★★★</div>
//             <p className="text-sm text-gray-500">100% positive feedback</p>
//           </div> */}
//         </div>

//         {/* Info badges */}
//         {/* 🖥️ Desktop/Web layout */}
//         <div className="mt-6 flex-wrap gap-3 text-sm max-w-4xl hidden sm:flex">
//           {[
//             {
//               icon: "/Profile/name.png",
//               label: "Name",
//               value: user?.name,
//             },
//             {
//               icon: "/Profile/member.png",
//               label: "Member Number",
//               value: user?.customer_number,
//             },
//             {
//               icon: "/Profile/authenticated.png",
//               label: "Authenticated",
//               value: "Yes",
//             },
//             {
//               icon: "/Profile/email.png",
//               label: "Email",
//               value: user?.email,
//             },
//             {
//               icon: "/Profile/location.png",
//               label: "Location",
//               value: user?.billing_address,
//             },
//             {
//               icon: "/Profile/since.png",
//               label: "Member Since",
//               value: user?.created_at
//                 ? new Date(user.created_at).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "short",
//                   })
//                 : "",
//             },
//           ].map((item, i) => (
//             <span
//               key={i}
//               className="flex items-center bg-[#EFEFEF] px-3 py-1 rounded-md w-fit"
//             >
//               <Image
//                 src={item.icon}
//                 alt={`${item.label} Icon`}
//                 width={15}
//                 height={15}
//                 className="mr-2"
//               />
//               {item.label}:
//               <span className="text-[#555555] ml-2">{item.value}</span>
//             </span>
//           ))}
//         </div>

//         {/* 📱 Mobile layout */}
//         <div className="mt-6 grid grid-cols-1 gap-3 sm:hidden">
//           {[
//             {
//               icon: "/Profile/name.png",
//               label: "Name",
//               value: user?.name,
//             },
//             {
//               icon: "/Profile/member.png",
//               label: "Member Number",
//               value: user?.customer_number,
//             },
//             {
//               icon: "/Profile/authenticated.png",
//               label: "Authenticated",
//               value: "Yes",
//             },
//             {
//               icon: "/Profile/email.png",
//               label: "Email",
//               value: user?.email,
//             },
//             {
//               icon: "/Profile/location.png",
//               label: "Location",
//               value: user?.billing_address,
//             },
//             {
//               icon: "/Profile/since.png",
//               label: "Member Since",
//               value: user?.created_at
//                 ? new Date(user.created_at).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "short",
//                   })
//                 : "",
//             },
//           ].map((item, i) => (
//             <div
//               key={i}
//               className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200"
//             >
//               <div className="bg-green-100 p-2 rounded-full flex items-center justify-center">
//                 <Image
//                   src={item.icon}
//                   alt={`${item.label} Icon`}
//                   width={18}
//                   height={18}
//                 />
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-xs text-gray-500 leading-tight">
//                   {item.label}
//                 </span>
//                 <span className="text-sm text-gray-800 font-medium">
//                   {item.value}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Buttons */}
//         <div className="mt-6 flex gap-3 flex-wrap">
//           <Button
//             title="Log Out"
//             onClick={() => {
//               logout();
//               router.push("/login");
//             }}
//             className="cursor-pointer"
//           />

//           {!profile && (
//             <Button
//               title="Edit Profile"
//               onClick={() => showComponent("editProfile")}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDetails;
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "../ReuseableComponenets/Button";
import { toast } from "react-toastify";
import { useAuthStore } from "@/lib/stores/authStore";
import { useProfileStore } from "@/lib/stores/profileStore";
import { useTranslation } from "react-i18next";
import { userApi } from "@/lib/api/user";
import { Image_URL } from "@/config/constants";

const UserDetails = ({ profile }) => {
  const { user, logout, updateUser } = useAuthStore();
  const router = useRouter();
  const showComponent = useProfileStore((state) => state.showComponent);

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    toast.info("File selected");
    const formData = new FormData();
    formData.append("profile_photo", file);

    try {
      const res = await userApi.uploadProfileImage(formData);
      updateUser({ profile_photo: res.data.profile_photo });
      toast.success(res?.data?.message || "Profile uploaded successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Profile upload failed!");
      console.error("Profile upload failed:", err.message);
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user?.id) return;

    toast.info("File selected");
    const formData = new FormData();
    formData.append("background_photo", file);

    try {
      const res = await userApi.uploadCoverImage(user.id, formData);
      updateUser({ background_photo: res.data.background_photo });
      toast.success("Cover photo uploaded!");
    } catch (err) {
      toast.error("Cover upload failed!");
      console.error("Cover upload failed:", err.message);
    }
  };   
   const { t } = useTranslation();
  

  return (
    <div className="w-full mx-auto bg-[#FAFAFA] rounded-lg overflow-hidden relative">
      {/* Cover Photo Section */}
      <div className="h-64 bg-transparent relative z-10 md:z-50 rounded-t-lg overflow-visible">
        <div className="h-64 bg-gray-200 relative z-10 md:z-50 rounded-t-lg overflow-visible">
          {user?.background_photo && (
            <Image
              src={`${Image_URL}${user.background_photo}`}
              alt="Cover"
              fill
              sizes="100vw"
              className="object-cover"
            />
          )}

          <input
            type="file"
            id="cover-upload"
            className="hidden"
            accept="image/*"
            onChange={handleCoverUpload}
          />
          <label
            htmlFor="cover-upload"
            className="absolute bottom-2 right-2 p-1 rounded-full cursor-pointer"
            title="Change cover"
          >
            <Image
              src="/Profile/camera.png"
              alt="Edit"
              width={20}
              height={20}
            />
          </label>
        </div>

        {/* Profile Image Section */}
        <div className="absolute left-6 -bottom-16 z-10 md:z-50">
          <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden flex items-center justify-center bg-[#175f48] text-green-50 text-7xl font-semibold">
            {user?.profile_photo ? (
              <Image
                src={`${Image_URL}${user.profile_photo}`}
                alt="Profile"
                fill
                sizes="128px"
                className="object-cover"
              />
            ) : (
              user?.name?.charAt(0)?.toUpperCase()
            )}

            <input
              type="file"
              id="profile-upload"
              className="hidden"
              accept="image/*"
              onChange={handleProfileUpload}
            />
            <label
              htmlFor="profile-upload"
              className="absolute bottom-1 right-8 bg-white rounded-full cursor-pointer"
              title="Change profile picture"
            >
              <Image
                src="/Profile/camera.png"
                alt="Edit"
                width={16}
                height={16}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="pt-14 px-4 pb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="ml-0 md:ml-7 mt-2 md:mt-5">
            <h2 className="text-lg font-semibold">{user?.username}</h2>
          </div>
        </div>

        {/* Info Badges Desktop */}
        <div className="mt-6 flex-wrap gap-3 text-sm max-w-4xl hidden sm:flex">
          {[
            {
              icon: "/Profile/name.png",
              label: "Name",
              value: user?.username,
            },
            {
              icon: "/Profile/member.png",
              label: "Member Number",
              value: user?.memberId,
            },
            {
              icon: "/Profile/authenticated.png",
              label: "Authenticated",
              value: "Yes",
            },
            {
              icon: "/Profile/email.png",
              label: "Email",
              value: user?.email,
            },
            {
              icon: "/Profile/location.png",
              label: "Location",
              value: (user?.address_1 == null || user?.address_1 == "") ? `${user?.governorates?.name}, ${user?.regions?.name}` : `${user?.address_1}, ${user?.governorates?.name}, ${user?.regions?.name}`,
            },
            {
              icon: "/Profile/since.png",
              label: "Member Since",
              value: user?.created_at
                ? new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })
                : "",
            },
          ].map((item, i) => (
            <span
              key={i}
              className="flex items-center bg-[#EFEFEF] px-3 py-1 rounded-md w-fit gap-2"
            >
              <Image
                src={item.icon}
                alt={`${item.label} Icon`}
                width={15}
                height={15}
                className="mr-2 gap-5"
              />
              {t(item.label)}:

              <span className="text-[#555555] ml-2">{item.value}</span>
            </span>
          ))}
        </div>

        {/* Info Cards Mobile */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:hidden">
          {[
            {
              icon: "/Profile/name.png",
              label: "Name",
              value: user?.username,
            },
            {
              icon: "/Profile/member.png",
              label: "Member Number",
              value: user?.memberId,
            },
            {
              icon: "/Profile/authenticated.png",
              label: "Authenticated",
              value: "Yes",
            },
            {
              icon: "/Profile/email.png",
              label: "Email",
              value: user?.email,
            },
            {
              icon: "/Profile/location.png",
              label: "Location",
              value: (user?.address_1 == null || user?.address_1 == "") ? `${user?.governorates?.name}, ${user?.regions?.name}` : user?.address_1,
            },
            {
              icon: "/Profile/since.png",
              label: "Member Since",
              value: user?.created_at
                ? new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })
                : "",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="bg-green-100 p-2 rounded-full flex items-center justify-center">
                <Image
                  src={item.icon}
                  alt={`${item.label} Icon`}
                  width={18}
                  height={18}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 leading-tight">
              {t(item.label)}:
                </span>
                <span className="text-sm text-gray-800 font-medium">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3 flex-wrap">
          <Button
    title={t("Log Out")}
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="cursor-pointer"
          />
          {!profile && (
            <Button
      title={t("Edit Profile")}
              onClick={() => showComponent("editProfile")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
