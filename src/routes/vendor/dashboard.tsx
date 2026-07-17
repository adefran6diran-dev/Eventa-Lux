import { createFileRoute } from "@tanstack/react-router";
import { useRequiredAuth } from "../../lib/use-auth";
import { VendorShell } from "../../components/eventa/VendorShell";
import { LuxCard } from "../../components/eventa/LuxCard";

export const Route = createFileRoute("/vendor/dashboard")({
  component: VendorDashboardPage,
});

const mockStats = [
  { label: "Total Bookings", value: "24" },
  { label: "Pending Requests", value: "3" },
  { label: "Active Clients", value: "18" },
  { label: "Revenue (₦)", value: "12.4M" },
];

const mockRecentBookings = [
  { id: "b1", client: "Amara O.", event: "Wedding Reception", date: "2026-08-15", status: "confirmed", amount: "₦5,000,000" },
  { id: "b2", client: "Tunde A.", event: "Corporate Gala", date: "2026-09-01", status: "pending", amount: "₦2,500,000" },
  { id: "b3", client: "Zainab K.", event: "Birthday", date: "2026-07-20", status: "completed", amount: "₦1,200,000" },
];

function VendorDashboardPage() {
  const { user } = useRequiredAuth("vendor");

  return (
    <VendorShell title="Dashboard">
      <div className="mb-10 grid gap-4 md:grid-cols-4">
        {mockStats.map((s) => (
          <LuxCard key={s.label}>
            <p className="text-xs text-[var(--color-smoke)] uppercase tracking-[0.12em]">{s.label}</p>
            <p className="font-display mt-1 text-2xl text-[var(--color-gold)]">{s.value}</p>
          </LuxCard>
        ))}
      </div>

      <LuxCard>
        <h3 className="font-display text-lg text-[var(--color-ivory)] mb-4">Recent Bookings</h3>
        <div className="space-y-3">
          {mockRecentBookings.map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-md border border-[var(--color-border)] p-3">
              <div>
                <p className="text-sm font-medium text-[var(--color-ivory)]">{b.client}</p>
                <p className="text-xs text-[var(--color-smoke)]">{b.event} &middot; {b.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[var(--color-gold)]">{b.amount}</p>
                <span className={`text-xs ${b.status === "confirmed" ? "text-emerald-400" : b.status === "pending" ? "text-[var(--color-gold)]" : "text-[var(--color-smoke)]"}`}>
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </LuxCard>
    </VendorShell>
  );
}
