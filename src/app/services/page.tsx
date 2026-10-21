import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServices, getSkills, getSite } from "@/lib/data/loaders";
import { ServicesHeroSection } from "@/sections/services/ServicesHeroSection";
import { ServicesSubNav } from "@/sections/services/ServicesSubNav";
import { ServiceDetailSection } from "@/sections/services/ServiceDetailSection";

export async function generateMetadata(): Promise<Metadata> {
  const servicesData = getServices();
  const site = getSite();

  if (!servicesData || servicesData.items.length === 0) {
    return {
      title: "Services",
    };
  }

  const seoTitle = servicesData.page.seo?.title || `Services — ${site.name}`;
  const seoDescription = servicesData.page.seo?.description || site.seo?.description;

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `${site.url}/services`,
      siteName: site.name,
      images: site.seo?.ogImage ? [site.seo.ogImage.src] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: site.seo?.ogImage ? [site.seo.ogImage.src] : undefined,
    },
  };
}

export default function ServicesPage() {
  const servicesData = getServices();
  const skillsData = getSkills();

  // Presence rule: if no visible services exist, return 404
  if (!servicesData || servicesData.items.length === 0) {
    notFound();
  }

  const skillMap: Record<string, { name: string; icon?: string }> = {};
  if (skillsData) {
    for (const skill of skillsData.items) {
      skillMap[skill.id] = { name: skill.name, icon: skill.icon };
    }
  }

  return (
    <div className="flex flex-col">
      <ServicesHeroSection
        count={servicesData.items.length}
        eyebrow={servicesData.page.eyebrow}
        title={servicesData.page.title}
        intro={servicesData.page.intro}
      />
      <ServicesSubNav services={servicesData.items} />
      <div className="flex flex-col divide-y divide-line">
        {servicesData.items.map((service, idx) => (
          <ServiceDetailSection
            key={service.id}
            service={service}
            index={idx}
            skillMap={skillMap}
          />
        ))}
      </div>
    </div>
  );
}
