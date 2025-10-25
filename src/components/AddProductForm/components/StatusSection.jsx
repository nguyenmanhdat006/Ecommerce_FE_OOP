export default function StatusSection({ formData, onInputChange, onToggleInStock }) {
  return (
    <div className="space-y-6">
      {/* Status Section */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold mb-4">Status</h2>
        <select
          name="status"
          value={formData.status}
          onChange={onInputChange}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="draft">🟡 Draft</option>
          <option value="published">🟢 Published</option>
          <option value="archived">⚫ Archived</option>
        </select>
        <p className="text-xs text-muted-foreground mt-2">Set the product status.</p>
      </div>

      {/* In Stock Section */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">In stock</label>
          <button
            onClick={onToggleInStock}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              formData.inStock ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.inStock ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
