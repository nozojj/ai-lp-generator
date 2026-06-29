type PageHeaderProps = {
  label: string;
  title: string;
  description?: string;
};

export default function PageHeader({
  label,
  title,
  description,
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      <p className="mb-2 text-sm tracking-widest text-slate-400 uppercase">
        {label}
      </p>

      <h1 className="text-4xl font-bold">{title}</h1>

      {description && <p className="mt-2 text-slate-400">{description}</p>}
    </div>
  );
}
