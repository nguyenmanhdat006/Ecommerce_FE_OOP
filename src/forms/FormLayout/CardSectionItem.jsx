export function CardSectionItem({ title, actionButton, children }) {
  return (
    <div className="border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        {actionButton}
      </div>
      {children}
    </div>
  );
}
