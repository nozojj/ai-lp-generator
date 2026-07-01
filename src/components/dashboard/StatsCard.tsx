interface Props {
  title: string;
  value: string | number;
}

export default function StatsCard({ title, value }: Props) {
  return (
    <div className="border-border bg-card rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md">
      <p className="text-muted-foreground text-sm">{title}</p>

      <h2 className="text-foreground mt-2 text-3xl font-bold">{value}</h2>
    </div>
  );
}
