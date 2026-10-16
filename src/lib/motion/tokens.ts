export const duration = {
  instant: 0.12, // colour/border feedback
  fast: 0.2, // hover, popover
  base: 0.45, // most reveals
  slow: 0.8, // section headings, image reveals
  cinematic: 1.2, // hero, page curtain, preloader exit
} as const;

// Motion uses cubic-bezier arrays; GSAP uses named eases.
export const ease = {
  out: [0.16, 1, 0.3, 1], // GSAP: "expo.out"     — default for reveals
  inOut: [0.76, 0, 0.24, 1], // GSAP: "power4.inOut" — curtains, transitions
  soft: [0.33, 1, 0.68, 1], // GSAP: "power2.out"   — hovers
} as const;

export const stagger = { tight: 0.04, base: 0.08, loose: 0.12 } as const;

export const distance = { sm: 16, md: 32, lg: 64 } as const; // px for y-offset reveals

export const viewport = { once: true, margin: "0px 0px -12% 0px" } as const;
