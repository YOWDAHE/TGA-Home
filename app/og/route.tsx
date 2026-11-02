// The link-preview card for every page (1200×630 PNG). Pages point here from lib/seo.ts with the
// title, label and date in the query, so a preview never has to fetch the story, which would
// count a view.
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const NAVY = "#0B1B4D";
const GREEN = "#007A5E";
const MUTED = "#606b80";

const assets = Promise.all([
	readFile(join(process.cwd(), "assets/fonts/Geist-500.ttf")),
	readFile(join(process.cwd(), "assets/fonts/Geist-600.ttf")),
	readFile(join(process.cwd(), "public/logo.svg")),
]);

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

// Shorter titles get bigger type, like the reference card
const titleSize = (title: string, withImage: boolean) => {
	const scale = withImage ? 0.86 : 1;
	if (title.length <= 45) return Math.round(66 * scale);
	if (title.length <= 80) return Math.round(56 * scale);
	return Math.round(46 * scale);
};

/** Fetches a same-site photo for the card; anything else is ignored */
async function loadPhoto(path: string | null, origin: string) {
	if (!path || !path.startsWith("/") || path.startsWith("//")) return null;
	// In production only nginx knows /api-backend, so ask the backend for those files directly
	const backend = process.env.BACKEND_URL?.replace(/\/$/, "");
	const url =
		backend && path.startsWith("/api-backend/")
			? `${backend}/api/${path.slice("/api-backend/".length)}`
			: new URL(path, origin).toString();
	try {
		const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
		const type = res.headers.get("content-type") ?? "";
		// Satori can draw PNG, JPEG and GIF, not WebP or AVIF
		if (!res.ok || !/image\/(png|jpe?g|gif)/.test(type)) return null;
		const data = Buffer.from(await res.arrayBuffer());
		return `data:${type};base64,${data.toString("base64")}`;
	} catch {
		return null;
	}
}

export async function GET(request: NextRequest) {
	const query = request.nextUrl.searchParams;
	const eyebrow = clip(query.get("eyebrow") || "TGA Global", 40);
	const title = clip(query.get("title") || "Ethiopia's most reputable and top-ranked legal firm", 120);
	const date = clip(query.get("date") ?? "", 40);

	const [[medium, semibold, logo], photo] = await Promise.all([
		assets,
		loadPhoto(query.get("image"), request.nextUrl.origin),
	]);
	const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;

	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					padding: "56px 64px 52px",
					backgroundColor: "#f4f6f9",
					backgroundImage: [
						"radial-gradient(circle at 8% 35%, rgba(0,122,94,0.20), rgba(0,122,94,0) 34%)",
						"radial-gradient(circle at 88% 22%, rgba(11,27,77,0.14), rgba(11,27,77,0) 36%)",
						"radial-gradient(circle at 70% 95%, rgba(0,122,94,0.12), rgba(0,122,94,0) 32%)",
						"linear-gradient(rgba(11,27,77,0.045) 1px, transparent 1px)",
						"linear-gradient(90deg, rgba(11,27,77,0.045) 1px, transparent 1px)",
					].join(", "),
					backgroundSize: "100% 100%, 100% 100%, 100% 100%, 56px 56px, 56px 56px",
					fontFamily: "Geist",
				}}
			>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img src={logoSrc} width={152} height={70} alt="" />

				<div
					style={{
						display: "flex",
						marginTop: 34,
						flex: 1,
						backgroundColor: "white",
						borderRadius: 32,
						overflow: "hidden",
						boxShadow: "0 24px 60px rgba(11,27,77,0.10)",
						border: "1px solid rgba(11,27,77,0.06)",
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							flex: 1,
							padding: photo ? "40px 44px 40px 52px" : "40px 56px",
						}}
					>
						<div
							style={{
								display: "flex",
								fontSize: 22,
								fontWeight: 600,
								letterSpacing: 4,
								textTransform: "uppercase",
								color: GREEN,
							}}
						>
							{eyebrow}
						</div>
						<div
							style={{
								display: "block",
								marginTop: 18,
								fontSize: titleSize(title, Boolean(photo)),
								fontWeight: 600,
								lineHeight: 1.12,
								letterSpacing: -1.5,
								color: NAVY,
								lineClamp: 3,
							}}
						>
							{title}
						</div>
						{date && (
							<div style={{ display: "flex", marginTop: 22, fontSize: 26, fontWeight: 500, color: MUTED }}>
								{date}
							</div>
						)}
					</div>
					{photo && (
						// eslint-disable-next-line @next/next/no-img-element
						<img src={photo} alt="" style={{ width: 360, height: "100%", objectFit: "cover" }} />
					)}
				</div>

				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 30 }}>
					<div style={{ display: "flex", fontSize: 26, fontWeight: 500, color: MUTED }}>tgagloballawfirm.com</div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 12,
							padding: "12px 24px",
							borderRadius: 999,
							backgroundColor: NAVY,
							color: "white",
							fontSize: 23,
							fontWeight: 600,
						}}
					>
						<div style={{ display: "flex", width: 11, height: 11, borderRadius: 999, backgroundColor: "#34c39a" }} />
						Ethiopia&apos;s leading law firm
					</div>
				</div>
			</div>
		),
		{
			width: 1200,
			height: 630,
			fonts: [
				{ name: "Geist", data: medium, weight: 500, style: "normal" },
				{ name: "Geist", data: semibold, weight: 600, style: "normal" },
			],
			// The query holds everything drawn, so a given URL always renders the same card
			headers: { "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable" },
		}
	);
}
