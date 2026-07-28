import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { PopupLauncher } from "@/components/popup-launcher";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { contrastColor } from "@/lib/color";
import { getCategoryTree, getSiteSettings } from "@/lib/data";

import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.site_name,
    description: `Shop online at ${settings.site_name}`,
    icons: settings.favicon ? [{ url: settings.favicon }] : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, categoryTree] = await Promise.all([getSiteSettings(), getCategoryTree()]);

  const themeStyle = {
    "--primary": settings.primary_color,
    "--primary-foreground": contrastColor(settings.primary_color),
    "--secondary": settings.secondary_color,
    "--secondary-foreground": contrastColor(settings.secondary_color),
  } as React.CSSProperties;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={themeStyle}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <SiteHeader settings={settings} categories={categoryTree.results} />
          <main className="flex-1">{children}</main>
          <SiteFooter settings={settings} />
          <PopupLauncher />
        </Providers>
      </body>
    </html>
  );
}
