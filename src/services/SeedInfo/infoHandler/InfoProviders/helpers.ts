export const GameGetDateAndTimeLocal = () => {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth();
	const date = now.getDate();
	const h = now.getHours();
	const m = now.getMinutes();
	const s = now.getSeconds();
	let Jussi = false; // Midsummer Day;
	if (month === 6) {
		const day = now.getDay();
		if (date >= 20 && date <= 26 && day === 6) {
			Jussi = true;
		}
	}
	return [year, month, date, h, m, s, Number(Jussi)];
};

export const isChristmas = () => {
	const [year, month, day] = GameGetDateAndTimeLocal();

	if (month === 12 && day >= 24 && day <= 26) {
		return true;
	} else {
		return false;
	}
};
