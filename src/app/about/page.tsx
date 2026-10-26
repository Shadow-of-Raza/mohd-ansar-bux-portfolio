import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfile, getSite } from "@/lib/data/loaders";
import { AboutIntroSection } from "@/sections/about/AboutIntroSection";
import { GallerySection } from "@/sections/about/GallerySection";
import { InterestsSection } from "@/sections/about/InterestsSection";
import { HobbiesSection } from "@/sections/about/HobbiesSection";
import { PersonalInfoSection } from "@/sections/about/PersonalInfoSection";

export async function generateMetadata(): Promise<Metadata> {
  const profile = getProfile();
  const site = getSite();

  if (!profile) {
    return {
      title: "About",
    };
  }

  const seoTitle = profile.page.seo?.title || `About — ${site.name}`;
  const seoDescription = profile.page.seo?.description || site.seo?.description;

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `${site.url}/about`,
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

export default function AboutPage() {
  const profile = getProfile();
  const site = getSite();

  // Presence rule: if profile is null, return 404
  if (!profile) {
    notFound();
  }

  const hasInterests = Boolean(profile.interests?.items?.length);

  return (
    <div className="flex flex-col">
      <AboutIntroSection profile={profile} siteName={site.name} />
      <GallerySection gallery={profile.gallery} />
      <InterestsSection interests={profile.interests} />
      <HobbiesSection
        hobbies={profile.hobbies}
        eyebrow={hasInterests ? "04 — Personal" : "03 — Personal"}
      />
      <PersonalInfoSection
        basicInfo={profile.basicInfo}
        eyebrow={hasInterests ? "05 — Details" : "04 — Details"}
      />
    </div>
  );
}
