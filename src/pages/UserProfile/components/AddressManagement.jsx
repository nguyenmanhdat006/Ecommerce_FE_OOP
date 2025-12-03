import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Plus, Edit2, Trash2, MapPin } from "lucide-react";
import { Section } from "./Section";
import AddressForm from "@/forms/AddressForm/AddressForm";
import {
  fetchMyAddresses,
  deleteAddress,
  clearSelectedAddress,
  selectAddressState,
} from "@/store/addressSlice";

export default function AddressManagement() {
  const dispatch = useDispatch();
  const { addresses, loading, loaded } = useSelector(selectAddressState);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    // Only fetch if not already loaded
    if (!loaded) {
      dispatch(fetchMyAddresses());
    }
  }, [dispatch, loaded]);

  const handleAddClick = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEditClick = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDeleteClick = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      await dispatch(deleteAddress(addressId)).unwrap();
      toast.success("Address deleted successfully");
      dispatch(fetchMyAddresses());
    } catch (err) {
      const errorMessage =
        err?.message ||
        err?.response?.data?.message ||
        "Failed to delete address";
      toast.error(errorMessage);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingAddress(null);
    dispatch(clearSelectedAddress());
    dispatch(fetchMyAddresses());
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
    dispatch(clearSelectedAddress());
  };

  if (loading && (!addresses || !Array.isArray(addresses) || addresses.length === 0)) {
    return (
      <Section title="Manage Address">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-sm text-muted-foreground">Loading addresses...</p>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Manage Address</h2>
          {!showForm && (
            <button
              onClick={handleAddClick}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
            >
              <Plus size={18} />
              Add New Address
            </button>
          )}
        </div>

        {showForm ? (
          <div className="border-t border-border pt-6">
            <AddressForm
              address={editingAddress}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        ) : (
          <>
            {addresses && Array.isArray(addresses) && addresses.length > 0 ? (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin size={18} className="text-primary" />
                          <h3 className="font-semibold text-lg">{address.name}</h3>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1 ml-6">
                          <p>{address.street}</p>
                          <p>
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p className="mt-2">Phone: {address.phoneNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleEditClick(address)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                          title="Edit address"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(address.id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                          title="Delete address"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No addresses saved yet.</p>
                <button
                  onClick={handleAddClick}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                >
                  <Plus size={18} />
                  Add Your First Address
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

