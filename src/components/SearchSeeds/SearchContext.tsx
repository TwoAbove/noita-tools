import React, { FC, useEffect, useReducer, useState } from "react";

import SeedSolver from "../../services/seedSolverHandler";
import { ILogicRules, RuleType } from "../../services/SeedInfo/infoHandler/IRule";
import useLocalStorage from "../../services/useLocalStorage";
import copy from "copy-to-clipboard";
import { avg, randomUUID } from "../../services/helpers";

import cloneDeep from "lodash/cloneDeep.js";
import uniqueId from "lodash/uniqueId.js";
import isEqual from "lodash/isEqual.js";
import Cookies from "js-cookie";

import { getTreeTools } from "./node";
import { RuleConstructors } from "./RuleConstructor";
import { CallbackComputeHandler } from "../../services/compute/CallbackComputeHandler";
import { ChunkProvider, Status } from "../../services/compute/ChunkProvider";
import { SocketComputeProvider } from "../../services/compute/SocketComputeProvider";
import SocketHandler from "../../services/socketHandler";
import { ComputeSocket } from "../../services/compute/ComputeSocket";
import { useLiveQuery, useObservable } from "dexie-react-hooks";
import { SearchesItem, db } from "../../services/db";
import { liveQuery } from "dexie";

const treeTools = getTreeTools("id", "rules");

interface IState extends ILogicRules {
  selectedRule: string;
}

interface IAddAction {
  action: "add";
  data: {
    type: string;
    target: string;
  };
}
interface ISelectAction {
  action: "select";
  data: string;
}
interface IUpdateAction {
  action: "update";
  data: {
    id: string;
    config: any;
  };
}
interface IDeleteAction {
  action: "delete";
  data: string;
}
interface IMoveAction {
  action: "move";
  data: {
    source: string;
    dest: string;
  };
}
interface IImportAction {
  action: "import";
  data: string;
}

