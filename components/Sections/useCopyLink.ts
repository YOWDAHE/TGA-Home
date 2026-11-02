"use client";

import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

/** Copies a link to one of this site's pages (e.g. "/resources/2") and confirms with a toast. */
export function useCopyLink() {
	const { toast } = useToast();

	return useCallback(
		async (path: string) => {
			const url = new URL(path, window.location.origin).toString();
			try {
				await navigator.clipboard.writeText(url);
				toast({ title: "Link copied", description: "The page link is on your clipboard." });
			} catch (error) {
				console.error("Error copying link:", error);
				toast({
					title: "Couldn't copy the link",
					description: url,
					variant: "destructive",
				});
			}
		},
		[toast]
	);
}
