import { Link } from "@tanstack/react-router";

import { SocialLinks } from "@/components/social-links";
import { contact, emailHref, phoneHref, whatsappHref } from "@/data/contact";

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <Link
              to="/"
              className="inline-flex items-center gap-3 transition-opacity hover:opacity-85"
            >
              <img
                src="/favicon.png"
                alt="PTQU Crest"
                width={32}
                height={32}
                className="size-8 rounded-md border border-amber/40 bg-[#151210] object-cover"
              />
              <span className="font-display text-base font-semibold text-headline">
                Path to Qur&apos;anic Understanding
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A school-managed learning environment for the classical Islamic sciences.
            </p>
          </div>

          <div className="min-w-0">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-amber">Contact</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={phoneHref}
                  className="text-muted-foreground transition-colors duration-200 hover:text-amber"
                >
                  Call {contact.phoneNumber}
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-muted-foreground transition-colors duration-200 hover:text-amber"
                >
                  WhatsApp {contact.whatsappNumber}
                </a>
              </li>
              <li>
                <a
                  href={emailHref}
                  className="break-all text-muted-foreground transition-colors duration-200 hover:text-amber"
                >
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-amber">Follow</h2>
            <SocialLinks className="mt-4" size="sm" />
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Path to Qur&apos;anic Understanding. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
