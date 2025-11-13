// components/FormSelect.jsx

export function FormSelect({ 
  label, 
  name, 
  register, 
  errors, 
  options = [],
  onChange,      // thêm prop onChange cho controlled mode
  value,         // value controlled
  useRegister = true, // default true, false nếu muốn custom
}) {
  const getError = (errors, path) => {
    return path?.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), errors);
  };

  const error = getError(errors, name);

  return (
    <div>
      <label
        className={`block text-sm font-medium mb-2 ${
          error ? "text-red-500" : "text-foreground"
        }`}
      >
        {label}
      </label>
      {useRegister ? (
      <select
        {...register(name)}
        className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 ${
            error ? "border-red-500 ring-red-500" : "border-input ring-ring"
          }`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <select
          name={name}
          onChange={onChange}
          value={value}
          className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 ${
            error ? "border-red-500 ring-red-500" : "border-input ring-ring"
        }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      )}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
}
