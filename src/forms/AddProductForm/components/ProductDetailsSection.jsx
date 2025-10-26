import { FormInput } from "@/components/FormInput";
import { CardSection } from "@/forms/FormLayout/CardSection";
import { FormTextarea } from "@/components/FormTextArea";

export default function ProductDetailsSection({
  handleUploadThumbnail,
  register,
  errors,
}) {
  return (
    <CardSection title="Product Details">
      <FormInput
        label="Name"
        name="name"
        register={register}
        placeholder="Product name"
        errors={errors}
      />

      <div className="grid grid-cols-2 gap-3">
        <FormInput
          label="Brand"
          name="brand"
          register={register}
          placeholder="Brand"
          errors={errors}
        />
        <FormInput
          label="Slug"
          name="slug"
          register={register}
          placeholder="slug"
          errors={errors}
        />
      </div>
      <FormInput
        label="Thumbnail"
        type="file"
        useRegister={false}
        onChange={handleUploadThumbnail}
      />
      <FormTextarea
        label="Description"
        name="description"
        register={register}
        placeholder="Set a description to the product for better visibility."
        errors={errors}
      />
    </CardSection>
  );
}
