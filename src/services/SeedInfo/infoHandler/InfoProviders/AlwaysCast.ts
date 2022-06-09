/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import templeData from '../../data/temple-locations.json';
import { IRule } from '../IRule';
import { InfoProvider } from './Base';
import { ACTION_TYPE } from './Wand';

export class AlwaysCastInfoProvider extends InfoProvider {
	temples = templeData;

	provide(
		templeLevel: number,
		perkNumber: number,
		perksOnLevel: number,
		worldOffset = 0
	) {
		const { x: _x, y: _y } = this.temples[templeLevel];
		const y = _y;
		// In Noita's code x is `x + (i-0.5)*item_width`
		// Since we use 0..n-1 instead of 1..n, we use `+ 0.5` since we can
		// think of this as `i + 1 - 0.5`, which can be simplified to
		// `i + 0.5`
		const x =
			this.randoms.RoundHalfOfEven(
				_x + (perkNumber + 0.5) * (60 / perksOnLevel)
			) +
			35840 * worldOffset;
		this.randoms.SetRandomSeed(x, y);

		const good_cards = [
			'DAMAGE',
			'CRITICAL_HIT',
			'HOMING',
			'SPEED',
			'ACID_TRAIL',
			'SINEWAVE'
		];
		let card = good_cards[this.randoms.Random(0, good_cards.length - 1)];

		const r = this.randoms.Random(1, 100);
		const level = 6;

		if (r <= 50) {
			const p = this.randoms.Random(1, 100);
			if (p <= 86) {
				card = this.randoms.GetRandomActionWithType(
					x,
					y,
					level,
					ACTION_TYPE.MODIFIER,
					666
				);
			} else if (p <= 93) {
				card = this.randoms.GetRandomActionWithType(
					x,
					y,
					level,
					ACTION_TYPE.STATIC_PROJECTILE,
					666
				);
			} else if (p < 100) {
				card = this.randoms.GetRandomActionWithType(
					x,
					y,
					level,
					ACTION_TYPE.PROJECTILE,
					666
				);
			} else {
				card = this.randoms.GetRandomActionWithType(
					x,
					y,
					level,
					ACTION_TYPE.UTILITY,
					666
				);
			}
		}

		return card;
	}

	test(rule: IRule): boolean {
		return true;
	}
}
