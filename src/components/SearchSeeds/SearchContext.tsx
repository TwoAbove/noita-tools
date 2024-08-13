import React, { FC, useContext, useEffect, useReducer, useCallback, useState } from "react";

import { SeedSolver } from "../../services/seedSolverHandler";
import useLocalStorage from "../../services/useLocalStorage";
import copy from "copy-to-clipboard";
import { randomUUID } from "../../services/helpers";

import Cookies from "js-cookie";

import { CallbackComputeHandler } from "../../services/compute/CallbackComputeHandler";
import { ChunkProvider, Status } from "../../services/compute/ChunkProvider";
import { SocketComputeProvider } from "../../services/compute/SocketComputeProvider";
import { ComputeSocket } from "../../services/compute/ComputeSocket";
import { SearchesItem, db } from "../../services/db";

import { ruleReducer, initialRuleState } from "./ruleReducer";

const calculateJobHash = async (string: string) => {
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(string));
  const stringHash = Array.prototype.map.call(new Uint8Array(buf), x => ("00" + x.toString(16)).slice(-2)).join("");
  return stringHash;
};

export const SearchContext = React.createContext<any>({});

const SearchContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSearchUUID, setCurrentSearchUUID] = useLocalStorage("search-current-search-uuid", "");
  const [searchInstance, setQuery] = useState<SearchesItem | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const [ruleTree, ruleDispatch] = useReducer(ruleReducer, initialRuleState);
  const [chunkProvider, setChunkProvider] = useState<ChunkProvider>();
  const [seedSolver, setSeedSolver] = useState(() => new SeedSolver(1, true));
  const [solverStatus, setSolverStatus] = useState<Status>();
  const [computeJobHash, setComputeJobHash] = useState("");

  const [unlockedSpells] = useLocalStorage<boolean[] | undefined>("unlocked-spells", undefined);
  const [useCores, setUseCores] = useLocalStorage("useCores", 1);
  const [concurrency] = useLocalStorage("search-max-concurrency", navigator.hardwareConcurrency);

  const [customSeedList, setCustomSeedList] = useState("");
  const [solverReady, setSolverReady] = useState(false);

  // Cluster-related state
  const [clusterState, setClusterState] = useState({ hosts: 0, workers: 0, appetite: 0 });
  const [clusterHelpAvailable, setClusterHelpAvailable] = useState(false);
  const [clusterHelpEnabled, setClusterHelpEnabled] = useState(false);
  const [clusterConnected, setClusterConnected] = useState(false);
  const [socketComputeProvider, setSocketComputeProvider] = useState<SocketComputeProvider>();
  const [callbackComputeHandler, setCallbackComputeHandler] = useState<CallbackComputeHandler>();
  const [computeVersionMismatch, setComputeVersionMismatch] = useState<boolean>(false);

  // Load query data when currentSearchUUID changes
  useEffect(() => {
    const loadQuery = async () => {
      if (!currentSearchUUID) return;

      setIsLoading(true);
      try {
        const newSearchInstance = await db.searches.get({ uuid: currentSearchUUID });
        if (newSearchInstance) {
          setQuery(newSearchInstance);
          ruleDispatch({ action: "import", data: newSearchInstance.config.rules });
          const newJobHash = await calculateJobHash(newSearchInstance.config.name || "");
          setComputeJobHash(newJobHash);
        }
      } catch (error) {
        console.error("Error loading query:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuery();
  }, [currentSearchUUID]);

  const updateSearchConfig = (config: Partial<SearchesItem["config"]>) => {
    if (searchInstance) {
      db.searches.update(searchInstance.id!, { config: { ...searchInstance.config, ...config } });
      setQuery({ ...searchInstance, config: { ...searchInstance.config, ...config } });
    }
  };

  useEffect(() => {
    if (!searchInstance) return;

    db.searches.update(searchInstance.id!, {
      config: { ...searchInstance.config, rules: btoa(JSON.stringify(ruleTree)) },
    });
  }, [ruleTree]);

  useEffect(() => {
    if (!searchInstance) return;

    const { from: seed, to: seedEnd } = searchInstance.config;

    const updateChunkProvider = () => {
      if (chunkProvider) {
        chunkProvider.config = {
          ...chunkProvider.config,
          searchFrom: seed,
          searchTo: seedEnd,
          jobName: computeJobHash,
        };
      } else {
        const newChunkProvider = new ChunkProvider({
          chunkSize: 100,
          searchFrom: seed,
          searchTo: seedEnd,
          jobName: computeJobHash,
          etaHistoryTimeConstant: 120,
          chunkProcessingTimeTarget: 5,
        });
        setChunkProvider(newChunkProvider);
      }
    };

    const debounceTimer = setTimeout(updateChunkProvider, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchInstance, computeJobHash, chunkProvider]);

  useEffect(() => {
    if (!searchInstance) return;

    const { findAll, from: seed, to: seedEnd } = searchInstance.config;

    seedSolver.update({
      rules: ruleTree,
      currentSeed: seed,
      seedEnd: seedEnd,
      unlockedSpells,
      findAll,
    });
  }, [searchInstance, ruleTree, seedSolver, unlockedSpells]);

  useEffect(() => {
    if (!chunkProvider || !ruleTree || !seedSolver) return;

    const newCallbackComputeHandler = new CallbackComputeHandler(setSolverStatus, chunkProvider, ruleTree, seedSolver);

    setCallbackComputeHandler(newCallbackComputeHandler);

    return () => {
      newCallbackComputeHandler.destruct();
    };
  }, [seedSolver, ruleTree, chunkProvider]);

  const handleMultithreading = useCallback(() => {
    setUseCores(useCores > 1 ? 1 : concurrency);
  }, [useCores, concurrency, setUseCores]);

  useEffect(() => {
    const newSeedSolver = new SeedSolver(useCores, true);
    setSeedSolver(newSeedSolver);
    setSolverReady(false);
    newSeedSolver.workersReadyPromise
      .then(() => {
        setSolverReady(true);
      })
      .catch(console.error);
    return () => {
      newSeedSolver.destroy().catch(console.error);
    };
  }, [useCores]);

  const handleCustomSeedListChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const seedList = e.target.value
        .replace(/\D/g, ",")
        .split(",")
        .map(s => parseInt(s))
        .filter(s => !isNaN(s));
      chunkProvider?.setCustomSeedList(seedList);
      setCustomSeedList(seedList.join(", "));
    },
    [chunkProvider],
  );

  const toggleClusterHelp = useCallback(() => {
    setClusterHelpEnabled(prev => !prev);
  }, []);

  useEffect(() => {
    const getClusterStats = async () => {
      try {
        const newClusterState = await fetch("/api/cluster_stats").then(r => r.json());
        setClusterState(newClusterState);
        setClusterHelpAvailable(newClusterState.workers > 0);
      } catch (error) {
        console.error("Error fetching cluster stats:", error);
      }
    };

    const interval = setInterval(getClusterStats, 5000);
    getClusterStats();
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!clusterHelpEnabled || !chunkProvider || !ruleTree) return;

    const newComputeSocket = new ComputeSocket({
      url: window.location.host,
      sessionToken: Cookies.get("noitoolSessionToken"),
      version: APP_VERSION,
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
      setSolverStatus,
      chunkProvider,
      ruleTree,
      newComputeSocket,
    );
    setSocketComputeProvider(newSocketComputeProvider);

    return () => {
      setClusterConnected(false);
      newComputeSocket.stop();
      newSocketComputeProvider.destruct();
    };
  }, [chunkProvider, ruleTree, clusterHelpEnabled]);

  const startCalculation = useCallback(async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ruleTree),
    };
    fetch("/api/data", requestOptions).catch(console.error);
    socketComputeProvider?.start();
    callbackComputeHandler?.start().catch(console.error);
  }, [ruleTree, socketComputeProvider, callbackComputeHandler]);

  const stopCalculation = useCallback(async () => {
    socketComputeProvider?.stop();
    if (!chunkProvider?.customSeeds?.length) {
      await callbackComputeHandler?.stop();
    }
  }, [socketComputeProvider, callbackComputeHandler, chunkProvider]);

  const handleCopy = useCallback(() => {
    const seedList = chunkProvider?.results.size ? [...chunkProvider.results.values()] : [];
    copy(seedList.join(","));
  }, [chunkProvider]);

  const clearSearch = useCallback(() => {
    setSolverStatus(undefined);
    if (chunkProvider) {
      chunkProvider.clear();
      if (searchInstance) {
        const { from: seed, to: seedEnd } = searchInstance.config;
        chunkProvider.config = {
          ...chunkProvider.config,
          searchFrom: seed,
          searchTo: seedEnd,
          jobName: computeJobHash,
        };
      }
    }
  }, [chunkProvider, searchInstance, computeJobHash]);

  const handleImportSearch = useCallback((str: string) => {
    try {
      const data = JSON.parse(atob(str));
      db.searches
        .add({
          ...data,
          uuid: randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .catch(console.error);
    } catch (error) {
      console.error("Error importing search:", error);
    }
  }, []);

  const running = solverStatus?.running;
  const seedsChecked = chunkProvider?.progress || 0;
  const totalSeeds = searchInstance ? searchInstance.config.to - searchInstance.config.from + 1 : 0;
  const percentChecked = Math.floor((seedsChecked / totalSeeds) * 100);
  const seedsPerSecond = solverStatus?.rate;

  const contextValue = {
    isLoading,
    searchInstance,
    ruleTree,
    ruleDispatch,
    solverReady,
    chunkProvider,
    seedSolver,
    solverStatus,
    computeJobHash,
    unlockedSpells,
    useCores,
    concurrency,
    customSeedList,
    clusterState,
    clusterHelpAvailable: clusterHelpAvailable && !computeVersionMismatch,
    clusterHelpEnabled,
    clusterConnected,
    computeVersionMismatch,
    running,
    seedsChecked,
    totalSeeds,
    percentChecked,
    seedsPerSecond,
    computeJobName: searchInstance?.config.name || "",
    seed: searchInstance?.config.from || 1,
    seedEnd: searchInstance?.config.to || Math.pow(2, 31),
    findAll: searchInstance?.config.findAll || false,
    updateSearchConfig,
    handleMultithreading,
    handleCustomSeedListChange,
    toggleClusterHelp,
    startCalculation,
    stopCalculation,
    handleCopy,
    clearSearch,
    handleImportSearch,
    setCurrentSearchUUID,
  };

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>;
};

export default SearchContextProvider;

export const useSearchContext = () => useContext(SearchContext);
