import { FaEnvelope, FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

const ITEMS = [
  { Icon: FaXTwitter, label: "X" },
  { Icon: FaFacebookF, label: "Facebook" },
  { Icon: FaEnvelope, label: "Email" },
  { Icon: FaInstagram, label: "Instagram" },
];

export function SocialIcons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 text-foreground/80 ${className}`}>
      {ITEMS.map(({ Icon, label }) => (
        <a key={label} href="#" aria-label={label} className="hover:text-primary">
          <Icon className="h-3.5 w-3.5" />
        </a>
      ))}
    </div>
  );
}
