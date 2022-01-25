import GameInfoProvider from './infoHandler';

// Jest does not support WASM, so have to test this manually in browser

// Gotten by looking at speed runs on https://www.speedrun.com/noita
const shopInfo = [
	{
		seed: 1661986216,
		infoProvider: new GameInfoProvider({ seed: 1661986216 }),
		types: ['item', 'wand', 'wand', 'item', 'wand', 'wand', 'item']
	},
	{
		seed: 1740143235,
		infoProvider: new GameInfoProvider({ seed: 1740143235 }),
		types: ['wand', 'item', 'wand', 'item', 'wand', 'wand', 'wand']
	},
	{
		seed: 1549453123,
		infoProvider: new GameInfoProvider({ seed: 1549453123 }),
		types: ['wand', 'item', 'item', 'item', 'item', 'item', 'item']
	},
	{
		seed: 1711538246,
		infoProvider: new GameInfoProvider({ seed: 1711538246 }),
		types: ['wand', 'item', 'wand', 'wand', 'wand', 'item', 'item']
	},
	{
		seed: 1238012588,
		infoProvider: new GameInfoProvider({ seed: 1238012588 }),
		types: ['item', 'wand', 'wand', 'wand', 'wand', 'wand', 'wand']
	}
];

const arraysEqual = <T>(a: Array<T>, b: Array<T>) => {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;

	for (var i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	return true;
};

const check = (shop: typeof shopInfo, x: number, y: number) => {
	for (const info of shop) {
		info.infoProvider.randoms.SetWorldSeed(Number(info.seed));
		const out = info.infoProvider.providers.shop
			.provide(new Map(), 0, x, y)
			.map(o => o.type);
		// console.log(out);
		if (!arraysEqual(info.types, out)) {
			return false;
		}
	}
	return true;
};

// const maxY = 100;
// const maxX = 400;
const maxY = 10;
const maxX = 10;

new Promise<void>(async res => {
	const out: { x: number; y: number }[] = [];
	for (const info of shopInfo) {
		while (!info.infoProvider.ready) {
			await new Promise(res => setTimeout(res, 50));
		}
	}

	console.log('All providers ready');

	for (let y = -maxY; y <= maxY; y++) {
		for (let x = -maxX; x <= maxX; x++) {
			if (x % 100 === 0 && y % 100 === 0) {
				console.log(`x: ${x}, y: ${y}`);
			}
			if (check(shopInfo, x, y)) {
				console.log('-------------------------------------------');
				console.log(`Found! x: ${x}, y: ${y}`);
				console.log('-------------------------------------------');
				out.push({ x, y });
			}
		}
	}
	console.log('out', out);
	res();
});
