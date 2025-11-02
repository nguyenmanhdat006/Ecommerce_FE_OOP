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
import { createCategoryType } from "@/store/categoryTypeSlice";
import { fetchCategories } from "@/store/categorySlice";

export default function AddCategoryTypeForm({ onSuccess }) {
  const form = useForm({
    resolver: yupResolver(categoryTypeSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      categoryId: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const dispatch = useDispatch();
  const categories = useSelector(
    (state) => state.categoryState?.categories || []
  );
  const loaded = useSelector((state) => state.categoryState?.loaded);

  useEffect(() => {
    if (!loaded) {
      dispatch(fetchCategories());
    }
  }, [dispatch, loaded]);

  const onSubmit = async (data) => {
    try {
      await dispatch(createCategoryType(data)).unwrap();
      toast.success("Category type created successfully!");
      reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err?.message || "Create category type failed");
    }
  };

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
            reset();
            if (onSuccess) onSuccess();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Category Type"}
        </Button>
      </div>
    </form>
  );
}

