"use server";

import { ContactFormSchema, type ContactActionState } from "@/lib/validation/contact";

/**
 * Server Action to handle contact form submissions.
 * Performs server-side Zod validation and honeypot spam protection.
 *
 * NOTE (Phase 8 TODO): Actual email sending via Resend API is scheduled
 * for Phase 8. In development (NODE_ENV !== "production"), this action returns
 * mock success after a brief 800ms delay to facilitate UI loading/success testing.
 * In production, it returns an informative error until Resend is configured.
 */
export async function sendContactMessage(
  prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    service: formData.get("service"),
    message: formData.get("message"),
    company_website: formData.get("company_website"),
  };

  const parsed = ContactFormSchema.safeParse(rawData);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as string;
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return {
      success: false,
      errors: fieldErrors,
      message: "Please correct the errors below.",
    };
  }

  // Honeypot check: automated bots populate invisible fields
  if (parsed.data.company_website && parsed.data.company_website.length > 0) {
    // Silently return decoy success for bots
    return { success: true };
  }

  // Dev-only 800ms delay to allow UI loading state capture
  if (process.env.NODE_ENV !== "production") {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      success: true,
      message: "Message received! (Mock delivery in development mode)",
    };
  }

  // Phase 8 TODO: Connect Resend SDK sending here
  return {
    success: false,
    message: "Email delivery service will be fully connected in Phase 8.",
  };
}
