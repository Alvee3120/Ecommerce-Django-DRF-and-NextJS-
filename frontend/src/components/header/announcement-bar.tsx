import { Megaphone, User } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-[1200px] items-center justify-center gap-2 px-4 py-2.5 text-sm md:justify-between">
        <div className="flex items-center gap-2">
          <Megaphone className="h-4 w-4 shrink-0" />
          <span>Add anything here or just remove it...</span>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <span>English</span>
          <span className="opacity-50">|</span>
          <span>US Dollar</span>
          <span className="opacity-50">|</span>
          <span className="inline-flex items-center gap-1">
            <User className="h-4 w-4" />
            Login / Register
          </span>
        </div>
      </div>
    </div>
  );
}
