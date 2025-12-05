import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function OrdersHeader({ onOpenCreateOrder }) {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-foreground">{t('admin.orders.title')}</h1>
    </div>
  );
}
