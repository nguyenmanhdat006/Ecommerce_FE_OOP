import { Upload, X } from "lucide-react"

export default function ImageUploadSection({ 
  images, 
  dragActive, 
  onDrag, 
  onDrop, 
  onRemoveImage 
}) {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Product Images</h2>
        <button className="text-sm text-muted-foreground hover:text-foreground">
          Add media from URL
        </button>
      </div>

      <div
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-border"
        }`}
      >
        <Upload size={32} className="mx-auto mb-2 text-muted-foreground" />
        <p className="font-medium mb-1">Drop your images here</p>
        <p className="text-sm text-muted-foreground mb-4">PNG or JPG (max. 5MB)</p>
        <button className="px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 inline-flex items-center gap-2">
          <Upload size={16} />
          Select images
        </button>
      </div>

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <span className="text-sm text-muted-foreground">{image.name}</span>
              </div>
              <button
                onClick={() => onRemoveImage(index)}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
