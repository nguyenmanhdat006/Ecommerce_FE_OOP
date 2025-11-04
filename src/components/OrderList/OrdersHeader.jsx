import { Button } from "@/components/ui/button";

export default function OrdersHeader({ onOpenCreateOrder }) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-foreground">Orders</h1>
    </div>
  );
}
