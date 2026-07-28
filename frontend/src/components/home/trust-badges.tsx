import { Gift, Headphones, PiggyBank, Plane, RefreshCw } from "lucide-react";

const ITEMS = [
  { Icon: Plane, title: "Free Shipping", desc: "Free shipping for all US orders" },
  { Icon: Headphones, title: "Support 24/7", desc: "We support 24h a day" },
  { Icon: RefreshCw, title: "Money Back", desc: "You have 30 days to return" },
  { Icon: Gift, title: "Payment Secure", desc: "We ensure secure payment" },
  { Icon: PiggyBank, title: "Discount", desc: "Up to 40% for members" },
];

export function TrustBadges() {
  return (
    <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-8 px-4 py-12 lg:grid-cols-5">
      {ITEMS.map(({ Icon, title, desc }) => (
        <div
          key={title}
          className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left"
        >
          <Icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
          <div>
            <p className="font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
