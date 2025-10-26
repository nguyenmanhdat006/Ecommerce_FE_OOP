import { toast } from "react-hot-toast";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";

import { FormLayout } from "@/forms/FormLayout/FormLayout";
import ProductDetailsSection from "./components/ProductDetailsSection";
import { ImageUploadSection } from "./components/ImageUploadSection";
import PricingSection from "./components/PricingSection";
import StatusSection from "./components/StatusSection";
import CategoriesSection from "./components/CategoriesSection";
import { VariantsSection } from "./components/VariantsSection";

import { productSchema } from "@/validation/productSchema";
import { createProduct } from "@/store/productSlice";
import { fetchCategories } from "@/store/categorySlice";
import { useEffect } from "react";
import { uploadSingleFile } from "@/store/uploadSlice";

export default function AddProductForm() {
  const form = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      brand: "",
      newArrival: false,
      rating: null,
      thumbnail: "",
      slug: "",
      categoryId: "",
      categoryTypeId: "",
      categoryName: "",
      categoryTypeName: "",
      variants: [],
      productResources: [],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue, // cái này dùng để set giá trị cho form
    formState: { errors },
  } = form;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const categories = useSelector((state) => state.categorySlice?.categories);

  const selectedCategoryId = watch("categoryId");
  const selectedCategoryTypeId = watch("categoryTypeId");

  const selectedCategory = categories?.find(
    (cat) => cat.id === selectedCategoryId
  );
  const categoryTypes = selectedCategory?.categoryTypes || [];
  const selectedCategoryType = categoryTypes?.find(
    (type) => type.id === selectedCategoryTypeId
  );

  // Trong select chỉ cập nhật id, còn name thì thủ công
  useEffect(() => {
    setValue("categoryName", selectedCategory?.name || "");
  }, [selectedCategory, setValue]);

  useEffect(() => {
    setValue("categoryTypeName", selectedCategoryType?.name || "");
  }, [selectedCategoryType, setValue]);

  // Field arrays
  const resourceArray = useFieldArray({ control, name: "productResources" });
  const variantArray = useFieldArray({ control, name: "variants" });

  // Actions
  const handleSaveDraft = () => toast.success("Draft saved!");
  const handleDiscard = () => reset();
  const onSubmit = (data) => {
    dispatch(createProduct(data));
    reset();
    toast.success("Product published!");
  };

  const handleUploadThumbnail = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await dispatch(uploadSingleFile(file)).unwrap();
      if (result.payload) setValue("thumbnail", result.payload.fileUrl);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <FormLayout
      title="Add Product"
      onDiscard={handleDiscard}
      onSaveDraft={handleSaveDraft}
      onPublish={handleSubmit(onSubmit)}
    >
      {/* Left Column */}
      <div className="col-span-2 space-y-6">
        <ProductDetailsSection
          handleUploadThumbnail={handleUploadThumbnail}
          register={register}
          errors={errors}
        />
        <ImageUploadSection
          fields={resourceArray.fields}
          append={resourceArray.append}
          remove={resourceArray.remove}
          update={resourceArray.update}
          register={register}
          errors={errors}
        />
        <VariantsSection
          fields={variantArray.fields}
          append={variantArray.append}
          remove={variantArray.remove}
          register={register}
          errors={errors}
        />
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <PricingSection register={register} errors={errors} control={control} />
        <StatusSection register={register} errors={errors} control={control} />
        <CategoriesSection
          register={register}
          errors={errors}
          categories={categories}
          categoryTypes={categoryTypes}
          selectedCategory={selectedCategory}
        />
      </div>
    </FormLayout>
  );
}
