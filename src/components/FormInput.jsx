export function FormInput({ label, register, name, placeholder, type = "text", errors, options = {} }) {
  // Hàm lấy error từ nested path
  const getError = (errors, path) => {
    return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), errors);
  };

  const error = getError(errors, name);

  return (
    <div>
      <label className={`block text-sm font-medium mb-2 ${error ? "text-red-500" : "text-foreground"}`}>{label}</label>
      <input
        type={type}
        {...register(name, options)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 ${
          error ? "border-red-500 ring-red-500" : "border-input ring-ring"
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}
