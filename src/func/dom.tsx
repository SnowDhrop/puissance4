export function prevent(cb: () => void) {
	return (e: { preventDefault: () => void }) => {
		e.preventDefault();
		cb();
	};
}
