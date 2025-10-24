import { ProductHeader } from "./components/ProductHeader";
import { ProductStats } from "./components/ProductStats";
import { ProductFilters } from "./components/ProductFilters";
import { ProductsTable } from "@/components/ProductsTable";

export function ProductsPage() {
  return (
    <div className="p-8 space-y-6">
      <ProductHeader onAdd={() => console.log("add")} />
      <ProductStats />
      <ProductFilters />
      <ProductsTable />
    </div>
  );
}
