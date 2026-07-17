import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { mockVendors, type MockVendor } from "../lib/mock-vendors";
import { LuxCard } from "../components/eventa/LuxCard";
import { LuxButton } from "../components/eventa/LuxButton";
import { LuxBadge } from "../components/eventa/LuxBadge";
import { DiamondRating } from "../components/eventa/DiamondRating";
import { CategoryIcon } from "../components/eventa/CategoryIcon";
import { GoldLine } from "../components/eventa/GoldLine";
import { cn } from "../utils/cn";
import { addBooking } from "../lib/booking-store";

export const Route = createFileRoute("/vendors")({
  component: VendorsPage,
});

const categories = [
  "All",
  "venue",
  "catering",
  "photography",
  "decoration",
  "music",
  "makeup",
];

function VendorsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedVendor, setSelectedVendor] = useState<MockVendor | null>(null);
  const [bookingStep, setBookingStep] = useState<"details" | "confirm">("details");
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [eventDate, setEventDate] = useState("");
  const [notes, setNotes] = useState("");

  const filtered = mockVendors.filter((v) => {
    const matchCategory =
      selectedCategory === "All" || v.category === selectedCategory;
    const matchSearch =
      !search ||
      v.business_name.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBook = () => {
    if (!selectedVendor) return;
    const pkg = selectedVendor.packages[selectedPackage];
    if (!pkg) return;

    addBooking({
      vendor_id: selectedVendor.id,
      vendor_name: selectedVendor.business_name,
      vendor_category: selectedVendor.category,
      package_name: pkg.name,
      package_price: pkg.price,
      event_title: `${pkg.name} - ${selectedVendor.business_name}`,
      event_date: eventDate,
      notes,
    });

    setBookingStep("confirm");
  };

  const resetModal = () => {
    setSelectedVendor(null);
    setBookingStep("details");
    setSelectedPackage(0);
    setEventDate("");
    setNotes("");
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <span className="label-eyebrow">Directory</span>
        <h1 className="font-display mt-2 text-4xl">
          Find Your <span className="gold-accent">Perfect</span> Vendor
        </h1>
        <GoldLine className="mx-auto mt-4 w-24" />
      </div>

      {/* Filters */}
      <div className="mb-10 space-y-4">
        <input
          type="text"
          placeholder="Search vendors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-obsidian)] px-4 py-3 text-sm text-[var(--color-ivory)] placeholder:text-[var(--color-smoke)] focus:border-[var(--color-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold)]"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-[0.12em] transition-all",
                selectedCategory === cat
                  ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
                  : "border-[var(--color-border)] text-[var(--color-smoke)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]",
              )}
            >
              {cat === "All" ? "All" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((vendor) => (
          <LuxCard key={vendor.id} hover className="group relative flex flex-col">
            {/* Favorite */}
            <button
              onClick={() => toggleFavorite(vendor.id)}
              className="absolute right-4 top-4 z-10 text-lg transition-transform hover:scale-110"
              aria-label={favorites.has(vendor.id) ? "Remove from favorites" : "Add to favorites"}
            >
              {favorites.has(vendor.id) ? (
                <span className="text-[var(--color-gold)]">&#9829;</span>
              ) : (
                <span className="text-[var(--color-smoke)]">&#9829;</span>
              )}
            </button>

            {/* Photo */}
            <div className="relative mb-4 h-48 overflow-hidden rounded-md">
              <img
                src={vendor.photos[0]}
                alt={vendor.business_name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {vendor.is_verified && (
                <span className="absolute right-2 top-2 rounded-full bg-[var(--color-gold)] px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--color-obsidian)]">
                  Verified
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <CategoryIcon category={vendor.category} />
                  <div>
                    <h3 className="font-display text-lg text-[var(--color-ivory)]">
                      {vendor.business_name}
                    </h3>
                    <p className="text-xs text-[var(--color-smoke)]">{vendor.location}</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-smoke)] line-clamp-2">
              {vendor.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DiamondRating rating={vendor.rating} />
                <span className="text-xs text-[var(--color-smoke)]">
                  ({vendor.review_count})
                </span>
              </div>
              <LuxBadge variant="gold">{vendor.category}</LuxBadge>
            </div>

            <GoldLine className="my-4" />

            <LuxButton
              onClick={() => {
                setSelectedVendor(vendor);
                setBookingStep("details");
                setSelectedPackage(0);
                setEventDate("");
                setNotes("");
              }}
              className="w-full"
            >
              Book Now
            </LuxButton>
          </LuxCard>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-[var(--color-smoke)]">No vendors found matching your criteria.</p>
        </div>
      )}

      {/* Booking Modal */}
      {selectedVendor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-obsidian)]/80 backdrop-blur-sm p-4"
          onClick={resetModal}
        >
          <div
            className="w-full max-w-lg rounded-lg border border-[var(--color-border)] bg-[var(--color-obsidian-2)] p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {bookingStep === "details" ? (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-2xl text-[var(--color-ivory)]">
                      {selectedVendor.business_name}
                    </h3>
                    <p className="text-sm text-[var(--color-smoke)]">{selectedVendor.location}</p>
                  </div>
                  <button
                    onClick={resetModal}
                    className="text-[var(--color-smoke)] hover:text-[var(--color-ivory)]"
                  >
                    &#10005;
                  </button>
                </div>

                <GoldLine className="mb-6" />

                <div className="space-y-4">
                  <div>
                    <label className="label-eyebrow block mb-1">Select Package</label>
                    <select
                      value={selectedPackage}
                      onChange={(e) => setSelectedPackage(Number(e.target.value))}
                      className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-obsidian)] px-4 py-2.5 text-sm text-[var(--color-ivory)]"
                    >
                      {selectedVendor.packages.map((pkg, i) => (
                        <option key={i} value={i}>
                          {pkg.name} - &#x20A6;{pkg.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label-eyebrow block mb-1">Event Date</label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-obsidian)] px-4 py-2.5 text-sm text-[var(--color-ivory)]"
                    />
                  </div>
                  <div>
                    <label className="label-eyebrow block mb-1">Notes</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special requests..."
                      className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-obsidian)] px-4 py-2.5 text-sm text-[var(--color-ivory)] placeholder:text-[var(--color-smoke)] resize-none"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <LuxButton onClick={handleBook} className="flex-1">
                    Confirm Booking
                  </LuxButton>
                  <LuxButton variant="ghost" onClick={resetModal}>
                    Cancel
                  </LuxButton>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6 text-center">
                  <span className="text-4xl">&#10003;</span>
                  <h3 className="font-display mt-3 text-2xl text-[var(--color-gold)]">
                    Booking Confirmed
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-smoke)]">
                    {selectedVendor.business_name} has been notified. You can track your booking in My Bookings.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link to="/bookings" className="flex-1">
                    <LuxButton className="w-full">View My Bookings</LuxButton>
                  </Link>
                  <LuxButton variant="ghost" onClick={resetModal}>
                    Continue Browsing
                  </LuxButton>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
