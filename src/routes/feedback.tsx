import { createFileRoute } from "@tanstack/react-router";
import { LuxCard } from "../components/eventa/LuxCard";
import { LuxInput } from "../components/eventa/LuxInput";
import { LuxTextarea } from "../components/eventa/LuxTextarea";
import { LuxButton } from "../components/eventa/LuxButton";
import { GoldLine } from "../components/eventa/GoldLine";
import { supabase } from "../lib/supabase";
import { useState } from "react";

export const Route = createFileRoute("/feedback")({
  component: FeedbackPage,
});

function FeedbackPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "praise" as "praise" | "complaint" | "suggestion",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const { error: dbError } = await supabase.from("feedback").insert({
        name: form.name,
        email: form.email,
        type: form.type,
        message: form.message,
      });
      if (dbError) throw dbError;
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message ?? "Failed to submit feedback");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-12 text-center">
        <span className="label-eyebrow">Feedback</span>
        <h1 className="font-display mt-2 text-4xl">
          We Value Your <span className="gold-accent">Voice</span>
        </h1>
        <GoldLine className="mx-auto mt-4 w-24" />
      </div>

      <LuxCard>
        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <span className="text-4xl">&#10024;</span>
            <h3 className="font-display text-2xl text-[var(--color-gold)]">Thank You</h3>
            <p className="text-sm text-[var(--color-smoke)]">
              Your feedback has been received. We appreciate your voice.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <LuxInput
              label="Name"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <LuxInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <div className="space-y-1.5">
              <span className="label-eyebrow">Type</span>
              <div className="flex gap-2">
                {(["praise", "complaint", "suggestion"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, type: t })}
                    className={`flex-1 rounded-md border px-4 py-2.5 text-xs font-medium uppercase tracking-[0.12em] transition-all ${
                      form.type === t
                        ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
                        : "border-[var(--color-border)] text-[var(--color-smoke)] hover:border-[var(--color-gold)]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <LuxTextarea
              label="Message"
              placeholder="Share your thoughts..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />

            {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}

            <LuxButton type="submit" className="w-full">
              Submit Feedback
            </LuxButton>
          </form>
        )}
      </LuxCard>
    </div>
  );
}
