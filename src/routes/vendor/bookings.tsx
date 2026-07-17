import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useRequiredAuth } from "../../lib/use-auth";
import { VendorShell } from "../../components/eventa/VendorShell";
import { LuxCard } from "../../components/eventa/LuxCard";
import { LuxButton } from "../../components/eventa/LuxButton";
import { LuxBadge } from "../../components/eventa/LuxBadge";
import { GoldLine } from "../../components/eventa/GoldLine";

export const Route = createFileRoute("/vendor/bookings")({
  component: VendorBookingsPage,
});

type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

interface Booking {
  id: string;
  client: string;
  email: string;
  event: string;
  date: string;
  guests: number;
  budget: string;
  package: string;
  status: BookingStatus;
  created_at: string;
}

const mockBookings: Booking[] = [
  { id: "b1", client: "Amara O.", email: "amara@example.com", event: "Wedding Reception", date: "2026-08-15", guests: 200, budget: "₦8,000,000", package: "Platinum Suite", status: "pending", created_at: "2026-06-20" },
  { id: "b2", client: "Tunde A.", email: "tunde@example.com", event: "Corporate Gala", date: "2026-09-01", guests: 150, budget: "₦3,500,000", package: "Gold Hall", status: "pending", created_at: "2026-06-25" },
  { id: "b3", client: "Zainab K.", email: "zainab@example.com", event: "Birthday", date: "2026-07-20", guests: 50, budget: "₦1,500,000", package: "Silver Hall", status: "confirmed", created_at: "2026-06-15" },
  { id: "b4", client: "Chioma E.", email: "chioma@example.com", event: "Engagement Party", date: "2026-10-05", guests: 100, budget: "₦4,000,000", package: "Gold Hall", status: "completed", created_at: "2026-05-10" },
];

function VendorBookingsPage() {
  useRequiredAuth("vendor");
  const [bookings, setBookings] = useState(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[number] | null>(null);

  const updateStatus = (id: string, status: "confirmed" | "cancelled") => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    setSelectedBooking(null);
  };

  const statusVariant = (s: string) =>
    s === "confirmed" ? "success" : s === "cancelled" ? "error" : s === "completed" ? "gold" : "default";

  return (
    <VendorShell title="Bookings">
      <div className="space-y-4">
        {bookings.map((b) => (
          <LuxCard key={b.id}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-display text-lg text-[var(--color-ivory)]">{b.client}</h3>
                  <LuxBadge variant={statusVariant(b.status)}>{b.status}</LuxBadge>
                </div>
                <p className="mt-1 text-sm text-[var(--color-smoke)]">
                  {b.event} &middot; {b.date} &middot; {b.guests} guests
                </p>
                <p className="text-xs text-[var(--color-smoke)]">
                  Package: {b.package} &middot; Budget: {b.budget}
                </p>
              </div>
              <div className="flex gap-2">
                {b.status === "pending" && (
                  <>
                    <LuxButton size="sm" onClick={() => updateStatus(b.id, "confirmed")}>Accept</LuxButton>
                    <LuxButton size="sm" variant="ghost" onClick={() => { setSelectedBooking(b); }}>Decline</LuxButton>
                  </>
                )}
              </div>
            </div>
          </LuxCard>
        ))}
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-obsidian)]/80 backdrop-blur-sm p-4" onClick={() => setSelectedBooking(null)}>
          <div className="w-full max-w-md rounded-lg border border-[var(--color-border)] bg-[var(--color-obsidian-2)] p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-2xl text-[var(--color-ivory)]">Decline Booking</h3>
            <GoldLine className="my-4" />
            <p className="text-sm text-[var(--color-smoke)]">
              This will cancel the booking request from <strong className="text-[var(--color-ivory)]">{selectedBooking.client}</strong>. The client will be notified.
            </p>
            <div className="mt-6 flex gap-3">
              <LuxButton variant="ghost" onClick={() => updateStatus(selectedBooking.id, "cancelled")} className="flex-1">Confirm Decline</LuxButton>
              <LuxButton variant="ghost" onClick={() => setSelectedBooking(null)}>Cancel</LuxButton>
            </div>
          </div>
        </div>
      )}
    </VendorShell>
  );
}
