import { FormInput } from "@/components/FormInput";
import { CardSection } from "@/forms/FormLayout/CardSection";
import { ToggleField } from "@/components/ToggleField";

export default function PricingSection({ register, errors }) {

  return (
    <CardSection title="Pricing">
        <FormInput
          type="number"
          label="Price"
          name="price"
          register={register}
          placeholder="Price"
          errors={errors}
          options={{ valueAsNumber: true }}
        />

          {/* <ToggleField
            label="Charge tax on this product"
            name="chargeTax"
            control={control}
          /> */}
    </CardSection>
  );
}
