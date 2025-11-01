import * as yup from "yup";

export const categoryTypeSchema = yup.object().shape({
  name: yup.string().required("Tên loại danh mục là bắt buộc"),
  code: yup.string().required("Mã loại danh mục là bắt buộc"),
  description: yup.string().nullable(),
  categoryId: yup.string().required("Danh mục là bắt buộc"),
});

