import { FormInput } from "@/components/FormInput";
import { CardSection } from "@/forms/FormLayout/CardSection";
import { FormTextarea } from "@/components/FormTextArea";

export default function ProductDetailsSection({ register, errors }) {
  return (
    <CardSection title="Product Details">
        <FormInput
          label="Name"
          name="name"
          register={register}
          placeholder="Product name"
          errors={errors}
        />

        <FormInput
          label="Brand"
          name="brand"
          register={register}
          placeholder="Brand"
          errors={errors}
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
