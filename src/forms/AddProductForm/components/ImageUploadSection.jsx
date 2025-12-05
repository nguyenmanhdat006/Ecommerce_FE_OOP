import { Upload, Loader2 } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { ImageCard } from "@/components/ImageCard";
import { CardSection } from "@/forms/FormLayout/CardSection";
import { AddButton } from "@/components/AddButton";
import { uploadSingleFile } from "@/store/uploadSlice";
import { toast } from "react-hot-toast";

// Hàm kiểm tra xem string có phải là URL hợp lệ không
const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
};

// Hàm kiểm tra xem file có phải là ảnh không
const isImageFile = (file) => {
  return file.type.startsWith("image/");
};

export function ImageUploadSection({
  fields,
  append,
  remove,
  update,
  register,
  errors,
  dispatch,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const handleSetPrimary = (index) => {
    fields.forEach((field, i) =>
      update(i, { ...field, isPrimary: i === index, type: "IMAGE" })
    );
  };

  // Xử lý upload file và lấy link
  const handleUploadFile = useCallback(async (file, index = null) => {
    if (!isImageFile(file)) {
      toast.error("File phải là ảnh!");
      return;
    }

    try {
      setUploading(true);
      const result = await dispatch(uploadSingleFile(file)).unwrap();
      
      if (result && result.files && result.files[0]) {
        const fileUrl = result.files[0].fileUrl;
        const imageNumber = index !== null ? index + 1 : fields.length + 1;
        const imageName = `ảnh ${imageNumber}`;

        if (index !== null) {
          // Cập nhật field hiện có
          update(index, {
            ...fields[index],
            url: fileUrl,
            name: imageName,
            type: "IMAGE",
          });
        } else {
          // Thêm field mới
          append({
            url: fileUrl,
            name: imageName,
            isPrimary: fields.length === 0,
            type: "IMAGE",
          });
        }
        toast.success(`Đã upload ${imageName} thành công!`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload ảnh thất bại!");
    } finally {
      setUploading(false);
    }
  }, [dispatch, fields.length, append, update]);

  // Xử lý URL (paste hoặc nhập)
  const handleAddUrl = useCallback((urlString) => {
    if (!isValidUrl(urlString)) {
      toast.error("URL không hợp lệ!");
      return;
    }

    const imageNumber = fields.length + 1;
    const imageName = `ảnh ${imageNumber}`;

    append({
      url: urlString.trim(),
      name: imageName,
      isPrimary: fields.length === 0,
      type: "IMAGE",
    });
    toast.success(`Đã thêm ${imageName} từ URL!`);
  }, [fields.length, append]);

  // Xử lý drag & drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(isImageFile);

    if (imageFiles.length === 0) {
      toast.error("Vui lòng kéo thả file ảnh!");
      return;
    }

    // Upload từng file
    for (let i = 0; i < imageFiles.length; i++) {
      await handleUploadFile(imageFiles[i]);
    }
  };

  // Xử lý paste từ clipboard
  useEffect(() => {
    const handlePaste = async (e) => {
      // Kiểm tra nếu đang focus vào input/textarea thì bỏ qua
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")
      ) {
        // Nếu đang focus vào input URL trong ImageCard, cho phép paste URL
        if (activeElement.type === "url" && activeElement.value === "") {
          const text = e.clipboardData?.getData("text");
          if (text && isValidUrl(text)) {
            // Không preventDefault để cho phép paste vào input
            return;
          }
        }
        // Các trường hợp khác, bỏ qua
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      // Kiểm tra paste file ảnh
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            await handleUploadFile(file);
            return;
          }
        }
      }

      // Kiểm tra paste text (URL) - chỉ khi không có input nào đang focus
      const text = e.clipboardData?.getData("text");
      if (text && isValidUrl(text)) {
        e.preventDefault();
        handleAddUrl(text);
      }
    };

    // Thêm event listener vào drop zone để dễ dàng paste
    const dropZone = dropZoneRef.current;
    if (dropZone) {
      dropZone.addEventListener("paste", handlePaste);
      // Thêm tabIndex để có thể focus
      dropZone.setAttribute("tabIndex", "0");
    }

    // Cũng lắng nghe paste ở window level
    window.addEventListener("paste", handlePaste);
    
    return () => {
      if (dropZone) {
        dropZone.removeEventListener("paste", handlePaste);
      }
      window.removeEventListener("paste", handlePaste);
    };
  }, [fields.length, handleUploadFile, handleAddUrl]);

  // Xử lý chọn file từ input
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const imageFiles = files.filter(isImageFile);
    if (imageFiles.length === 0) {
      toast.error("Vui lòng chọn file ảnh!");
      return;
    }

    // Upload từng file
    for (let i = 0; i < imageFiles.length; i++) {
      await handleUploadFile(imageFiles[i]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
        ref={dropZoneRef}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        } ${uploading ? "opacity-50 cursor-wait" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {uploading ? (
          <>
            <Loader2 size={32} className="mx-auto mb-2 text-primary animate-spin" />
            <p className="font-medium mb-1">Đang upload ảnh...</p>
          </>
        ) : (
          <>
            <Upload size={32} className="mx-auto mb-2 text-muted-foreground" />
            <p className="font-medium mb-1">Kéo thả ảnh vào đây hoặc click để chọn</p>
            <p className="text-sm text-muted-foreground mb-2">
              Hoặc paste URL ảnh từ clipboard
            </p>
            <p className="text-xs text-muted-foreground">
              Hỗ trợ: JPG, PNG, GIF, WebP
            </p>
          </>
        )}
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
