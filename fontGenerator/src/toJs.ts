function Random(a?: number, b?: number): number {
	return 1;
}


function ipairs(t: string | any[]) {
	return t;
}

function clamp(val: number, lower: number, upper: number): number {
	if (lower > upper) {
		[lower, upper] = [upper, lower];
	}
	return Math.max(lower, Math.min(upper, val));
}

function GetRandomActionWithType(
	x: number,
	y: number,
	level: number,
	type: number,
	q: number
): string {
	return 'bomb';
}

function EntityGetTransform(is: string): [number, number] {
	return [0, 0];
}

function EntityGetFirstComponent(
	entity_id: any,
	component_type_name: string,
	tag?: string
): string | undefined {
	return '';
}

function ComponentSetValue(
	component_id: string,
	variable_name: string,
	value: number
): void { }

function ComponentSetValueVector2(
	component_id: string,
	variable_name: string,
	x: number,
	y: number
): void { }

// End stubs

const ACTION_TYPE_PROJECTILE = 0;
const ACTION_TYPE_STATIC_PROJECTILE = 1;
const ACTION_TYPE_MODIFIER = 2;
const ACTION_TYPE_DRAW_MANY = 3;
const ACTION_TYPE_MATERIAL = 4;
const ACTION_TYPE_OTHER = 5;
const ACTION_TYPE_UTILITY = 6;
const ACTION_TYPE_PASSIVE = 7;

function AddGunActionPermanent(entity_id: any, action_id: string): void {
	return;
}
function AddGunAction(entity_id: any, action_id: string): void {
	return;
}

interface IGunProps {
	[name: string]: {
		prob: number;
		min: number;
		max: number;
		mean: number;
		sharpness: number;
		extra?: (gun: any) => void;
	}[];
}

const gun_probs: IGunProps = {
	deck_capacity: [
		{ prob: 1, min: 3, max: 10, mean: 6, sharpness: 2 },
		{
			prob: 0.1,
			min: 2,
			max: 7,
			mean: 4,
			sharpness: 4,
			extra: function (gun: { [x: string]: number }) {
				gun['prob_unshuffle'] = gun['prob_unshuffle'] + 0.8;
			}
		},
		{
			prob: 0.05,
			min: 1,
			max: 5,
			mean: 3,
			sharpness: 4,
			extra: function (gun: { [x: string]: number }) {
				gun['prob_unshuffle'] = gun['prob_unshuffle'] + 0.8;
			}
		},
		{ prob: 0.15, min: 5, max: 11, mean: 8, sharpness: 2 },
		{ prob: 0.12, min: 2, max: 20, mean: 8, sharpness: 4 },
		{
			prob: 0.15,
			min: 3,
			max: 12,
			mean: 6,
			sharpness: 6,
			extra: function (gun: { [x: string]: number }) {
				gun['prob_draw_many'] = gun['prob_draw_many'] + 0.8;
			}
		},
		{ prob: 1, min: 1, max: 20, mean: 6, sharpness: 0 }
	],
	reload_time: [
		{ prob: 1, min: 5, max: 60, mean: 30, sharpness: 2 },
		{ prob: 0.5, min: 1, max: 100, mean: 40, sharpness: 2 },
		{ prob: 0.02, min: 1, max: 100, mean: 40, sharpness: 0 },
		{
			prob: 0.35,
			min: 1,
			max: 240,
			mean: 40,
			sharpness: 0,
			extra: function (gun: { [x: string]: number }) {
				gun['prob_unshuffle'] = gun['prob_unshuffle'] + 0.5;
			}
		}
	],
	fire_rate_wait: [
		{ prob: 1, min: 1, max: 30, mean: 5, sharpness: 2 },
		{ prob: 0.1, min: 1, max: 50, mean: 15, sharpness: 3 },
		{ prob: 0.1, min: -15, max: 15, mean: 0, sharpness: 3 },
		{ prob: 0.45, min: 0, max: 35, mean: 12, sharpness: 0 }
	],
	spread_degrees: [
		{ prob: 1, min: -5, max: 10, mean: 0, sharpness: 3 },
		{ prob: 0.1, min: -35, max: 35, mean: 0, sharpness: 0 }
	],
	speed_multiplier: [
		{ prob: 1, min: 0.8, max: 1.2, mean: 1, sharpness: 6 },
		{ prob: 0.05, min: 1, max: 2, mean: 1.1, sharpness: 3 },
		{ prob: 0.05, min: 0.5, max: 1, mean: 0.9, sharpness: 3 },
		{ prob: 1, min: 0.8, max: 1.2, mean: 1, sharpness: 0 },
		{ prob: 0.001, min: 1, max: 10, mean: 5, sharpness: 2 }
	],
	actions_per_round: [
		{ prob: 1, min: 1, max: 3, mean: 1, sharpness: 3 },
		{ prob: 0.2, min: 2, max: 4, mean: 2, sharpness: 8 },
		{ prob: 0.05, min: 1, max: 5, mean: 2, sharpness: 2 },
		{ prob: 1, min: 1, max: 5, mean: 2, sharpness: 0 }
	]
};

