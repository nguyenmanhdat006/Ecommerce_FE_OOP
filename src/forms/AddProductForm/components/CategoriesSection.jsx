export default function CategoriesSection({ register, errors }) {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <div className="space-y-3">
        {/* Category */}
        <select
          {...register("category")}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select a category</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
        )}

        {/* Sub Category */}
        <select
          {...register("subCategory")}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select a sub category</option>
          <option value="subcategory1">Sub Category 1</option>
          <option value="subcategory2">Sub Category 2</option>
        </select>
        {errors.subCategory && (
          <p className="text-red-500 text-sm mt-1">{errors.subCategory.message}</p>
        )}
      </div>
    </div>
  );
}
