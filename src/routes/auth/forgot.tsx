import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AuthShell } from "../../components/eventa/AuthShell";
import { LuxInput } from "../../components/eventa/LuxInput";
import { LuxButton } from "../../components/eventa/LuxButton";
import { supabase } from "../../lib/supabase";
import { useState } from "react";

export const Route = createFileRoute("/auth/forgot")({
  component: ForgotPage,
});

function ForgotPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: `${window.location.origin}/auth/login` },
      );
      if (authError) throw authError;
      setSent(true);
    } catch (err: any) {
      setError(err.message ?? "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset Password"
      subtitle={sent ? "Check your email for the reset link" : "Enter your email to receive a reset link"}
    >
      {sent ? (
        <div className="text-center space-y-4">
          <span className="text-4xl">&#9993;</span>
          <p className="text-sm text-[var(--color-smoke)]">
            If an account exists with that email, you'll receive a password reset link shortly.
          </p>
          <LuxButton variant="ghost" onClick={() => router.navigate({ to: "/auth/login" })}>
            Back to Sign In
          </LuxButton>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <LuxInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
          <LuxButton type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </LuxButton>
        </form>
      )}
    </AuthShell>
  );
}
