import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function ProductHeader({ onAdd }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-foreground">Products</h1>
      <Button onClick={onAdd}>
        <Plus className="w-4 h-4 mr-2" />
        Add Product
      </Button>
    </div>
  )
}
