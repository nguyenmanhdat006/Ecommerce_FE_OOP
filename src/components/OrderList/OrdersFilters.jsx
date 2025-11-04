"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Settings2, LayoutGrid } from "lucide-react";

export default function OrdersFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 max-w-xs">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-muted border-border"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground bg-transparent"
          onClick={() => onStatusChange(statusFilter ? null : "pending")}
        >
          <Settings2 className="w-4 h-4" />
          Status
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground bg-transparent"
          onClick={() => onCategoryChange(categoryFilter ? null : "sale")}
        >
          <Settings2 className="w-4 h-4" />
          Category
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground bg-transparent"
        >
          <LayoutGrid className="w-4 h-4" />
          Columns
        </Button>
      </div>
    </div>
  );
}
