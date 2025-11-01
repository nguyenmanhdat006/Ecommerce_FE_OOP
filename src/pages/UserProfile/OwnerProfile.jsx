import { useState } from "react";
import ProfileSidebar from "./components/ProfileSidebar";
import ProfileForm from "@/forms/ProfileForm/ProfileForm";

export default function OwnerProfile() {
  const [activeSection, setActiveSection] = useState("personal");

  return (
    <div className="flex flex-col min-h-screen bg-background">

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <ProfileSidebar 
              activeSection={activeSection} 
              onSectionChange={setActiveSection} 
            />

            <div className="md:col-span-3">
              {activeSection === "personal" && <ProfileForm />}

              {activeSection === "orders" && (
                <section className="bg-card rounded-lg p-6 border border-border">
                  <h2 className="text-xl font-semibold mb-4">My Orders</h2>
                  <p className="text-muted-foreground">No orders yet.</p>
                </section>
              )}

              {activeSection === "address" && (
                <section className="bg-card rounded-lg p-6 border border-border">
                  <h2 className="text-xl font-semibold mb-4">Manage Address</h2>
                  <p className="text-muted-foreground">No addresses saved.</p>
                </section>
              )}

              {activeSection === "payment" && (
                <section className="bg-card rounded-lg p-6 border border-border">
                  <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
                  <p className="text-muted-foreground">No payment methods saved.</p>
                </section>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
