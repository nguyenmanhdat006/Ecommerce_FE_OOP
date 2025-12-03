import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { FormInput } from "@/components/FormInput";
import { addressSchema } from "@/validation/addressSchema";
import { createAddress, updateAddress } from "@/store/addressSlice";

export default function AddressForm({ address, onSuccess, onCancel }) {
  const dispatch = useDispatch();
  const isEdit = Boolean(address?.id);

  const form = useForm({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      name: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = form;

  // Load initial data when editing
  useEffect(() => {
    if (address) {
      setValue("name", address.name || "");
      setValue("street", address.street || "");
      setValue("city", address.city || "");
      setValue("state", address.state || "");
      setValue("zipCode", address.zipCode || "");
      setValue("phoneNumber", address.phoneNumber || "");
    } else {
      reset();
    }
  }, [address, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await dispatch(updateAddress({ id: address.id, data })).unwrap();
        toast.success("Address updated successfully");
      } else {
        await dispatch(createAddress(data)).unwrap();
        toast.success("Address added successfully");
      }
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err?.message ||
        err?.response?.data?.message ||
        "Failed to save address";
      toast.error(errorMessage);
      console.error("Save failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <FormInput
        label={
          <>
            Name <span className="text-destructive">*</span>
          </>
        }
        name="name"
        type="text"
        register={register}
        placeholder="Enter name (e.g., Home, Office)"
        errors={errors}
      />

      {/* Street */}
      <FormInput
        label={
          <>
            Street Address <span className="text-destructive">*</span>
          </>
        }
        name="street"
        type="text"
        register={register}
        placeholder="Enter street address"
        errors={errors}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* City */}
        <FormInput
          label={
            <>
              City <span className="text-destructive">*</span>
            </>
          }
          name="city"
          type="text"
          register={register}
          placeholder="Enter city"
          errors={errors}
        />

        {/* State */}
        <FormInput
          label={
            <>
              State <span className="text-destructive">*</span>
            </>
          }
          name="state"
          type="text"
          register={register}
          placeholder="Enter state"
          errors={errors}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Zip Code */}
        <FormInput
          label={
            <>
              Zip Code <span className="text-destructive">*</span>
            </>
          }
          name="zipCode"
          type="text"
          register={register}
          placeholder="12345"
          errors={errors}
        />

        {/* Phone Number */}
        <FormInput
          label={
            <>
              Phone Number <span className="text-destructive">*</span>
            </>
          }
          name="phoneNumber"
          type="tel"
          register={register}
          placeholder="Enter phone number"
          errors={errors}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-border rounded-full hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-colors"
        >
          {isEdit ? "Update Address" : "Add Address"}
        </button>
      </div>
    </form>
  );
}

