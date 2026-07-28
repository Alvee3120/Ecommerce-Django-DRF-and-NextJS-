"use client";

import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useActivePopup } from "@/lib/queries";

export function PopupLauncher() {
  const { data: popup } = useActivePopup();
  const [open, setOpen] = useState(false);
  const [shownId, setShownId] = useState<number | null>(null);

  useEffect(() => {
    if (!popup || popup.id === shownId) return;
    const timer = setTimeout(() => {
      setOpen(true);
      setShownId(popup.id);
    }, popup.delay_seconds * 1000);
    return () => clearTimeout(timer);
  }, [popup, shownId]);

  if (!popup) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{popup.title}</DialogTitle>
          {popup.text ? <DialogDescription>{popup.text}</DialogDescription> : null}
        </DialogHeader>
        {popup.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={popup.image} alt={popup.title} className="w-full rounded-md" />
        ) : null}
        {popup.button_text && popup.button_link ? (
          <a href={popup.button_link} className={buttonVariants({ size: "default" })}>
            {popup.button_text}
          </a>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
