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
  hasProjectsPage,
  hasSkillsPage,
} from "@/lib/data/availability";
import { getSkillUsage } from "@/lib/data/relations";
import { HeroSection } from "@/sections/home/HeroSection";
import { AboutPreviewSection } from "@/sections/home/AboutPreviewSection";
import { ServicesPreviewSection } from "@/sections/home/ServicesPreviewSection";
import { ExperiencePreviewSection } from "@/sections/home/ExperiencePreviewSection";
import { EducationTimelineSection } from "@/sections/home/EducationTimelineSection";
import { ProjectsPreviewSection } from "@/sections/home/ProjectsPreviewSection";
import { SkillsShowcaseSection } from "@/sections/home/SkillsShowcaseSection";

export default function HomePage() {
  const site = getSite();
  const profile = getProfile();
  const services = getServices();
  const experience = getExperience();
  const education = getEducation();
  const projects = getProjects();
  const skillsData = getSkills();
  const skillUsage = getSkillUsage();
  const hasProjects = hasProjectsPage();
  const hasSkills = hasSkillsPage();
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
      <ProjectsPreviewSection
        projects={projects}
        skillMap={skillMap}
        hasProjectsPage={hasProjects}
      />
      <SkillsShowcaseSection
        skills={skillsData}
        skillUsage={skillUsage}
        hasSkillsPage={hasSkills}
      />
    </div>
  );
}


