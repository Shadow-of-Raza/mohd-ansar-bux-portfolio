import React, { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContact, getServices, getSite } from "@/lib/data/loaders";
import { hasContactPage } from "@/lib/data/availability";
import { Container } from "@/components/ui/Container";
import { ContactHeroSection } from "@/sections/contact/ContactHeroSection";
import { ContactDetailsSection } from "@/sections/contact/ContactDetailsSection";
import { ContactFormSection } from "@/sections/contact/ContactFormSection";

/**
 * Metadata for /contact.
 * Uses contact.json page.seo or site.json defaults.
 */
export async function generateMetadata(): Promise<Metadata> {
  const contactData = getContact();
  const site = getSite();
  const seo = contactData?.page?.seo;

  const siteName = site?.name || "Mohd Ansar Bux";
  const title = seo?.title || `Contact — ${siteName}`;
  const description =
    seo?.description ||
    contactData?.page?.intro ||
    site?.seo?.description ||
    "Get in touch with Mohd Ansar Bux for engineering roles, technical consultation, or web development projects.";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || site?.url || "https://ansarbux.dev";
  const ogImageUrl = site?.seo?.ogImage?.src
    ? `${siteUrl}${site.seo.ogImage.src}`
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/contact`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/contact`,
      type: "website",
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
  };
}

/**
 * Loading skeleton fallback for ContactFormSection during client hydration.
 */
function ContactFormSkeleton() {
  return (
    <div className="rounded-lg border border-line bg-surface-1/90 p-6 sm:p-8 md:p-10 shadow-xl animate-pulse">
      <div className="h-6 w-48 bg-surface-2 rounded mb-3" />
      <div className="h-4 w-72 bg-surface-2 rounded mb-8" />
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="h-12 bg-surface-2 rounded" />
          <div className="h-12 bg-surface-2 rounded" />
        </div>
        <div className="h-12 bg-surface-2 rounded" />
        <div className="h-32 bg-surface-2 rounded" />
        <div className="h-12 w-48 bg-surface-2 rounded" />
      </div>
    </div>
  );
}

/**
 * Contact page (/contact).
 * Composes CON-01 (Hero), CON-02 (Interactive Form), and CON-03 (Direct Details).
 * Strictly enforces presence rules:
 * - Uses hasContactPage() for notFound()
 * - Form only renders if form.enabled === true AND server env vars are set
 * - When form is hidden, CON-01 and CON-03 adapt gracefully to a centered layout.
 */
export default function ContactPage() {
  // One rule for the page: notFound if contact.email missing AND (form disabled OR env missing)
  if (!hasContactPage()) {
    notFound();
  }

  const contactData = getContact();
  if (!contactData) {
    notFound();
  }

  const site = getSite();
  const servicesData = getServices();
  const servicesList =
    servicesData?.items.map((s) => ({ slug: s.slug, title: s.title })) ?? [];

  // Check server environment variables on server only; never pass to client
  const hasServerEnv = Boolean(
    process.env.RESEND_API_KEY &&
    process.env.CONTACT_TO_EMAIL &&
    process.env.CONTACT_FROM_EMAIL,
  );
  const formEnabled = Boolean(contactData.form?.enabled && hasServerEnv);

  return (
    <div className="relative min-h-screen text-fg">
      {/* CON-01: Page Hero */}
      <ContactHeroSection
        eyebrow={contactData.page?.eyebrow}
        title={contactData.page?.title}
        intro={contactData.page?.intro}
        availability={site.availability}
        responseTime={contactData.responseTime}
      />

      {/* Main Content Area */}
      <section className="relative w-full py-12 md:py-16 lg:py-20">
        <Container>
          {formEnabled ? (
            /* 12-column asymmetric split: Left Details (5 cols), Right Form (7 cols) */
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">
              <div className="lg:col-span-5">
                <ContactDetailsSection
                  email={contactData.email}
                  phone={contactData.phone}
                  location={contactData.location}
                  socials={site.socials}
                  ctaTitle={contactData.cta?.title}
                />
              </div>

              <div className="lg:col-span-7">
                <Suspense fallback={<ContactFormSkeleton />}>
                  <ContactFormSection
                    services={servicesList}
                    otherOptionLabel={contactData.form?.otherOptionLabel}
                    successTitle={contactData.form?.successTitle}
                    successMessage={contactData.form?.successMessage}
                    submitLabel={contactData.cta?.label || "Send message"}
                  />
                </Suspense>
              </div>
            </div>
          ) : (
            /* Form hidden / missing env: Centered Direct Details */
            <div className="mx-auto max-w-2xl">
              <ContactDetailsSection
                email={contactData.email}
                phone={contactData.phone}
                location={contactData.location}
                socials={site.socials}
                ctaTitle={contactData.cta?.title}
              />
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
