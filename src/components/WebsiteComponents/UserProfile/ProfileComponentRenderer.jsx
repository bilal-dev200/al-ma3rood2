"use client";
import ChangeEmail from "./ChangeEmail";
import ChangePassword from "./ChangePassword";
import ChangeUsername from "./ChangeUsername";
import EditContactDetails from "./EditContactDetails";
import EditDeliveryaddress from "./EditDeliveryaddress";
import JobProfile from "./JobProfile";
import CvDocuments from "./CvDocuments";
import Button from "../ReuseableComponenets/Button";
import { useProfileStore } from "@/lib/stores/profileStore";
import AddressList from "./AddressList";

const componentMap = {
  changeEmail: ChangeEmail,
  changePassword: ChangePassword,
  changeUsername: ChangeUsername,
  editContactDetails: EditContactDetails,
  editDeliveryAddress: AddressList,
  jobProfile: JobProfile,
  documents: CvDocuments,
  editProfile: EditDeliveryaddress,
};

export default function ProfileComponentRenderer() {
  const { activeComponent } = useProfileStore();
  const ComponentToRender = activeComponent ? componentMap[activeComponent] : null;

  if (!ComponentToRender) return null;

  return (
    <div className="flex flex-col gap-3">
      <ComponentToRender />
    </div>
  );
}