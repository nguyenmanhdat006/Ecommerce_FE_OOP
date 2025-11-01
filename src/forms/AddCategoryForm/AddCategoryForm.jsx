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
import { createCategory } from "@/store/categorySlice";
import { fetchCategoryTypes } from "@/store/categoryTypeSlice";

export default function AddCategoryForm({ onSuccess }) {
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

  const dispatch = useDispatch();
  const categoryTypes = useSelector(
    (state) => state.categoryTypeSlice?.categoryTypes || []
  );
  const loadedCategoryTypes = useSelector(
    (state) => state.categoryTypeSlice?.loaded
  );

  useEffect(() => {
    if (!loadedCategoryTypes) {
      dispatch(fetchCategoryTypes());
    }
  }, [dispatch, loadedCategoryTypes]);

  const onSubmit = async (data) => {
    try {
      await dispatch(createCategory(data)).unwrap();
      toast.success("Category created successfully!");
      reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err?.message || "Create category failed");
    }
  };

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
            reset();
            if (onSuccess) onSuccess();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Category"}
        </Button>
      </div>
    </form>
  );
}

