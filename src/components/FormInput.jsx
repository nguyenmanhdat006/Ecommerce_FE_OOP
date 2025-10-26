export function FormInput({
  label,
  register,
  name,
  placeholder,
  type = "text",
  errors,
  options = {},
  onChange,      // thêm prop onChange cho file/custom input
  value,         // value controlled
  useRegister = true, // default true, false nếu muốn custom
}) {
  const getError = (errors, path) => {
    return path?.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), errors);
  };

  const error = getError(errors, name);

  return (
    <div>
      <label className={`block text-sm font-medium mb-2 ${error ? "text-red-500" : "text-foreground"}`}>
        {label}
      </label>
      
      {useRegister ? (
        <input
          type={type}
          {...register(name, options)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 ${
            error ? "border-red-500 ring-red-500" : "border-input ring-ring"
          }`}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          onChange={onChange}   // controlled
          value={value}
          className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 ${
            error ? "border-red-500 ring-red-500" : "border-input ring-ring"
          }`}
        />
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}
