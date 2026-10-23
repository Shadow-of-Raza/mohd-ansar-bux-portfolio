import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEducation, getSite } from "@/lib/data/loaders";
import { EducationHeroSection } from "@/sections/education/EducationHeroSection";
import { EducationTimelineDetailSection } from "@/sections/education/EducationTimelineDetailSection";

export async function generateMetadata(): Promise<Metadata> {
  const educationData = getEducation();
  const site = getSite();

  if (!educationData || educationData.items.length === 0) {
    return {
      title: "Education",
    };
  }

  const seoTitle = educationData.page.seo?.title || `Education — ${site.name}`;
  const seoDescription = educationData.page.seo?.description || site.seo?.description;

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `${site.url}/education`,
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

export default function EducationPage() {
  const educationData = getEducation();

  // Presence rule: if no visible education entries exist, return 404
  if (!educationData || educationData.items.length === 0) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <EducationHeroSection
        page={educationData.page}
        count={educationData.items.length}
      />
      <EducationTimelineDetailSection
        items={educationData.items}
      />
    </div>
  );
}
