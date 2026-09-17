"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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

  if (submitted) {
    return (
      <Card className={`border-teal-200 bg-teal-50 ${compact ? "" : "shadow-lg"}`}>
        <CardContent className={`${compact ? "p-4" : "p-6"} text-center`}>
          <CheckCircle className="w-10 h-10 text-teal-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Almost there!</h3>
          <p className="text-sm text-gray-600">
            Check your inbox and click the confirmation link to start receiving legal updates.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-teal-200 ${compact ? "" : "shadow-lg"}`}>
      <CardContent className={compact ? "p-4" : "p-6"}>
        <div className="flex items-center gap-2 mb-3">
          <Mail className="w-5 h-5 text-teal-600" />
          <h3 className={`font-bold text-gray-900 ${compact ? "text-base" : "text-lg"}`}>
            Subscribe to Legal Updates
          </h3>
        </div>
        {!compact && (
          <p className="text-sm text-gray-600 mb-4">
            Get client alerts and regulatory updates delivered to your inbox.
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          {!compact && (
            <div>
              <Input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>
          )}
          <div>
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className={errors.email ? "border-red-400" : ""}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <Button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Subscribing...
              </>
            ) : (
              "Subscribe"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
