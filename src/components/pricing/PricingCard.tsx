import { Button } from "@/components/ui/button";

type PricingCardProps = {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  recommended?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export default function PricingCard({
  title,
  price,
  description,
  features,
  buttonText,
  recommended,
  disabled,
  onClick,
}: PricingCardProps) {
  return (
    <div
      className={`rounded-2xl border p-8 ${
        recommended ? "border-emerald-500 shadow-lg" : "border-border"
      }`}
    >
      {recommended && (
        <p className="mb-4 text-sm font-bold text-emerald-400">
          ⭐ Recommended
        </p>
      )}

      <h2 className="text-3xl font-bold">{title}</h2>

      <p className="mt-2 text-4xl font-bold">{price}</p>

      <p className="text-muted-foreground mt-2">{description}</p>

      <ul className="mt-6 space-y-3">
        {features.map((feature) => (
          <li key={feature}>✅ {feature}</li>
        ))}
      </ul>

      <Button onClick={onClick} disabled={disabled} className="mt-8 w-full">
        {buttonText}
      </Button>
    </div>
  );
}
