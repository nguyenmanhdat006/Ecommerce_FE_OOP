import { CardSection } from "@/forms/FormLayout/CardSection";
import { FormSelect } from "@/components/FormSelect";

export default function CategoriesSection({
  register,
  errors,
  categories,
  categoryTypes,
  selectedCategory,
}) {
  return (
    <CardSection title="Categories">
      <FormSelect
        label="Category"
        name="categoryId"
        register={register}
        errors={errors}
        options={[{ value: "", label: "Select a category" }, ...categories.map(cat => ({ value: cat.id, label: cat.name }))]}
      />

      {selectedCategory && categoryTypes.length > 0 && (
        <FormSelect
          label="Category Type"
          name="categoryTypeId"
          register={register}
          errors={errors}
          options={[{ value: "", label: "Select a type" }, ...categoryTypes.map(type => ({ value: type.id, label: type.name }))]}
        />
      )}

      {/* Hidden fields for form submission */}
      <input type="hidden" {...register("categoryName")} />
      <input type="hidden" {...register("categoryTypeName")} />
    </CardSection>
  );
}
