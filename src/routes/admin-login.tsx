import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { LuxInput } from "../components/eventa/LuxInput";
import { LuxButton } from "../components/eventa/LuxButton";
import { GoldLine } from "../components/eventa/GoldLine";
import { supabase } from "../lib/supabase";

export const Route = createFileRoute("/admin-login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isBootstrap = typeof window !== "undefined" && window.location.search.includes("bootstrap=1");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isBootstrap) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { role: "admin" } },
        });
        if (signUpError) throw signUpError;
        if (data.user) {
          await supabase.from("user_roles").insert({
            user_id: data.user.id,
            role: "admin",
          });
        }
        router.navigate({ to: "/admin" });
        return;
      }

      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: isAdmin } = await supabase.rpc("has_role", {
        user_id: user.id,
        role: "admin",
      });

      if (!isAdmin) {
        await supabase.auth.signOut();
        throw new Error("Access denied. Admin privileges required.");
      }

      router.navigate({ to: "/admin" });
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="font-display text-2xl tracking-wider text-[var(--color-ivory)]">
            Eventa<span className="text-[var(--color-gold)] italic">.</span>{" "}
            <span className="text-xs text-[var(--color-smoke)]">Admin</span>
          </h1>
          <GoldLine className="mx-auto my-4 w-12" />
          <p className="text-sm text-[var(--color-smoke)]">
            {isBootstrap ? "Bootstrap the first admin account" : "Admin sign in"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-obsidian-2)] p-8"
        >
          <LuxInput
            label="Email"
            type="email"
            placeholder="admin@eventa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <LuxInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            showPasswordToggle
          />

          {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}

          <LuxButton type="submit" className="w-full" disabled={loading}>
            {loading ? "Authenticating..." : isBootstrap ? "Create Admin" : "Sign In"}
          </LuxButton>

          <p className="text-center text-xs text-[var(--color-smoke)]">
            <a href="/" className="text-[var(--color-gold)] hover:underline">
              Back to main site
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
