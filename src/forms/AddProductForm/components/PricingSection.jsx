export default function PricingSection({ formData, onInputChange, onToggleTaxable }) {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold mb-4">Pricing</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Base Price</label>
          <input
            type="number"
            name="basePrice"
            value={formData.basePrice}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Discounted Price</label>
          <input
            type="number"
            name="discountedPrice"
            value={formData.discountedPrice}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="0.00"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Charge tax on this product</label>
          <button
            onClick={onToggleTaxable}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              formData.taxable ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.taxable ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
