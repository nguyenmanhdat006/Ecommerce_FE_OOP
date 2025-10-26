import React from "react";
import { Controller } from "react-hook-form";

export default function ToggleSwitch({ name, control, label, register }) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 flex items-center justify-between">
      <span className="text-sm font-medium">{label}</span>

      <Controller
        {...register(name)}
        control={control}
        render={({ field }) => (
          <button
            type="button"
            onClick={() => field.onChange(!field.value)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              field.value ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                field.value ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        )}
      />
    </div>
  );
}
