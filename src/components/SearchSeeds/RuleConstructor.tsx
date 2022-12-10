import { RuleType } from '../../services/SeedInfo/infoHandler/IRule';

import Alchemy from './SearchViews/Alchemy';
import Biomes from './SearchViews/Biomes';
import Shop from './SearchViews/Shop';
import StartingFlask from './SearchViews/StartingFlask';
import StartingSpell from './SearchViews/StartingSpell';
import StartingBombSpell from './SearchViews/StartingBomb';
import Rain from './SearchViews/Rain';
import Perks from './SearchViews/Perks';
import FungalShifts from './SearchViews/FungalShifts';
import Search from './SearchViews/Search';
import { FC, useContext } from 'react';
import { Container } from 'react-bootstrap';
import { SearchContext } from './SearchContext';
import { getTreeTools } from './node';
import PacifistChest from './SearchViews/PacifistChest';

const treeTools = getTreeTools('id', 'rules');

export const RuleConstructors = {
	search: {
		Title: () => 'Search',
		Component: Search
	},
	alchemy: {
		Title: () => 'Alchemy',
		Component: Alchemy,
		defaultConfig: {
			path: '',
			params: [],
			val: {
				LC: [],
				AP: []
			}
		}
	},
	shop: {
		Title: () => 'Shop',
		Component: Shop,
		defaultConfig: {
			path: '',
			params: [],
			val: new Array(7).fill(undefined)
		}
	},
	rain: {
		Title: () => 'Rain',
		Component: Rain,
		defaultConfig: {
			path: '',
			params: [],
			val: {
				material: ''
			}
		}
	},
	startingFlask: {
		Title: () => 'Starting Flask',
		Component: StartingFlask,
		defaultConfig: {
			path: '',
			params: [],
			val: ''
		}
	},
	startingSpell: {
		Title: () => 'Starting Spell',
		Component: StartingSpell,
		defaultConfig: {
			path: '',
			params: [],
			val: ''
		}
	},
	startingBombSpell: {
		Title: () => 'Starting Bomb Spell',
		Component: StartingBombSpell,
		defaultConfig: {
			path: '',
			params: [],
			val: ''
		}
	},
	perk: {
		Title: () => 'Perks',
		Component: Perks,
		defaultConfig: {
			path: '',
			params: [],
			val: new Array(7).fill([])
		}
	},
	pacifistChest: {
		Title: () => 'Pacifist Chest',
		Component: PacifistChest,
		defaultConfig: {
			path: '',
			params: [],
			val: new Array(7).fill([])
		}
	},
	fungalShift: {
		Title: () => 'Fungal Shifts',
		Component: FungalShifts,
		defaultConfig: {
			path: '',
			params: [],
			val: new Array(20).fill(undefined)
		}
	},
	biomeModifier: {
		Title: () => 'Biome Modifiers',
		Component: Biomes,
		defaultConfig: {
			path: '',
			params: [],
			val: {}
		}
	},
	[RuleType.AND]: {
		Title: () => 'And',
		defaultConfig: {
			rules: []
		}
	},
	[RuleType.OR]: {
		Title: () => 'Or',
		defaultConfig: {
			rules: []
		}
	},
	[RuleType.NOT]: {
		Title: () => 'Not',
		defaultConfig: {
			rules: []
		}
	}
};
type IRuleConstructor = (typeof RuleConstructors)[keyof typeof RuleConstructors];


interface IRuleConstructorProps {}
const RuleConstructor: FC<IRuleConstructorProps> = () => {
	const { ruleTree, ruleDispatch } = useContext(SearchContext);
	const rule = treeTools.getById(ruleTree, ruleTree.selectedRule);
	if (!rule) {
		return <></>;
	}
	const { Component } = RuleConstructors[rule.type] || {};
	if (!Component) {
		return <></>;
	}
	return (
		<Container fluid id="tab-config">
			<Component
				config={rule}
				key={ruleTree.selectedRule}
				onUpdateConfig={newConfig =>
					ruleDispatch({
						action: 'update',
						data: {
							id: ruleTree.selectedRule,
							config: newConfig
						}
					})
				}
			/>
		</Container>
	);
};
export default RuleConstructor;
