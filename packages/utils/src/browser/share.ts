"use client"
// import { toast } from "sonner"
import { handle } from "../error/error-handler"
import { log } from "../log/increment"

export const handle_native_share = async (data: ShareData): Promise<void> => {
	const result = await handle({
		fn: () => navigator.share(data),
		on_error: {
			message: "Kan ikke dele",
			details: true,
		},
	})

	if (!result && data.url) {
		handle_copy_to_clipboard(data.url)
	} else if (!result && data.text) {
		handle_copy_to_clipboard(data.text)
	}
}

export const handle_copy_to_clipboard = async (text_to_copy: string): Promise<void> => {
	await handle({
		fn: () => navigator.clipboard.writeText(text_to_copy),
		on_success: {
			message: "Kopiert til utklippstavlen",
			show: true,
		},
		on_error: {
			message: "Kunne ikke kopiere til utklippstavlen",
			details: true,
		},
	})
}

export const handle_share = async (data: ShareData): Promise<void> => {
	if ("share" in navigator) {
		await handle_native_share(data)
	} else if (data.url) {
		handle_copy_to_clipboard(data.url)
	} else if (data.text) {
		handle_copy_to_clipboard(data.text)
	} else {
		log.error("Kan ikke dele uten innhold")
	}
}
