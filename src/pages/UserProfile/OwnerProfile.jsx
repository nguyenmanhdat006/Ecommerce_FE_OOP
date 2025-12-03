import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProfileLayout from "@/layout/ProfileLayout";
import ProfileSidebar from "./components/ProfileSidebar";
import ProfileForm from "@/forms/ProfileForm/ProfileForm";
import AddressManagement from "./components/AddressManagement";
import { Section } from "./components/Section";
import { loadUserProfile, selectUserProfile } from "@/store/userProfileSlice";

export default function OwnerProfile() {
  const [activeSection, setActiveSection] = useState("personal");
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUserProfile);

  useEffect(() => {
    if (!userProfile) {
      dispatch(loadUserProfile());
    }
  }, [dispatch, userProfile]);

  // Map user profile data to form format
  const initialData = userProfile
    ? {
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        email: userProfile.email || "",
        phoneNumber: userProfile.phoneNumber || "",
        avatar: userProfile.avatar || "",
      }
    : null;

  const sections = {
    personal: (
      <ProfileForm userId={userProfile?.id} initialData={initialData} />
    ),
    orders: <Section title="My Orders">No orders yet.</Section>,
    address: <AddressManagement />,
    payment: (
      <Section title="Payment Methods">No payment methods saved.</Section>
    ),
  };

  return (
    <ProfileLayout
      sidebar={
        <ProfileSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      }
    >
      {sections[activeSection]}
    </ProfileLayout>
  );
}
