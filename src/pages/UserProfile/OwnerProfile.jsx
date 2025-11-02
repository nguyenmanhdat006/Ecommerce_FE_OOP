import { useState } from "react";
import ProfileLayout from "@/layout/ProfileLayout";
import ProfileSidebar from "./components/ProfileSidebar";
import ProfileForm from "@/forms/ProfileForm/ProfileForm";
import { Section } from "./components/Section";

export default function OwnerProfile() {
  const [activeSection, setActiveSection] = useState("personal");

  const sections = {
    personal: <ProfileForm />,
    orders: <Section title="My Orders">No orders yet.</Section>,
    address: <Section title="Manage Address">No addresses saved.</Section>,
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
