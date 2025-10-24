import { Card } from "./ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

// interface StatCardProps {
//   label: string
//   value: string
//   change: string
//   changeType: "positive" | "negative"
// }

export function StatCard({ label, value, change, changeType }) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            changeType === "positive" ? "text-green-600" : "text-red-600"
          }`}
        >
          {changeType === "positive" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {change}
        </div>
      </div>
    </Card>
  )
}
