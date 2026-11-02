/** Tags arrive as "a, b" or "#a #b"; this returns them without the leading # */
export const parseHashtags = (hashtags?: string | null) =>
	(hashtags ?? "")
		.split(/[\s,]+/)
		.map((tag) => tag.replace(/^#/, ""))
		.filter(Boolean);
