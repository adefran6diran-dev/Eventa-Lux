import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "../../components/eventa/AuthShell";
import { LuxInput } from "../../components/eventa/LuxInput";
import { LuxButton } from "../../components/eventa/LuxButton";
import { supabase } from "../../lib/supabase";

export const Route = createFileRoute("/vendor/login")({
  component: VendorLoginPage,
});

function VendorLoginPage() {
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

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: isVendor } = await supabase.rpc("has_role", {
        user_id: user.id,
        role: "vendor",
      });

      if (!isVendor) {
        await supabase.auth.signOut();
        throw new Error("Access denied. Vendor privileges required.");
      }

      router.navigate({ to: "/vendor/dashboard" });
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Vendor Sign In" subtitle="Access your vendor dashboard">
      <form onSubmit={handleSubmit} className="space-y-5">
        <LuxInput label="Email" type="email" placeholder="vendor@eventa.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <LuxInput label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required showPasswordToggle />
        {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
        <LuxButton type="submit" className="w-full" disabled={loading}>
          {loading ? "Verifying..." : "Sign In"}
        </LuxButton>
        <p className="text-center text-xs text-[var(--color-smoke)]">
          Not a vendor yet?{" "}
          <Link to="/vendor-apply" className="text-[var(--color-gold)] hover:underline">
            Apply now
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
