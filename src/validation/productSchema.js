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
  newArrival: yup.boolean().default(false),
  rating: yup.number().min(0).max(5).nullable(),
  thumbnail: yup.string().url().nullable(),
  slug: yup.string().nullable(),

  categoryId: yup.string().nullable(),
  categoryTypeId: yup.string().nullable(),
  categoryName: yup.string().nullable(),
  categoryTypeName: yup.string().nullable(),

  variants: yup.array().of(
    yup.object().shape({
      size: yup.string().nullable(),
      color: yup.string().nullable(),
      stockQuantity: yup.number().typeError("Số lượng phải là số").min(0).nullable(),
    })
  ),

  productResources: yup
    .array()
    .of(
      yup.object().shape({
        url: yup.string().url("URL không hợp lệ").required("Ảnh bắt buộc"),
        name: yup.string().nullable(),
        isPrimary: yup.boolean().required(),
        type: yup.string().default("IMAGE"),
      })
    )
    .min(1, "Cần ít nhất 1 hình sản phẩm")
    .test(
      "one-primary",
      "Cần có 1 ảnh chính (isPrimary = true)",
      (resources) => resources?.some((r) => r.isPrimary)
    ),
});
