import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, FilterX } from "lucide-react"
import { useState } from "react"

export function FilterBar({ filters, onSearch, onClear }) {
  const [search, setSearch] = useState("")

  const handleSearch = (val) => {
    setSearch(val)
    onSearch && onSearch(val)
  }

  return (
    <Card className="p-4 shadow-none border-none">
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">

        {/* Search box */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {filters?.map((f) => (
            <Select key={f.key} onValueChange={(value) => f.onChange?.(f.key, value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder={f.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {f.options.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          {/* Clear filters */}
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
