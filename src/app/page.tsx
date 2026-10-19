import {
  getSite,
  getProfile,
  getProjects,
  getServices,
  getSkills,
  getExperience,
  getEducation,
} from "@/lib/data/loaders";
import {
  hasContactPage,
  hasAboutPage,
  hasServicesPage,
  hasExperiencePage,
  hasEducationPage,
} from "@/lib/data/availability";
import { HeroSection } from "@/sections/home/HeroSection";
import { AboutPreviewSection } from "@/sections/home/AboutPreviewSection";
import { ServicesPreviewSection } from "@/sections/home/ServicesPreviewSection";
import { ExperiencePreviewSection } from "@/sections/home/ExperiencePreviewSection";
import { EducationTimelineSection } from "@/sections/home/EducationTimelineSection";

export default function HomePage() {
  const site = getSite();
  const profile = getProfile();
  const services = getServices();
  const experience = getExperience();
  const education = getEducation();
  const skillsData = getSkills();
  const hasProjects = getProjects() !== null;
  const hasContact = hasContactPage();
  const hasAbout = hasAboutPage();
  const hasServices = hasServicesPage();
  const hasExperience = hasExperiencePage();
  const hasEducation = hasEducationPage();

  const skillMap: Record<string, { name: string; icon?: string }> = {};
  if (skillsData) {
    for (const s of skillsData.items) {
      skillMap[s.id] = { name: s.name, icon: s.icon };
    }
  }

  return (
    <div className="flex flex-col">
      <HeroSection site={site} profile={profile} hasProjectsPage={hasProjects} hasContactPage={hasContact} />
      <AboutPreviewSection profile={profile} hasAboutPage={hasAbout} />
      <ServicesPreviewSection services={services} skillMap={skillMap} hasServicesPage={hasServices} />
      <ExperiencePreviewSection
        experience={experience}
        skillMap={skillMap}
        hasExperiencePage={hasExperience}
      />
      <EducationTimelineSection
        education={education}
        hasEducationPage={hasEducation}
      />
    </div>
  );
}

