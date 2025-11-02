// components/FormMultiSelect.jsx

export function FormMultiSelect({ label, name, register, errors, options = [], watch, setValue }) {
  const selectedValues = watch(name) || [];

  const handleToggle = (value) => {
    const currentIds = selectedValues.map((item) => {
      if (typeof item === "string") return item;
      return item?.id || item;
    });

    if (currentIds.includes(value)) {
      // Remove from selection
      const newValues = selectedValues.filter((item) => {
        const itemId = typeof item === "string" ? item : item?.id || item;
        return itemId !== value;
      });
      setValue(name, newValues, { shouldValidate: true });
    } else {
      // Add to selection
      const option = options.find((opt) => opt.value === value);
      if (option && option.data) {
        setValue(name, [...selectedValues, option.data], { shouldValidate: true });
      } else {
        // Fallback if data structure is different
        const newItem = {
          id: value,
          name: option?.label || "",
          code: option?.code || "",
        };
        setValue(name, [...selectedValues, newItem], { shouldValidate: true });
      }
    }
  };

  const isChecked = (value) => {
    return selectedValues.some((item) => {
      const itemId = typeof item === "string" ? item : item?.id || item;
      return itemId === value;
    });
  };

  return (
    <div>
      <label
        className={`block text-sm font-medium mb-2 ${
          errors?.[name] ? "text-red-500" : "text-foreground"
        }`}
      >
        {label}
      </label>
      <div className="border rounded-md bg-background p-3 min-h-[120px] max-h-[200px] overflow-y-auto">
        {options.length === 0 ? (
          <p className="text-sm text-muted-foreground">No options available</p>
        ) : (
          <div className="space-y-2">
            {options.map((opt) => {
              const value = opt.value;
              return (
                <label
                  key={value}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-muted p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={isChecked(value)}
                    onChange={() => handleToggle(value)}
                    className="w-4 h-4 rounded border-input"
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
      <input type="hidden" {...register(name)} />
      {errors?.[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
      {selectedValues.length > 0 && (
        <p className="text-xs text-muted-foreground mt-2">
          {selectedValues.length} item(s) selected
        </p>
      )}
    </div>
  );
}

