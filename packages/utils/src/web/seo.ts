
export const get_seo = ({
	title,
	description,
	keywords,
	image,
}: {
	title: string
	description?: string
	image?: string
	keywords?: string
}
): Array<{
	title: string
	content?: string
	name?: string
} | {
	title: undefined
	content?: string
	name?: string
}> => {
	const tags = [
		{ title },
		{ name: "description", content: description ?? undefined },
		{ name: "keywords", content: keywords ?? undefined },
		{ name: "twitter:title", content: title ?? undefined },
		{ name: "twitter:description", content: description ?? undefined },
		{ name: "twitter:creator", content: "@turbotobias" },
		{ name: "twitter:site", content: "@turbotobias" },
		{ name: "og:type", content: "website" },
		{ name: "og:title", content: title },
		{ name: "og:description", content: description ?? undefined },
		...(image
			? [
				{ name: "twitter:image", content: image },
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "og:image", content: image },
			]
			: []),
	]

	return tags
}
