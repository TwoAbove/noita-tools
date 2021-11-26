export const capitalize = (s: string) =>
	s.toLowerCase().replace(/^\w/, c => c.toUpperCase());

export const includesAll = (arr: string[], target: string[]) =>
	arr.length ? target.every(v => arr.includes(v)) : true;
