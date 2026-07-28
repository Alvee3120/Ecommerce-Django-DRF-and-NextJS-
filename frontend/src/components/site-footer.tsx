import Link from "next/link";

import type { SiteSettings } from "@/lib/types";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-16 border-t bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground md:flex-row">
        <span>
          &copy; {new Date().getFullYear()} {settings.site_name}
        </span>
        <Link href="/track-order" className="hover:text-primary">
          Track your order
        </Link>
      </div>
    </footer>
  );
}
