import { useState } from "react"
import { toast } from "react-hot-toast"
import FormHeader from "./components/FormHeader"
import ProductDetailsSection from "./components/ProductDetailsSection"
import ImageUploadSection from "./components/ImageUploadSection"
import PricingSection from "./components/PricingSection"
import StatusSection from "./components/StatusSection"
import CategoriesSection from "./components/CategoriesSection"
import VariantsSection from "./components/VariantsSection"

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

  const handleToggleTaxable = () => {
    setFormData((prev) => ({ ...prev, taxable: !prev.taxable }))
  }

  const handleToggleInStock = () => {
    setFormData((prev) => ({ ...prev, inStock: !prev.inStock }))
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
      <FormHeader 
        onDiscard={handleDiscard}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
      />

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6  mx-auto">
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Product Details */}
            <div className="col-span-2 space-y-6">
              <ProductDetailsSection 
                formData={formData}
                onInputChange={handleInputChange}
              />

              <ImageUploadSection 
                images={images}
                dragActive={dragActive}
                onDrag={handleDrag}
                onDrop={handleDrop}
                onRemoveImage={removeImage}
              />

              <VariantsSection />
            </div>

            {/* Right Column - Pricing & Status */}
            <div className="space-y-6">
              <PricingSection 
                formData={formData}
                onInputChange={handleInputChange}
                onToggleTaxable={handleToggleTaxable}
              />

              <StatusSection 
                formData={formData}
                onInputChange={handleInputChange}
                onToggleInStock={handleToggleInStock}
              />

              <CategoriesSection 
                formData={formData}
                onInputChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
