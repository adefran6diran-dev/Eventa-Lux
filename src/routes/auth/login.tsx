import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "../../components/eventa/AuthShell";
import { LuxInput } from "../../components/eventa/LuxInput";
import { LuxButton } from "../../components/eventa/LuxButton";
import { supabase } from "../../lib/supabase";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      router.navigate({ to: "/events" });
    } catch (err: any) {
      setError(err.message ?? "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome Back" subtitle="Sign in to manage your events">
      <form onSubmit={handleSubmit} className="space-y-5">
        <LuxInput
          label="Email"
          type="email"
          placeholder="you@example.com"
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
        />
        {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
        <LuxButton type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </LuxButton>
        <div className="flex items-center justify-between text-xs">
          <Link to="/auth/signup" className="text-[var(--color-gold)] hover:underline">
            Create account
          </Link>
          <Link to="/auth/forgot" className="text-[var(--color-smoke)] hover:underline">
            Forgot password?
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
