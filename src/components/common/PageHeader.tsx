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
      <p className="text-muted-foreground mb-2 text-sm tracking-widest uppercase">
        {label}
      </p>

      <h1 className="text-foreground text-4xl font-bold">{title}</h1>

      {description && (
        <p className="text-muted-foreground mt-2">{description}</p>
      )}
    </div>
  );
}
