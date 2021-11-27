export const capitalize = (s: string) =>
	s.toLowerCase().replace(/^\w/, c => c.toUpperCase());

export const includesAll = (set: string[], test: string[]) =>
	set.length ? test.every(v => set.includes(v)) : true;
