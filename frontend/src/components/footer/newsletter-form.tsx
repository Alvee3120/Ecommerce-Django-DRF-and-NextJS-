"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // No newsletter backend yet - just acknowledge locally for now.
    setSubscribed(true);
    setEmail("");
  }

  if (subscribed) {
    return <p className={`text-sm text-primary ${className}`}>Thanks for subscribing!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email here"
        className="h-[42px] flex-1 rounded-[5px]"
      />
      <Button
        type="submit"
        className="h-[42px] rounded-[5px] px-8 text-xs font-medium tracking-widest uppercase"
      >
        Subscribe
      </Button>
    </form>
  );
}
