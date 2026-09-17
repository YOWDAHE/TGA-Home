import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/api/legal-updates/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data.message, error: data.error },
        { status: res.status },
      );
    }
    return NextResponse.json({ success: true, message: data.message });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to subscribe";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
