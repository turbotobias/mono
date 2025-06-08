export const register_happy_dom_globally = async () => {
	await import("@happy-dom/global-registrator")
		.then((m) => m.GlobalRegistrator.register())
		.catch((err) => {
			console.error(
				"can not register happy dom globally because import failed in register_happy_dom_globally",
				err,
			)
		})
}
