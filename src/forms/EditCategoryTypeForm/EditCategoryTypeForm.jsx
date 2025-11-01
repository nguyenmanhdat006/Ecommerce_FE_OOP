import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/FormInput";
import { FormTextarea } from "@/components/FormTextArea";
import { FormSelect } from "@/components/FormSelect";
import { categoryTypeSchema } from "@/validation/categoryTypeSchema";
import { updateCategoryType, getCategoryType } from "@/store/categoryTypeSlice";
import { fetchCategories } from "@/store/categorySlice";

export default function EditCategoryTypeForm({ id, onSuccess }) {
  const dispatch = useDispatch();
  const selectedCategoryType = useSelector(
    (state) => state.categoryTypeSlice?.selectedCategoryType
  );
  const categories = useSelector(
    (state) => state.categoryState?.categories || []
  );
  const loading = useSelector((state) => state.categoryTypeSlice?.loading);
  const form = useForm({  
    resolver: yupResolver(categoryTypeSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      categoryId: "",
    },
  });

  const loadedCategories = useSelector((state) => state.categoryState?.loaded);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  // Load categories and category type data when component mounts or id changes
  useEffect(() => {
    if (!loadedCategories) {
      dispatch(fetchCategories());
    }
    if (id) {
      dispatch(getCategoryType(id));
    }
  }, [id, dispatch, loadedCategories]);

  // Update form when selectedCategoryType changes
  useEffect(() => {
    if (selectedCategoryType && selectedCategoryType.id === id) {
      reset({
        name: selectedCategoryType.name || "",
        code: selectedCategoryType.code || "",
        description: selectedCategoryType.description || "",
        categoryId: selectedCategoryType.categoryId || "",
      });
    }
  }, [selectedCategoryType, id, reset]);

  const onSubmit = async (data) => {
    try {
      await dispatch(updateCategoryType({ id, data })).unwrap();
      toast.success("Category type updated successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err?.message || "Update category type failed");
    }
  };

  if (loading || !selectedCategoryType || selectedCategoryType.id !== id) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormSelect
        label="Category"
        name="categoryId"
        register={register}
        errors={errors}
        options={[
          { value: "", label: "Select a category" },
          ...categories.map((cat) => ({
            value: cat.id,
            label: cat.name,
          })),
        ]}
      />

      <FormInput
        label="Code"
        name="code"
        register={register}
        placeholder="Enter category type code"
        errors={errors}
      />

      <FormInput
        label="Name"
        name="name"
        register={register}
        placeholder="Enter category type name"
        errors={errors}
      />

      <FormTextarea
        label="Description"
        name="description"
        register={register}
        placeholder="Enter description (optional)"
        rows={4}
        errors={errors}
      />

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (onSuccess) onSuccess();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Category Type"}
        </Button>
      </div>
    </form>
  );
}

