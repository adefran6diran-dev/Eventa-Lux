import { Outlet, createRootRoute } from "@tanstack/react-router";
import { EventaNav } from "../components/eventa/EventaNav";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-ivory)] antialiased">
      <EventaNav />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}
