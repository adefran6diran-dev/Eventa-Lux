import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useSyncExternalStore } from "react";
import { LuxCard } from "../../components/eventa/LuxCard";
import { LuxButton } from "../../components/eventa/LuxButton";
import { LuxInput } from "../../components/eventa/LuxInput";
import { GoldLine } from "../../components/eventa/GoldLine";
import { getBookings } from "../../lib/booking-store";

const EVENTS_KEY = "eventa_events";
const EVENTS_UPDATE = "eventa-events-update";

type Event = {
  id: string;
  title: string;
  event_type: string;
  event_date: string;
  guest_count: number;
  budget: number;
  location: string;
  notes: string;
  created_at: string;
};

let eventsCached: Event[] | null = null;
let eventsRaw = "";

function getEvents(): Event[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY) ?? "[]";
    if (raw === eventsRaw && eventsCached) return eventsCached;
    eventsRaw = raw;
    eventsCached = JSON.parse(raw);
    return eventsCached!;
  } catch {
    return [];
  }
}

function saveEvent(event: Omit<Event, "id" | "created_at">): Event {
  const newEvent: Event = {
    ...event,
    id: `e_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    created_at: new Date().toISOString(),
  };
  const events = getEvents();
  events.push(newEvent);
  persistEvents(events);
  return newEvent;
}

function updateEvent(id: string, updates: Partial<Event>) {
  const events = getEvents();
  const idx = events.findIndex((e) => e.id === id);
  if (idx !== -1) {
    Object.assign(events[idx], updates);
    persistEvents(events);
  }
}

function deleteEvent(id: string) {
  const events = getEvents().filter((e) => e.id !== id);
  persistEvents(events);
}

function persistEvents(events: Event[]) {
  const raw = JSON.stringify(events);
  localStorage.setItem(EVENTS_KEY, raw);
  eventsRaw = raw;
  eventsCached = events;
  window.dispatchEvent(new CustomEvent(EVENTS_UPDATE));
}

function subscribeToEvents(cb: () => void): () => void {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENTS_UPDATE, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENTS_UPDATE, cb);
  };
}

function useEvents() {
  return useSyncExternalStore(subscribeToEvents, getEvents, getEvents);
}

export const Route = createFileRoute("/events/")({
  component: EventsPage,
});

function EventsPage() {
  const events = useEvents();
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    event_type: "",
    event_date: "",
    guest_count: "",
    budget: "",
    location: "",
    notes: "",
  });

  const bookings = getBookings();

  const resetForm = () => {
    setForm({ title: "", event_type: "", event_date: "", guest_count: "", budget: "", location: "", notes: "" });
    setEditingId(null);
    setShowCreate(false);
  };

  const openEdit = (ev: Event) => {
    setForm({
      title: ev.title,
      event_type: ev.event_type,
      event_date: ev.event_date,
      guest_count: String(ev.guest_count),
      budget: String(ev.budget),
      location: ev.location,
      notes: ev.notes,
    });
    setEditingId(ev.id);
    setShowCreate(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: form.title,
      event_type: form.event_type,
      event_date: form.event_date,
      guest_count: parseInt(form.guest_count) || 0,
      budget: parseInt(form.budget) || 0,
      location: form.location,
      notes: form.notes,
    };
    if (editingId) {
      updateEvent(editingId, data);
    } else {
      saveEvent(data);
    }
    resetForm();
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteEvent(deleteId);
      setDeleteId(null);
    }
  };

  const allEvents = events.length > 0 || bookings.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <span className="label-eyebrow">Dashboard</span>
          <h1 className="font-display mt-2 text-4xl">
            My <span className="gold-accent">Events</span>
          </h1>
        </div>
        <LuxButton onClick={() => { resetForm(); setShowCreate(!showCreate); }}>
          {showCreate ? "Cancel" : "New Event"}
        </LuxButton>
      </div>

      <GoldLine className="mb-10" />

      {showCreate && (
        <LuxCard className="mb-10">
          <h3 className="font-display text-xl text-[var(--color-ivory)] mb-6">
            {editingId ? "Edit Event" : "Create Event"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <LuxInput
              label="Event Title"
              placeholder="e.g. Wedding Reception"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <span className="label-eyebrow">Type</span>
                <select
                  value={form.event_type}
                  onChange={(e) => setForm({ ...form, event_type: e.target.value })}
                  required
                  className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-obsidian)] px-4 py-2.5 text-sm text-[var(--color-ivory)]"
                >
                  <option value="">Select type</option>
                  <option value="wedding">Wedding</option>
                  <option value="birthday">Birthday</option>
                  <option value="corporate">Corporate</option>
                  <option value="private_dinner">Private Dinner</option>
                  <option value="gal_awards">Gala / Awards</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <LuxInput
                label="Event Date"
                type="date"
                value={form.event_date}
                onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <LuxInput
                label="Guest Count"
                type="number"
                placeholder="e.g. 100"
                value={form.guest_count}
                onChange={(e) => setForm({ ...form, guest_count: e.target.value })}
                required
              />
              <LuxInput
                label="Budget (₦)"
                type="number"
                placeholder="e.g. 5000000"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                required
              />
            </div>
            <LuxInput
              label="Location"
              placeholder="City, State"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <div className="space-y-1.5">
              <span className="label-eyebrow">Notes</span>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any special requirements..."
                className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-obsidian)] px-4 py-2.5 text-sm text-[var(--color-ivory)] placeholder:text-[var(--color-smoke)] resize-y min-h-[80px]"
              />
            </div>
            <LuxButton type="submit">{editingId ? "Save Changes" : "Create Event"}</LuxButton>
          </form>
        </LuxCard>
      )}

      {!allEvents ? (
        <div className="py-20 text-center">
          <span className="text-4xl">&#127881;</span>
          <p className="mt-4 text-[var(--color-smoke)]">
            You haven't created any events yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.length > 0 && (
            <div>
              <h3 className="label-eyebrow mb-3">Vendor Bookings</h3>
              <div className="space-y-3">
                {bookings.map((b) => (
                  <Link key={b.id} to="/bookings" className="block">
                    <LuxCard hover>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-display text-lg text-[var(--color-ivory)]">
                            {b.vendor_name}
                          </h3>
                          <p className="text-xs text-[var(--color-smoke)]">
                            {b.package_name} &middot; {b.event_date || "Date TBD"}
                          </p>
                        </div>
                        <span className={`text-xs uppercase tracking-wider ${
                          b.status === "confirmed" ? "text-emerald-400" :
                          b.status === "cancelled" ? "text-[var(--color-error)]" :
                          "text-[var(--color-gold)]"
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    </LuxCard>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {events.length > 0 && (
            <div>
              <h3 className="label-eyebrow mb-3">My Events</h3>
              <div className="space-y-3">
                {events.map((ev) => (
                  <LuxCard key={ev.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display text-lg text-[var(--color-ivory)]">
                          {ev.title}
                        </h3>
                        <p className="text-xs text-[var(--color-smoke)]">
                          {new Date(ev.event_date).toLocaleDateString()} &middot;{" "}
                          {ev.guest_count} guests &middot; &#x20A6;
                          {ev.budget.toLocaleString()}
                        </p>
                        {ev.location && (
                          <p className="text-xs text-[var(--color-smoke)]">
                            {ev.location}
                          </p>
                        )}
                        {ev.notes && (
                          <p className="mt-1 text-xs italic text-[var(--color-smoke)]">
                            "{ev.notes}"
                          </p>
                        )}
                      </div>
                      <div className="ml-4 flex flex-col items-end gap-2">
                        <span className="label-eyebrow">{ev.event_type.replace("_", " ")}</span>
                        <div className="flex gap-2">
                          <LuxButton size="sm" onClick={() => openEdit(ev)}>
                            Edit
                          </LuxButton>
                          <LuxButton size="sm" variant="ghost" onClick={() => setDeleteId(ev.id)}>
                            Delete
                          </LuxButton>
                        </div>
                      </div>
                    </div>
                  </LuxCard>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <LuxCard className="w-full max-w-sm text-center">
            <h3 className="font-display text-xl text-[var(--color-ivory)] mb-4">
              Delete Event?
            </h3>
            <p className="text-sm text-[var(--color-smoke)] mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <LuxButton variant="ghost" onClick={() => setDeleteId(null)}>
                Keep It
              </LuxButton>
              <LuxButton onClick={handleDelete}>
                Yes, Delete
              </LuxButton>
            </div>
          </LuxCard>
        </div>
      )}
    </div>
  );
}
