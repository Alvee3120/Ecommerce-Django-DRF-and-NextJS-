"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchToggle({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    router.push(`/?q=${encodeURIComponent(value.trim())}`);
    setOpen(false);
  }

  if (!open) {
    return (
      <button type="button" aria-label="Search" onClick={() => setOpen(true)} className={className}>
        <Search className="h-5 w-5" />
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex items-center gap-1 ${className}`}>
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products..."
        className="w-28 border-b border-foreground/30 bg-transparent px-1 py-0.5 text-sm outline-none sm:w-48"
      />
      <button type="button" aria-label="Close search" onClick={() => setOpen(false)}>
        <X className="h-4 w-4" />
      </button>
    </form>
  );
}
