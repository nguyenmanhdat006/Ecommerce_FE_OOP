import { FormInput } from "@/components/FormInput";
import ToggleSwitch from "@/components/ToggleSwitch";

export default function StatusSection({ register, errors, control }) {
  return (
    <div className="space-y-6">
      {/* Status Section */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold mb-4">Status</h2>
        <select
          // {...register("status")}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="draft">🟡 Draft</option>
          <option value="published">🟢 Published</option>
          <option value="archived">⚫ Archived</option>
        </select>
        {errors.status && (
          <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          Set the product status.
        </p>
      </div>

      {/* In Stock Section */}
      <ToggleSwitch name="newArrival" control={control} label="New Arrival" register={register} />
    </div>
  );
}
