import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchBox({ value, onChange, placeholder = "Search..." }) {
  const [text, setText] = useState(value ?? "")

  // Debounce anti-lag list
  useEffect(() => {
    const t = setTimeout(() => {
      onChange?.(text)
    }, 300)

    return () => clearTimeout(t)
  }, [text, onChange])

  return (
    <div className="relative w-full md:max-w-xs">
      <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-10"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  )
}
