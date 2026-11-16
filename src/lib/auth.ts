/**
 * Auth integration point — backed by the school's existing Supabase project.
 * All auth logic stays isolated in this module.
 */
import { useEffect, useState } from "react";

import { supabase } from "./supabase";

export type User = {
  id: string;
  email: string;
  fullName?: string | undefined;
} | null;

export type AuthState = {
  user: User;
  isLoading: boolean;
};

function mapAuthUser(
  raw:
    | { id: string; email?: string | undefined; user_metadata?: Record<string, unknown> }
    | null
    | undefined,
): User {
  if (!raw) return null;
  const metaName =
    typeof raw.user_metadata?.["full_name"] === "string"
      ? raw.user_metadata["full_name"]
      : undefined;
  return {
    id: raw.id,
    email: raw.email ?? "",
    fullName: metaName,
  };
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ user: null, isLoading: true });

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: mapAuthUser(session?.user),
        isLoading: false,
      });
    });

    void supabase.auth.getUser().then(({ data }) => {
      setState({
        user: mapAuthUser(data.user),
        isLoading: false,
      });
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return state;
}

function formatAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials")) {
    return "Incorrect email address or password. Please check your details and try again.";
  }
  if (lower.includes("email not confirmed")) {
    return "Your email address has not been confirmed yet. Please check your inbox for the confirmation link.";
  }
  if (lower.includes("user already registered") || lower.includes("already exists")) {
    return "An account with this email address already exists. Try signing in instead.";
  }
  if (lower.includes("password") && lower.includes("least")) {
    return "Password must be at least 6 characters long.";
  }
  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    return "Too many attempts. Please wait a moment before trying again.";
  }
  if (lower.includes("signups not allowed") || lower.includes("signup is disabled")) {
    return "Public sign-up is currently disabled in authentication settings. Please contact the school administration.";
  }
  return message;
}

/**
 * Ensures a newly signed-up user has a profile row and ONLY the `student` role
 * (never teacher/admin), if not already created by a database trigger.
 */
export async function ensureStudentOnboarding(
  userId: string,
  fullName: string | undefined,
  email: string,
): Promise<void> {
  try {
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (!existingProfile) {
      await supabase.from("profiles").insert({
        id: userId,
        full_name: fullName?.trim() || null,
        email: email.trim(),
        is_active: true,
      });
    }

    const { data: existingRoles } = await supabase
      .from("user_roles")
      .select("role_id")
      .eq("user_id", userId);

    if (!existingRoles || existingRoles.length === 0) {
      const { data: studentRole } = await supabase
        .from("roles")
        .select("id")
        .ilike("name", "student")
        .maybeSingle();

      if (studentRole && (studentRole as { id?: string }).id) {
        await supabase.from("user_roles").insert({
          user_id: userId,
          role_id: (studentRole as { id: string }).id,
        });
      }
    }
  } catch {
    // Non-fatal: a Supabase trigger or RLS policy may manage onboarding server-side.
  }
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<{ error?: string }> {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) return { error: formatAuthError(error.message) };
  return {};
}

export async function signUpWithEmail(input: {
  fullName: string;
  email: string;
  password: string;
}): Promise<{ error?: string; needsEmailConfirmation?: boolean }> {
  const cleanName = input.fullName.trim();
  const cleanEmail = input.email.trim();

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password: input.password,
    options: {
      data: {
        full_name: cleanName,
        role: "student",
      },
      ...(typeof window !== "undefined"
        ? { emailRedirectTo: `${window.location.origin}/login` }
        : {}),
    },
  });

  if (error) {
    return { error: formatAuthError(error.message) };
  }

  // Supabase returns an empty identities array when email already exists and confirmation is on.
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return {
      error: "An account with this email address already exists. Try signing in instead.",
    };
  }

  if (data.session && data.user) {
    await ensureStudentOnboarding(data.user.id, cleanName, cleanEmail);
    return { needsEmailConfirmation: false };
  }

  return { needsEmailConfirmation: true };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}
