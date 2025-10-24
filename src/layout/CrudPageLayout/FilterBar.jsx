import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FilterX } from "lucide-react"
import { SearchBox } from "@/components/SearchBox"
import { SelectFilter } from "@/components/SearchFilter"

export function FilterBar({ filters, onSearch, onClear }) {
  return (
    <Card className="p-4 shadow-none border-none">
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">

        <SearchBox onChange={onSearch} placeholder="Search products..." />

        <div className="flex flex-wrap gap-3 items-center">
          {filters?.map((f) => (
            <SelectFilter
              key={f.key}
              placeholder={f.placeholder}
              options={f.options}
              onChange={(value) => f.onChange?.(f.key, value)}
            />
          ))}

          {onClear && (
            <Button variant="ghost" size="sm" onClick={onClear}>
              <FilterX className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
