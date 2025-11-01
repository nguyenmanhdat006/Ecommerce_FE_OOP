export function Section({ title, children }) {
  return (
    <section className="bg-card rounded-lg p-6 border border-border">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="text-muted-foreground">{children}</p>
    </section>
  );
}
