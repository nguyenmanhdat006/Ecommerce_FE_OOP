export function FormInput({ label, register, name, placeholder, type = "text", errors }) {
  return (
    <div>
      <label className={`block text-sm font-medium mb-2 ${errors?.[name] ? "text-red-500" : "text-foreground"}`}>{label}</label>
      <input
        type={type}
        {...register(name)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 ${
          errors?.[name] ? "border-red-500 ring-red-500" : "border-input ring-ring"
        }`}
      />
      {errors?.[name] && <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>}
    </div>
  );
}