import { ChevronLeft } from "lucide-react"

export default function FormHeader({ onDiscard, onSaveDraft, onPublish }) {
  return (
    <div className="border-b border-border bg-background sticky top-0 z-10">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-muted rounded-md">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Add Products</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onDiscard}
            className="px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 font-medium"
          >
            Discard
          </button>
          <button
            onClick={onSaveDraft}
            className="px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 font-medium"
          >
            Save Draft
          </button>
          <button
            onClick={onPublish}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  )
}
