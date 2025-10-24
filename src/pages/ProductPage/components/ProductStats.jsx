import { StatCard } from "@/components/StatsCard"

const stats = [
  { label: "Total Sales", value: "$30,230", change: "+20.1%", changeType: "positive" },
  { label: "Number of Sales", value: "982", change: "+5.02%", changeType: "positive" },
  { label: "Affiliate", value: "$4,530", change: "+3.1%", changeType: "positive" },
  { label: "Discounts", value: "$2,230", change: "-3.58%", changeType: "negative" },
]

export function ProductStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((s, i) => (
        <StatCard key={i} {...s} />
      ))}
    </div>
  )
}
