import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useRequiredAuth } from "../../lib/use-auth";
import { VendorShell } from "../../components/eventa/VendorShell";
import { LuxCard } from "../../components/eventa/LuxCard";
import { LuxInput } from "../../components/eventa/LuxInput";
import { LuxTextarea } from "../../components/eventa/LuxTextarea";
import { LuxButton } from "../../components/eventa/LuxButton";
import { GoldLine } from "../../components/eventa/GoldLine";
import { mockVendors } from "../../lib/mock-vendors";

export const Route = createFileRoute("/vendor/profile")({
  component: VendorProfilePage,
});

const categories = ["venue", "catering", "photography", "decoration", "music", "makeup", "fashion", "planning"];

function VendorProfilePage() {
  useRequiredAuth("vendor");
  const vendor = mockVendors[0];

  const [form, setForm] = useState({
    business_name: vendor.business_name,
    category: vendor.category,
    description: vendor.description,
    location: vendor.location,
    website: vendor.website ?? "",
    instagram: vendor.instagram ?? "",
  });

  const [packages, setPackages] = useState(vendor.packages);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updatePackage = (index: number, field: string, value: string | number) => {
    setPackages((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const addPackage = () => {
    setPackages((prev) => [...prev, { name: "", price: 0, description: "" }]);
  };

  const removePackage = (index: number) => {
    setPackages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <VendorShell title="Profile">
      <div className="max-w-3xl space-y-8">
        <LuxCard>
          <h3 className="font-display text-xl text-[var(--color-ivory)] mb-6">Business Information</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <LuxInput label="Business Name" value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} required />
            <div className="space-y-1.5">
              <span className="label-eyeblock">Category</span>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-obsidian)] px-4 py-2.5 text-sm text-[var(--color-ivory)]">
                {categories.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <LuxTextarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="grid gap-4 md:grid-cols-3">
              <LuxInput label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <LuxInput label="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              <LuxInput label="Instagram" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
            </div>
            <div className="flex items-center gap-3">
              <LuxButton type="submit">{saved ? "Saved!" : "Save Changes"}</LuxButton>
            </div>
          </form>
        </LuxCard>

        <LuxCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl text-[var(--color-ivory)]">Packages & Pricing</h3>
            <LuxButton size="sm" onClick={addPackage}>Add Package</LuxButton>
          </div>
          <GoldLine className="mb-6" />
          <div className="space-y-4">
            {packages.map((pkg, i) => (
              <div key={i} className="rounded-md border border-[var(--color-border)] p-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <LuxInput label="Package Name" value={pkg.name} onChange={(e) => updatePackage(i, "name", e.target.value)} />
                  <div className="space-y-1.5">
                    <span className="label-eyebrow block">Price (₦)</span>
                    <input type="number" value={pkg.price} onChange={(e) => updatePackage(i, "price", parseInt(e.target.value) || 0)} className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-obsidian)] px-4 py-2.5 text-sm text-[var(--color-ivory)]" />
                  </div>
                  <div className="flex items-end">
                    <LuxButton variant="ghost" size="sm" onClick={() => removePackage(i)}>Remove</LuxButton>
                  </div>
                </div>
                <div className="mt-3">
                  <LuxTextarea label="Description" value={pkg.description} onChange={(e) => updatePackage(i, "description", e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </LuxCard>
      </div>
    </VendorShell>
  );
}
