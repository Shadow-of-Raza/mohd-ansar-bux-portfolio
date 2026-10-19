import "server-only";
import { z } from "zod";

/**
 * Text helpers:
 * - Empty strings and whitespace become undefined so components can use `?.`
 * - text requires at least 1 non-whitespace character
 * - textList trims and drops empty string entries
 */
export const optText = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().trim().optional(),
);

export const text = z.string().trim().min(1);

export const textList = z
  .array(z.string().trim())
  .transform((a) => a.filter(Boolean))
  .default([]);

export const yearMonth = z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/);

export const url = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? null : v),
  z.url().nullish(),
);

export const email = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.email().optional(),
);

/* -------------------------------- Shared -------------------------------- */

export const ImageSchema = z.object({
  src: text,
  alt: z.string().default(""),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  caption: optText,
});

export const SeoSchema = z
  .object({
    title: optText,
    description: optText,
    ogImage: ImageSchema.optional(),
    keywords: z.array(z.string().trim()).default([]),
  })
  .prefault({});

export const PageCopy = z
  .object({
    eyebrow: optText,
    title: optText,
    intro: optText,
    seo: SeoSchema,
  })
  .prefault({});

export const HomeCopy = z
  .object({
    eyebrow: optText,
    title: optText,
    intro: optText,
    limit: z.number().int().positive().optional(),
    statLabel: optText,
    statDescription: optText,
  })
  .prefault({});

const BaseItem = {
  id: text,
  visible: z.boolean().default(true),
  featured: z.boolean().default(false),
  order: z.number().optional(),
};

/* ------------------------------ 1. Site --------------------------------- */

export const SiteSchema = z.object({
  name: text,
  role: text,
  location: optText,
  url: url,
  logo: ImageSchema.extend({
    text: optText,
  }).optional(),
  availability: z
    .object({
      open: z.boolean().default(false),
      label: optText,
    })
    .optional(),
  hero: z
    .object({
      eyebrow: optText,
      headline: optText,
      intro: optText,
      primaryCta: z.object({ label: text, href: text }).optional(),
      secondaryCta: z.object({ label: text, href: text }).optional(),
      poster: ImageSchema.optional(),
    })
    .optional(),
  socials: z
    .array(
      z.object({
        id: text,
        label: text,
        url: text,
        icon: text,
      }),
    )
    .default([]),
  footer: z
    .object({
      intro: optText,
      ctaTitle: optText,
    })
    .optional(),
  seo: SeoSchema,
});

export type Site = z.infer<typeof SiteSchema>;

/* ----------------------------- 2. Profile ------------------------------- */

export const ProfileSchema = z.object({
  page: PageCopy,
  home: z
    .object({
      eyebrow: optText,
      title: optText,
      summary: textList,
      facts: z
        .array(
          z.object({
            label: text,
            value: text,
          }),
        )
        .default([]),
    })
    .prefault({}),
  portrait: ImageSchema.optional(),
  bio: textList,
  resume: z
    .object({
      file: text,
      label: text,
      updated: optText,
    })
    .optional(),
  gallery: z.array(ImageSchema).default([]),
  interests: z
    .object({
      title: optText,
      items: z
        .array(
          z.object({
            id: text,
            title: text,
            description: optText,
            icon: optText,
          }),
        )
        .default([]),
    })
    .optional(),
  hobbies: z
    .object({
      title: optText,
      items: z
        .array(
          z.object({
            id: text,
            title: text,
            description: optText,
            image: ImageSchema.optional(),
          }),
        )
        .default([]),
    })
    .optional(),
  basicInfo: z
    .object({
      title: optText,
      items: z
        .array(
          z.object({
            label: text,
            value: text,
          }),
        )
        .default([]),
    })
    .optional(),
});

export type Profile = z.infer<typeof ProfileSchema>;

/* ---------------------------- 3. Services -------------------------------- */

export const ServiceSchema = z.object({
  ...BaseItem,
  slug: text.regex(/^[a-z0-9-]+$/),
  title: text,
  tagline: optText,
  summary: optText,
  icon: optText,
  definition: textList,
  whyNeeded: z
    .array(
      z.object({
        title: text,
        description: text,
      }),
    )
    .default([]),
  deliverables: textList,
  process: z
    .array(
      z.object({
        title: text,
        description: text,
      }),
    )
    .default([]),
  technologies: z.array(text).default([]),
  idealFor: textList,
  faqs: z
    .array(
      z.object({
        question: text,
        answer: text,
      }),
    )
    .default([]),
  cta: z.object({ label: text }).optional(),
});

export const ServicesFileSchema = z.object({
  page: PageCopy,
  home: HomeCopy,
  items: z.array(ServiceSchema).default([]),
});

