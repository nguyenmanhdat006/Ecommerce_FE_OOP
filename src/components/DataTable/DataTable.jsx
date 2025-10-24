import React from "react"
import { Card } from "../ui/card"

export function DataTable({
  data = [],
  columns = [],
  showSelect = true,
}) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {showSelect && (
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  <input type="checkbox" className="rounded" />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={col.thClassName ?? "px-6 py-3 text-left text-sm font-semibold text-foreground"}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header ?? ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                {showSelect && (
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                )}
                {columns.map((col) => {
                  return (
                    <td
                      key={col.key}
                      className={col.tdClassName ?? "px-6 py-4 text-sm text-foreground"}
                      style={col.width ? { width: col.width } : undefined}
                    >
                      {col.render ? col.render(item) : // default: display field by key
                        String((item)[col.key] ?? "")}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}