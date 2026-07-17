import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "../../components/eventa/AuthShell";
import { LuxInput } from "../../components/eventa/LuxInput";
import { LuxButton } from "../../components/eventa/LuxButton";
import { supabase } from "../../lib/supabase";

export const Route = createFileRoute("/auth/signup")({
  component: SignupPage,
});

function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/login` },
      });
      if (authError) throw authError;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message ?? "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthShell title="Check Your Email" subtitle="Confirm your account to get started">
        <div className="space-y-4 text-center">
          <span className="text-4xl">&#9993;</span>
          <p className="text-sm text-[var(--color-smoke)]">
            We sent a confirmation link to <strong className="text-[var(--color-ivory)]">{email}</strong>.
          </p>
          <LuxButton variant="ghost" onClick={() => router.navigate({ to: "/auth/login" })}>
            Go to Sign In
          </LuxButton>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Create Account" subtitle="Join Eventa to plan your events">
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
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <LuxInput
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
        <LuxButton type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </LuxButton>
        <p className="text-center text-xs text-[var(--color-smoke)]">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-[var(--color-gold)] hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
