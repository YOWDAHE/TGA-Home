import Link from "next/link";
import { unsubscribeFromLegalUpdates } from "@/app/actions/legal-updates.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import TopNav from "@/components/Sections/TopNav";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function UnsubscribePage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNav currentHref="/legal-updates" />
        <div className="container mx-auto px-4 py-16 max-w-md">
          <Card>
            <CardContent className="p-8 text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-xl font-bold mb-2">Invalid Link</h1>
              <p className="text-gray-600 mb-6">This unsubscribe link is invalid.</p>
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

  try {
    const res = await unsubscribeFromLegalUpdates(token);
    success = res.status === "success";
    message = res.message;
  } catch {
    success = false;
    message = "Failed to unsubscribe. The link may be invalid.";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav currentHref="/legal-updates" />
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card>
          <CardContent className="p-8 text-center">
            {success ? (
              <>
                <CheckCircle className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h1 className="text-xl font-bold mb-2">Unsubscribed</h1>
                <p className="text-gray-600 mb-6">{message}</p>
              </>
            ) : (
              <>
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-xl font-bold mb-2">Unsubscribe Failed</h1>
                <p className="text-gray-600 mb-6">{message}</p>
              </>
            )}
            <Link href="/legal-updates">
              <Button className="bg-teal-600 hover:bg-teal-700">Back to Legal Updates</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
