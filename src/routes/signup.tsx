import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { signUpWithEmail } from "@/lib/auth";
import { contact, emailHref, whatsappHref } from "@/data/contact";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — Path to Qur'anic Understanding" },
      {
        name: "description",
        content:
          "Create a new student account for the Path to Qur'anic Understanding school portal.",
      },
      { property: "og:title", content: "Sign Up — Path to Qur'anic Understanding" },
      {
        property: "og:description",
        content: "Register for a student account on Path to Qur'anic Understanding.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter your password.");
      return;
    }

    setIsSubmitting(true);
    const result = await signUpWithEmail({
      fullName: trimmedName,
      email: trimmedEmail,
      password,
    });
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.needsEmailConfirmation) {
      setConfirmationEmail(trimmedEmail);
      return;
    }

    void navigate({ to: "/student", replace: true });
  }

  return (
    <div className="hero-gradient min-h-[calc(100vh-8rem)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center">
            <p className="inline-flex items-center rounded-full border border-amber/40 bg-amber/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-amber">
              Student registration
            </p>
            <h1 className="mt-6 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Create your account
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-foreground/85">
              New accounts receive student access. Once signed in, your account remains pending
              enrollment until an administrator assigns your subjects.
            </p>
          </div>

          {/* Auth mode switcher */}
          <div className="mt-8 grid grid-cols-2 rounded-lg border border-border bg-card/70 p-1 text-sm">
            <Link
              to="/login"
              className="rounded-md py-2 text-center font-medium text-muted-foreground transition-colors hover:text-headline"
            >
              Sign in
            </Link>
            <span className="rounded-md bg-amber py-2 text-center font-semibold text-primary-foreground">
              Sign up
            </span>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-card/90 p-6 backdrop-blur-sm sm:p-8">
            {confirmationEmail ? (
              <div className="space-y-4 text-center">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber">
                  Check your inbox
                </p>
                <h2 className="font-display text-xl font-semibold text-headline">
                  Confirm your email address
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  We sent a confirmation link to{" "}
                  <strong className="font-medium text-headline">{confirmationEmail}</strong>. Open
                  that link to verify your account, then sign in. Your account will show as pending
                  enrollment until an administrator enrols you in subjects.
                </p>
                <div className="pt-2">
                  <Link
                    to="/login"
                    className="inline-flex h-11 w-full items-center justify-center rounded-md bg-amber px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-amber-soft"
                  >
                    Go to Sign in
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="space-y-2">
                  <label htmlFor="full-name" className="block text-sm font-medium text-headline">
                    Full name
                  </label>
                  <input
                    id="full-name"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="e.g. Abdullah Yusuf"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 w-full rounded-md border border-input bg-secondary px-4 text-base text-foreground transition-colors duration-200 placeholder:text-muted-foreground hover:border-amber/50 focus:border-amber focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="signup-email" className="block text-sm font-medium text-headline">
                    Email address
                  </label>
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 w-full rounded-md border border-input bg-secondary px-4 text-base text-foreground transition-colors duration-200 placeholder:text-muted-foreground hover:border-amber/50 focus:border-amber focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="signup-password"
                    className="block text-sm font-medium text-headline"
                  >
                    Password
                  </label>
                  <input
                    id="signup-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 w-full rounded-md border border-input bg-secondary px-4 text-base text-foreground transition-colors duration-200 placeholder:text-muted-foreground hover:border-amber/50 focus:border-amber focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-headline"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 w-full rounded-md border border-input bg-secondary px-4 text-base text-foreground transition-colors duration-200 placeholder:text-muted-foreground hover:border-amber/50 focus:border-amber focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-12 w-full items-center justify-center rounded-md bg-amber text-sm font-semibold tracking-wide text-primary-foreground transition-colors duration-200 hover:bg-amber-soft disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Creating account…" : "Create student account"}
                </button>

                {error && (
                  <p
                    role="alert"
                    className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-center text-sm text-destructive"
                  >
                    {error}
                  </p>
                )}

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-amber underline underline-offset-4 transition-colors hover:text-amber-soft"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            )}
          </div>

          <div className="mt-6 rounded-xl border border-border bg-card/70 p-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <strong className="font-semibold text-headline">Need help enrolling?</strong> Message
              us on{" "}
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
