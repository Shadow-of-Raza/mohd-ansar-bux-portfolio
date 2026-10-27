"use client";

import React, { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Send, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ContactFormSchema, type ContactFormData } from "@/lib/validation/contact";
import { sendContactMessage } from "@/app/contact/actions";
import { cn } from "@/lib/utils/cn";

export type ContactFormSectionProps = {
  services: { slug: string; title: string }[];
  otherOptionLabel?: string;
  successTitle?: string;
  successMessage?: string;
  submitLabel?: string;
  className?: string;
};

/**
 * CON-02 Contact Form Section (Client Component).
 * Only section allowed to have "use client".
 * Reads ?service= query param via useSearchParams() to pre-select service options.
 * Validates with shared Zod schema, moves focus to first invalid field on failure,
 * submits via Server Action, and renders accessible success confirmation.
 * Adheres strictly to docs/context/01 §5.9, 02 §6, 03 §6-11, and 05 §4-5.
 */
export function ContactFormSection({
  services = [],
  otherOptionLabel = "Something else",
  successTitle = "Message sent",
  successMessage = "Thanks for reaching out — I will get back to you soon.",
  submitLabel = "Send message",
  className,
}: ContactFormSectionProps) {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service") || "";

  // Prepare select options
  const selectOptions: SelectOption[] = [
    { value: "", label: "Select how I can help..." },
    ...services.map((s) => ({ value: s.slug, label: s.title })),
    { value: "other", label: otherOptionLabel },
  ];

  // Match param against known options
  const matchedService = selectOptions.some((o) => o.value === serviceParam)
    ? serviceParam
    : "";

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    service: matchedService,
    message: "",
    company_website: "",
  });

  // Track previous matchedService to adjust state during render if query param changes
  const [prevMatchedService, setPrevMatchedService] = useState(matchedService);
  if (matchedService !== prevMatchedService) {
    setPrevMatchedService(matchedService);
    if (matchedService) {
      setFormData((prev) => ({ ...prev, service: matchedService }));
    }
  }

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Field refs for focus management on validation failure
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(null);

    // Client-side validation using shared schema
    const parsed = ContactFormSchema.safeParse(formData);

    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof ContactFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      setStatusMessage("Please fix the highlighted errors before submitting.");

      // Focus the first invalid field
      if (fieldErrors.name) {
        nameRef.current?.focus();
      } else if (fieldErrors.email) {
        emailRef.current?.focus();
      } else if (fieldErrors.service) {
        serviceRef.current?.focus();
      } else if (fieldErrors.message) {
        messageRef.current?.focus();
      }
      return;
    }

    // Submit via Server Action
    setIsSubmitting(true);
    setErrors({});

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("email", formData.email);
    submitData.append("service", formData.service);
    submitData.append("message", formData.message);
    submitData.append("company_website", formData.company_website || "");

    try {
      const result = await sendContactMessage({}, submitData);
      setIsSubmitting(false);

      if (result.success) {
        setIsSubmitted(true);
        setStatusMessage(result.message || "Message sent successfully.");
      } else {
        if (result.errors) {
          setErrors(result.errors);
        }
        setStatusMessage(result.message || "Failed to send message. Please try again.");
      }
    } catch {
      setIsSubmitting(false);
      setStatusMessage("A network error occurred. Please try again.");
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      service: matchedService,
      message: "",
      company_website: "",
    });
    setErrors({});
    setIsSubmitted(false);
    setStatusMessage(null);
  };

  return (
    <div
      className={cn(
        "relative rounded-lg border border-line bg-surface-1/90 p-6 sm:p-8 md:p-10 shadow-xl backdrop-blur-sm",
        className,
      )}
    >
      {/* Accessible live status announcer */}
      <div role="status" aria-live="polite" className="sr-only">
        {statusMessage}
      </div>

      {isSubmitted ? (
        /* Editorial Success State Card */
        <div className="py-8 text-center animate-in fade-in-50 duration-300">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-royal/30 text-electric-300">
            <CheckCircle2 className="h-8 w-8" strokeWidth={2} aria-hidden="true" />
          </div>

          <h3 className="mt-5 font-display text-display-xs text-white sm:text-display-sm">
            {successTitle}
          </h3>

          <p className="mt-3 font-body text-lead text-pretty text-fg-muted max-w-[46ch] mx-auto">
            {successMessage}
          </p>

          <div className="mt-8">
            <Button
              type="button"
              variant="secondary"
              size="md"
              icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}
              onClick={handleReset}
            >
              Send another message
            </Button>
          </div>
        </div>
      ) : (
        /* Contact Form */
        <form id="contact-form" onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="space-y-1">
            <h2 className="font-display text-display-xs text-white sm:text-display-sm">
              Send an enquiry
            </h2>
            <p className="font-body text-body text-fg-muted">
              Fill in your details below and I will respond to your consultation or project request.
            </p>
          </div>

          {/* Name & Email Row */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              ref={nameRef}
              id="contact-name"
              name="name"
              label="Your name *"
              placeholder="e.g. Alex Morgan"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              disabled={isSubmitting}
              autoComplete="name"
              required
            />

            <Input
              ref={emailRef}
              id="contact-email"
              name="email"
              type="email"
              label="Email address *"
              placeholder="alex@company.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              disabled={isSubmitting}
              autoComplete="email"
              required
            />
          </div>

          {/* Service / Topic Select */}
          <Select
            ref={serviceRef}
            id="contact-service"
            name="service"
            label="What can I help with? *"
            value={formData.service}
            onChange={handleChange}
            options={selectOptions}
            error={errors.service}
            disabled={isSubmitting}
            required
          />

          {/* Message Textarea */}
          <Textarea
            ref={messageRef}
            id="contact-message"
            name="message"
            label="Your message *"
            placeholder="Tell me about your project, timeline, and goals..."
            rows={5}
            value={formData.message}
            onChange={handleChange}
            error={errors.message}
            disabled={isSubmitting}
            required
          />

          {/* Hidden Anti-Bot Honeypot Field */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="company_website">Do not fill this field</label>
            <input
              type="text"
              id="company_website"
              name="company_website"
              value={formData.company_website}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Error summary banner if server returned general error */}
          {statusMessage && !isSubmitted && Object.keys(errors).length === 0 && (
            <div
              className="rounded-sm border border-electric-200/40 bg-surface-2 p-3 text-small text-electric-200"
              role="alert"
            >
              {statusMessage}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              trailingIcon={<Send className="h-4 w-4" aria-hidden="true" />}
              className="w-full sm:w-auto min-w-[200px]"
            >
              {submitLabel}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
