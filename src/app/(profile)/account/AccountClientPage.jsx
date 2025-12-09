'use client';

import ProfileComponentRenderer from "@/components/WebsiteComponents/UserProfile/ProfileComponentRenderer";
import UserDetails from "@/components/WebsiteComponents/UserProfile/UserDetails";
import UserBalance from "@/components/WebsiteComponents/UserProfile/UserBalance";
import UpdateDetails from "@/components/WebsiteComponents/UserProfile/UpdateDetails";
import Reviews from "@/components/WebsiteComponents/UserProfile/Reviews";
import FeedbackCard from "@/components/WebsiteComponents/UserProfile/FeedbackCard";
import { useProfileStore } from "@/lib/stores/profileStore";

export default function AccountClientPage() {
  const activeComponent = useProfileStore((state) => state.activeComponent);

  return (
    <>
      <ProfileComponentRenderer />
      {!activeComponent && (
        <>
          <UserDetails />
          {/* <UserBalance /> */}
          <UpdateDetails />
          <Reviews />
          <FeedbackCard />
        </>
      )}
    </>
  );
}


