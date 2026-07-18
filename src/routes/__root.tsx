import { Outlet, createRootRoute, redirect } from "@tanstack/react-router";
import { EventaNav } from "../components/eventa/EventaNav";
import { supabase } from "../lib/supabase";

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/signup"];

    // 1. Get user
    const { data: { user } } = await supabase.auth.getUser();

    // 2. Check if current path starts with any public route
    const isPublic = PUBLIC_ROUTES.some(
      route => location.pathname === route || location.pathname.startsWith(route + "/")
    );

    // 3. If NOT logged in AND NOT public, redirect to your real login
    if (!user && !isPublic) {
      throw redirect({ to: "/auth/login" });
    }

    // If logged in and trying to go to login/signup, send to dashboard
    if (user && ["/auth/login", "/auth/signup"].includes(location.pathname)) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-ivory)] antialiased">
      <EventaNav />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}