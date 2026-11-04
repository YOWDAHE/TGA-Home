"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, RotateCw } from "lucide-react";
import ErrorScreen, {
	primaryButtonClass,
	secondaryButtonClass,
} from "@/components/Sections/ErrorScreen";

export default function Error({
	error,
	retry,
}: {
	error: Error & { digest?: string };
	retry: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<ErrorScreen
			label="Something went wrong"
			title="This page didn't load"
			description="We hit a problem loading this page. It's usually temporary, so please try again in a moment."
			actions={
				<>
					<button
						type="button"
						onClick={() => retry()}
						className={primaryButtonClass}
					>
						<RotateCw className="h-4 w-4" />
						Try again
					</button>
					<Link href="/" className={secondaryButtonClass}>
						Back to home
						<ArrowRight className="h-4 w-4" />
					</Link>
				</>
			}
			footnote={error.digest ? <>Reference: {error.digest}</> : undefined}
		/>
	);
}
