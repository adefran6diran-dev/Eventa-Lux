export type Booking = {
  id: string;
  vendor_id: string;
  vendor_name: string;
  vendor_category: string;
  package_name: string;
  package_price: number;
  event_title: string;
  event_date: string;
  notes: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
};

const STORAGE_KEY = "eventa_bookings";
const UPDATE_EVENT = "eventa-bookings-update";

let cached: Booking[] | null = null;
let cachedRaw = "";

export function getBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? "[]";
    if (raw === cachedRaw && cached) return cached;
    cachedRaw = raw;
    cached = JSON.parse(raw);
    return cached!;
  } catch {
    return [];
  }
}

function persist(bookings: Booking[]) {
  const raw = JSON.stringify(bookings);
  localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cached = bookings;
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
}

export function addBooking(booking: Omit<Booking, "id" | "status" | "created_at">): Booking {
  const newBooking: Booking = {
    ...booking,
    id: `b_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  const bookings = getBookings();
  bookings.push(newBooking);
  persist(bookings);
  return newBooking;
}

export function updateBookingStatus(id: string, status: Booking["status"]) {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx !== -1) {
    bookings[idx].status = status;
    persist(bookings);
  }
}

export function updateBooking(
  id: string,
  updates: Partial<Pick<Booking, "event_title" | "event_date" | "notes" | "package_name" | "package_price">>
) {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx !== -1) {
    Object.assign(bookings[idx], updates);
    persist(bookings);
  }
}

export function deleteBooking(id: string) {
  const bookings = getBookings();
  const filtered = bookings.filter((b) => b.id !== id);
  persist(filtered);
}

export function subscribeToBookings(cb: () => void): () => void {
  window.addEventListener("storage", cb);
  window.addEventListener(UPDATE_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(UPDATE_EVENT, cb);
  };
}
