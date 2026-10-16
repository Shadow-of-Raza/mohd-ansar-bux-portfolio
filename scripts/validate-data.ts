import contact from "../src/data/contact.json";
import education from "../src/data/education.json";
import experience from "../src/data/experience.json";
import profile from "../src/data/profile.json";
import projects from "../src/data/projects.json";
import services from "../src/data/services.json";
import site from "../src/data/site.json";
import skills from "../src/data/skills.json";

const files = {
  contact,
  education,
  experience,
  profile,
  projects,
  services,
  site,
  skills,
};

for (const [name, data] of Object.entries(files)) {
  if (data === undefined) {
    console.error(`Failed to load data for ${name}`);
    process.exit(1);
  }
}

console.log("✓ data files readable (full validation arrives in Phase 2)");
process.exit(0);
