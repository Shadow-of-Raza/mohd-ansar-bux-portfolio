import { z } from "zod";

/**
 * Contact form validation schema shared across client and server.
 * Does not import from lib/data and contains no "server-only" guard.
 * Validates name, email, service topic, message, and a hidden honeypot.
 */
export const ContactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name (at least 2 characters)")
    .max(100, "Name must be 100 characters or fewer"),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address")
    .pipe(z.email("Please enter a valid email address")),
  service: z
    .string()
    .trim()
    .min(1, "Please select an option for how I can help"),
  message: z
    .string()
    .trim()
    .min(10, "Please enter a message (at least 10 characters)")
    .max(3000, "Message must be 3,000 characters or fewer"),
  company_website: z
    .string()
    .max(0, "Bot detected")
    .optional()
    .or(z.literal("")),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;

export type ContactActionState = {
  success?: boolean;
  errors?: Partial<Record<keyof ContactFormData, string>>;
  message?: string;
};
