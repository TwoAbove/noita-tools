import React, { FC, useReducer, useState } from 'react';

import SeedSolver from '../../services/seedSolverHandler';
import { ILogicRules, RuleType } from '../../services/SeedInfo/infoHandler/IRule';
import useLocalStorage from '../../services/useLocalStorage';
import copy from 'copy-to-clipboard';
import { avg } from '../../services/helpers';

import cloneDeep from 'lodash/cloneDeep.js';
import uniqueId from 'lodash/uniqueId.js';
import isEqual from 'lodash/isEqual.js';

import { getTreeTools } from './node';
import { RuleConstructors } from './RuleConstructor';
import { CallbackComputeHandler } from '../../services/compute/CallbackComputeHandler';
import { ChunkProvider, Status } from '../../services/compute/ChunkProvider';

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
	const [solverReady, setSolverReady] = React.useState(false);
	const [seedSolver, setSeedSolver] = React.useState(
		() => new SeedSolver(useCores, true)
	);

	const [chunkProvider, setChunkProvider] = React.useState<ChunkProvider>();
	const [callbackComputeHandler, setCallbackComputeHandler] = React.useState<CallbackComputeHandler>();

	const [seedStr, setSeed] = useLocalStorage('search-min-seed', '1');
	const seed = parseInt(seedStr) || 1;

	const [seedEndStr, setSeedEnd] = useLocalStorage('search-max-seed', '');
	const seedEnd = parseInt(seedEndStr) || Math.pow(2, 31);

	const [customSeedList, setCustomSeedList] = useState('');

	const [computeJobName, setComputeJobName] = React.useState('');

	const handleSeedStartChange = (e: any) => {
		setSeed(e.target.value);
	};
	const handleSeedEndChange = (e: any) => {
		setSeedEnd(e.target.value);
	};
	const handleCustomSeedListChange = (e: any) => {
		chunkProvider?.setCustomSeedList(e.target.value.replace(/\D/g, ',').split(',').map((s: string) => parseInt(s)).filter((s: number) => !isNaN(s)));
		setCustomSeedList(e.target.value);
	};

	const [ruleTree, ruleDispatch] = useReducer(ruleReducer, {
		id: uniqueId(),
		type: RuleType.AND,
		rules: [],
		selectedRule: 'search',
	});

	const [solverStatus, setSolverStatus] = React.useState<Status>();
	const running = solverStatus?.running;

	const clearSearch = () => {
		setSolverStatus(undefined);
		if (chunkProvider) {
			chunkProvider.clear();
			chunkProvider.config = {
				...chunkProvider?.config,
				searchFrom: seed,
				searchTo: seedEnd,
				jobName: computeJobName
			};
		}
	}

	const handleMultithreading = () => {
		if (useCores > 1) {
			setUseCores(1);
		} else {
			setUseCores(concurrency);
		}
	};

	React.useEffect(() => {
		if (!chunkProvider) {
			const newChunkProvider = new ChunkProvider({
				chunkSize: 100,
				searchFrom: seed,
				searchTo: seedEnd,
				jobName: computeJobName,
				etaHistoryTimeConstant: 120,
				chunkProcessingTimeTarget: 5,
			});
			setChunkProvider(newChunkProvider);
			return;
		}
		chunkProvider.config = {
			...chunkProvider.config,
			searchFrom: seed,
			searchTo: seedEnd,
			jobName: computeJobName
		};
	}, [seed, seedEnd, computeJobName, chunkProvider]);

	React.useEffect(() => {
		const newSeedSolver = new SeedSolver(useCores, true);
		setSeedSolver(newSeedSolver);
		setSolverReady(false);
		newSeedSolver.workersReadyPromise.then(() => {
			setSolverReady(true);
		}).catch((e) => {
			console.error(e);
		});
		return () => {
			newSeedSolver.destroy();
		}
	}, [useCores]);

	React.useEffect(() => {
		seedSolver.update({
			rules: ruleTree,
			currentSeed: seed,
			seedEnd: seedEnd,
			unlockedSpells,
			findAll,
		});
	}, [seed, seedEnd, ruleTree, unlockedSpells, seedSolver, findAll]);

	React.useEffect(() => {
		if (!chunkProvider || !ruleTree || !seedSolver) {
			return;
		}
		const newCallbackComputeProvider = new CallbackComputeHandler((status) => {
			setSolverStatus(status);
		}, chunkProvider, ruleTree, seedSolver);
		setCallbackComputeHandler(newCallbackComputeProvider);
	}, [seedSolver, ruleTree, chunkProvider]);

	const [lastResultLength, setLastResultLength] = useState(0);

	React.useEffect(() => {
		const currentResultLength = chunkProvider?.results.length || 0;
		if (!findAll && currentResultLength > lastResultLength && solverStatus?.running) {
			callbackComputeHandler?.stop();
			setLastResultLength(currentResultLength);
		}
	}, [findAll, chunkProvider?.results.length, callbackComputeHandler, solverStatus?.running, lastResultLength]);

	const handleCopy = () => {
		const seedList = chunkProvider?.results || [];
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
			body: JSON.stringify(ruleTree)
		};
		fetch('/api/data', requestOptions).catch(e => { });
		await callbackComputeHandler?.start();
	};

	const stopCalculation = async () => {
		await callbackComputeHandler?.stop();
	};

	const seedsChecked = chunkProvider?.progress || 0;
	const totalSeeds = (seedEnd - seed) + 1;
	const percentChecked = Math.floor((seedsChecked / totalSeeds) * 100);
	const seedsPerSecond = solverStatus?.rate;


	const clusterHelpAvailable = false;
	const clusterHelpEnabled = false;
	const toggleClusterHelp = () => { };


	return <SearchContext.Provider value={{
		seedSolver,
		solverStatus,
		solverReady,
		chunkProvider,
		clearSearch,

		clusterHelpAvailable,
		clusterHelpEnabled,
		toggleClusterHelp,

		updateRules,
		handleCopy,
		startCalculation,
		stopCalculation,
		handleSeedStartChange,
		handleSeedEndChange,
		handleCustomSeedListChange,
		handleMultithreading,
		setFindAll,
		ruleDispatch,
		findAll,
		useCores,
		running,
		ruleTree,
		seed,
		seedEnd,
		customSeedList,
		seedsChecked,
		totalSeeds,
		percentChecked,
		seedsPerSecond
	}}>{children}</SearchContext.Provider>;
};


export default SearchContextProvider;
