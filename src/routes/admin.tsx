import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LuxCard } from "../components/eventa/LuxCard";
import { LuxButton } from "../components/eventa/LuxButton";
import { LuxInput } from "../components/eventa/LuxInput";
import { LuxBadge } from "../components/eventa/LuxBadge";
import { GoldLine } from "../components/eventa/GoldLine";
import { cn } from "../utils/cn";
import { getBookings, updateBookingStatus, type Booking } from "../lib/booking-store";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

const tabs = ["Overview", "Applications", "Vendors", "Clients", "Bookings", "Feedback", "Inbox"] as const;

type Tab = (typeof tabs)[number];

interface Application {
  id: string;
  business_name: string;
  category: string;
  email: string;
  phone: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

interface Vendor {
  id: string;
  business_name: string;
  category: string;
  email: string;
  phone: string;
  verified: boolean;
  status: "active" | "suspended";
  rating: number;
  total_bookings: number;
  joined: string;
}

interface Feedback {
  id: string;
  name: string;
  type: "praise" | "complaint" | "suggestion";
  message: string;
  created_at: string;
  is_read: boolean;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  total_bookings: number;
  joined: string;
}

interface AdminMessage {
  id: string;
  vendor_id: string;
  vendor_name: string;
  booking_id?: string;
  subject: string;
  content: string;
  direction: "to_vendor" | "from_vendor";
  created_at: string;
  is_read: boolean;
}

const initialApplications: Application[] = [
  { id: "a1", business_name: "Royal Tastes Catering", category: "catering", email: "info@royaltastes.ng", phone: "+234 802 345 6789", status: "pending", created_at: "2026-06-28T10:00:00Z" },
  { id: "a2", business_name: "Golden Lens Photography", category: "photography", email: "hello@goldenlens.com", phone: "+234 803 456 7890", status: "pending", created_at: "2026-06-30T14:30:00Z" },
  { id: "a3", business_name: "Ivy & Bloom Decor", category: "decoration", email: "contact@ivybloom.ng", phone: "+234 805 678 9012", status: "pending", created_at: "2026-07-01T09:15:00Z" },
  { id: "a4", business_name: "Melody Makers Band", category: "music", email: "bookings@melodymakers.com", phone: "+234 806 789 0123", status: "pending", created_at: "2026-07-02T11:00:00Z" },
];

const initialVendors: Vendor[] = [
  { id: "v1", business_name: "The Grand Hall", category: "venue", email: "events@grandhall.ng", phone: "+234 801 234 5678", verified: true, status: "active", rating: 4.8, total_bookings: 24, joined: "2026-01-15" },
  { id: "v2", business_name: "Delicious Affairs", category: "catering", email: "info@deliciousaffairs.com", phone: "+234 802 345 6789", verified: true, status: "active", rating: 4.6, total_bookings: 18, joined: "2026-02-01" },
  { id: "v3", business_name: "Crystal Events", category: "decoration", email: "hello@crystalevents.ng", phone: "+234 803 456 7890", verified: false, status: "active", rating: 4.3, total_bookings: 12, joined: "2026-03-10" },
  { id: "v4", business_name: "Prime Beats DJ", category: "music", email: "bookings@primebeats.com", phone: "+234 804 567 8901", verified: false, status: "suspended", rating: 3.9, total_bookings: 8, joined: "2026-04-05" },
];

const initialClients: Client[] = [
  { id: "c1", name: "Amara Okafor", email: "amara.o@example.com", phone: "+234 810 111 2222", total_bookings: 3, joined: "2026-03-15" },
  { id: "c2", name: "Tunde Adebayo", email: "tunde.a@example.com", phone: "+234 810 333 4444", total_bookings: 1, joined: "2026-05-20" },
  { id: "c3", name: "Chioma Eze", email: "chioma.e@example.com", phone: "+234 810 555 6666", total_bookings: 2, joined: "2026-04-10" },
  { id: "c4", name: "Emeka Nwosu", email: "emeka.n@example.com", phone: "+234 810 777 8888", total_bookings: 5, joined: "2026-02-01" },
];

const initialFeedback: Feedback[] = [
  { id: "f1", name: "Amara O.", type: "praise", message: "Exceptional platform! Found the perfect caterer for my daughter's wedding.", created_at: "2026-07-02T16:00:00Z", is_read: false },
  { id: "f2", name: "Tunde A.", type: "suggestion", message: "Would love to see more venue options in Abuja.", created_at: "2026-07-01T11:20:00Z", is_read: false },
  { id: "f3", name: "Chioma E.", type: "complaint", message: "A vendor cancelled last minute with no explanation.", created_at: "2026-06-28T09:00:00Z", is_read: true },
  { id: "f4", name: "Emeka N.", type: "praise", message: "The booking process was seamless. Highly recommend!", created_at: "2026-07-03T14:00:00Z", is_read: false },
];

const initialMessages: AdminMessage[] = [
  { id: "m1", vendor_id: "v1", vendor_name: "The Grand Hall", booking_id: "b1", subject: "Booking #b1 — Wedding Reception", content: "Can we confirm the date for the venue booking?", direction: "to_vendor", created_at: "2026-07-03T09:00:00Z", is_read: false },
  { id: "m2", vendor_id: "v2", vendor_name: "Delicious Affairs", booking_id: "b2", subject: "Menu options for corporate event", content: "The client has requested a vegan menu option. Do you offer this?", direction: "to_vendor", created_at: "2026-07-02T14:30:00Z", is_read: true },
  { id: "m3", vendor_id: "v3", vendor_name: "Crystal Events", subject: "Portfolio update", content: "We've added new decor photos to our portfolio. Please review.", direction: "from_vendor", created_at: "2026-07-04T11:00:00Z", is_read: false },
];

function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [applications, setApplications] = useState(initialApplications);
  const [vendors, setVendors] = useState(initialVendors);
  const [clients] = useState(initialClients);
  const [feedback, setFeedback] = useState(initialFeedback);
  const [messages, setMessages] = useState(initialMessages);
  const [confirmAction, setConfirmAction] = useState<{ type: string; id: string; label: string } | null>(null);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeContent, setComposeContent] = useState("");

  const bookings = getBookings();

  const activeBookings = bookings.filter((b) => b.status !== "cancelled").length;
  const pendingApps = applications.filter((a) => a.status === "pending").length;
  const unreadFeedback = feedback.filter((f) => !f.is_read).length;
  const unreadMessages = messages.filter((m) => !m.is_read).length;
  const activeVendors = vendors.filter((v) => v.status === "active").length;
  const totalNotifications = pendingApps + unreadFeedback + unreadMessages;

  const handleApproveApp = (id: string) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: "approved" as const } : a)));
    const app = applications.find((a) => a.id === id);
    if (app) {
      setVendors((prev) => [...prev, {
        id: `v${Date.now()}`,
        business_name: app.business_name,
        category: app.category,
        email: app.email,
        phone: app.phone,
        verified: false,
        status: "active" as const,
        rating: 0,
        total_bookings: 0,
        joined: new Date().toISOString().split("T")[0],
      }]);
    }
    setConfirmAction(null);
  };

  const handleRejectApp = (id: string) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: "rejected" as const } : a)));
    setConfirmAction(null);
  };

  const handleVerifyVendor = (id: string) => {
    setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, verified: !v.verified } : v)));
  };

  const handleToggleVendor = (id: string) => {
    setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, status: v.status === "active" ? "suspended" as const : "active" as const } : v)));
    setConfirmAction(null);
  };

  const handleRemoveVendor = (id: string) => {
    setVendors((prev) => prev.filter((v) => v.id !== id));
    setConfirmAction(null);
  };

  const handleMarkRead = (id: string) => {
    setFeedback((prev) => prev.map((f) => (f.id === id ? { ...f, is_read: true } : f)));
  };

  const handleSendMessage = () => {
    if (!composeTo || !composeSubject || !composeContent) return;
    const newMsg: AdminMessage = {
      id: `m${Date.now()}`,
      vendor_id: composeTo,
      vendor_name: vendors.find((v) => v.id === composeTo)?.business_name ?? "Unknown",
      subject: composeSubject,
      content: composeContent,
      direction: "to_vendor",
      created_at: new Date().toISOString(),
      is_read: false,
    };
    setMessages((prev) => [newMsg, ...prev]);
    setShowCompose(false);
    setComposeTo("");
    setComposeSubject("");
    setComposeContent("");
  };

  const handleBookingStatus = (id: string, status: Booking["status"]) => {
    updateBookingStatus(id, status);
  };

  const handleClientBookingStatus = (bookingId: string, vendorId: string, status: Booking["status"]) => {
    handleBookingStatus(bookingId, status);
    const msg: AdminMessage = {
      id: `m${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      vendor_id: vendorId,
      vendor_name: vendors.find((v) => v.id === vendorId)?.business_name ?? "Vendor",
      booking_id: bookingId,
      subject: `Booking ${status === "confirmed" ? "confirmed" : "status updated"}`,
      content: `Admin has ${status === "confirmed" ? "confirmed" : "updated"} booking ${bookingId}. Please ensure best service delivery.`,
      direction: "to_vendor",
      created_at: new Date().toISOString(),
      is_read: false,
    };
    setMessages((prev) => [msg, ...prev]);
  };

  const notificationItems = [
    ...applications.filter((a) => a.status === "pending").map((a) => ({ label: `New application: ${a.business_name}`, type: "application" as const, id: a.id, time: a.created_at })),
    ...feedback.filter((f) => !f.is_read).map((f) => ({ label: `Feedback from ${f.name}`, type: "feedback" as const, id: f.id, time: f.created_at })),
    ...messages.filter((m) => !m.is_read).map((m) => ({ label: `Message from ${m.vendor_name}`, type: "message" as const, id: m.id, time: m.created_at })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const statCards = [
    { label: "Pending Applications", value: String(pendingApps) },
    { label: "Active Vendors", value: String(activeVendors) },
    { label: "Active Bookings", value: String(activeBookings) },
    { label: "Unread Feedback", value: String(unreadFeedback) },
    { label: "Unread Messages", value: String(unreadMessages) },
  ];

  const filteredVendors = vendors.filter(
    (v) => !searchQuery || v.business_name.toLowerCase().includes(searchQuery.toLowerCase()) || v.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredClients = clients.filter(
    (c) => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBookings = bookings.filter(
    (b) => !searchQuery || b.vendor_name.toLowerCase().includes(searchQuery.toLowerCase()) || b.event_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <span className="label-eyebrow">Admin Panel</span>
          <h1 className="font-display mt-2 text-3xl">
            Eventa <span className="gold-accent">Command Center</span>
          </h1>
          <GoldLine className="mt-4" />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowNotificationPanel(!showNotificationPanel)}
            className="relative rounded-md border border-[var(--color-border)] bg-[var(--color-obsidian)] p-2.5 hover:border-[var(--color-gold)] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-ivory)]">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {totalNotifications > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--color-gold)] px-1 text-[10px] font-bold text-[var(--color-obsidian)]">
                {totalNotifications}
              </span>
            )}
          </button>

          {showNotificationPanel && (
            <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-[var(--color-border)] bg-[var(--color-obsidian-2)] p-4 shadow-2xl">
              <h3 className="label-eyebrow mb-3">Notifications</h3>
              {notificationItems.length === 0 ? (
                <p className="text-sm text-[var(--color-smoke)] text-center py-4">All caught up!</p>
              ) : (
                <div className="max-h-72 space-y-2 overflow-y-auto">
                  {notificationItems.map((item) => (
                    <div key={`${item.type}-${item.id}`} className="flex items-center gap-2 rounded-md bg-[var(--color-obsidian)] p-2.5 text-sm">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${item.type === "application" ? "bg-amber-400" : item.type === "feedback" ? "bg-emerald-400" : "bg-sky-400"}`} />
                      <p className="text-[var(--color-ivory)]">{item.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mb-10 grid gap-4 md:grid-cols-5">
        {statCards.map((stat) => (
          <LuxCard key={stat.label} className="text-center md:text-left">
            <p className="text-xs text-[var(--color-smoke)] uppercase tracking-[0.12em]">{stat.label}</p>
            <p className="font-display mt-1 text-2xl text-[var(--color-gold)]">{stat.value}</p>
          </LuxCard>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-obsidian)] p-1">
        {tabs.map((tab) => {
          const count = tab === "Applications" ? pendingApps : tab === "Feedback" ? unreadFeedback : tab === "Inbox" ? unreadMessages : 0;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative rounded-sm px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-all",
                activeTab === tab
                  ? "bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
                  : "text-[var(--color-smoke)] hover:text-[var(--color-gold)]",
              )}
            >
              {tab}
              {count > 0 && (
                <span className="ml-2 rounded-full bg-[var(--color-gold)] px-1.5 py-0.5 text-[10px] text-[var(--color-obsidian)]">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mb-6">
        <LuxInput
          placeholder={`Search ${activeTab.toLowerCase()}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {activeTab === "Overview" && (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <LuxCard>
              <h3 className="label-eyebrow mb-4">Recent Applications</h3>
              {applications.filter((a) => a.status === "pending").slice(0, 3).length === 0 ? (
                <p className="text-sm text-[var(--color-smoke)]">No pending applications.</p>
              ) : (
                <div className="space-y-3">
                  {applications.filter((a) => a.status === "pending").slice(0, 3).map((a) => (
                    <div key={a.id} className="flex items-center justify-between rounded-md bg-[var(--color-obsidian)] p-3">
                      <span className="text-sm text-[var(--color-ivory)]">{a.business_name}</span>
                      <LuxBadge variant="gold">{a.category}</LuxBadge>
                    </div>
                  ))}
                </div>
              )}
            </LuxCard>

            <LuxCard>
              <h3 className="label-eyebrow mb-4">Recent Feedback</h3>
              {feedback.filter((f) => !f.is_read).slice(0, 3).length === 0 ? (
                <p className="text-sm text-[var(--color-smoke)]">No unread feedback.</p>
              ) : (
                <div className="space-y-3">
                  {feedback.filter((f) => !f.is_read).slice(0, 3).map((f) => (
                    <div key={f.id} className="rounded-md bg-[var(--color-obsidian)] p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--color-ivory)]">{f.name}</span>
                        <LuxBadge variant={f.type === "praise" ? "success" : f.type === "complaint" ? "error" : "default"}>
                          {f.type}
                        </LuxBadge>
                      </div>
                      <p className="mt-1 text-xs text-[var(--color-smoke)] line-clamp-2">{f.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </LuxCard>

            <LuxCard>
              <h3 className="label-eyebrow mb-4">Active Bookings</h3>
              {activeBookings === 0 ? (
                <p className="text-sm text-[var(--color-smoke)]">No active bookings.</p>
              ) : (
                <div className="space-y-3">
                  {bookings.filter((b) => b.status !== "cancelled").slice(0, 3).map((b) => (
                    <div key={b.id} className="flex items-center justify-between rounded-md bg-[var(--color-obsidian)] p-3">
                      <div>
                        <p className="text-sm text-[var(--color-ivory)]">{b.event_title}</p>
                        <p className="text-xs text-[var(--color-smoke)]">{b.vendor_name}</p>
                      </div>
                      <LuxBadge variant={b.status === "confirmed" ? "success" : "default"}>{b.status}</LuxBadge>
                    </div>
                  ))}
                </div>
              )}
            </LuxCard>

            <LuxCard>
              <h3 className="label-eyebrow mb-4">Unread Messages</h3>
              {unreadMessages === 0 ? (
                <p className="text-sm text-[var(--color-smoke)]">No unread messages.</p>
              ) : (
                <div className="space-y-3">
                  {messages.filter((m) => !m.is_read).slice(0, 3).map((m) => (
                    <div key={m.id} className="rounded-md bg-[var(--color-obsidian)] p-3">
                      <p className="text-sm text-[var(--color-ivory)]">{m.vendor_name}</p>
                      <p className="text-xs text-[var(--color-smoke)] line-clamp-1">{m.subject}</p>
                    </div>
                  ))}
                </div>
              )}
            </LuxCard>
          </div>

          <LuxCard>
            <h3 className="label-eyebrow mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <LuxButton size="sm" onClick={() => setActiveTab("Applications")}>Review Applications ({pendingApps})</LuxButton>
              <LuxButton size="sm" onClick={() => setActiveTab("Feedback")}>View Feedback ({unreadFeedback})</LuxButton>
              <LuxButton size="sm" onClick={() => { setActiveTab("Inbox"); setShowCompose(true); }}>Message a Vendor</LuxButton>
              <LuxButton size="sm" onClick={() => setActiveTab("Bookings")}>Manage Bookings ({activeBookings})</LuxButton>
            </div>
          </LuxCard>
        </div>
      )}

      {activeTab === "Applications" && (
        <div className="space-y-4">
          {applications.filter((a) => !searchQuery || a.business_name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
            <p className="text-sm text-[var(--color-smoke)] py-8 text-center">No applications found.</p>
          ) : (
            applications.filter((a) => !searchQuery || a.business_name.toLowerCase().includes(searchQuery.toLowerCase())).map((app) => (
              <LuxCard key={app.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-display text-lg text-[var(--color-ivory)]">{app.business_name}</h3>
                      <LuxBadge variant="gold">{app.category}</LuxBadge>
                      {app.status === "pending" && <LuxBadge variant="default">pending</LuxBadge>}
                      {app.status === "approved" && <LuxBadge variant="success">approved</LuxBadge>}
                      {app.status === "rejected" && <LuxBadge variant="error">rejected</LuxBadge>}
                    </div>
                    <p className="mt-1 text-xs text-[var(--color-smoke)]">{app.email} &middot; {app.phone}</p>
                    <p className="text-xs text-[var(--color-smoke)]">Applied {new Date(app.created_at).toLocaleDateString()}</p>
                  </div>
                  {app.status === "pending" && (
                    <div className="flex gap-2">
                      <LuxButton size="sm" onClick={() => setConfirmAction({ type: "approve", id: app.id, label: app.business_name })}>Approve</LuxButton>
                      <LuxButton variant="ghost" size="sm" onClick={() => setConfirmAction({ type: "reject", id: app.id, label: app.business_name })}>Reject</LuxButton>
                    </div>
                  )}
                </div>
              </LuxCard>
            ))
          )}
        </div>
      )}

      {activeTab === "Vendors" && (
        <div className="space-y-4">
          {filteredVendors.length === 0 ? (
            <p className="text-sm text-[var(--color-smoke)] py-8 text-center">No vendors found.</p>
          ) : (
            filteredVendors.map((v) => (
              <LuxCard key={v.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-display text-lg text-[var(--color-ivory)]">{v.business_name}</h3>
                      <LuxBadge variant="gold">{v.category}</LuxBadge>
                      {v.verified ? <LuxBadge variant="success">verified</LuxBadge> : <LuxBadge variant="default">unverified</LuxBadge>}
                      {v.status === "suspended" && <LuxBadge variant="error">suspended</LuxBadge>}
                    </div>
                    <p className="mt-1 text-xs text-[var(--color-smoke)]">{v.email} &middot; {v.phone}</p>
                    <p className="text-xs text-[var(--color-smoke)]">&starf; {v.rating} &middot; {v.total_bookings} bookings &middot; Joined {v.joined}</p>
                  </div>
                  <div className="flex gap-2">
                    <LuxButton size="sm" variant={v.verified ? "ghost" : "solid"} onClick={() => handleVerifyVendor(v.id)}>
                      {v.verified ? "Unverify" : "Verify"}
                    </LuxButton>
                    {v.status === "active" ? (
                      <LuxButton size="sm" variant="ghost" onClick={() => setConfirmAction({ type: "suspend", id: v.id, label: v.business_name })}>
                        Suspend
                      </LuxButton>
                    ) : (
                      <LuxButton size="sm" variant="ghost" onClick={() => handleToggleVendor(v.id)}>
                        Reinstate
                      </LuxButton>
                    )}
                    <LuxButton size="sm" variant="ghost" onClick={() => setConfirmAction({ type: "remove", id: v.id, label: v.business_name })}>
                      Remove
                    </LuxButton>
                  </div>
                </div>
              </LuxCard>
            ))
          )}
        </div>
      )}

      {activeTab === "Clients" && (
        <div className="space-y-4">
          {filteredClients.length === 0 ? (
            <p className="text-sm text-[var(--color-smoke)] py-8 text-center">No clients found.</p>
          ) : (
            filteredClients.map((c) => {
              const clientBookings = bookings.filter((b) => b.event_title.toLowerCase().includes(c.name.split(" ")[0].toLowerCase()));
              return (
                <LuxCard key={c.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-display text-lg text-[var(--color-ivory)]">{c.name}</h3>
                        <LuxBadge variant="default">{c.total_bookings} bookings</LuxBadge>
                      </div>
                      <p className="mt-1 text-xs text-[var(--color-smoke)]">{c.email} &middot; {c.phone}</p>
                      <p className="text-xs text-[var(--color-smoke)]">Client since {c.joined}</p>
                      {clientBookings.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          {clientBookings.map((b) => (
                            <div key={b.id} className="flex items-center gap-2 rounded-md bg-[var(--color-obsidian)] px-3 py-1.5">
                              <span className="text-xs text-[var(--color-ivory)]">{b.event_title}</span>
                              <span className="text-[10px] text-[var(--color-smoke)]">&middot; {b.vendor_name}</span>
                              <LuxBadge variant={b.status === "confirmed" ? "success" : b.status === "cancelled" ? "error" : "default"}>
                                {b.status}
                              </LuxBadge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </LuxCard>
              );
            })
          )}
        </div>
      )}

      {activeTab === "Bookings" && (
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <p className="text-sm text-[var(--color-smoke)] py-8 text-center">No bookings found.</p>
          ) : (
            filteredBookings.map((b) => (
              <LuxCard key={b.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-display text-lg text-[var(--color-ivory)]">{b.event_title}</h3>
                      <LuxBadge variant={b.status === "confirmed" ? "success" : b.status === "cancelled" ? "error" : "default"}>
                        {b.status}
                      </LuxBadge>
                    </div>
                    <p className="mt-1 text-sm text-[var(--color-smoke)]">{b.vendor_name} &middot; {b.package_name}</p>
                    <p className="text-xs text-[var(--color-smoke)]">
                      &#x20A6;{b.package_price.toLocaleString()} &middot; {b.event_date ? new Date(b.event_date).toLocaleDateString() : "Date TBD"}
                    </p>
                    {b.notes && <p className="mt-1 text-xs italic text-[var(--color-smoke)]">"{b.notes}"</p>}
                  </div>
                  <div className="ml-4 flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      {b.status === "pending" && (
                        <LuxButton size="sm" onClick={() => handleClientBookingStatus(b.id, b.vendor_id, "confirmed")}>
                          Confirm
                        </LuxButton>
                      )}
                      {b.status !== "cancelled" && (
                        <LuxButton size="sm" variant="ghost" onClick={() => handleBookingStatus(b.id, "cancelled")}>
                          Cancel
                        </LuxButton>
                      )}
                      {b.status === "confirmed" && (
                        <LuxButton size="sm" variant="ghost" onClick={() => handleBookingStatus(b.id, "completed")}>
                          Complete
                        </LuxButton>
                      )}
                    </div>
                    <LuxButton
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedVendor(b.vendor_id);
                        setShowCompose(true);
                        setComposeTo(b.vendor_id);
                        setComposeSubject(`Booking ${b.id} — ${b.event_title}`);
                      }}
                    >
                      Message Vendor
                    </LuxButton>
                  </div>
                </div>
              </LuxCard>
            ))
          )}
        </div>
      )}

      {activeTab === "Feedback" && (
        <div className="space-y-4">
          {feedback.filter((f) => !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.message.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
            <p className="text-sm text-[var(--color-smoke)] py-8 text-center">No feedback found.</p>
          ) : (
            feedback.filter((f) => !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.message.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
              <LuxCard key={item.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-[var(--color-ivory)]">{item.name}</h3>
                      <LuxBadge variant={item.type === "praise" ? "success" : item.type === "complaint" ? "error" : "default"}>
                        {item.type}
                      </LuxBadge>
                      {!item.is_read && <span className="h-2 w-2 rounded-full bg-[var(--color-gold)]" />}
                    </div>
                    <p className="mt-2 text-sm text-[var(--color-smoke)]">{item.message}</p>
                    <p className="mt-2 text-xs text-[var(--color-smoke)]">{new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                  {!item.is_read && (
                    <LuxButton size="sm" variant="ghost" onClick={() => handleMarkRead(item.id)}>Mark Read</LuxButton>
                  )}
                </div>
              </LuxCard>
            ))
          )}
        </div>
      )}

      {activeTab === "Inbox" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[var(--color-smoke)]">{unreadMessages} unread of {messages.length} messages</p>
            <LuxButton size="sm" onClick={() => setShowCompose(true)}>Compose Message</LuxButton>
          </div>
          {messages.length === 0 ? (
            <p className="text-sm text-[var(--color-smoke)] py-8 text-center">No messages.</p>
          ) : (
            messages.map((m) => (
              <LuxCard key={m.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-base text-[var(--color-ivory)]">{m.vendor_name}</h3>
                      {!m.is_read && <span className="h-2 w-2 rounded-full bg-[var(--color-gold)]" />}
                      <LuxBadge variant={m.direction === "to_vendor" ? "default" : "gold"}>
                        {m.direction === "to_vendor" ? "sent" : "received"}
                      </LuxBadge>
                      {m.booking_id && <LuxBadge variant="gold">booking #{m.booking_id.slice(0, 6)}</LuxBadge>}
                    </div>
                    <p className="mt-1 text-sm font-medium text-[var(--color-ivory)]">{m.subject}</p>
                    <p className="mt-1 text-sm text-[var(--color-smoke)]">{m.content}</p>
                    <p className="mt-1 text-xs text-[var(--color-smoke)]">{new Date(m.created_at).toLocaleString()}</p>
                  </div>
                  <div className="ml-4 flex gap-2">
                    {!m.is_read && (
                      <LuxButton size="sm" variant="ghost" onClick={() => setMessages((prev) => prev.map((msg) => msg.id === m.id ? { ...msg, is_read: true } : msg))}>
                        Mark Read
                      </LuxButton>
                    )}
                    <LuxButton size="sm" variant="ghost" onClick={() => { setComposeTo(m.vendor_id); setComposeSubject(`Re: ${m.subject}`); setShowCompose(true); }}>
                      Reply
                    </LuxButton>
                  </div>
                </div>
              </LuxCard>
            ))
          )}
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-obsidian)]/80 backdrop-blur-sm p-4" onClick={() => setConfirmAction(null)}>
          <div className="w-full max-w-md rounded-lg border border-[var(--color-border)] bg-[var(--color-obsidian-2)] p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-2xl text-[var(--color-ivory)]">
              {confirmAction.type === "reject" ? "Reject Application" : confirmAction.type === "suspend" ? "Suspend Vendor" : confirmAction.type === "remove" ? "Remove Vendor" : "Confirm Approval"}
            </h3>
            <GoldLine className="my-4" />
            <p className="text-sm text-[var(--color-smoke)]">
              {confirmAction.type === "remove"
                ? "This will permanently remove this vendor. This action cannot be undone."
                : `Are you sure you want to ${confirmAction.type} "${confirmAction.label}"?`}
            </p>
            <div className="mt-6 flex gap-3">
              {confirmAction.type === "reject" ? (
                <LuxButton onClick={() => handleRejectApp(confirmAction.id)} className="flex-1">Confirm Reject</LuxButton>
              ) : confirmAction.type === "suspend" ? (
                <LuxButton onClick={() => handleToggleVendor(confirmAction.id)} className="flex-1">Confirm Suspend</LuxButton>
              ) : confirmAction.type === "remove" ? (
                <LuxButton onClick={() => handleRemoveVendor(confirmAction.id)} className="flex-1">Remove Vendor</LuxButton>
              ) : (
                <LuxButton onClick={() => handleApproveApp(confirmAction.id)} className="flex-1">Confirm Approval</LuxButton>
              )}
              <LuxButton variant="ghost" onClick={() => setConfirmAction(null)}>Cancel</LuxButton>
            </div>
          </div>
        </div>
      )}

      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-obsidian)]/80 backdrop-blur-sm p-4" onClick={() => setShowCompose(false)}>
          <div className="w-full max-w-lg rounded-lg border border-[var(--color-border)] bg-[var(--color-obsidian-2)] p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-2xl text-[var(--color-ivory)]">Compose Message</h3>
            <GoldLine className="my-4" />
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="label-eyebrow">To</span>
                <select
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-obsidian)] px-4 py-2.5 text-sm text-[var(--color-ivory)]"
                >
                  <option value="">Select vendor</option>
                  {vendors.filter((v) => v.status === "active").map((v) => (
                    <option key={v.id} value={v.id}>{v.business_name}</option>
                  ))}
                </select>
              </div>
              <LuxInput
                label="Subject"
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                placeholder="Message subject"
              />
              <div className="space-y-1.5">
                <span className="label-eyebrow">Message</span>
                <textarea
                  value={composeContent}
                  onChange={(e) => setComposeContent(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-obsidian)] px-4 py-2.5 text-sm text-[var(--color-ivory)] placeholder:text-[var(--color-smoke)] resize-y min-h-[120px]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <LuxButton variant="ghost" onClick={() => setShowCompose(false)}>Cancel</LuxButton>
                <LuxButton onClick={handleSendMessage} disabled={!composeTo || !composeSubject || !composeContent}>Send Message</LuxButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
