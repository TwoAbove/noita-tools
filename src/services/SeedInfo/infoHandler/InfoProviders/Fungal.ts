/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import fungalMaterialsData from '../../data/fungal-materials.json';
import { includesSome } from '../../../helpers';
import { IRule } from '../IRule';
import { InfoProvider } from './Base';
import { Global } from './Global';

export class FungalInfoProvider extends InfoProvider {
	fungalData = fungalMaterialsData;
	_G = new Global();

	fungal_shift(
		entity: null,
		x: null,
		y: null,
		debug_no_limits: boolean
	): { flaskTo: boolean; flaskFrom: boolean; from: string[]; to: string } {
		//let parent = EntityGetParent(entity);
		//if (parent != 0) {
		//	entity = parent
		//}

		let iter = this._G.GetValue('fungal_shift_iteration', 0);
		this._G.SetValue('fungal_shift_iteration', iter + 1);
		if (iter > 20 && !debug_no_limits) {
			return { flaskTo: false, flaskFrom: false, from: [], to: '' };
		}

		this.randoms.SetRandomSeed(89346, 42345 + iter);

		let converted_any = false;

		let rnd = this.randoms.random_create(9123, 58925 + iter); // TODO: store for next change
		let from = this.randoms.pick_random_from_table_weighted(
			rnd,
			this.fungalData.materials_from
		);
		let to = this.randoms.pick_random_from_table_weighted(
			rnd,
			this.fungalData.materials_to
		);

		let flaskFrom = false;
		let flaskTo = false;
		// if a potion is equipped, randomly use main material from potion as one of the materials
		if (this.randoms.random_nexti(rnd, 1, 100) <= 75) {
			if (this.randoms.random_nexti(rnd, 1, 100) <= 50) {
				flaskFrom = true;
			} else {
				flaskTo = true;
			}
		}

		let from_materials: string[] = [];
		// apply effects
		let to_material = to.material;
		for (let i = 0; i < from.materials.length; i++) {
			let it = from.materials[i];
			let from_material = it;

			from_materials.push(from_material);
		}
		if (from_materials.length > 1) {
			// Filter out the duplicates
			from_materials = from_materials.filter(m => m !== to_material);
		}
		return { flaskTo, flaskFrom, from: from_materials, to: to_material };
	}

	provide(maxShifts?: number) {
		let debug_no_limits = false;
		this._G.SetValue('fungal_shift_iteration', 0);
		const shifts: Array<ReturnType<FungalInfoProvider['fungal_shift']>> = [];
		if (!maxShifts || maxShifts === -1) maxShifts = 20;
		for (let i = 0; i < maxShifts; i++) {
			shifts.push(this.fungal_shift(null, null, null, false));
		}

		return shifts;
	}

	//   let info: {
	//     flaskTo: boolean;
	//     flaskFrom: boolean;
	//     from: string[];
	//     to: string;
	// }[]

	test(rule: IRule<IFungalRule>): boolean {
		let info = this.provide();
		if (!rule.val) {
			return false;
		}
		for (let i = 0; i <= info.length; i++) {
			if (!rule.val[i]) {
				continue;
			}

			const flaskTo = rule.val[i].flaskTo;
			if (flaskTo && flaskTo !== info[i].flaskTo) {
				return false;
			}

			const flaskFrom = rule.val[i].flaskFrom;
			if (flaskFrom && flaskFrom !== info[i].flaskFrom) {
				return false;
			}

			const from = rule.val[i].from;
			if (
				from &&
				!includesSome(from!.flatMap(l => l.split(',')), info[i].from)
			) {
				return false;
			}

			const to = rule.val[i].to;
			if (to && !to!.includes(info[i].to)) {
				return false;
			}
		}
		return true;
	}
}

export type IFungalRule = Array<{
	from?: string[];
	to?: string;
	flaskFrom?: boolean;
	flaskTo?: boolean;
}>;
