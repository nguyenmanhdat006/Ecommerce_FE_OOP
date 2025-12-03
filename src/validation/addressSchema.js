import * as yup from "yup";

export const addressSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  street: yup
    .string()
    .required("Street address is required")
    .min(5, "Street address must be at least 5 characters")
    .max(200, "Street address must be less than 200 characters"),
  city: yup
    .string()
    .required("City is required")
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be less than 100 characters"),
  state: yup
    .string()
    .required("State is required")
    .min(2, "State must be at least 2 characters")
    .max(100, "State must be less than 100 characters"),
  zipCode: yup
    .string()
    .required("Zip code is required")
    .matches(/^[0-9]{4,10}(-[0-9]{4})?$/, "Invalid zip code format"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, "Invalid phone number format"),
});

