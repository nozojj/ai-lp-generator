type SettingCardProps = {
  title: string;
  children: React.ReactNode;
};

export default function SettingCard({
  title,
  children,
}: SettingCardProps) {
  return (
    <div className="bg-card border-border rounded-xl border p-6">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>

      {children}
    </div>
  );
}