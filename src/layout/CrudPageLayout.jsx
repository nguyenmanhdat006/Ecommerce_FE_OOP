// components/layouts/CrudPageLayout.jsx

import { TableHeader } from "@/components/DataTable/TableHeader";

export function CrudPageLayout({ 
  title, 
  actionText, 
  onAdd, 
  children, 
  filters, 
  stats 
}) {
  return (
    <div className="p-8 space-y-6">

      {/* Top Header */}
      <TableHeader 
        title={title} 
        actionText={actionText} 
        onAdd={onAdd} 
      />

      {/* Optional Stats */}
      {stats && (
        <div>
          {stats}
        </div>
      )}

      {/* Optional Filters */}
      {filters && (
        <div>
          {filters}
        </div>
      )}

      {/* Page main content */}
      <div>
        {children}
      </div>
    </div>
  );
}
