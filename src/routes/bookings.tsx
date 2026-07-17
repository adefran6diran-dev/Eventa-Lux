import { createFileRoute } from "@tanstack/react-router";
import { useState, useSyncExternalStore } from "react";
import { LuxCard } from "../components/eventa/LuxCard";
import { LuxButton } from "../components/eventa/LuxButton";
import { LuxInput } from "../components/eventa/LuxInput";
import { LuxBadge } from "../components/eventa/LuxBadge";
import { GoldLine } from "../components/eventa/GoldLine";
import {
  getBookings,
  subscribeToBookings,
  updateBooking,
  deleteBooking,
  updateBookingStatus,
  type Booking,
} from "../lib/booking-store";

export const Route = createFileRoute("/bookings")({
  component: BookingsPage,
});

function useBookings() {
  return useSyncExternalStore(subscribeToBookings, getBookings, getBookings);
}

const mockMessages: Record<string, { id: string; sender: string; content: string; created_at: string }[]> = {
  "b1": [
    { id: "m1", sender: "Vendor", content: "Hello! We're excited to work with you. Please let us know your preferred menu.", created_at: "2026-06-21T09:00:00Z" },
    { id: "m2", sender: "You", content: "We'd love the Grand Buffet package. Can we discuss dietary options?", created_at: "2026-06-21T10:30:00Z" },
  ],
};

type EditForm = {
  event_title: string;
  event_date: string;
  notes: string;
};

function BookingsPage() {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ event_title: "", event_date: "", notes: "" });
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);
  const bookings = useBookings();

  const statusVariant = (s: Booking["status"]) =>
    s === "confirmed" ? "success"
    : s === "cancelled" ? "error"
    : s === "completed" ? "gold"
    : "default";

  const messages = activeChat ? mockMessages[activeChat] ?? [] : [];

  const openEdit = (b: Booking) => {
    setEditId(b.id);
    setEditForm({
      event_title: b.event_title,
      event_date: b.event_date,
      notes: b.notes,
    });
  };

  const handleEditSave = () => {
    if (!editId) return;
    updateBooking(editId, editForm);
    setEditId(null);
  };

  const handleCancel = (id: string) => {
    deleteBooking(id);
    setConfirmCancel(null);
    if (activeChat === id) setActiveChat(null);
  };

  const handleStatusChange = (id: string, status: Booking["status"]) => {
    updateBookingStatus(id, status);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10">
        <span className="label-eyebrow">Dashboard</span>
        <h1 className="font-display mt-2 text-4xl">
          My <span className="gold-accent">Bookings</span>
        </h1>
        <GoldLine className="mt-4" />
      </div>

      {bookings.length === 0 ? (
        <div className="py-20 text-center">
          <span className="text-4xl">&#128197;</span>
          <p className="mt-4 text-[var(--color-smoke)]">
            No bookings yet. Browse vendors to book your first service.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            {bookings.map((b) => (
              <LuxCard
                key={b.id}
                hover
                className={`transition-all ${activeChat === b.id ? "border-[var(--color-gold)]" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 cursor-pointer" onClick={() => setActiveChat(b.id)}>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg text-[var(--color-ivory)]">
                        {b.vendor_name}
                      </h3>
                      <LuxBadge variant={statusVariant(b.status)}>
                        {b.status}
                      </LuxBadge>
                    </div>
                    <p className="mt-1 text-sm text-[var(--color-smoke)]">
                      {b.package_name} &middot; &#x20A6;{b.package_price.toLocaleString()}
                    </p>
                    {b.event_date && (
                      <p className="text-xs text-[var(--color-smoke)]">
                        Event: {new Date(b.event_date).toLocaleDateString()}
                      </p>
                    )}
                    {b.notes && (
                      <p className="mt-1 text-xs italic text-[var(--color-smoke)]">
                        "{b.notes}"
                      </p>
                    )}
                    <p className="text-xs text-[var(--color-smoke)]">
                      Booked {new Date(b.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-col items-end gap-2">
                    <span className="label-eyebrow">{b.vendor_category}</span>
                    <div className="flex gap-2">
                      <LuxButton size="sm" onClick={() => openEdit(b)}>
                        Edit
                      </LuxButton>
                      {b.status !== "cancelled" && (
                        <LuxButton size="sm" variant="ghost" onClick={() => setConfirmCancel(b.id)}>
                          Cancel
                        </LuxButton>
                      )}
                    </div>
                  </div>
                </div>
              </LuxCard>
            ))}
          </div>

          <div className="md:col-span-1">
            {activeChat ? (
              <LuxCard className="flex h-full flex-col">
                <h4 className="label-eyebrow mb-3">Messages</h4>
                <GoldLine className="mb-4" />

                {messages.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-[var(--color-smoke)]">
                      No messages yet for this booking.
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px]">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`rounded-md p-3 ${
                          msg.sender === "You"
                            ? "bg-[var(--color-gold)]/10 ml-4"
                            : "bg-[var(--color-obsidian)] mr-4"
                        }`}
                      >
                        <p className="text-xs font-medium text-[var(--color-gold)]">
                          {msg.sender}
                        </p>
                        <p className="mt-1 text-sm text-[var(--color-ivory)]">
                          {msg.content}
                        </p>
                        <p className="mt-1 text-[10px] text-[var(--color-smoke)]">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-obsidian)] px-3 py-2 text-xs text-[var(--color-ivory)] placeholder:text-[var(--color-smoke)]"
                  />
                  <LuxButton size="sm">Send</LuxButton>
                </div>
              </LuxCard>
            ) : (
              <LuxCard>
                <div className="py-8 text-center">
                  <p className="text-sm text-[var(--color-smoke)]">
                    Select a booking to view messages
                  </p>
                </div>
              </LuxCard>
            )}
          </div>
        </div>
      )}

      {editId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <LuxCard className="w-full max-w-md">
            <h3 className="font-display text-xl text-[var(--color-ivory)] mb-6">
              Edit Booking
            </h3>
            <div className="space-y-4">
              <LuxInput
                label="Event Title"
                value={editForm.event_title}
                onChange={(e) => setEditForm({ ...editForm, event_title: e.target.value })}
              />
              <LuxInput
                label="Event Date"
                type="date"
                value={editForm.event_date}
                onChange={(e) => setEditForm({ ...editForm, event_date: e.target.value })}
              />
              <div className="space-y-1.5">
                <span className="label-eyebrow">Notes</span>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-obsidian)] px-4 py-2.5 text-sm text-[var(--color-ivory)] placeholder:text-[var(--color-smoke)] resize-y min-h-[80px]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <LuxButton variant="ghost" onClick={() => setEditId(null)}>
                  Cancel
                </LuxButton>
                <LuxButton onClick={handleEditSave}>
                  Save Changes
                </LuxButton>
              </div>
            </div>
          </LuxCard>
        </div>
      )}

      {confirmCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <LuxCard className="w-full max-w-sm text-center">
            <h3 className="font-display text-xl text-[var(--color-ivory)] mb-4">
              Cancel Booking?
            </h3>
            <p className="text-sm text-[var(--color-smoke)] mb-6">
              This will permanently remove this booking.
            </p>
            <div className="flex justify-center gap-3">
              <LuxButton variant="ghost" onClick={() => setConfirmCancel(null)}>
                Keep It
              </LuxButton>
              <LuxButton onClick={() => handleCancel(confirmCancel)}>
                Yes, Cancel
              </LuxButton>
            </div>
          </LuxCard>
        </div>
      )}
    </div>
  );
}
