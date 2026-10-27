import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { Grain } from "@/components/ui/Grain";
import { SkipLink } from "@/components/layout/SkipLink";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SpaceBackground } from "@/components/layout/SpaceBackground";
import { getSite, getContact, getServices } from "@/lib/data/loaders";
import { getNavItems, hasContactPage } from "@/lib/data/availability";
import "./globals.css";

const site = getSite();

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || site.url || "http://localhost:3000"),
  title: {
    default: site.seo?.title || `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.seo?.description || `${site.name} — ${site.role}`,
  keywords: site.seo?.keywords,
  openGraph: {
    title: site.seo?.title || site.name,
    description: site.seo?.description,
    url: site.url,
    siteName: site.name,
    locale: "en_US",
    type: "website",
    images: site.seo?.ogImage
      ? [
          {
            url: site.seo.ogImage.src,
            width: site.seo.ogImage.width,
            height: site.seo.ogImage.height,
            alt: site.seo.ogImage.alt,
          },
        ]
      : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo?.title || site.name,
    description: site.seo?.description,
    images: site.seo?.ogImage ? [site.seo.ogImage.src] : undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentSite = getSite();
  const navItems = getNavItems();
  const hasContact = hasContactPage();
  const contact = getContact();
  const services = getServices();

  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen font-body text-fg antialiased selection:bg-electric selection:text-white"
      >
        <SpaceBackground />
        <SkipLink />
        <Grain />
        <Header
          site={currentSite}
          navItems={navItems}
          hasContact={hasContact}
          contactEmail={contact?.email}
        />
        <main id="main" className="min-h-screen">
          {children}
        </main>
        <Footer
          site={currentSite}
          navItems={navItems}
          hasContact={hasContact}
          contact={contact}
          services={services}
        />
      </body>
    </html>
  );
}