function shuffleTable(t: any[]): void {
	let iterations = t.length;
	let j;
	for (let i = iterations; i <= 2; i += -1) {
		j = Random(1, i);
		[t[i], t[j]] = [t[j], t[i]];
	}
}

function total_prob(gun_prob: IGunProps[string]): number {
	return gun_prob.reduce((c, p) => c + p.prob, 0);
}

function get_gun_probs(what: string): IGunProps[string][number] | undefined {
	if (gun_probs[what] === undefined) {
		return undefined;
	}
	let r = Random() * total_prob(gun_probs[what]);
	for (const v of gun_probs[what]) {
		if (v.prob !== undefined) {
			if (r <= v.prob) {
				return v;
			}
			r = r - v.prob;
		}
	}
	return undefined;
}

function apply_random_variable(t_gun: IGun, variable: string): void {
	let cost = t_gun['cost'];
	let probs = get_gun_probs(variable);
	if (!probs) {
		return;
	}
	if (variable === 'reload_time') {
		let min = clamp(60 - cost * 5, 1, 240);
		let max = 1024;
		t_gun[variable] = clamp(
			RandomDistribution(probs.min, probs.max, probs.mean, probs.sharpness),
			min,
			max
		);
		t_gun['cost'] = t_gun['cost'] - (60 - t_gun[variable]) / 5;
		return;
	}
	if (variable === 'fire_rate_wait') {
		let min = clamp(16 - cost, -50, 50);
		let max = 50;
		t_gun[variable] = clamp(
			RandomDistribution(probs.min, probs.max, probs.mean, probs.sharpness),
			min,
			max
		);
		t_gun['cost'] = t_gun['cost'] - (16 - t_gun[variable]);
		return;
	}
	if (variable === 'spread_degrees') {
		let min = clamp(cost / -1.5, -35, 35);
		let max = 35;
		t_gun[variable] = clamp(
			RandomDistribution(probs.min, probs.max, probs.mean, probs.sharpness),
			min,
			max
		);
		t_gun['cost'] = t_gun['cost'] - (16 - t_gun[variable]);
		return;
	}
	if (variable === 'speed_multiplier') {
		t_gun[variable] = RandomDistributionf(
			probs.min,
			probs.max,
			probs.mean,
			probs.sharpness
		);
		t_gun['cost'] = t_gun['cost'] - 0;
		return;
	}
	if (variable === 'deck_capacity') {
		let min = 1;
		let max = clamp(cost / 5 + 6, 1, 20);
		if (t_gun['force_unshuffle'] === 1) {
			min = 1;
			max = (cost - 15) / 5;
			if (max > 6) {
				max = 6 + (cost - (15 + 6 * 5)) / 10;
			}
		}
		max = clamp(max, 1, 20);
		t_gun[variable] = clamp(
			RandomDistribution(probs.min, probs.max, probs.mean, probs.sharpness),
			min,
			max
		);
		t_gun['cost'] = t_gun['cost'] - (t_gun[variable] - 6) * 5;
		return;
	}
	let deck_capacity = t_gun['deck_capacity'];
	if (variable === 'shuffle_deck_when_empty') {
		let random = Random(0, 1);
		if (t_gun['force_unshuffle'] === 1) {
			random = 1;
			if (cost < 15 + deck_capacity * 5) {
			}
		}
		if (random === 1 && cost >= 15 + deck_capacity * 5 && deck_capacity <= 9) {
			t_gun[variable] = 0;
			t_gun['cost'] = t_gun['cost'] - (15 + deck_capacity * 5);
		}
		return;
	}
	if (variable === 'actions_per_round') {
		let action_costs = [
			0,
			5 + deck_capacity * 2,
			15 + deck_capacity * 3.5,
			35 + deck_capacity * 5,
			45 + deck_capacity * deck_capacity
		];
		let min = 1;
		let max = 1;
		for (let i = 0; i < action_costs.length; i++) {
			const acost = action_costs[i];
			if (acost <= cost) {
				max = i + 1;
			}
		}

		max = clamp(max, 1, deck_capacity);
		t_gun[variable] = Math.floor(
			clamp(
				RandomDistribution(probs.min, probs.max, probs.mean, probs.sharpness),
				min,
				max
			)
		);
		let temp_cost =
			action_costs[clamp(t_gun[variable], 1, action_costs.length)];
		t_gun['cost'] = t_gun['cost'] - temp_cost;
		return;
	}
}
function WandDiff(
	gun: {
		fire_rate_wait?: any;
		actions_per_round?: any;
		shuffle_deck_when_empty?: any;
		deck_capacity?: any;
		spread_degrees?: any;
		reload_time?: any;
	},
	wand: {
		fire_rate_wait: number;
		actions_per_round: number;
		shuffle_deck_when_empty: number;
		deck_capacity: number;
		spread_degrees: number;
		reload_time: number;
	}
): number {
	let score = 0;
	score = score + Math.abs(gun.fire_rate_wait - wand.fire_rate_wait) * 2;
	score = score + Math.abs(gun.actions_per_round - wand.actions_per_round) * 20;
	score =
		score +
		Math.abs(gun.shuffle_deck_when_empty - wand.shuffle_deck_when_empty) * 30;
	score = score + Math.abs(gun.deck_capacity - wand.deck_capacity) * 5;
	score = score + Math.abs(gun.spread_degrees - wand.spread_degrees);
	score = score + Math.abs(gun.reload_time - wand.reload_time);
	return score;
}
function GetWandUI(gun: IGun) {
	let best_wand = undefined;
	let best_score = 1000;
	let gun_in_wand_space = {} as any;
	gun_in_wand_space.fire_rate_wait = clamp(
		(gun['fire_rate_wait'] + 5) / 7 - 1,
		0,
		4
	);
	gun_in_wand_space.actions_per_round = clamp(
		gun['actions_per_round'] - 1,
		0,
		2
	);
	gun_in_wand_space.shuffle_deck_when_empty = clamp(
		gun['shuffle_deck_when_empty'],
		0,
		1
	);
	gun_in_wand_space.deck_capacity = clamp((gun['deck_capacity'] - 3) / 3, 0, 7);
	gun_in_wand_space.spread_degrees = clamp(
		(gun['spread_degrees'] + 5) / 5 - 1,
		0,
		2
	);
	gun_in_wand_space.reload_time = clamp(
		(gun['reload_time'] + 5) / 25 - 1,
		0,
		2
	);
	for (const wand of wands) {
		let score = WandDiff(gun_in_wand_space, wand);
		if (score <= best_score) {
			best_wand = wand;
			best_score = score;
			if (score === 0 && Random(0, 100) < 33) {
				return best_wand;
			}
		}
	}
	return best_wand;
}

