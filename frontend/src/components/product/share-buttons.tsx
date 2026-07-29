"use client";

import { Share2 } from "lucide-react";
import { FaEnvelope, FaFacebookF, FaPinterestP, FaXTwitter } from "react-icons/fa6";

export function ShareButtons({
  url,
  title,
  image,
}: {
  url: string;
  title: string;
  image: string | null;
}) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { Icon: FaXTwitter, label: "Share on X", href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { Icon: FaFacebookF, label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    {
      Icon: FaPinterestP,
      label: "Share on Pinterest",
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}${
        image ? `&media=${encodeURIComponent(image)}` : ""
      }`,
    },
    { Icon: FaEnvelope, label: "Share by email", href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}` },
  ];

  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="flex items-center gap-1.5 font-medium">
        <Share2 className="h-4 w-4" />
        Share
      </span>
      <div className="flex items-center gap-3 text-foreground/60">
        {links.map(({ Icon, label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="hover:text-primary"
          >
            <Icon className="h-3.5 w-3.5" />
          </a>
        ))}
      </div>
    </div>
  );
}
