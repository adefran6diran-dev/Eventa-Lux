import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export type AuthUser = {
  id: string;
  email: string;
  role: "admin" | "vendor" | "user" | null;
  profile: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userInfo = await resolveUserRole(session.user);
        setUser(userInfo);
      }
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const userInfo = await resolveUserRole(session.user);
          setUser(userInfo);
        } else {
          setUser(null);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.navigate({ to: "/" });
  };

  return { user, loading, signOut, supabase };
}

async function resolveUserRole(user: { id: string; email?: string; user_metadata?: Record<string, any> }) {
  const [adminResult, vendorResult] = await Promise.all([
    supabase.rpc("has_role", { user_id: user.id, role: "admin" }).maybeSingle(),
    supabase.rpc("has_role", { user_id: user.id, role: "vendor" }).maybeSingle(),
  ]);

  const isAdmin = adminResult.data ?? false;
  const isVendor = vendorResult.data ?? false;

  const role = isAdmin ? "admin" : isVendor ? "vendor" : user.user_metadata?.role ?? "user";

  return {
    id: user.id,
    email: user.email!,
    role: role as "admin" | "vendor" | "user" | null,
    profile: {
      full_name: user.user_metadata?.full_name ?? null,
      avatar_url: user.user_metadata?.avatar_url ?? null,
    },
  };
}

export function useRequiredAuth(requiredRole: "admin" | "vendor") {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.role !== requiredRole)) {
      router.navigate({ to: requiredRole === "admin" ? "/admin-login" : "/vendor/login" });
    }
  }, [user, loading, requiredRole, router]);

  return { user, loading };
}
