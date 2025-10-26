import { useState } from "react";
import { FormInput } from "@/components/FormInput";

export default function PricingSection({ register, errors }) {
  const [taxable, setTaxable] = useState(true); // trạng thái toggle riêng

  const handleToggle = () => {
    setTaxable(!taxable);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold mb-4">Pricing</h2>
      <div className="space-y-4">
        <FormInput
          type="number"
          label="Price"
          name="price"
          register={register}
          placeholder="Price"
          errors={errors}
        />

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Charge tax on this product</label>
          <button
            type="button"
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              taxable ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                taxable ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
