import { SiDiscover, SiMastercard, SiPaypal, SiVisa } from "react-icons/si";

const ICONS = [
  { Icon: SiVisa, label: "Visa", color: "#1a1f71" },
  { Icon: SiMastercard, label: "Mastercard", color: "#eb001b" },
  { Icon: SiDiscover, label: "Discover", color: "#ff6000" },
  { Icon: SiPaypal, label: "PayPal", color: "#003087" },
];

export function PaymentIcons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {ICONS.map(({ Icon, label, color }) => (
        <span
          key={label}
          aria-label={label}
          className="flex h-6 w-9 items-center justify-center rounded border bg-background"
        >
          <Icon className="h-4 w-4" style={{ color }} />
        </span>
      ))}
    </div>
  );
}