type IActions = IAddAction | ISelectAction | IUpdateAction | IDeleteAction | IMoveAction | IImportAction;
const ruleReducer = (state: IState, action: IActions) => {
  const newState = cloneDeep(state);
  switch (action.action) {
    case "add": {
      newState.rules.push({
        id: uniqueId(),
        type: action.data.type,
        ...RuleConstructors[action.data.type].defaultConfig,
      });
      return newState;
    }
    case "select": {
      newState.selectedRule = action.data;
      return newState;
    }
    case "update": {
      const { id, config } = action.data;
      const node = treeTools.getById(newState, id);
      if (!node) {
        return state;
      }
      Object.assign(node, config);
      return newState;
    }
    case "delete": {
      const id = action.data;
      treeTools.deleteById(newState, id);
      return newState;
    }
    case "move": {
      const { source, dest } = action.data;
      treeTools.move(newState, source, dest);
      return newState;
    }
    case "import": {
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

// TODO: split this up into separate contexts
export const SearchContext = React.createContext<any>({});
interface SearchContextProviderProps {
  children: any;
}
const SearchContextProvider: FC<SearchContextProviderProps> = ({ children }) => {
  const [currentSearchUUID, setCurrentSearchUUID] = useLocalStorage("search-current-search-uuid", "");

  const [query, setQuery] = React.useState<SearchesItem | undefined>();

  const findAll = query?.config.findAll || false;
  const setFindAll = (value: boolean) => {
    if (!query) {
      return;
    }
    db.searches
      .update(query.id!, {
        config: { ...query.config, findAll: value },
        updatedAt: new Date(),
      })
      .catch(console.error);
  };

  const seed = query?.config.from || 1;
  const setSeed = (value: string) => {
    if (!query) {
      return;
    }
    const from = parseInt(value);
    if (isNaN(from)) {
      return;
    }
    db.searches
      .update(query.id!, {
        config: { ...query.config, from },
        updatedAt: new Date(),
      })
      .catch(console.error);
  };
  const handleSeedStartChange = (e: any) => {
    setSeed(e.target.value);
  };

  const seedEnd = query?.config.to || Math.pow(2, 31);
  const setSeedEnd = (value: string) => {
    if (!query) {
      return;
    }
    const to = parseInt(value);
    if (isNaN(to)) {
      return;
    }
    db.searches
      .update(query.id!, {
        config: { ...query.config, to },
        updatedAt: new Date(),
      })
      .catch(console.error);
  };
  const handleSeedEndChange = (e: any) => {
    setSeedEnd(e.target.value);
  };

  const computeJobName = query?.config.name || "";
  const setComputeJobName = (value: string) => {
    if (!query) {
      return;
    }
    db.searches
      .update(query.id!, {
        config: { ...query.config, name: value },
        updatedAt: new Date(),
      })
      .catch(console.error);
  };
  const [computeJobHash, setComputeJobHash] = React.useState("");
  const handleComputeJobNameChange = async (e: any) => {
    const string = e.target.value;
    setComputeJobName(string);
    const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(string));
    const stringHash = Array.prototype.map.call(new Uint8Array(buf), x => ("00" + x.toString(16)).slice(-2)).join("");
    setComputeJobHash(stringHash);
  };

  const [ruleTree, ruleDispatch] = useReducer(ruleReducer, {
    id: "root",
    type: RuleType.AND,
    rules: [],
    selectedRule: "search",
  });

  useEffect(() => {
    if (!query) {
      return;
    }
    if (isEqual(query.config.rules, ruleTree)) {
      return;
    }
    db.searches
      .update(query.id!, {
        config: { ...query.config, rules: btoa(JSON.stringify(ruleTree)) },
        updatedAt: new Date(),
      })
      .catch(console.error);
  }, [ruleTree, query]);

  const handleImportSearch = (str: string) => {
    const data = JSON.parse(atob(str));
    db.searches
      .add({
        ...data,
        uuid: randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .catch(console.error);
  };

  useEffect(() => {
    // useEffect instead of useLiveQuery because there is some funkiness with equality checks that causes too many re-renders
    const subscription = liveQuery(() => db.searches.get({ uuid: currentSearchUUID })).subscribe({
      next: async newQuery => {
        if (!newQuery) {
          return;
        }
        if (isEqual(newQuery.config, query?.config)) {
          return;
        }

        setQuery(newQuery);

        const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(newQuery.config.name));
        const stringHash = Array.prototype.map
          .call(new Uint8Array(buf), x => ("00" + x.toString(16)).slice(-2))
          .join("");
        setComputeJobHash(stringHash);

        if (!isEqual(newQuery.config.rules, ruleTree)) {
          ruleDispatch({ action: "import", data: newQuery.config.rules });
        }
      },
      error: err => console.error(err),
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [currentSearchUUID, query, ruleTree]);

  const [useCores, setUseCores] = useLocalStorage("useCores", 1);
  const [concurrency] = useLocalStorage("search-max-concurrency", navigator.hardwareConcurrency);
  const handleMultithreading = () => {
    if (useCores > 1) {
      setUseCores(1);
    } else {
      setUseCores(concurrency);
    }
  };
  const [solverReady, setSolverReady] = React.useState(false);
  const [seedSolver, setSeedSolver] = React.useState(() => new SeedSolver(useCores, true));

  const [chunkProvider, setChunkProvider] = React.useState<ChunkProvider>();
  const [callbackComputeHandler, setCallbackComputeHandler] = React.useState<CallbackComputeHandler>();
  const [customSeedList, setCustomSeedList] = useState("");
  const handleCustomSeedListChange = (e: any) => {
    const seedList = e.target.value
      .replace(/\D/g, ",")
      .split(",")
      .map((s: string) => parseInt(s))
      .filter((s: number) => !isNaN(s));
    chunkProvider?.setCustomSeedList(seedList);
    setCustomSeedList(seedList.join(", "));
  };
  React.useEffect(() => {
    if (!chunkProvider) {
      const newChunkProvider = new ChunkProvider({
        chunkSize: 100,
        searchFrom: seed,
        searchTo: seedEnd,
        jobName: computeJobHash,
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
      jobName: computeJobHash,
    };
  }, [seed, seedEnd, computeJobHash, chunkProvider]);

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
        jobName: computeJobHash,
      };
    }
  };

  React.useEffect(() => {
    const newSeedSolver = new SeedSolver(useCores, true);
    setSeedSolver(newSeedSolver);
    setSolverReady(false);
    newSeedSolver.workersReadyPromise
      .then(() => {
        setSolverReady(true);
      })
      .catch(e => {
        console.error(e);
      });
    return () => {
      newSeedSolver.destroy().catch(e => {});
    };
  }, [useCores]);

  const [unlockedSpells] = useLocalStorage<boolean[] | undefined>("unlocked-spells", undefined);

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
    const newCallbackComputeProvider = new CallbackComputeHandler(
      status => {
        setSolverStatus(status);
      },
      chunkProvider,
      ruleTree,
      seedSolver
    );
    setCallbackComputeHandler(newCallbackComputeProvider);
  }, [seedSolver, ruleTree, chunkProvider]);

  const [lastResultLength, setLastResultLength] = useState(0);

  React.useEffect(() => {
    const currentResultLength = chunkProvider?.results.size || 0;
    if (!findAll && currentResultLength > lastResultLength && solverStatus?.running) {
      callbackComputeHandler?.stop();
      setLastResultLength(currentResultLength);
    }
  }, [findAll, chunkProvider?.results.size, callbackComputeHandler, solverStatus?.running, lastResultLength]);

  const handleCopy = () => {
    let seedList: number[] = [];
    if (chunkProvider?.results.size) {
      seedList = [...chunkProvider?.results.values()];
    }
    copy(seedList.join(","));
  };

  const updateRules = rules => {
    seedSolver.update({
      rules,
    });
  };

  const seedsChecked = chunkProvider?.progress || 0;
  const totalSeeds = seedEnd - seed + 1;
  const percentChecked = Math.floor((seedsChecked / totalSeeds) * 100);
  const seedsPerSecond = solverStatus?.rate;

  // Cluster
  const [clusterState, setClusterState] = useState({
    hosts: 0,
    workers: 0,
    appetite: 0,
  });
  const [clusterHelpAvailable, setClusterHelpAvailable] = useState(false);
  const [clusterHelpEnabled, setClusterHelpEnabled] = useState(false);
  const [clusterConnected, setClusterConnected] = useState(false);
  const toggleClusterHelp = () => {
    setClusterHelpEnabled(!clusterHelpEnabled);
  };
  useEffect(() => {
    const getClusterStats = async () => {
      const newClusterState = await fetch("/api/cluster_stats").then(r => r.json());
      if (isEqual(clusterState, newClusterState)) {
        return;
      }
      setClusterState(newClusterState);
      setClusterHelpAvailable(newClusterState.workers > 0);
    };
    const interval = setInterval(() => getClusterStats(), 5000);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getClusterStats();
    return () => clearInterval(interval);
  }, [clusterState]);

  const [socketComputeProvider, setSocketComputeProvider] = useState<SocketComputeProvider>();
  const [computeVersionMismatch, setComputeVersionMismatch] = useState<boolean>(false);
  useEffect(() => {
    if (!clusterHelpEnabled) {
      return;
    }
    if (!chunkProvider) {
      return;
    }

    const newComputeSocket = new ComputeSocket({
      url: window.location.host,
      sessionToken: Cookies.get("noitoolSessionToken"),
      version: process.env.REACT_APP_VERSION!,
      onUpdate: () => {
        setClusterConnected(newComputeSocket.connected);
      },
      isHost: true,
    });

    newComputeSocket.on("compute:version_mismatch", () => {
      setComputeVersionMismatch(true);
      newComputeSocket.stop();
    });

    const newSocketComputeProvider = new SocketComputeProvider(
      status => {
        setSolverStatus(status);
      },
      chunkProvider,
      ruleTree,
      newComputeSocket
    );
    setSocketComputeProvider(newSocketComputeProvider);
    return () => {
      setClusterConnected(false);
      newComputeSocket.stop();
      newSocketComputeProvider.destruct();
    };
  }, [chunkProvider, ruleTree, clusterHelpEnabled]);

  const startCalculation = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ruleTree),
    };
    fetch("/api/data", requestOptions).catch(e => {});
    socketComputeProvider?.start();
    callbackComputeHandler?.start().catch(e => {});
  };

  const stopCalculation = async () => {
    socketComputeProvider?.stop();
    if (chunkProvider?.customSeeds?.length) {
      return;
    }
    await callbackComputeHandler?.stop();
  };

  return (
    <SearchContext.Provider
      value={{
        seedSolver,
        solverStatus,
        solverReady,
        chunkProvider,
        clearSearch,

        currentSearchUUID,
        setCurrentSearchUUID,
        handleImportSearch,

        clusterState,
        clusterHelpAvailable: clusterHelpAvailable && !computeVersionMismatch,
        clusterHelpEnabled,
        socketComputeProvider,
        clusterConnected,
        computeVersionMismatch,
        toggleClusterHelp,

        updateRules,
        handleCopy,
        startCalculation,
        stopCalculation,
        handleSeedStartChange,
        handleSeedEndChange,
        handleCustomSeedListChange,
        computeJobName,
        handleComputeJobNameChange,
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
        seedsPerSecond,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContextProvider;
