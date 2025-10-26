import { CardSection } from "@/forms/FormLayout/CardSection";
import { AddButton } from "@/components/AddButton";
import { FormInput } from "@/components/FormInput";
import { CardSectionItem } from "@/forms/FormLayout/CardSectionItem";
import { RemoveButton } from "@/components/RemoveButton";

export function VariantsSection({ fields, append, remove, register, errors }) {
  return (
    <CardSection
      title="Variants"
      actions={
        <AddButton
          onClick={() => append({ size: "", color: "", stockQuantity: 0 })}
          title="Add Variant"
        />
      }
    >
      {errors?.variants && (
        <p className="text-red-500 text-sm mb-4">{errors.variants.message}</p>
      )}

        {fields.map((field, index) => (
          <CardSectionItem
            key={field.id}
            title={`Variant ${index + 1}`}
            actionButton={<RemoveButton onClick={() => remove(index)} />}
          >
            <div className="grid grid-cols-3 gap-3">
              <FormInput
                label="Size"
                name={`variants.${index}.size`}
                register={register}
                placeholder="M"
                errors={errors}
              />
              <FormInput
                label="Color"
                name={`variants.${index}.color`}
                register={register}
                placeholder="Red"
                errors={errors}
              />
              <FormInput
                label="Stock Quantity"
                name={`variants.${index}.stockQuantity`}
                type="number"
                register={register}
                placeholder="10"
                errors={errors}
              />
            </div>
          </CardSectionItem>
        ))}

        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No variants added yet. Click "Add Variant" to get started.
        </p>
      )}
    </CardSection>
  );
}
