import { Facebook, Instagram, type LucideIcon } from "lucide-react";

import { contact } from "@/data/contact";
import { cn } from "@/lib/utils";

type SocialLinksProps = {
  className?: string;
  size?: "sm" | "md";
};

type SocialItem = {
  label: string;
  href: string;
  Icon: LucideIcon;
};

/** Instagram / Facebook links, sourced from `src/data/contact.ts`. */
export function SocialLinks({ className, size = "md" }: SocialLinksProps) {
  const box = size === "sm" ? "size-9" : "size-11";
  const icon = size === "sm" ? "size-4" : "size-5";

  const items: SocialItem[] = [
    { label: "Instagram", href: contact.instagramUrl, Icon: Instagram },
    { label: "Facebook", href: contact.facebookUrl, Icon: Facebook },
  ];

  return (
    <ul className={cn("flex items-center gap-3", className)}>
      {items.map(({ label, href, Icon }) => (
        <li key={label}>
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${label} (opens in a new tab)`}
              className={cn(
                box,
                "grid place-items-center rounded-full border border-border text-muted-foreground transition-colors duration-200 hover:border-amber/70 hover:text-amber",
              )}
            >
              <Icon className={icon} aria-hidden="true" />
            </a>
          ) : (
            <span
              aria-label={`${label} — link coming soon`}
              title="Link coming soon"
              className={cn(
                box,
                "grid cursor-not-allowed place-items-center rounded-full border border-border/70 text-muted-foreground/50",
              )}
            >
              <Icon className={icon} aria-hidden="true" />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
