// components/FormTextarea.jsx
export function FormTextarea({ label, name, register, placeholder, rows = 4, errors }) {
  return (
    <div>
      <label className={`block text-sm font-medium mb-2 ${errors?.[name] ? "text-red-500" : "text-foreground"}`}>
        {label}
      </label>
      <textarea
        {...register(name)}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 ${
          errors?.[name] ? "border-red-500 ring-red-500" : "border-input ring-ring"
        }`}
      />
      {errors?.[name] && <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>}
    </div>
  );
}
