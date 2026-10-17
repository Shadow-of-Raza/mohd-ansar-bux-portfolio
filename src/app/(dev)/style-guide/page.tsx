import React from "react";
import { notFound } from "next/navigation";
import { ArrowRight, Download, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { StyleGuideInteractive } from "./StyleGuideInteractive";

export const metadata = {
  title: "Design System & UI Primitives Style Guide (Dev Only)",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StyleGuidePage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const colorTokens = [
    { name: "night", token: "--color-night", role: "Page canvas", bg: "bg-night", text: "text-white" },
    { name: "void", token: "--color-void", role: "Deepest layer", bg: "bg-void", text: "text-white" },
    {
      name: "surface-1",
      token: "--color-surface-1",
      role: "Cards & inputs",
      bg: "bg-surface-1",
      text: "text-white",
    },
    {
      name: "surface-2",
      token: "--color-surface-2",
      role: "Hover & chips",
      bg: "bg-surface-2",
      text: "text-white",
    },
    {
      name: "navy",
      token: "--color-navy",
      role: "Popovers & active chips",
      bg: "bg-navy",
      text: "text-white",
    },
    {
      name: "royal",
      token: "--color-royal",
      role: "Secondary accent / glows",
      bg: "bg-royal",
      text: "text-white",
    },
    {
      name: "electric",
      token: "--color-electric",
      role: "Primary accent fill",
      bg: "bg-electric",
      text: "text-white",
    },
    {
      name: "electric-hover",
      token: "--color-electric-hover",
      role: "Button hover fill",
      bg: "bg-electric-hover",
      text: "text-white",
    },
    {
      name: "electric-300",
      token: "--color-electric-300",
      role: "Accent text on dark",
      bg: "bg-electric-300",
      text: "text-night",
    },
    {
      name: "electric-200",
      token: "--color-electric-200",
      role: "Error text & highlights",
      bg: "bg-electric-200",
      text: "text-night",
    },
    { name: "fg", token: "--color-fg", role: "Primary text", bg: "bg-white", text: "text-night" },
    {
      name: "fg-muted",
      token: "--color-fg-muted",
      role: "Body copy",
      bg: "bg-surface-1",
      text: "text-fg-muted",
    },
    {
      name: "fg-subtle",
      token: "--color-fg-subtle",
      role: "Meta / labels",
      bg: "bg-surface-1",
      text: "text-fg-subtle",
    },
  ];

  return (
    <div className="min-h-screen bg-night py-16 text-fg">
      <Container>
        {/* Header */}
        <header className="mb-16 border-b border-line pb-10">
          <Eyebrow className="mb-3">00 — DEV ENVIRONMENT</Eyebrow>
          <SectionHeading as="h1" className="mb-4">
            DESIGN *system* & primitives
          </SectionHeading>
          <p className="max-w-3xl text-lead font-body text-fg-muted">
            Phase 1 Component Library & Visual Token Verification. This page displays every primitive, derived
            shade, fluid typographic step, and component state (default, hover, focus, disabled, error).
          </p>
        </header>

        <div className="space-y-24">
          {/* SECTION 1: Design Tokens */}
          <section className="space-y-6">
            <Eyebrow>01 — COLOR TOKENS</Eyebrow>
            <SectionHeading as="h2" className="text-heading">
              Curated *night* editorial palette
            </SectionHeading>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {colorTokens.map((token) => (
                <div key={token.name} className="rounded-md border border-line bg-surface-1 p-4 shadow-card">
                  <div
                    className={`h-14 w-full rounded-sm border border-line/40 ${token.bg} mb-3 flex items-center justify-center font-mono text-xs`}
                  >
                    <span className={token.text}>{token.name}</span>
                  </div>
                  <p className="text-label font-label font-bold text-fg">{token.name}</p>
                  <p className="text-small font-body text-fg-subtle">{token.role}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 2: Typography & renderAccent */}
          <section className="space-y-8">
            <Eyebrow>02 — TYPOGRAPHY SCALE</Eyebrow>
            <SectionHeading as="h2" className="text-heading">
              Fluid *type* hierarchy & accent word
            </SectionHeading>
            <div className="space-y-6 rounded-md border border-line bg-surface-1/40 p-6 md:p-8">
              <div>
                <span className="text-micro font-label text-fg-subtle">
                  display-2xl (Archivo Black, clamp 3.5rem to 11rem)
                </span>
                <p className="text-display-2xl text-fg">MOHD *ansar*</p>
              </div>
              <div className="border-t border-line pt-4">
                <span className="text-micro font-label text-fg-subtle">
                  display-xl (Archivo Black, clamp 2.75rem to 6rem)
                </span>
                <p className="text-display-xl text-fg">ENGINEERING *scale*</p>
              </div>
              <div className="border-t border-line pt-4">
                <span className="text-micro font-label text-fg-subtle">
                  display-lg (Archivo Black, clamp 2.25rem to 4.25rem)
                </span>
                <p className="text-display-lg text-fg">SELECTED *projects*</p>
              </div>
              <div className="border-t border-line pt-4">
                <span className="text-micro font-label text-fg-subtle">
                  heading (Archivo Black, clamp 1.5rem to 2.25rem)
                </span>
                <p className="text-heading text-fg">FULL-STACK *architecture*</p>
              </div>
              <div className="border-t border-line pt-4">
                <span className="text-micro font-label text-fg-subtle">
                  title (Abhaya Libre 700, 1.375rem)
                </span>
                <p className="text-title text-fg">High Performance Distributed Cloud Engine</p>
              </div>
              <div className="border-t border-line pt-4">
                <span className="text-micro font-label text-fg-subtle">
                  lead (Abhaya Libre 400, clamp 1.25rem to 1.5rem)
                </span>
                <p className="max-w-2xl text-lead text-fg-muted">
                  Building resilient systems and editorial user interfaces with uncompromising aesthetic
                  standards and surgical precision.
                </p>
              </div>
              <div className="border-t border-line pt-4">
                <span className="text-micro font-label text-fg-subtle">
                  body (Abhaya Libre 400, 1.125rem)
                </span>
                <p className="max-w-2xl text-body text-fg-muted">
                  Paragraphed text utilizes Abhaya Libre with high readability at 18px+, generous line height,
                  and constrained measure for editorial clarity.
                </p>
              </div>
              <div className="border-t border-line pt-4">
                <span className="text-micro font-label text-fg-subtle">
                  label & micro (Alegreya SC, 0.875rem & 0.75rem)
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-label text-fg">01 — SERVICES SECTION</span>
                  <span className="text-micro text-fg-subtle">STATUS: AVAILABLE</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: Buttons & LinkButtons */}
          <section className="space-y-8">
            <Eyebrow>03 — BUTTONS & LINK BUTTONS</Eyebrow>
            <SectionHeading as="h2" className="text-heading">
              Action *triggers* & state variants
            </SectionHeading>

            {/* Variants */}
            <div className="space-y-4">
              <h3 className="text-label font-label text-fg-subtle">Variants (Primary, Secondary, Ghost)</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" trailingIcon={<ArrowRight className="h-4 w-4" />}>
                  Primary Button
                </Button>
                <Button variant="secondary" icon={<Mail className="h-4 w-4" />}>
                  Secondary Button
                </Button>
                <Button variant="ghost">Ghost Button</Button>
                <LinkButton
                  href="#test-link"
                  variant="primary"
                  trailingIcon={<Download className="h-4 w-4" />}
                >
                  LinkButton (Internal)
                </LinkButton>
                <LinkButton href="https://github.com" external variant="secondary">
                  External Link
                </LinkButton>
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-4 border-t border-line pt-6">
              <h3 className="text-label font-label text-fg-subtle">Sizes (Small, Medium, Large)</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm" variant="primary">
                  Small (h-9)
                </Button>
                <Button size="md" variant="primary">
                  Medium (h-12 default)
                </Button>
                <Button size="lg" variant="primary">
                  Large (h-14)
                </Button>
              </div>
            </div>

            {/* States */}
            <div className="space-y-4 border-t border-line pt-6">
              <h3 className="text-label font-label text-fg-subtle">States (Loading, Disabled)</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button isLoading variant="primary">
                  Loading State
                </Button>
                <Button disabled variant="primary">
                  Disabled Primary
                </Button>
                <Button disabled variant="secondary">
                  Disabled Secondary
                </Button>
              </div>
            </div>
          </section>

          {/* SECTION 4: Badges & Chips */}
          <section className="space-y-8">
            <Eyebrow>04 — BADGES & STATUS INDICATORS</Eyebrow>
            <SectionHeading as="h2" className="text-heading">
              Badges & *status* chips
            </SectionHeading>

            <div className="flex flex-wrap items-center gap-4">
              <Badge variant="present">Present / Pursuing</Badge>
              <Badge variant="open-source">Open Source</Badge>
              <Badge variant="default">Full-Time</Badge>
            </div>
          </section>

          {/* SECTION 5: Cards */}
          <section className="space-y-8">
            <Eyebrow>05 — ELEVATION & CARDS</Eyebrow>
            <SectionHeading as="h2" className="text-heading">
              Card *elevation* via light and hairline borders
            </SectionHeading>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <h4 className="font-title mb-2 text-title text-fg">Resting Card</h4>
                <p className="text-body font-body text-fg-muted">
                  Resting elevation features a hairline border, inner top highlight, and background surface-1.
                </p>
              </Card>

              <Card interactive>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-title text-title text-fg">Interactive Hover Card</h4>
                  <Badge variant="present">Hover Me</Badge>
                </div>
                <p className="text-body font-body text-fg-muted">
                  Interactive state lifts by -4px, transitions border to electric/40, and emits a royal glow.
                </p>
              </Card>
            </div>
          </section>

          {/* SECTION 6: Form Controls */}
          <section className="space-y-8">
            <Eyebrow>06 — FORM PRIMITIVES</Eyebrow>
            <SectionHeading as="h2" className="text-heading">
              Accessible *form* inputs & validation states
            </SectionHeading>

            <div className="grid max-w-4xl gap-6 md:grid-cols-2">
              <Input
                label="Full Name"
                placeholder="e.g. John Doe"
                helperText="Enter your real or business name"
              />

              <Input
                label="Email Address"
                defaultValue="invalid-email-format"
                error="Please enter a valid email address"
              />

              <Input label="Disabled Field" disabled placeholder="Disabled input state" />

              <Select
                label="Inquiry Type"
                options={[
                  { value: "general", label: "General Project Inquiry" },
                  { value: "consulting", label: "Architecture Consulting" },
                  { value: "fulltime", label: "Full-time Engineering Role" },
                ]}
              />

              <div className="md:col-span-2">
                <Textarea
                  label="Project Details"
                  placeholder="Describe your vision, timeline, and goals..."
                  helperText="Maximum 1,000 characters."
                />
              </div>

              <div className="md:col-span-2">
                <Textarea
                  label="Project Details (Error State)"
                  defaultValue="Too short"
                  error="Please provide at least 20 characters describing the project."
                />
              </div>
            </div>
          </section>

          {/* SECTION 7: Interactive Components Demo */}
          <section className="space-y-8">
            <Eyebrow>07 — COMPLEX & INTERACTIVE PRIMITIVES</Eyebrow>
            <SectionHeading as="h2" className="text-heading">
              Interactive *primitives* in action
            </SectionHeading>
            <StyleGuideInteractive />
          </section>

          {/* SECTION 8: Section Contract Demonstration */}
          <div className="border-t border-line pt-12">
            <Section
              id="demo-section"
              eyebrow="08 — SECTION CONTRACT"
              title="Standard *section* layout test"
              intro="This tests the canonical Section contract wrapping Container, Eyebrow, SectionHeading with accent, intro, and children."
            >
              <div className="rounded-md border border-line bg-surface-1 p-6 text-fg-muted">
                Section children rendered inside standard Container with vertical padding rhythm.
              </div>
            </Section>
          </div>
        </div>
      </Container>
    </div>
  );
}
