import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LuxCard } from "../../components/eventa/LuxCard";
import { LuxButton } from "../../components/eventa/LuxButton";
import { LuxBadge } from "../../components/eventa/LuxBadge";
import { GoldLine } from "../../components/eventa/GoldLine";
import { mockVendors } from "../../lib/mock-vendors";

export const Route = createFileRoute("/events/$eventId")({
  component: EventDetailPage,
});

function EventDetailPage() {
  const { eventId } = Route.useParams();
  const [shortlist, setShortlist] = useState<string[]>([]);

  const toggleShortlist = (id: string) => {
    setShortlist((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
        : [...prev, id],
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <span className="label-eyebrow">Event</span>
      <h1 className="font-display mt-2 text-3xl">
        Event <span className="gold-accent">Details</span>
      </h1>
      <p className="mt-1 text-xs text-[var(--color-smoke)]">ID: {eventId}</p>
      <GoldLine className="my-6" />

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          <LuxCard>
            <h3 className="font-display text-xl text-[var(--color-ivory)] mb-2">
              Shortlist
            </h3>
            <p className="text-sm text-[var(--color-smoke)]">
              Select vendors from the directory to build your shortlist.
            </p>
            <GoldLine className="my-4" />

            <div className="space-y-3">
              {mockVendors.slice(0, 4).map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between rounded-md border border-[var(--color-border)] p-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={v.photos[0]}
                      alt={v.business_name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-[var(--color-ivory)]">
                        {v.business_name}
                      </p>
                      <p className="text-xs text-[var(--color-smoke)]">{v.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleShortlist(v.id)}
                    className={`rounded-md border px-3 py-1 text-xs font-medium transition-all ${
                      shortlist.includes(v.id)
                        ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
                        : "border-[var(--color-border)] text-[var(--color-smoke)] hover:border-[var(--color-gold)]"
                    }`}
                  >
                    {shortlist.includes(v.id) ? "Added" : "Add"}
                  </button>
                </div>
              ))}
            </div>
          </LuxCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <LuxCard>
            <h4 className="label-eyebrow mb-3">Shortlist Summary</h4>
            <p className="font-display text-3xl text-[var(--color-gold)]">
              {shortlist.length}
            </p>
            <p className="text-xs text-[var(--color-smoke)]">vendors selected</p>
            {shortlist.length > 0 && (
              <LuxButton className="mt-4 w-full" size="sm">
                Send Inquiries
              </LuxButton>
            )}
          </LuxCard>
          <LuxCard>
            <h4 className="label-eyebrow mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <LuxButton variant="outline" className="w-full" size="sm">
                View Bookings
              </LuxButton>
              <LuxButton variant="ghost" className="w-full" size="sm">
                Edit Event
              </LuxButton>
            </div>
          </LuxCard>
        </div>
      </div>
    </div>
  );
}
