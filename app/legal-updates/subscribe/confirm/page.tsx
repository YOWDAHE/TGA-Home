import Link from "next/link";
import { confirmSubscription } from "@/app/actions/legal-updates.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import Header from "@/components/Sections/Header";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ConfirmSubscriptionPage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-24 mt-16 max-w-md">
          <Card>
            <CardContent className="p-8 text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-xl font-bold mb-2">Invalid Link</h1>
              <p className="text-gray-600 mb-6">This confirmation link is invalid or has expired.</p>
              <Link href="/legal-updates">
                <Button className="bg-teal-600 hover:bg-teal-700">Back to Legal Updates</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  let success = false;
  let message = "";
  let email = "";

  try {
    const res = await confirmSubscription(token);
    success = res.status === "success";
    message = res.message;
    email = res.data?.email || "";
  } catch {
    success = false;
    message = "Invalid or expired confirmation link.";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-24 mt-16 max-w-md">
        <Card>
          <CardContent className="p-8 text-center">
            {success ? (
              <>
                <CheckCircle className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h1 className="text-xl font-bold mb-2">Subscription Confirmed!</h1>
                <p className="text-gray-600 mb-2">{message}</p>
                {email && <p className="text-sm text-gray-500 mb-6">{email}</p>}
              </>
            ) : (
              <>
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-xl font-bold mb-2">Confirmation Failed</h1>
                <p className="text-gray-600 mb-6">{message}</p>
              </>
            )}
            <Link href="/legal-updates">
              <Button className="bg-teal-600 hover:bg-teal-700">Browse Legal Updates</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
