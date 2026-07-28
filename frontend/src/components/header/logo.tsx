import Link from "next/link";

import type { SiteSettings } from "@/lib/types";

export function Logo({ settings, className = "" }: { settings: SiteSettings; className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center font-bold tracking-tight ${className}`}>
      {settings.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={settings.logo} alt={settings.site_name} className="h-8 w-auto" />
      ) : (
        <span>
          {settings.site_name}
          <span className="text-primary">.</span>
        </span>
      )}
    </Link>
  );
}
