import * as yup from "yup";

export const categorySchema = yup.object().shape({
  name: yup.string().required("Tên danh mục là bắt buộc"),
  code: yup.string().required("Mã danh mục là bắt buộc"),
  description: yup.string().nullable(),
  categoryTypes: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required(),
        name: yup.string().required(),
        code: yup.string().required(),
      })
    )
    .nullable()
    .default([]),
});

