const development_hostnames = [".pages.dev", ".ngrok.dev"]

export function is_browser(): boolean {
	return typeof window !== "undefined"
}

export function is_dev(): boolean {
	if (!is_browser()) throw new Error("is_dev can only be called in the browser")
	return development_hostnames.some((hostname) => window.location.hostname.endsWith(hostname))
}
