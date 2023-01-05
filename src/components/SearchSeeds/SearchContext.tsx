import React, { FC, useReducer } from 'react';

import SeedSolver from '../../services/seedSolverHandler';
import { ILogicRules, RuleType } from '../../services/SeedInfo/infoHandler/IRule';
import useLocalStorage from '../../services/useLocalStorage';
import copy from 'copy-to-clipboard';
import { avg } from '../../services/helpers';
import { cloneDeep, uniqueId, isEqual } from 'lodash';
import { getTreeTools } from './node';
import { RuleConstructors } from './RuleConstructor';

const treeTools = getTreeTools('id', 'rules');

interface IState extends ILogicRules {
	selectedRule: string,
}

interface IAddAction {
	action: 'add';
	data: {
		type: string,
		target: string
	};
}
interface ISelectAction {
	action: 'select';
	data: string;
}
interface IUpdateAction {
	action: 'update';
	data: {
		id: string,
		config: any
	};
}
interface IDeleteAction {
	action: 'delete';
	data: string;
}
interface IMoveAction {
	action: 'move';
	data: {
		source: string,
		dest: string
	};
}
interface IImportAction {
	action: 'import';
	data: string;
}

type IActions = IAddAction | ISelectAction | IUpdateAction | IDeleteAction | IMoveAction | IImportAction;
const ruleReducer = (state: IState, action: IActions) => {
	const newState = cloneDeep(state);
	switch (action.action) {
		case 'add': {
			newState.rules.push({
				id: uniqueId(),
				type: action.data.type,
				...RuleConstructors[action.data.type].defaultConfig
			});
			return newState;
		}
		case 'select': {
			newState.selectedRule = action.data;
			return newState;
		}
		case 'update': {
			const { id, config } = action.data;
			const node = treeTools.getById(newState, id);
			if (!node) {
				return state;
			}
			Object.assign(node, config);
			return newState;
		}
		case 'delete': {
			const id = action.data;
			treeTools.deleteById(newState, id);
			return newState
		}
		case 'move': {
			const { source, dest } = action.data;
			treeTools.move(newState, source, dest)
			return newState;
		}
		case 'import': {
			try {
				const str = action.data;
				return JSON.parse(atob(str));
			} catch (e) {
				console.error(e);
			}
		}
	}
	return state;
};

