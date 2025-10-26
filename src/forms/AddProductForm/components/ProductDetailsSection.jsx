import { FormInput } from "@/components/FormInput";

export default function ProductDetailsSection({ register, errors }) {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold mb-4">Product Details</h2>
      <div className="space-y-4">
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

        <div>
          <label className="block text-sm font-medium mb-2">Description (Optional)</label>
          <textarea
            {...register("description")}
            rows={4}
            placeholder="Set a description to the product for better visibility."
            className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 ${
              errors?.description ? "border-red-500 ring-red-500" : "border-input ring-ring"
            }`}
          />
          {errors?.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}