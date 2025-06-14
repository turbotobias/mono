export const get_duration = (then: number): string => {
	const now = performance.now() - then;

	if (now > 1000) return `${(now / 1000).toFixed(2)}s`;

	return `${~~now}ms`;
};
