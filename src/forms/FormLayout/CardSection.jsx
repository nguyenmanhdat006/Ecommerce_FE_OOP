export function CardSection({ title, actions, children }) {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}