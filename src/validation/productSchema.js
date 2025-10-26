// src/validation/productSchema.js
import * as yup from "yup";

export const productSchema = yup.object().shape({
  name: yup.string().required("Tên sản phẩm là bắt buộc"),
  description: yup.string().max(500, "Mô tả tối đa 500 ký tự"),
  price: yup
    .number()
    .typeError("Giá phải là số")
    .positive("Giá phải lớn hơn 0")
    .required("Giá sản phẩm là bắt buộc"),
  brand: yup.string().required("Thương hiệu là bắt buộc"),
  newArrival: yup.boolean(),

  // Category
  categoryId: yup.string().required("Chọn danh mục là bắt buộc"),
  categoryTypeId: yup.string().nullable(), // optional

  // Variants
  variants: yup.array().of(
    yup.object().shape({
      size: yup.string(),
      color: yup.string(),
      stockQuantity: yup
        .number()
        .typeError("Số lượng phải là số")
        .min(0, "Số lượng không thể âm")
        .required("Số lượng bắt buộc"),
    })
  ),

  // Product Resources (images)
  productResources: yup
    .array()
    .of(
      yup.object().shape({
        url: yup.string().url("URL không hợp lệ").required("Ảnh bắt buộc"),
        name: yup.string(),
        isPrimary: yup.boolean(),
      })
    )
    .min(1, "Cần ít nhất 1 hình sản phẩm")
    .test(
      "one-primary",
      "Cần có 1 ảnh chính (isPrimary = true)",
      (resources) => resources?.some((r) => r.isPrimary)
    ),
});
