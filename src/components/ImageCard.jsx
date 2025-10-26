import { Star, X } from "lucide-react";

export function ImageCard({
  field,
  index,
  removeResource,
  handleSetPrimary,
  register,
  error,
}) {
  return (
    <div className="relative group">
      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
        {field.url ? (
          <img
            src={field.url}
            alt={field.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-sm text-muted-foreground">No image</span>
          </div>
        )}

        {field.isPrimary && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full p-1">
            <Star size={12} fill="currentColor" />
          </div>
        )}

        <button
          type="button"
          onClick={() => handleSetPrimary(index)}
          className="absolute bottom-38 left-1 bg-card text-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {field.isPrimary ? "Primary" : "Set Primary"}
        </button>

        <button
          type="button"
          onClick={() => removeResource(index)}
          className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-2 space-y-2">
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            type="url"
            {...register(`productResources.${index}.url`)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {error?.url && (
            <p className="text-red-500 text-xs mt-1">{error.url.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image Name</label>
          <input
            type="text"
            {...register(`productResources.${index}.name`)}
            placeholder="Product image"
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <input
        type="hidden"
        {...register(`productResources.${index}.isPrimary`)}
      />
    </div>
  );
}
