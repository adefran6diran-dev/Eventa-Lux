import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useRequiredAuth } from "../../lib/use-auth";
import { VendorShell } from "../../components/eventa/VendorShell";
import { LuxCard } from "../../components/eventa/LuxCard";
import { LuxButton } from "../../components/eventa/LuxButton";
import { GoldLine } from "../../components/eventa/GoldLine";
import { cn } from "../../utils/cn";

export const Route = createFileRoute("/vendor/messages")({
  component: VendorMessagesPage,
});

const mockConversations = [
  { id: "c1", client: "Amara O.", lastMessage: "Looking forward to the wedding setup!", unread: 2, booking: "Wedding Reception" },
  { id: "c2", client: "Tunde A.", lastMessage: "Can we discuss the menu options?", unread: 0, booking: "Corporate Gala" },
  { id: "c3", client: "Zainab K.", lastMessage: "Thank you for the amazing service!", unread: 0, booking: "Birthday Party" },
];

const mockMessages: Record<string, { id: string; sender: string; content: string; time: string }[]> = {
  c1: [
    { id: "m1", sender: "Amara O.", content: "Hello! We're so excited about our wedding.", time: "10:30 AM" },
    { id: "m2", sender: "You", content: "Congratulations! We're honored to be part of it.", time: "10:32 AM" },
    { id: "m3", sender: "Amara O.", content: "Can we schedule a walkthrough of the venue next week?", time: "10:35 AM" },
    { id: "m4", sender: "Amara O.", content: "Also, my mother would love to discuss the floral arrangements.", time: "10:36 AM" },
  ],
  c2: [
    { id: "m5", sender: "Tunde A.", content: "Hi, I'd like to finalize the catering menu.", time: "2:00 PM" },
    { id: "m6", sender: "You", content: "Of course! I'll send over the menu options shortly.", time: "2:05 PM" },
  ],
  c3: [
    { id: "m7", sender: "Zainab K.", content: "The decoration was absolutely beautiful!", time: "Yesterday" },
    { id: "m8", sender: "You", content: "Thank you! It was our pleasure.", time: "Yesterday" },
  ],
};

function VendorMessagesPage() {
  useRequiredAuth("vendor");
  const [activeChat, setActiveChat] = useState("c1");
  const [newMessage, setNewMessage] = useState("");

  const messages = mockMessages[activeChat] ?? [];
  const conversation = mockConversations.find((c) => c.id === activeChat);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setNewMessage("");
  };

  return (
    <VendorShell title="Messages">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-2">
          {mockConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveChat(conv.id)}
              className={cn(
                "w-full rounded-md border p-3 text-left transition-all",
                activeChat === conv.id
                  ? "border-[var(--color-gold)] bg-[var(--color-gold)]/5"
                  : "border-[var(--color-border)] hover:border-[var(--color-gold)]",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--color-ivory)]">{conv.client}</span>
                {conv.unread > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-gold)] text-[10px] font-bold text-[var(--color-obsidian)]">
                    {conv.unread}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-[var(--color-smoke)] truncate">{conv.lastMessage}</p>
              <p className="mt-0.5 text-[10px] text-[var(--color-smoke)]">{conv.booking}</p>
            </button>
          ))}
        </div>

        <div className="md:col-span-2">
          <LuxCard className="flex h-full flex-col">
            {conversation && (
              <>
                <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                  <div>
                    <h3 className="font-display text-lg text-[var(--color-ivory)]">{conversation.client}</h3>
                    <p className="text-xs text-[var(--color-smoke)]">{conversation.booking}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto py-4 max-h-[400px]">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "rounded-md p-3 max-w-[80%]",
                        msg.sender === "You"
                          ? "bg-[var(--color-gold)]/10 ml-auto"
                          : "bg-[var(--color-obsidian)]",
                      )}
                    >
                      <p className="text-xs font-medium text-[var(--color-gold)]">{msg.sender}</p>
                      <p className="mt-1 text-sm text-[var(--color-ivory)]">{msg.content}</p>
                      <p className="mt-1 text-[10px] text-[var(--color-smoke)]">{msg.time}</p>
                    </div>
                  ))}
                </div>

                <GoldLine />

                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-obsidian)] px-3 py-2 text-sm text-[var(--color-ivory)] placeholder:text-[var(--color-smoke)] focus:border-[var(--color-gold)] focus:outline-none"
                  />
                  <LuxButton size="sm" onClick={handleSend}>Send</LuxButton>
                </div>
              </>
            )}
          </LuxCard>
        </div>
      </div>
    </VendorShell>
  );
}