interface IGun {
	cost: number;
	deck_capacity: number;
	actions_per_round: number;
	reload_time: number;
	shuffle_deck_when_empty: number;
	fire_rate_wait: number;
	spread_degrees: number;
	speed_multiplier: number;
	prob_unshuffle: number;
	prob_draw_many: number;
	mana_charge_speed: number;
	mana_max: number;
	force_unshuffle: number;
	is_rare: number;
}

function get_gun_data(cost: number, level: number, force_unshuffle: any): any {
	if (level === 1) {
		if (Random(0, 100) < 50) {
			cost = cost + 5;
		}
	}
	cost = cost + Random(-3, 3);
	const gun: IGun = {
		cost: cost,
		deck_capacity: 0,
		actions_per_round: 0,
		reload_time: 0,
		shuffle_deck_when_empty: 1,
		fire_rate_wait: 0,
		spread_degrees: 0,
		speed_multiplier: 0,
		prob_unshuffle: 0.1,
		prob_draw_many: 0.15,
		mana_charge_speed: 50 * level + Random(-5, 5 * level),
		mana_max: 50 + 150 * level + Random(-5, 5) * 10,
		force_unshuffle: 0,
		is_rare: 0
	};
	let p = Random(0, 100);
	if (p < 20) {
		gun['mana_charge_speed'] = (50 * level + Random(-5, 5 * level)) / 5;
		gun['mana_max'] = (50 + 150 * level + Random(-5, 5) * 10) * 3;
	}
	p = Random(0, 100);
	if (p < 15) {
		gun['mana_charge_speed'] = (50 * level + Random(-5, 5 * level)) * 5;
		gun['mana_max'] = (50 + 150 * level + Random(-5, 5) * 10) / 3;
	}
	if (gun['mana_max'] < 50) {
		gun['mana_max'] = 50;
	}
	if (gun['mana_charge_speed'] < 10) {
		gun['mana_charge_speed'] = 10;
	}
	p = Random(0, 100);
	if (p < 15 + level * 6) {
		gun['force_unshuffle'] = 1;
	}
	p = Random(0, 100);
	if (p < 5) {
		gun['is_rare'] = 1;
		gun['cost'] = gun['cost'] + 65;
	}
	const variables_01 = [
		'reload_time',
		'fire_rate_wait',
		'spread_degrees',
		'speed_multiplier'
	];
	const variables_02 = ['deck_capacity'];
	const variables_03 = ['shuffle_deck_when_empty', 'actions_per_round'];
	shuffleTable(variables_01);
	if (gun['force_unshuffle'] !== 1) {
		shuffleTable(variables_03);
	}
	for (const v of variables_01) {
		apply_random_variable(gun, v);
	}
	for (const v of variables_02) {
		apply_random_variable(gun, v);
	}
	for (const v of variables_03) {
		apply_random_variable(gun, v);
	}
	if (gun['cost'] > 5 && Random(0, 1000) < 995) {
		if (gun['shuffle_deck_when_empty'] === 1) {
			gun['deck_capacity'] = gun['deck_capacity'] + gun['cost'] / 5;
			gun['cost'] = 0;
		} else {
			gun['deck_capacity'] = gun['deck_capacity'] + gun['cost'] / 10;
			gun['cost'] = 0;
		}
	}
	if (force_unshuffle) {
		gun['shuffle_deck_when_empty'] = 0;
	}
	if (Random(0, 10000) <= 9999) {
		gun['deck_capacity'] = clamp(gun['deck_capacity'], 2, 26);
	}
	if (gun['deck_capacity'] <= 1) {
		gun['deck_capacity'] = 2;
	}
	if (gun['reload_time'] >= 60) {
		function random_add_actions_per_round(): void {
			gun['actions_per_round'] = gun['actions_per_round'] + 1;
			if (Random(0, 100) < 70) {
				random_add_actions_per_round();
			}
		}
		random_add_actions_per_round();
		if (Random(0, 100) < 50) {
			let new_actions_per_round = gun['deck_capacity'];
			for (let i = 1; i <= 6; i++) {
				let temp_actions_per_round = Random(
					gun['actions_per_round'],
					gun['deck_capacity']
				);
				if (temp_actions_per_round < new_actions_per_round) {
					new_actions_per_round = temp_actions_per_round;
				}
			}
			gun['actions_per_round'] = new_actions_per_round;
		}
	}
	gun['actions_per_round'] = clamp(
		gun['actions_per_round'],
		1,
		gun['deck_capacity']
	);
	return gun;
}

