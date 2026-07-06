type EmptyStateProps = {
  title: string;
  description: string;
};

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="border-border bg-card rounded-xl border p-10 text-center shadow-sm">
      <h2 className="text-foreground text-2xl font-bold">{title}</h2>

      <p className="text-muted-foreground mt-2">{description}</p>
    </div>
  );
}
