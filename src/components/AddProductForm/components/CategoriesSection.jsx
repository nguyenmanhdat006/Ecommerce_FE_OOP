export default function CategoriesSection({ formData, onInputChange }) {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <div className="space-y-3">
        <select
          name="category"
          value={formData.category}
          onChange={onInputChange}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select a category</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
        </select>
        <select
          name="subCategory"
          value={formData.subCategory}
          onChange={onInputChange}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select a sub category</option>
          <option value="subcategory1">Sub Category 1</option>
          <option value="subcategory2">Sub Category 2</option>
        </select>
      </div>
    </div>
  )
}
