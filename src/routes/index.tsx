import { createFileRoute, Link } from "@tanstack/react-router";
import { GoldLine } from "../components/eventa/GoldLine";
import { LuxButton } from "../components/eventa/LuxButton";
import { LuxCard } from "../components/eventa/LuxCard";
import { CategoryIcon } from "../components/eventa/CategoryIcon";
import { useAuth } from "../lib/use-auth";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const features = [
  {
    title: "Curated Excellence",
    description:
      "Every vendor on Eventa has been vetted for quality, reliability, and the distinctive touch that makes your event unforgettable.",
  },
  {
    title: "Seamless Planning",
    description:
      "From vendor discovery to booking and real-time communication, manage your entire event from a single sophisticated dashboard.",
  },
  {
    title: "Concierge Support",
    description:
      "Our dedicated team ensures your experience is flawless, handling every detail with the discretion and care you deserve.",
  },
];

const categories = [
  { name: "Venues", key: "venue" },
  { name: "Catering", key: "catering" },
  { name: "Photography", key: "photography" },
  { name: "Decoration", key: "decoration" },
  { name: "Music", key: "music" },
  { name: "Makeup & Beauty", key: "makeup" },
];

function HomePage() {
  const { user, loading } = useAuth();

  return (
    <div>
      {/* ── Hero ─────────────────────── */}
      <section className="radial-gold-glow relative flex min-h-[90vh] flex-col items-center justify-center px-6 text-center">
        {loading ? (
          <div className="flex flex-col items-center gap-6 animate-pulse">
            <div className="h-4 w-48 rounded bg-[var(--color-border)]" />
            <div className="h-16 w-[600px] max-w-full rounded bg-[var(--color-border)]" />
            <div className="h-6 w-80 rounded bg-[var(--color-border)]" />
            <div className="mt-4 flex gap-4">
              <div className="h-12 w-40 rounded-md bg-[var(--color-border)]" />
              <div className="h-12 w-40 rounded-md bg-[var(--color-border)]" />
            </div>
          </div>
        ) : user ? (
          <>
            <span className="label-eyebrow mb-6">Welcome back</span>
            <h1 className="font-display max-w-4xl text-5xl leading-tight md:text-7xl">
              {user.profile?.full_name ? (
                <>Welcome back, <span className="gold-accent">{user.profile.full_name.split(" ")[0]}</span></>
              ) : (
                <>Welcome <span className="gold-accent">back</span></>
              )}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-[var(--color-smoke)]">
              {user.role === "vendor"
                ? "Manage your bookings, messages, and vendor profile."
                : user.role === "admin"
                  ? "Oversee vendors, applications, and platform feedback."
                  : "Continue planning your perfect event with Nigeria's finest vendors."}
            </p>
            <div className="mt-10 flex items-center gap-4">
              {user.role === "vendor" ? (
                <Link to="/vendor/dashboard">
                  <LuxButton size="lg">Vendor Dashboard</LuxButton>
                </Link>
              ) : user.role === "admin" ? (
                <Link to="/admin">
                  <LuxButton size="lg">Admin Panel</LuxButton>
                </Link>
              ) : (
                <>
                  <Link to="/vendors">
                    <LuxButton size="lg">Explore Vendors</LuxButton>
                  </Link>
                  <Link to="/events">
                    <LuxButton variant="outline" size="lg">
                      My Events
                    </LuxButton>
                  </Link>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <span className="label-eyebrow mb-6">Nigeria's Premier Event Platform</span>
            <h1 className="font-display max-w-4xl text-5xl leading-tight md:text-7xl">
              Where <span className="gold-accent">Luxury</span> Meets
              <br />
              <span className="gold-accent">Perfection</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-[var(--color-smoke)]">
              Curating Nigeria's most exceptional event vendors for the
              discerning few who accept nothing less than extraordinary.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <Link to="/vendors">
                <LuxButton size="lg">Explore Vendors</LuxButton>
              </Link>
              <Link to="/vendor-apply">
                <LuxButton variant="outline" size="lg">
                  Join as a Vendor
                </LuxButton>
              </Link>
            </div>
          </>
        )}
        <GoldLine shimmer className="mt-20 w-32" />
      </section>

      {/* ── Categories ────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 text-center">
          <span className="label-eyebrow">Categories</span>
          <h2 className="font-display mt-3 text-4xl">
            Find the <span className="gold-accent">Perfect</span> Partner
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {categories.map((cat) => (
            <Link key={cat.name} to="/vendors" className="group">
              <LuxCard hover className="flex flex-col items-center text-center py-8">
                <CategoryIcon category={cat.key} size="lg" />
                <p className="mt-4 font-display text-lg text-[var(--color-ivory)] group-hover:text-[var(--color-gold)] transition-colors">
                  {cat.name}
                </p>
              </LuxCard>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────── */}
      <section className="border-t border-[var(--color-border)] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <span className="label-eyebrow">Why Eventa</span>
            <h2 className="font-display mt-3 text-4xl">
              Crafted for <span className="gold-accent">Excellence</span>
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((f, i) => (
              <LuxCard key={i} glow>
                <span className="font-display text-4xl text-[var(--color-gold)]">
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <h3 className="font-display mt-4 text-xl text-[var(--color-ivory)]">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-smoke)]">
                  {f.description}
                </p>
              </LuxCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────── */}
      {!user && (
        <section className="border-t border-[var(--color-border)] py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-display text-4xl">
              Ready to Create Something
              <br />
              <span className="gold-accent">Extraordinary</span>?
            </h2>
            <p className="mt-4 text-[var(--color-smoke)]">
              Join Nigeria's most discerning event planning platform.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link to="/auth/signup">
                <LuxButton size="lg">Get Started</LuxButton>
              </Link>
              <Link to="/feedback">
                <LuxButton variant="ghost" size="lg">
                  Share Feedback
                </LuxButton>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ───────────────────── */}
      <footer className="border-t border-[var(--color-border)] py-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="font-display text-2xl tracking-wider text-[var(--color-ivory)]">
            Eventa<span className="text-[var(--color-gold)] italic">.</span>
          </p>
          <GoldLine className="mx-auto my-4 w-16" />
          <p className="text-xs text-[var(--color-smoke)]">
            &copy; {new Date().getFullYear()} Eventa. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
