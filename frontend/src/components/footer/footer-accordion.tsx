"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Section {
  title: string;
  content: React.ReactNode;
}

export function FooterAccordion({ sections }: { sections: Section[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y">
      {sections.map((section, i) => (
        <div key={section.title} className="py-4">
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between text-left font-semibold"
          >
            {section.title}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
            />
          </button>
          {openIndex === i && <div className="mt-3">{section.content}</div>}
        </div>
      ))}
    </div>
  );
}
