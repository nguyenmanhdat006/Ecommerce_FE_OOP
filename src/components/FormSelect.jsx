// components/FormSelect.jsx

// eslint-disable-next-line no-unused-vars
export function FormSelect({ label, name, register, errors, options = [] }) {
  return (
    <div>
      <label
        className={`block text-sm font-medium mb-2 ${
          errors?.[name] ? "text-red-500" : "text-foreground"
        }`}
      >
        {label}
      </label>
      <select
        {...register(name)}
        className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 ${
          errors?.[name] ? "border-red-500 ring-red-500" : "border-input ring-ring"
        }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {errors?.[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
}
