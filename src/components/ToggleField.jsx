// components/ToggleField.jsx
import { ToggleButton } from "@/components/ToggleButton";
import { Controller } from "react-hook-form";

export function ToggleField({ name, control, label }) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <ToggleButton
            checked={field.value}
            onClick={() => field.onChange(!field.value)}
          />
        )}
      />
    </div>
  );
}
