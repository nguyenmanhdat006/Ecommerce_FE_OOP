import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/FormInput";
import { FormTextarea } from "@/components/FormTextArea";
import { FormMultiSelect } from "@/components/FormMultiSelect";
import { categorySchema } from "@/validation/categorySchema";
import { updateCategory, getCategory } from "@/store/categorySlice";
import { fetchCategoryTypes } from "@/store/categoryTypeSlice";
import Spinner from "@/components/Spinner/Spinner";

export default function EditCategoryForm({ id, onSuccess }) {
  const dispatch = useDispatch();
  const selectedCategory = useSelector(
    (state) => state.categorySlice?.selectedCategory
  );
  const categoryTypes = useSelector(
    (state) => state.categoryTypeSlice?.categoryTypes || []
  );
  const loading = useSelector((state) => state.categorySlice?.loading);
  const loadedCategoryTypes = useSelector(
    (state) => state.categoryTypeSlice?.loaded
  );

  const form = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      categoryTypes: [],
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  // Load category types and category data when component mounts or id changes
  useEffect(() => {
    if (!loadedCategoryTypes) {
      dispatch(fetchCategoryTypes());
    }
    if (id) {
      dispatch(getCategory(id));
    }
  }, [id, dispatch, loadedCategoryTypes]);

  // Update form when selectedCategory changes
  useEffect(() => {
    if (selectedCategory && selectedCategory.id === id) {
      reset({
        name: selectedCategory.name || "",
        code: selectedCategory.code || "",
        description: selectedCategory.description || "",
        categoryTypes: selectedCategory.categoryTypes || [],
      });
    }
  }, [selectedCategory, id, reset]);

  const onSubmit = async (data) => {
    try {
      await dispatch(updateCategory({ id, data })).unwrap();
      toast.success("Category updated successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err?.message || "Update category failed");
    }
  };

  if (loading || !selectedCategory || selectedCategory.id !== id) {
    return <Spinner />;
  }

  const categoryTypeOptions = categoryTypes.map((ct) => ({
    value: ct.id,
    label: ct.name,
    code: ct.code,
    data: {
      id: ct.id,
      name: ct.name,
      code: ct.code,
    },
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormInput
        label="Code"
        name="code"
        register={register}
        placeholder="Enter category code"
        errors={errors}
      />

      <FormInput
        label="Name"
        name="name"
        register={register}
        placeholder="Enter category name"
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

      <FormMultiSelect
        label="Category Types"
        name="categoryTypes"
        register={register}
        errors={errors}
        options={categoryTypeOptions}
        watch={watch}
        setValue={setValue}
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
          {isSubmitting ? "Updating..." : "Update Category"}
        </Button>
      </div>
    </form>
  );
}

