/**
 * Client-side role resolution for portal pages.
 * Redirects signed-out visitors to /login and wrong-role users to their own home.
 */
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "./auth";
import { fetchUserRole, roleHome, type RoleName } from "./portal";

export function usePortalRole(expected?: RoleName) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const roleQuery = useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: () => fetchUserRole(user!.id),
    enabled: Boolean(user?.id),
  });

  useEffect(() => {
    if (!isLoading && !user) void navigate({ to: "/login", replace: true });
  }, [isLoading, user, navigate]);

  const role = roleQuery.data ?? null;

  useEffect(() => {
    if (!expected || isLoading || !user || !roleQuery.isSuccess) return;
    if (!role) {
      void navigate({ to: "/dashboard", replace: true });
      return;
    }
    if (role !== expected) {
      void navigate({ to: roleHome[role], replace: true });
    }
  }, [expected, isLoading, user, roleQuery.isSuccess, role, navigate]);

  return {
    user,
    role,
    isLoading: isLoading || (Boolean(user) && roleQuery.isLoading),
    error: roleQuery.error as Error | null,
  };
}