export type Service = z.infer<typeof ServiceSchema>;
export type ServicesFile = z.infer<typeof ServicesFileSchema>;

/* --------------------------- 4. Experience ------------------------------- */

export const ExperienceRoleSchema = z.object({
  id: text,
  title: text,
  employmentType: optText,
  mode: optText,
  start: yearMonth,
  end: yearMonth.nullish(),
  summary: optText,
  description: textList,
  responsibilities: textList,
  achievements: textList,
  skills: z.array(text).default([]),
  projects: z.array(text).default([]),
});

export const ExperienceCompanySchema = z.object({
  ...BaseItem,
  company: z.object({
    name: text,
    logo: ImageSchema.optional(),
    url: url,
    location: optText,
  }),
  roles: z.array(ExperienceRoleSchema).default([]),
});

export const ExperienceFileSchema = z.object({
  page: PageCopy,
  home: HomeCopy,
  items: z.array(ExperienceCompanySchema).default([]),
});

export type ExperienceRole = z.infer<typeof ExperienceRoleSchema>;
export type ExperienceCompany = z.infer<typeof ExperienceCompanySchema>;
export type ExperienceFile = z.infer<typeof ExperienceFileSchema>;

/* ---------------------------- 5. Education ------------------------------- */

export const EducationSchema = z.object({
  ...BaseItem,
  degree: text,
  field: optText,
  institution: z.object({
    name: text,
    logo: ImageSchema.optional(),
    url: url,
  }),
  board: optText,
  location: optText,
  start: yearMonth,
  end: yearMonth.nullish(),
  status: z.enum(["completed", "pursuing"]).default("completed"),
  score: z.object({ label: text, value: text }).optional(),
  highlights: textList,
  coursework: textList,
});

export const EducationFileSchema = z.object({
  page: PageCopy,
  home: HomeCopy,
  items: z.array(EducationSchema).default([]),
});

export type Education = z.infer<typeof EducationSchema>;
export type EducationFile = z.infer<typeof EducationFileSchema>;

/* ---------------------------- 6. Projects -------------------------------- */

export const ProjectSchema = z.object({
  ...BaseItem,
  slug: text.regex(/^[a-z0-9-]+$/),
  title: text,
  tagline: optText,
  summary: optText,
  type: z.enum(["professional", "open-source", "freelance", "personal"]),
  organization: z.object({ name: text, url: url }).optional(),
  role: optText,
  status: z.enum(["live", "completed", "in-progress", "archived"]).optional(),
  confidential: z.boolean().default(false),
  timeline: z
    .object({
      start: yearMonth.optional(),
      end: yearMonth.nullish(),
      durationLabel: optText,
    })
    .optional(),
  links: z
    .object({
      github: url,
      live: url,
    })
    .prefault({}),
  cover: ImageSchema.optional(),
  gallery: z.array(ImageSchema).default([]),
  techStack: z
    .array(
      z.object({
        skill: text,
        reason: optText,
      }),
    )
    .default([]),
  writeup: z
    .object({
      overview: textList,
      purpose: textList,
      features: textList,
      challenges: textList,
      outcome: textList,
    })
    .prefault({}),
});

export const ProjectsFileSchema = z.object({
  page: PageCopy,
  home: HomeCopy,
  items: z.array(ProjectSchema).default([]),
});

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectsFile = z.infer<typeof ProjectsFileSchema>;

/* ----------------------------- 7. Skills --------------------------------- */

export const SkillCategorySchema = z.object({
  id: text,
  label: text,
  order: z.number().optional(),
});

export const SkillSchema = z.object({
  ...BaseItem,
  name: text,
  category: text,
  icon: text,
});

export const UsageCopy = z
  .object({
    usedLabel: optText,
    emptyLabel: optText,
    emptyCta: z.object({ label: text, href: text }).optional(),
  })
  .prefault({});

export const SkillsFileSchema = z.object({
  page: PageCopy,
  home: HomeCopy,
  usage: UsageCopy,
  categories: z.array(SkillCategorySchema).default([]),
  items: z.array(SkillSchema).default([]),
});

export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type SkillsFile = z.infer<typeof SkillsFileSchema>;

/* ----------------------------- 8. Contact -------------------------------- */

export const ContactSchema = z.object({
  page: PageCopy,
  email: email,
  phone: optText,
  location: optText,
  responseTime: optText,
  cta: z
    .object({
      title: optText,
      label: optText,
    })
    .optional(),
  form: z
    .object({
      enabled: z.boolean().default(true),
      otherOptionLabel: optText,
      successTitle: optText,
      successMessage: optText,
    })
    .optional(),
});

export type Contact = z.infer<typeof ContactSchema>;
