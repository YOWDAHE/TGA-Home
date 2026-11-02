"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { subscribeToLegalUpdates } from "@/app/actions/legal-updates.actions";
import { useToast } from "@/hooks/use-toast";

interface LegalUpdatesSubscribeFormProps {
  compact?: boolean;
}

export default function LegalUpdatesSubscribeForm({ compact = false }: LegalUpdatesSubscribeFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const validate = () => {
    const newErrors: { name?: string; email?: string } = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await subscribeToLegalUpdates(email.trim(), name.trim() || undefined);
      setSubmitted(true);
      toast({
        title: "Check your email",
        description: "We sent a confirmation link to complete your subscription.",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Subscription failed";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[#e3e8ef] bg-white px-4 py-3 text-sm text-brand-navy shadow-sm placeholder:text-[#9aa3b5] transition-all focus:border-brand-green focus:outline-none focus:ring-4 focus:ring-brand-tint disabled:opacity-60";

  if (submitted) {
    return (
      <div className={`rounded-3xl bg-brand-tint text-center ring-1 ring-brand-green/15 ${compact ? "p-5" : "p-7"}`}>
        <CheckCircle className="mx-auto mb-3 h-10 w-10 text-brand-green" />
        <h3 className="mb-2 font-semibold text-brand-navy">Almost there!</h3>
        <p className="text-sm text-[#606b80]">
          Check your inbox and click the confirmation link to start receiving legal updates.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative isolate overflow-hidden rounded-3xl bg-brand-navy text-white ${compact ? "p-5" : "p-7"}`}>
      <div aria-hidden className="absolute -right-16 -top-20 -z-10 h-48 w-48 rounded-full bg-brand-green/40 blur-3xl" />
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-brand-tint">
        <Mail className="h-5 w-5" />
      </span>
      <h3 className={`font-semibold tracking-tight ${compact ? "text-base" : "text-xl"}`}>
        Subscribe to Legal Updates
      </h3>
      {!compact && (
        <p className="mt-2 text-sm leading-relaxed text-white/65">
          Get client alerts and regulatory updates delivered to your inbox.
        </p>
      )}
      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        {!compact && (
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className={inputClass}
          />
        )}
        <div>
          <input
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className={`${inputClass} ${errors.email ? "border-red-400" : ""}`}
          />
          {errors.email && <p className="mt-1.5 text-xs text-red-300">{errors.email}</p>}
        </div>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-full bg-white py-3 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-tint disabled:opacity-60"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Subscribing...
            </>
          ) : (
            "Subscribe"
          )}
        </button>
      </form>
    </div>
  );
}