export const SearchContext = React.createContext<any>({});
interface SearchContextProviderProps {
	children: any;
}
const SearchContextProvider: FC<SearchContextProviderProps> = ({
	children
}) => {
	const [unlockedSpells] = useLocalStorage<boolean[] | undefined>('unlocked-spells', undefined);
	const [useCores, setUseCores] = useLocalStorage('useCores', 1);
	const [concurrency] = useLocalStorage('search-max-concurrency', navigator.hardwareConcurrency);

	const [findAll, setFindAll] = useLocalStorage('findAll', false);
	const [seedSolver, setSeedSolver] = React.useState(
		() => new SeedSolver(useCores, true)
	);
	const [seed, setSeed] = React.useState('1');
	const [seedEnd, setSeedEnd] = React.useState('');
	const handleSeedStartChange = (e: any) => {
		setSeed(e.target.value);
	};
	const handleSeedEndChange = (e: any) => {
		setSeedEnd(e.target.value);
	};

	const [ruleTree, ruleDispatch] = useReducer(ruleReducer, {
		id: uniqueId(),
		type: RuleType.AND,
		rules: [],
		selectedRule: 'search',
	});
	// const [ruleTree, ruleDispatch] = useReducer(ruleReducer, {
	// 	id: uniqueId(),
	// 	type: RuleType.AND,
	// 	rules: [
	// 	{
	// 		id: uniqueId(),
	// 		type: 'map',
	// 		...RuleConstructors['map'].defaultConfig
	// 	},
	// ],
	// 	selectedRule: 'search',
	// });
	// const [ruleTree, ruleDispatch] = useReducer(ruleReducer, {
	// 	id: uniqueId(),
	// 	type: RuleType.AND,
	// 	rules: [
	// 		{
	// 			id: uniqueId(),
	// 			type: RuleType.OR,
	// 			rules: [
	// 				{
	// 					id: uniqueId(),
	// 					type: 'alchemy',
	// 					...RuleConstructors['alchemy'].defaultConfig
	// 				},
	// 			],
	// 		},
	// 		{
	// 			id: uniqueId(),
	// 			type: RuleType.NOT,
	// 			rules: [
	// 				{
	// 					id: uniqueId(),
	// 					type: 'shop',
	// 					...RuleConstructors['shop'].defaultConfig
	// 				},
	// 			],
	// 		},
	// 		{
	// 			id: uniqueId(),
	// 			type: 'perk',
	// 			...RuleConstructors['perk'].defaultConfig
	// 		},
	// 	],
	// 	selectedRule: 'search',
	// } as any);
	const [infoArray, setSolverInfo] = React.useState<
		ReturnType<SeedSolver['getInfo']>
	>([]);
	const [solverInfo, ...results] = infoArray;
	const running = !!solverInfo?.running;

	const handleMultithreading = () => {
		if (useCores > 1) {
			setUseCores(1);
		} else {
			setUseCores(concurrency);
		}
	};

	React.useEffect(() => {
		const update = async () => {
			const info = seedSolver.getInfo();
			if (!info || !infoArray) {
				return;
			}
			if (!isEqual(infoArray, info)) {
				console.log(info[0]);
				setSolverInfo(info);
			}
		};

		const id = setInterval(() => update(), 1000);
		return () => clearInterval(id);
	}, [seedSolver, infoArray]);

	React.useEffect(() => {
		const work = async () => {
			await seedSolver.destroy();
			const newSeedSolver = new SeedSolver(useCores, !findAll);
			const newSeed = parseInt(seed);
			const newSeedEnd = parseInt(seedEnd);
			newSeedSolver.update({
				rules: ruleTree,
				currentSeed: newSeed,
				seedEnd: newSeedEnd,
				unlockedSpells,
				findAll,
			});
			if (!isNaN(newSeed)) {
				newSeedSolver.update({
					currentSeed: newSeed,
					seedEnd: newSeedEnd,
					unlockedSpells,
					findAll
				});
			}
			setSeedSolver(newSeedSolver);
		};
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		work(); // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [useCores, seed, seedEnd, findAll, ruleTree, unlockedSpells]);
	// ^
	// seedSolver is both used and set here, so running this
	// again will create a loop
	// useEffect is used here idiomatically, but I'm not sure how to better do this


	const handleCopy = () => {
		const seedList = seedSolver.foundSeeds;
		copy(seedList.join(','));
	}

	const updateRules = (rules) => {
		seedSolver.update({
			rules,
		});
	}

	const startCalculation = async () => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({})
		};
		fetch('/api/data', requestOptions).catch(e => { });

		await seedSolver.start();
	};

	const stopCalculation = async () => {
		await seedSolver.stop();
	};

	const seedsChecked = Math.floor(Math.min(...results.map(i => i.currentSeed)));
	const totalSeeds = 4_294_967_294;
	const percentChecked = Math.floor((seedsChecked / totalSeeds) * 100);
	const seedsPerSecond = Math.floor(seedsChecked / ((new Date().getTime() - seedSolver.startTime) / 1000));

	return <SearchContext.Provider value={{
		seedSolver,
		solverInfo,
		results,
		updateRules,
		handleCopy,
		startCalculation,
		stopCalculation,
		handleSeedStartChange,
		handleSeedEndChange,
		handleMultithreading,
		setFindAll,
		ruleDispatch,
		findAll,
		useCores,
		running,
		ruleTree,
		seed,
		seedEnd,
		seedsChecked,
		totalSeeds,
		percentChecked,
		seedsPerSecond
	}}>{children}</SearchContext.Provider>;
};


export default SearchContextProvider;
