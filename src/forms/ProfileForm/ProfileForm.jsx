import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { Camera } from "lucide-react";
import { toast } from "react-hot-toast";
import { FormInput } from "@/components/FormInput";
import { profileSchema } from "@/validation/profileSchema";
import { updateUser } from "@/store/adminUserSlice";
import { uploadSingleFile } from "@/store/uploadSlice";
import { loadUserProfile } from "@/store/userProfileSlice";

export default function ProfileForm({ userId, initialData }) {
  const dispatch = useDispatch();
  const { loadingProfile } = useSelector((state) => state.userProfile);
  const userIdProfile = useSelector((state) => state.userProfile.profile?.id);

  const form = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      email: initialData?.email || "",
      phoneNumber: initialData?.phoneNumber || "",
      avatar: initialData?.avatar || "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  // Load initial data when it changes
  useEffect(() => {
    if (initialData) {
      setValue("firstName", initialData.firstName || "");
      setValue("lastName", initialData.lastName || "");
      setValue("email", initialData.email || "");
      setValue("phoneNumber", initialData.phoneNumber || "");
      setValue("avatar", initialData.avatar || "");
    }
  }, [initialData, setValue]);

  const avatarUrl = watch("avatar");

  const handleUploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      const result = await dispatch(uploadSingleFile(file)).unwrap();
      const fileUrl = result?.files?.[0]?.fileUrl || result?.fileUrl;
      if (fileUrl) {
        setValue("avatar", fileUrl);
        console.log("Avatar uploaded successfully");
        toast.success("Avatar uploaded successfully");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload avatar");
    }
  };

  const onSubmit = async (data) => {
    console.log(userId, userIdProfile);
    if (!userId || !userIdProfile) {
      console.log("User ID is required");
      toast.error("User ID is required");
      return;
    }

    try {
      console.log("Updating profile...");
      await dispatch(updateUser({ id: userId || userIdProfile, data })).unwrap();
      dispatch(loadUserProfile());
      toast.success("Profile updated successfully");
    } catch (err) {
      const errorMessage =
        err?.message ||
        err?.response?.data?.message ||
        "Failed to update profile";
      toast.error(errorMessage);
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Profile Picture Section */}
      <div className="bg-muted p-6 border-b border-border">
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-foreground rounded-full flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground flex items-center justify-center">
                  <Camera size={40} className="text-muted" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-colors cursor-pointer">
              <Camera size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadAvatar}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <FormInput
            label={
              <>
                First Name <span className="text-destructive">*</span>
              </>
            }
            name="firstName"
            type="text"
            register={register}
            placeholder="Enter first name"
            errors={errors}
          />

          {/* Last Name */}
          <FormInput
            label={
              <>
                Last Name <span className="text-destructive">*</span>
              </>
            }
            name="lastName"
            type="text"
            register={register}
            placeholder="Enter last name"
            errors={errors}
          />
        </div>

        {/* Email */}
        <FormInput
          label={
            <>
              Email <span className="text-destructive">*</span>
            </>
          }
          name="email"
          type="email"
          register={register}
          placeholder="Enter email address"
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

        {/* Submit Button */}
        <div className="flex justify-start pt-4">
          <button
            type="submit"
            disabled={loadingProfile}
            className="px-8 py-2 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingProfile ? "Updating..." : "Update Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
