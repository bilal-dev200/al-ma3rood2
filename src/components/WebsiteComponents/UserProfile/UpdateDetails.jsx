import { useProfileStore } from "@/lib/stores/profileStore";
import {
  FaEnvelope,
  FaKey,
  FaUserEdit,
  FaLock,
  FaAddressCard,
  FaMapMarkerAlt,
  FaUser,
  FaIdBadge,
  FaFileAlt,
  FaTags,
  FaImage,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const UpdateDetails = () => {
  const showComponent = useProfileStore((state) => state.showComponent);
  const hideComponent = useProfileStore((state) => state.hideComponent);

  const updateOptions = [
    { id: "editProfile", icon: FaUser, label: "My Profile" },
    // { id: "changeEmail", icon: FaEnvelope, label: "Change Email Address" },
    { id: "changePassword", icon: FaKey, label: "Change Password" },
    { id: "changeUsername", icon: FaUserEdit, label: "Change Fullname" },
    {
      id: "editContactDetails",
      icon: FaUserEdit,
      label: "Edit Contact Details",
    },
    // {
    //   id: "editDeliveryAddress",
    //   icon: FaUserEdit,
    //   label: "Edit Delivery Address",
    // },
  ];

  const profileOptions = [
    { id: "editProfile", icon: FaUser, label: "My Profile" },
    { id: "jobProfile", icon: FaIdBadge, label: "Job Profile" },
    { id: "documents", icon: FaFileAlt, label: "CVs and Documents" },
    { id: "sellingOptions", icon: FaTags, label: "Selling Options" },
    { id: "myPhotos", icon: FaImage, label: "My Photos" },
  ];
  const { t ,i18n} = useTranslation();
  const isRTL = i18n.language === "ar";



  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">{t("Update My Details")}</h2>

   {/* <div className="bg-gray-50 p-5 rounded-md space-y-6 text-sm">
  <div className="space-y-4">
    {updateOptions.map((item) => (
      <button
        key={item.id}
        onClick={() => showComponent(item.id)}
        className="flex items-center text-green-600 hover:underline"
      >
        <item.icon className="mr-2" />
        {t(item.label)}
      </button>
    ))}
  </div>
</div> */}
<div className="bg-gray-50 p-5 rounded-md space-y-6 text-sm">
  <div className="space-y-4">
    {updateOptions.map((item) => (
      <button
        key={item.id}
        onClick={() => showComponent(item.id)}
        className={`flex items-center text-green-600 cursor-pointer hover:underline ${isRTL ? "" : ""}`}
      >
        <item.icon className={`${isRTL ? "ml-2" : "mr-2"}`} />
        {t(item.label)}
      </button>
    ))}
  </div>
</div>


    </div>
  );
};

export default UpdateDetails;
