import { useState } from "react";
import { toast } from "react-hot-toast";
import FormHeader from "./components/FormHeader";
import ProductDetailsSection from "./components/ProductDetailsSection";
import ImageUploadSection from "./components/ImageUploadSection";
import PricingSection from "./components/PricingSection";
import StatusSection from "./components/StatusSection";
import CategoriesSection from "./components/CategoriesSection";
import VariantsSection from "./components/VariantsSection";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productSchema } from "@/validation/productSchema";
import { createProduct } from "@/store/productSlice";
import { useDispatch } from "react-redux";

export default function AddProductForm() {

  const dispatch = useDispatch();

  const {
    register, //Đăng kí input field, ví dụ register("name") để đăng kí input name
    handleSubmit, //Xử lý submit form 
    control, //Quản lý state của form, dùng với Controller 
    reset, //Reset form
    watch, //Theo dõi sự thay đổi của form, ví dụ watch("name") để lấy giá trị của name
    formState: { errors }, //Lấy lỗi từ form
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      brand: "",
      newArrival: false,
      categoryId: "",
      categoryTypeId: "",
      variants: [{ size: "M", color: "Red", stockQuantity: 10 }],
      productResources: [{ url: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-68.jpg", name: "Ảnh sản phẩm", isPrimary: true }],
    },
  });

  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files) {
      setImages((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved!");
  };

  const handleDiscard = () => {
    reset();
    setImages([]);
  };

  const onSubmit = (data) => {
    console.log("Data:", errors);
    dispatch(createProduct(data));
    reset();
    toast.success("Product published!");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <FormHeader
        onDiscard={handleDiscard}
        onSaveDraft={handleSaveDraft}
        onPublish={handleSubmit(onSubmit)}
      />

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6  mx-auto">
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Product Details */}
            <div className="col-span-2 space-y-6">
              <ProductDetailsSection
                register={register}
                errors={errors}
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
                register={register}
                errors={errors}
              />

              <StatusSection
                register={register}
                errors={errors}
                control={control}
              />

              <CategoriesSection
                register={register}
                errors={errors}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
