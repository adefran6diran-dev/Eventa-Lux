import { useEffect, useState } from 'react'
import { supabase } from "../../lib/supabase";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../../lib/use-auth";
import { LuxButton } from "./LuxButton";
import { cn } from "../../utils/cn";

interface NavLink {
  label: string;
  to: string;
}

const navLinks: NavLink[] = [
  { label: "Vendors", to: "/vendors" },
  { label: "Feedback", to: "/feedback" },
  { label: "Become a Vendor", to: "/vendor-apply" },
];

export function EventaNav({ className }: { className?: string }) {
  const { user, signOut } = useAuth();
  
  // Admin check state
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      setIsAdmin(profile?.role === 'admin');
    };
    checkRole();
  }, ); // fixed: now only runs when user changes

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-obsidian)]/80 backdrop-blur-xl",
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          className="font-display text-xl tracking-wider text-[var(--color-ivory)]"
        >
          Eventa<span className="text-[var(--color-gold)] italic">.</span>
        </Link>

        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-smoke)] transition-colors hover:text-[var(--color-gold)]"
            >
              {link.label}
            </Link>
          ))}

          {/* Admin link - only shows for admins */}
          {isAdmin && (
            <Link
              to="/admin"
              className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-gold)] transition-colors hover:text-[var(--color-ivory)]"
            >
              Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/events" className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-smoke)] transition-colors hover:text-[var(--color-gold)]">
                My Events
              </Link>
              <Link to="/bookings" className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-smoke)] transition-colors hover:text-[var(--color-gold)]">
                Bookings
              </Link>
              <LuxButton variant="ghost" size="sm" onClick={signOut}>
                Sign Out
              </LuxButton>
            </div>
          ) : (
            <Link to="/auth/login">
              <LuxButton variant="outline" size="sm">
                Sign In
              </LuxButton>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}