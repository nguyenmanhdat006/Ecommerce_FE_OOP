import { Upload } from "lucide-react";
import { useState } from "react";
import { ImageCard } from "@/components/ImageCard";
import { CardSection } from "@/forms/FormLayout/CardSection";
import { AddButton } from "@/components/AddButton";

export function ImageUploadSection({
  fields,
  append,
  remove,
  update,
  register,
  errors,
}) {
  const [dragActive, setDragActive] = useState(false);

  const handleSetPrimary = (index) => {
    fields.forEach((field, i) =>
      update(i, { ...field, isPrimary: i === index, type: "IMAGE" })
    );
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return (
    <CardSection
      title="Product Images"
      actions={
        <AddButton
          onClick={() =>
            append({ url: "", name: "", isPrimary: fields.length === 0 })
          }
        >
          Add image URL
        </AddButton>
      }
    >
      {errors?.productResources && (
        <p className="text-red-500 text-sm mb-4">
          {errors.productResources.message}
        </p>
      )}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-border"
        }`}
      >
        <Upload size={32} className="mx-auto mb-2 text-muted-foreground" />
        <p className="font-medium mb-1">Drop your images here</p>
        <p className="text-sm text-muted-foreground mb-4">Or paste URL</p>
      </div>

      {fields.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {fields.map((field, index) => (
            <ImageCard
              key={field.id}
              field={field}
              index={index}
              removeResource={remove}
              handleSetPrimary={handleSetPrimary}
              register={register}
              error={errors?.productResources?.[index]}
            />
          ))}
        </div>
      )}
    </CardSection>
  );
}
