import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { signInWithEmail } from "@/lib/auth";
import { contact, emailHref, whatsappHref } from "@/data/contact";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Path to Qur'anic Understanding" },
      {
        name: "description",
        content:
          "Sign in to the Path to Qur'anic Understanding school portal or create a new student account.",
      },
      { property: "og:title", content: "Sign In — Path to Qur'anic Understanding" },
      {
        property: "og:description",
        content: "Sign in to the Path to Qur'anic Understanding school portal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    if (!email.trim() || !email.includes("@")) {
      setFeedback("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setFeedback("Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    // Auth stays isolated in src/lib/auth.ts (Supabase client in src/lib/supabase.ts).
    const result = await signInWithEmail(email, password);
    setIsSubmitting(false);

    if (result.error) {
      setFeedback(result.error);
      return;
    }
    void navigate({ to: "/dashboard" });
  }

  return (
    <div className="hero-gradient min-h-[calc(100vh-8rem)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center">
            <p className="inline-flex items-center rounded-full border border-amber/40 bg-amber/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-amber">
              Portal access
            </p>
            <h1 className="mt-6 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Sign in to the portal
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-foreground/85">
              Enter your email address and password, or create a new student account.
            </p>
          </div>

          {/* Auth mode switcher */}
          <div className="mt-8 grid grid-cols-2 rounded-lg border border-border bg-card/70 p-1 text-sm">
            <span className="rounded-md bg-amber py-2 text-center font-semibold text-primary-foreground">
              Sign in
            </span>
            <Link
              to="/signup"
              className="rounded-md py-2 text-center font-medium text-muted-foreground transition-colors hover:text-headline"
            >
              Sign up
            </Link>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-card/90 p-6 backdrop-blur-sm sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-headline">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-md border border-input bg-secondary px-4 text-base text-foreground transition-colors duration-200 placeholder:text-muted-foreground hover:border-amber/50 focus:border-amber focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-headline">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-md border border-input bg-secondary px-4 text-base text-foreground transition-colors duration-200 placeholder:text-muted-foreground hover:border-amber/50 focus:border-amber focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 w-full items-center justify-center rounded-md bg-amber text-sm font-semibold tracking-wide text-primary-foreground transition-colors duration-200 hover:bg-amber-soft disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Signing in…" : "Sign in"}
              </button>

              {feedback && (
                <p
                  role="alert"
                  className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-center text-sm text-destructive"
                >
                  {feedback}
                </p>
              )}

              <p className="text-center text-sm text-muted-foreground">
                New here?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-amber underline underline-offset-4 transition-colors hover:text-amber-soft"
                >
                  Create an account
                </Link>
              </p>
            </form>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-card/70 p-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <strong className="font-semibold text-headline">Need assistance?</strong> Teacher and
              administrator accounts are issued by the school. For support, message us on{" "}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer noopener"
                className="text-amber underline underline-offset-4 transition-colors hover:text-amber-soft"
              >
                WhatsApp
              </a>{" "}
              or email{" "}
              <a
                href={emailHref}
                className="break-all text-amber underline underline-offset-4 transition-colors hover:text-amber-soft"
              >
                {contact.email}
              </a>
              .
            </p>
          </div>

          <p className="mt-8 text-center text-sm">
            <Link
              to="/"
              className="text-muted-foreground underline underline-offset-4 transition-colors hover:text-amber"
            >
              ← Back to the landing page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
