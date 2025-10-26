import { CardSection } from "@/forms/FormLayout/CardSection";
import { ToggleField } from "@/components/ToggleField";
import { FormSelect } from "@/components/FormSelect";

// TODO: implement register from props
// eslint-disable-next-line no-unused-vars
export default function StatusSection({ errors, control, register }) {
  console.log("register", register);
  console.log("control", control);
  console.log("errors", errors);
  return (
    <CardSection title="Status">
      <FormSelect
        label="Status"
        name="status"
        register={register}
        errors={errors}
        options={[
          { label: "Draft", value: "draft" },
          { label: "Published", value: "published" },
          { label: "Archived", value: "archived" },
        ]}
      />

      {/* In Stock Section */}
      <ToggleField name="newArrival" control={control} label="New Arrival" />
    </CardSection>
  );
}
