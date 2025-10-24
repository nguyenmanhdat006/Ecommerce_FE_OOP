import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function TableHeader({ title = 'Table List', actionText = 'Add New', onAdd }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      </div>
      <Button onClick={onAdd}>
        <Plus className="w-4 h-4 mr-2" />
        {actionText}
      </Button>
    </div>
  )
}
