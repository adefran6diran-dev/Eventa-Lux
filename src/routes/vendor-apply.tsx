import { createFileRoute } from "@tanstack/react-router";
import { LuxCard } from "../components/eventa/LuxCard";
import { LuxInput } from "../components/eventa/LuxInput";
import { LuxTextarea } from "../components/eventa/LuxTextarea";
import { LuxButton } from "../components/eventa/LuxButton";
import { GoldLine } from "../components/eventa/GoldLine";
import { supabase } from "../lib/supabase";
import { useState } from "react";

export const Route = createFileRoute("/vendor-apply")({
  component: VendorApplyPage,
});

const categories = [
  "venue",
  "catering",
  "photography",
  "decoration",
  "music",
  "makeup",
  "fashion",
  "planning",
  "transportation",
  "jewelry",
];

function VendorApplyPage() {
  const [form, setForm] = useState({
    business_name: "",
    category: "",
    description: "",
    location: "",
    website: "",
    instagram: "",
    email: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const payload: any = {
        business_name: form.business_name,
        category: form.category,
        description: form.description || null,
        location: form.location || null,
        website: form.website || null,
        instagram: form.instagram || null,
      };

      if (user) {
        payload.user_id = user.id;
      }

      const { error: dbError } = await supabase
        .from("vendor_applications")
        .insert(payload);
      if (dbError) throw dbError;
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message ?? "Failed to submit application");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-12 text-center">
        <span className="label-eyebrow">Join Us</span>
        <h1 className="font-display mt-2 text-4xl">
          Become an Eventa <span className="gold-accent">Vendor</span>
        </h1>
        <p className="mt-3 text-sm text-[var(--color-smoke)]">
          Join Nigeria's most exclusive network of event professionals.
        </p>
        <GoldLine className="mx-auto mt-4 w-24" />
      </div>

      <LuxCard>
        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <span className="text-4xl">&#10024;</span>
            <h3 className="font-display text-2xl text-[var(--color-gold)]">
              Application Submitted
            </h3>
            <p className="text-sm text-[var(--color-smoke)]">
              We'll review your application and get back to you within 3-5 business days.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <LuxInput
              label="Business Name"
              placeholder="Your business name"
              value={form.business_name}
              onChange={(e) =>
                setForm({ ...form, business_name: e.target.value })
              }
              required
            />

            <div className="space-y-1.5">
              <span className="label-eyebrow">Category</span>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                required
                className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-obsidian)] px-4 py-2.5 text-sm text-[var(--color-ivory)]"
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <LuxTextarea
              label="Description"
              placeholder="Tell us about your business..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <LuxInput
              label="Location"
              placeholder="City, State"
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
            />

            <div className="grid gap-4 md:grid-cols-2">
              <LuxInput
                label="Website"
                placeholder="https://"
                value={form.website}
                onChange={(e) =>
                  setForm({ ...form, website: e.target.value })
                }
              />
              <LuxInput
                label="Instagram"
                placeholder="@handle"
                value={form.instagram}
                onChange={(e) =>
                  setForm({ ...form, instagram: e.target.value })
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <LuxInput
                label="Email"
                type="email"
                placeholder="business@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <LuxInput
                label="Phone"
                type="tel"
                placeholder="+234"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}

            <LuxButton type="submit" className="w-full">
              Submit Application
            </LuxButton>
          </form>
        )}
      </LuxCard>
    </div>
  );
}
