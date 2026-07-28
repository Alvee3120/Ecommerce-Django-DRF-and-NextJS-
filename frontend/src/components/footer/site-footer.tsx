import { SocialIcons } from "@/components/header/social-icons";
import { Logo } from "@/components/header/logo";
import type { SiteSettings } from "@/lib/types";

import { FooterAccordion } from "./footer-accordion";
import { FooterLinks } from "./footer-links";
import { MobileTabBar } from "./mobile-tab-bar";
import { NewsletterForm } from "./newsletter-form";
import { OpeningHours } from "./opening-hours";
import { PaymentIcons } from "./payment-icons";

const COMPANY_LINKS = [
  "Delivery Information",
  "Privacy Policy",
  "Terms & Condition",
  "Search Terms",
  "Order & Return",
];

const CUSTOM_CARE_LINKS = [
  "Customer Service",
  "Privacy Policy",
  "Terms & Condition",
  "Best Seller",
  "Manufactures",
];

const BOTTOM_LINKS = ["Accessibility", "Store Directory", "About Us", "Contact Us"];

function ContactBlock({ settings }: { settings: SiteSettings }) {
  return (
    <div className="space-y-3">
      <Logo settings={settings} className="text-2xl" />
      <address className="flex flex-col gap-2 text-sm text-foreground/80 not-italic">
        <span>123 Main Street, Springfield, USA</span>
        <span>+1 (800) 123-4567</span>
        <span>support@yourstore.com</span>
        <span>yourstore.com</span>
      </address>
    </div>
  );
}

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="bg-[#fafafa]">
        <div className="mx-auto max-w-[1200px] px-4 py-12">
          {/* Desktop */}
          <div className="hidden lg:grid lg:grid-cols-4 lg:gap-8">
            <ContactBlock settings={settings} />

            <div className="space-y-6">
              <SocialIcons />
              <FooterLinks items={COMPANY_LINKS} />
            </div>

            <div className="col-span-2">
              <NewsletterForm className="mb-8 max-w-[575px]" />
              <div className="grid grid-cols-2 gap-8">
                <FooterLinks items={CUSTOM_CARE_LINKS} />
                <div className="space-y-4">
                  <OpeningHours />
                  <PaymentIcons />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="space-y-6 lg:hidden">
            <ContactBlock settings={settings} />
            <SocialIcons />
            <NewsletterForm />
            <FooterAccordion
              sections={[
                { title: "Company", content: <FooterLinks items={COMPANY_LINKS} /> },
                { title: "Custom Care", content: <FooterLinks items={CUSTOM_CARE_LINKS} /> },
                {
                  title: "Opening Time",
                  content: (
                    <div className="space-y-4">
                      <OpeningHours />
                      <PaymentIcons />
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="border-t bg-background">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-2 px-4 py-4 text-sm text-foreground/80 md:flex-row">
          <span>
            &copy; {year} <strong>{settings.site_name}</strong>
            {" "}
            &ndash; All Right reserved!
          </span>
          <div className="hidden items-center gap-6 lg:flex">
            {BOTTOM_LINKS.map((label) => (
              <a key={label} href="#" className="hover:text-primary">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <MobileTabBar />
    </footer>
  );
}
