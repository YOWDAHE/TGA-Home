import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams();
    ["page", "limit", "sortBy", "order", "q", "category", "content_type"].forEach((key) => {
      const val = searchParams.get(key);
      if (val) params.append(key, val);
    });

    const qs = params.toString();
    const res = await fetch(
      `${BACKEND_URL}/api/legal-updates/public${qs ? `?${qs}` : ""}`,
      { cache: "no-store" },
    );
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ success: false, error: data.message }, { status: res.status });
    }
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch legal updates";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
