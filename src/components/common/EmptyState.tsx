type EmptyStateProps = {
  title: string;
  description: string;
};

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="rounded-xl bg-slate-900 p-10 text-center">
      <h2 className="text-2xl font-bold">{title}</h2>

      <p className="mt-2 text-slate-400">
        {description}
      </p>
    </div>
  );
}