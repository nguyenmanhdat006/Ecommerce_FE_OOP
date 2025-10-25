import { useState } from "react"
import { ChevronLeft, Upload, X } from "lucide-react"
import { toast } from "react-hot-toast"

export default function AddProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    description: "",
    basePrice: "",
    discountedPrice: "",
    taxable: true,
    inStock: true,
    status: "draft",
    category: "",
    subCategory: "",
  })

  const [images, setImages] = useState([])
  const [dragActive, setDragActive] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    const checked = e.target.checked
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = e.dataTransfer.files
    if (files) {
      setImages((prev) => [...prev, ...Array.from(files)])
    }
  }

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handlePublish = () => {
    console.log("Publishing product:", formData)
    toast.success("Product published!")
  }

  const handleSaveDraft = () => {
    console.log("Saving draft:", formData)
    toast.success("Draft saved!")
  }

  const handleDiscard = () => {
    setFormData({
      name: "",
      sku: "",
      barcode: "",
      description: "",
      basePrice: "",
      discountedPrice: "",
      taxable: true,
      inStock: true,
      status: "draft",
      category: "",
      subCategory: "",
    })
    setImages([])
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-muted rounded-md">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold">Add Products</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDiscard}
              className="px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 font-medium"
            >
              Discard
            </button>
            <button
              onClick={handleSaveDraft}
              className="px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 font-medium"
            >
              Save Draft
            </button>
            <button
              onClick={handlePublish}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium"
            >
              Publish
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6  mx-auto">
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Product Details */}
            <div className="col-span-2 space-y-6">
              {/* Product Details Section */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold mb-4">Product Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Product name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">SKU</label>
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="SKU"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Barcode</label>
                      <input
                        type="text"
                        name="barcode"
                        value={formData.barcode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Barcode"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Set a description to the product for better visibility."
                    />
                  </div>
                </div>
              </div>

              {/* Product Images Section */}
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Product Images</h2>
                  <button className="text-sm text-muted-foreground hover:text-foreground">Add media from URL</button>
                </div>

                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <Upload size={32} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="font-medium mb-1">Drop your images here</p>
                  <p className="text-sm text-muted-foreground mb-4">PNG or JPG (max. 5MB)</p>
                  <button className="px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 inline-flex items-center gap-2">
                    <Upload size={16} />
                    Select images
                  </button>
                </div>

                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-sm text-muted-foreground">{image.name}</span>
                        </div>
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Variants Section */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold mb-4">Variants</h2>
                <p className="text-sm text-muted-foreground">Add product variants like size, color, etc.</p>
              </div>
            </div>

            {/* Right Column - Pricing & Status */}
            <div className="space-y-6">
              {/* Pricing Section */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold mb-4">Pricing</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Base Price</label>
                    <input
                      type="number"
                      name="basePrice"
                      value={formData.basePrice}
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Charge tax on this product</label>
                    <button
                      onClick={() => setFormData((prev) => ({ ...prev, taxable: !prev.taxable }))}
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

              {/* Status Section */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold mb-4">Status</h2>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
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
                    onClick={() => setFormData((prev) => ({ ...prev, inStock: !prev.inStock }))}
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

              {/* Categories Section */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold mb-4">Categories</h2>
                <div className="space-y-3">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select a sub category</option>
                    <option value="subcategory1">Sub Category 1</option>
                    <option value="subcategory2">Sub Category 2</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
