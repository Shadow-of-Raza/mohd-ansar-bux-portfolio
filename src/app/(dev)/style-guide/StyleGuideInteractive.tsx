"use client";

import React, { useState } from "react";
import { ArrowRight, Code2, Sparkles, Terminal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Popover } from "@/components/ui/Popover";
import { Accordion } from "@/components/ui/Accordion";
import { Lightbox, type LightboxImage } from "@/components/ui/Lightbox";
import { CopyButton } from "@/components/ui/CopyButton";

const sampleImages: LightboxImage[] = [
  {
    src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'%3E%3Crect width='100%25' height='100%25' fill='%230d0b25'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='32' fill='%238f8ff1'%3ESample Gallery Slide 1%3C/text%3E%3C/svg%3E",
    alt: "Sample Gallery Slide 1",
    caption: "High performance architecture visualization slide 1",
    width: 1200,
    height: 800,
  },
  {
    src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'%3E%3Crect width='100%25' height='100%25' fill='%23111035'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='32' fill='%238f8ff1'%3ESample Gallery Slide 2%3C/text%3E%3C/svg%3E",
    alt: "Sample Gallery Slide 2",
    caption: "High performance architecture visualization slide 2",
    width: 1200,
    height: 800,
  },
];

const sampleFaq = [
  {
    id: "faq-1",
    title: "How are design tokens defined?",
    content:
      "All tokens live in src/app/globals.css inside the Tailwind v4 @theme block. The default palette is removed so only our night editorial palette exists.",
  },
  {
    id: "faq-2",
    title: "What is the presence rule?",
    content:
      "If data for a section or field is empty or missing, nothing is rendered—no placeholder, no empty heading, and no coming-soon notice.",
  },
  {
    id: "faq-3",
    title: "How does the typography hierarchy work?",
    content:
      "Archivo Black for display headings (>= 24px), Abhaya Libre for body paragraphs, Alegreya SC for labels/UI, and Averia Serif Libre italic for single accent words.",
  },
];

export function StyleGuideInteractive() {
  const [activeChip, setActiveChip] = useState("React");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  return (
    <div className="space-y-12">
      {/* Chips section */}
      <div>
        <h4 className="mb-4 text-label font-label text-fg-subtle">Chips (Filter & Tech Tags)</h4>
        <div className="flex flex-wrap items-center gap-3">
          {["React", "TypeScript", "Next.js", "Node.js", "PostgreSQL"].map((tech) => (
            <Chip
              key={tech}
              active={activeChip === tech}
              onClick={() => setActiveChip(tech)}
              icon={<Code2 className="h-3.5 w-3.5" />}
            >
              {tech}
            </Chip>
          ))}
          <Chip disabled icon={<Terminal className="h-3.5 w-3.5" />}>
            Disabled Chip
          </Chip>
        </div>
        <p className="mt-2 text-small text-fg-subtle">
          Click any chip to toggle the active filter state (active: bg-navy border-electric).
        </p>
      </div>

      {/* CopyButton section */}
      <div>
        <h4 className="mb-4 text-label font-label text-fg-subtle">
          CopyButton (Click-to-Copy with 1.5s morph feedback)
        </h4>
        <div className="flex flex-wrap items-center gap-4">
          <CopyButton
            text="ansar.bux@example.com"
            label="Copy Email"
            copiedLabel="Copied"
            variant="primary"
          />
          <CopyButton text="pnpm dev" label="Copy Command" copiedLabel="Copied" variant="secondary" />
          <CopyButton
            text="https://github.com/Shadow-of-Raza"
            label="Copy URL"
            copiedLabel="Copied"
            variant="ghost"
          />
        </div>
      </div>

      {/* Popover section */}
      <div>
        <h4 className="mb-4 text-label font-label text-fg-subtle">
          Popover (Accessible on hover, click, and keyboard)
        </h4>
        <div className="flex flex-wrap items-center gap-6">
          <Popover
            side="top"
            trigger={
              <Chip icon={<Sparkles className="h-3.5 w-3.5 text-electric-300" />}>
                Hover or Click me (Top Popover)
              </Chip>
            }
          >
            <div className="space-y-2">
              <p className="text-label font-label text-white">Skill Usage</p>
              <p className="text-small font-body text-fg-muted">
                Used in 4 featured projects including E-Commerce, DevTools CLI, and Cloud Engine.
              </p>
            </div>
          </Popover>

          <Popover
            side="bottom"
            trigger={
              <Button variant="secondary" size="sm">
                Bottom Popover
              </Button>
            }
          >
            <div className="space-y-1">
              <p className="text-label font-label text-white">Project Details</p>
              <p className="text-small font-body text-fg-muted">
                Architecture built using Next.js 16 and React Server Components.
              </p>
            </div>
          </Popover>
        </div>
      </div>

      {/* Accordion section */}
      <div>
        <h4 className="mb-4 text-label font-label text-fg-subtle">Accordion (FAQ / Disclosure)</h4>
        <div className="max-w-2xl rounded-md border border-line bg-surface-1/40 p-6">
          <Accordion items={sampleFaq} defaultExpandedIds={["faq-1"]} />
        </div>
      </div>

      {/* Lightbox section */}
      <div>
        <h4 className="mb-4 text-label font-label text-fg-subtle">Lightbox (Full-screen Modal Viewer)</h4>
        <div className="flex items-center gap-4">
          <Button
            variant="primary"
            onClick={() => setLightboxOpen(true)}
            trailingIcon={<ArrowRight className="h-4 w-4" />}
          >
            Open Sample Gallery Lightbox
          </Button>
        </div>
        <Lightbox
          isOpen={lightboxOpen}
          images={sampleImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(index) => setLightboxIndex(index)}
        />
      </div>
    </div>
  );
}