interface IGunCards {
	cards: string[],
	permanentCard ?: string;
}
function wand_add_random_cards(
	x: number,
	y: number,
	gun: IGun,
	level = 1
): IGunCards {
	const res: IGunCards = {
		cards: [] as string[]
	};

	const AddGunAction = (card: string) => {
		res.cards.push(card);
	};

	const AddGunActionPermanent = (card: string) => {
		res.permanentCard = card;
	};

	let is_rare = gun['is_rare'];
	let good_cards = 5;
	if (Random(0, 100) < 7) {
		good_cards = Random(20, 50);
	}
	if (is_rare === 1) {
		good_cards = good_cards * 2;
	}
	const orig_level = level;
	level = level - 1;
	let deck_capacity = gun['deck_capacity'];
	let actions_per_round = gun['actions_per_round'];
	let card_count = Random(1, 3);
	let bullet_card = GetRandomActionWithType(
		x,
		y,
		level,
		ACTION_TYPE_PROJECTILE,
		0
	);
	let card = '';
	let random_bullets = 0;
	let good_card_count = 0;
	if (Random(0, 100) < 50 && card_count < 3) {
		card_count = card_count + 1;
	}
	if (Random(0, 100) < 10 || is_rare === 1) {
		card_count = card_count + Random(1, 2);
	}
	good_cards = Random(5, 45);
	card_count = Random(0.51 * deck_capacity, deck_capacity);
	card_count = clamp(card_count, 1, deck_capacity - 1);
	if (Random(0, 100) < orig_level * 10 - 5) {
		random_bullets = 1;
	}
	if (Random(0, 100) < 4 || is_rare === 1) {
		let p = Random(0, 100);
		if (p < 77) {
			card = GetRandomActionWithType(
				x,
				y,
				level + 1,
				ACTION_TYPE_MODIFIER,
				666
			);
		} else if (p < 77) {
			card = GetRandomActionWithType(
				x,
				y,
				level + 1,
				ACTION_TYPE_MODIFIER,
				666
			);
		} else if (p < 77) {
			card = GetRandomActionWithType(
				x,
				y,
				level + 1,
				ACTION_TYPE_MODIFIER,
				666
			);
		} else {
			card = GetRandomActionWithType(
				x,
				y,
				level + 1,
				ACTION_TYPE_PROJECTILE,
				666
			);
		}
		AddGunActionPermanent(card);
	}
	if (Random(0, 100) < 50) {
		let extra_level = +level;
		while (Random(1, 10) === 10) {
			extra_level = extra_level + 1;
			bullet_card = GetRandomActionWithType(
				x,
				y,
				extra_level,
				ACTION_TYPE_PROJECTILE,
				0
			);
		}
		if (card_count < 3) {
			if (card_count > 1 && Random(0, 100) < 20) {
				card = GetRandomActionWithType(x, y, level, ACTION_TYPE_MODIFIER, 2);
				AddGunAction(card);
				card_count = card_count - 1;
			}
			for (let i = 1; i <= card_count; i++) {
				AddGunAction(bullet_card);
			}
		} else {
			if (Random(0, 100) < 40) {
				card = GetRandomActionWithType(x, y, level, ACTION_TYPE_DRAW_MANY, 1);
				AddGunAction(card);
				card_count = card_count - 1;
			}
			if (card_count > 3 && Random(0, 100) < 40) {
				card = GetRandomActionWithType(x, y, level, ACTION_TYPE_DRAW_MANY, 1);
				AddGunAction(card);
				card_count = card_count - 1;
			}
			if (Random(0, 100) < 80) {
				card = GetRandomActionWithType(x, y, level, ACTION_TYPE_MODIFIER, 2);
				AddGunAction(card);
				card_count = card_count - 1;
			}
			for (let i = 1; i <= card_count; i++) {
				AddGunAction(bullet_card);
			}
		}
	} else {
		for (let i = 1; i <= card_count; i++) {
			if (Random(0, 100) < good_cards && card_count > 2) {
				if (good_card_count === 0 && actions_per_round === 1) {
					card = GetRandomActionWithType(x, y, level, ACTION_TYPE_DRAW_MANY, i);
					good_card_count = good_card_count + 1;
				} else {
					if (Random(0, 100) < 83) {
						card = GetRandomActionWithType(
							x,
							y,
							level,
							ACTION_TYPE_MODIFIER,
							i
						);
					} else {
						card = GetRandomActionWithType(
							x,
							y,
							level,
							ACTION_TYPE_DRAW_MANY,
							i
						);
					}
				}
				AddGunAction(card);
			} else {
				AddGunAction(bullet_card);
				if (random_bullets === 1) {
					bullet_card = GetRandomActionWithType(
						x,
						y,
						level,
						ACTION_TYPE_PROJECTILE,
						i
					);
				}
			}
		}
	}
	return res;
}

function generate_gun(
	x: number,
	y: number,
	cost: any,
	level: any,
	force_unshuffle: any
) {
	SetRandomSeed(x, y);
	const gun = get_gun_data(cost, level, force_unshuffle);
	const ui = GetWandUI(gun);
	const cards = wand_add_random_cards(x, y, gun, level);
}

function SetRandomSeed(x: number, y: number) { }
