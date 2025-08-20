/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  createContext,
  FC,
  memo,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Col, Form, Stack, Modal, Row, Table } from "react-bootstrap";

import GameInfoProvider from "../../../services/SeedInfo/infoHandler";
// WandIcon, LightBulletIcon, Square, IShopType are moved to ShopComponent.tsx
// Entity is moved to PacifistChest.tsx
import { localizeNumber, removeFromArr } from "../../../services/helpers";
import {
  IGenRowAction,
  IPerk,
  IPerkChangeAction,
  IPerkChangeStateType,
  IRerollAction,
  ISelectAction,
  ISetAction,
  IShiftAction,
  PerkInfoProvider,
} from "../../../services/SeedInfo/infoHandler/InfoProviders/Perk";
// IShopType is used by ShopComponent, IShopItems is used by HolyMountainProps and PerkRow
import { IShopItems, ShopInfoProvider, IShopType } from "../../../services/SeedInfo/infoHandler/InfoProviders/Shop";
// Square is used by ShopComponent
import ShopItems from "./ShopItems";
import { useTranslation } from "react-i18next";
import Perk from "../../Icons/Perk";
import { useLiveQuery } from "dexie-react-hooks";
import { db, FavoriteType, FavoriteItem } from "../../../services/db";
import useLocalStorage from "../../../services/useLocalStorage";
import { useSpellFavorite, useFavoritePerks } from "./helpers";
import classNames from "classnames";
// Entity related props are in PacifistChest.tsx
import { IItem } from "../../../services/SeedInfo/infoHandler/InfoProviders/ChestRandom"; // IItem is still needed for pacifistChestItems
import { cloneDeep } from "lodash";

// PerkRow is now used by HolyMountainSimpleView and HolyMountainAdvancedView
// import PerkRow from "./PerkRow"; 
// RerollPane is now part of PerkRow.tsx
import HolyMountainSimpleView from "./HolyMountainSimpleView";
import HolyMountainAdvancedView from "./HolyMountainAdvancedView";

const perkWidth = "3rem";
const gamblePerkDiff = "-0.8rem";

// IRerollPaneProps and RerollPane component moved to RerollPane.tsx
// IPacifistChestProps and PacifistChest component moved to PacifistChest.tsx
// Shop component (now ShopComponent) and its props moved to ShopComponent.tsx

// IPerkRowProps and PerkRow component moved to PerkRow.tsx

const PerkDeckModal = props => {
  const { perkDeck, show, handleClose, isPerkFavorite } = props;
  const [t] = useTranslation("materials");

  return (
    <Modal size="lg" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Perk Deck</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="p-3 justify-content-center align-items-center row-cols-auto">
          {perkDeck
            .map((perk, i) => {
              if (!perk) {
                return false;
              }
              const fav = isPerkFavorite(perk.id);
              return (
                <Col className="p-0 m-1" key={`${perk.id}-${i}`}>
                  <Perk
                    className={classNames(fav && "border border-info border-3")}
                    highlight={fav}
                    width={perkWidth}
                    perk={perk}
                  />
                </Col>
              );
            })
            .filter(Boolean)}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

interface IHolyMountainHeaderProps {
  advanced: boolean;
  rerolls: number;
  price: number;
  total: number;
  canUndo: boolean;
  perkDeck: IPerk[];
  lotteries: number;
  setAdvanced: (boolean) => void;
  handleOffset: (type: "+" | "-") => void;
  offsetText: () => ReactElement;
  handleReset: () => void;
  handleBack: () => void;
  isPerkFavorite: (string) => boolean;
}
const HolyMountainHeader = (props: IHolyMountainHeaderProps) => {
  const {
    canUndo,
    advanced,
    rerolls,
    price,
    total,
    perkDeck,
    lotteries,
    setAdvanced,
    handleOffset,
    handleReset,
    handleBack,
    offsetText,
    isPerkFavorite,
  } = props;

  const [showDeck, setShowDeck] = useState(false);
  const favoritePerks = perkDeck.map(p => p?.id).filter(isPerkFavorite);

  return (
    <>
      <Stack gap={2} direction="horizontal" className="flex-wrap">
        <Stack gap={3} direction="horizontal">
          <Button variant="outline-primary" size="sm" onClick={() => handleOffset("-")}>
            &lt;
          </Button>
          <span className="block capitalize">{offsetText()}</span>
          <Button variant="outline-primary" size="sm" onClick={() => handleOffset("+")}>
            &gt;
          </Button>
        </Stack>
        <div className="ms-auto" />
        <Form.Switch
          checked={advanced}
          onChange={e => {
            setAdvanced(e.target.checked);
          }}
          id="advanced-switch"
          label="Advanced"
        />
        <div className="ms-auto" />
        {advanced ? (
          <Button disabled={!canUndo} onClick={handleBack}>
            Undo
          </Button>
        ) : (
          <div className="ms-auto" />
        )}
        <div className="ms-auto" />
        <Button onClick={() => handleReset()}>Reset</Button>
        <div className="ms-auto" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignSelf: "stretch",
          }}
        >
          <span> Rerolls: {rerolls}</span>
          {!advanced && <span> Next: {localizeNumber(price)}</span>}
          <span> Total: {localizeNumber(total)}</span>
          {/* 50% per stack (multiplicative), rounded down to nearest int */}
          {/* <span>Lottery chance: {Math.floor(Math.pow(0.5, lotteries) * 100)}%</span> */}
        </div>
        <div className="ms-auto" />
        <Button
          className="position-relative"
          size="sm"
          variant="outline-secondary"
          onClick={() => setShowDeck(true)}
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
          }}
        >
          Show <br /> perk deck ({perkDeck.length})
          {favoritePerks.length ? (
            <div className="position-absolute text-info top-0 end-0 pe-1">{favoritePerks.length}</div>
          ) : (
            ""
          )}
        </Button>
      </Stack>
      <PerkDeckModal
        perkDeck={perkDeck}
        show={showDeck}
        isPerkFavorite={isPerkFavorite}
        handleClose={() => setShowDeck(false)}
      />
    </>
  );
};

const getRerollPrices = (perkStack: IPerkChangeAction[]): [Map<number, number[]>, number] => {
  const nextRerollPrices = new Map<number, number[]>();
  nextRerollPrices.set(0, new Array(7));

  let rerollTotal = 0;
  let totalRerolls = 0;
  let offset = 0;

  const getNextPrice = () => {
    const next = 200 * Math.pow(2, totalRerolls);
    // Roughly simulate breaking the perk reroll machine
    // https://youtu.be/DC976SBwSm4
    if (next > 55e12) {
      return 1;
    }
    return next;
  };

  for (const event of perkStack) {
    let rerolls = nextRerollPrices.get(offset)!;
    switch (event.type) {
      case IPerkChangeStateType.reroll: {
        rerollTotal += rerolls[event.data] || 0;
        totalRerolls++;
        const nextPrice = getNextPrice();

        rerolls[event.data] = nextPrice;
        break;
      }
      case IPerkChangeStateType.genRow: {
        const nextPrice = getNextPrice();
        rerolls[event.data] = nextPrice;
        break;
      }
      case IPerkChangeStateType.set: {
        offset = event.data;
        if (!nextRerollPrices.has(offset)) {
          nextRerollPrices.set(offset, new Array(6));
        }
        break;
      }
      case IPerkChangeStateType.shift: {
        offset = event.data;
        if (!nextRerollPrices.has(offset)) {
          nextRerollPrices.set(offset, new Array(6));
        }
        break;
      }
    }
    nextRerollPrices.set(offset, rerolls);
  }

  return [nextRerollPrices, rerollTotal];
};

interface IPerkData {
  perks: IPerk[][];
  pickedPerks: string[][];
  perkRerolls: number[];
  nextRerollPrices: Map<number, number[]>;
  totalRerolls: number;
  rerollPrice: number;
  rerollTotal: number;
  worldOffset: number;
  rerollsToFavorite?: number;
  favoritesInNextReroll?: number;
  isFavorite: (id: string) => boolean;
  lotteries: number;
}

const HolyMountainContext = createContext<any>({});

interface IHolyMountainContextProviderProps {
  infoProvider: GameInfoProvider;
  perks: ReturnType<PerkInfoProvider["provide"]>;
  perkDeck: ReturnType<PerkInfoProvider["getPerkDeck"]>;
  children: any;
}
// This is messy because there are two ways of generating perks: provide() and provideStateful()
// For refactoring, it should be best to have the stateful provide everything and create a transition function
// from action[] => old config.
const HolyMountainContextProvider = (props: IHolyMountainContextProviderProps) => {
  const { infoProvider, perks: simplePerks, perkDeck } = props;
  const [advanced, setAdvanced] = useState(() => infoProvider.config.perksAdvanced);

  const handleAdvancedChange = (value: boolean) => {
    setAdvanced(value);
    infoProvider.updateConfig({ perksAdvanced: value });
  };

  const [perkStacks, setPerkStacks] = useState<IPerkChangeAction[][]>(() => infoProvider.config.perkStacks);
  const perkStack = perkStacks[perkStacks.length - 1];

  const favorites = useFavoritePerks(infoProvider.providers.perk, perkDeck);
  const getPerkData = () => {
    const perk = infoProvider.providers.perk;
    const data = perk.provideStateless(perkStack);
    const hydrated = perk.hydrate(data.perks);
    return {
      ...data,
      perks: hydrated,
    };
  };

  const [pd, setPerkData] = useState<{
    lotteries: number;
    worldOffset: number;
    pickedPerks: string[][];
    perks: IPerk[][];
    perkRerolls: number[];
  }>({
    lotteries: 0,
    worldOffset: 0,
    pickedPerks: [],
    perks: [],
    perkRerolls: [],
  });
  const { worldOffset, pickedPerks, perks, perkRerolls } = pd;

  useEffect(() => {
    const newData = getPerkData();
    infoProvider.updateConfig({
      perkWorldOffset: +newData.worldOffset,
      perkStacks,
    });
    setPerkData(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perkStack]);

  const totalRerolls = advanced
    ? perkStack.reduce((c, n) => {
        return c + (n.type === IPerkChangeStateType.reroll ? 1 : 0);
      }, 0)
    : [...infoProvider.config.perkRerolls.entries()].reduce((c, [, n]) => {
        return c + n.reduce((cc, nn) => cc + nn, 0);
      }, 0);

  const getPrice = (rerolls: number) => 200 * Math.pow(2, rerolls);
  const getTotal = (rerolls = 0) => {
    if (rerolls <= 0) return 0;
    return getTotal(rerolls - 1) + getPrice(rerolls - 1);
  };

  const rerollPrice = getPrice(totalRerolls);

  let [nextRerollPrices, rerollTotal] = getRerollPrices(perkStack);

  if (!advanced) {
    rerollTotal = getTotal(totalRerolls);
  }

  const worldOffsetSimple = +infoProvider.config.perkWorldOffset;

  const handleOffsetAdvanced = (dir: "+" | "-" | number) => {
    let action: IShiftAction | ISetAction;

    if (typeof dir === "number") {
      action = {
        type: IPerkChangeStateType.set,
        data: dir,
      };
    } else {
      action = {
        type: IPerkChangeStateType.shift,
        data: dir === "+" ? 1 : -1,
      };
    }

    setPerkStacks([...perkStacks, [...perkStack, action]]);
  };
  const handleOffsetSimple = (dir: "+" | "-" | number) => {
    if (dir === "+") {
      infoProvider.updateConfig({ perkWorldOffset: +worldOffsetSimple + 1 });
    }
    if (dir === "-") {
      infoProvider.updateConfig({ perkWorldOffset: +worldOffsetSimple - 1 });
    }
    if (typeof dir === "number") {
      infoProvider.updateConfig({ perkWorldOffset: dir });
    }
  };

  const handleGenRowAdvanced = (level: number) => {
    const action: IGenRowAction = {
      type: IPerkChangeStateType.genRow,
      data: level,
    };
    setPerkStacks([...perkStacks, [...perkStack, action]]);
  };

  const handleRerollAdvanced = (e: React.MouseEvent<HTMLButtonElement>, level: number) => {
    e.preventDefault();
    const actions: IPerkChangeAction[] = [];
    actions.push({
      type: IPerkChangeStateType.reroll,
      data: level,
    });
    setPerkStacks([...perkStacks, [...perkStack, ...actions]]);
  };
  const handleRerollSimple = (e: React.MouseEvent<HTMLButtonElement>, level: number) => {
    e.preventDefault();
    const perkRerolls = new Map(infoProvider.config.perkRerolls);
    if (!perkRerolls.has(worldOffsetSimple)) {
      perkRerolls.set(worldOffsetSimple, []);
    }
    const p = perkRerolls.get(worldOffsetSimple)!;
    if (isNaN(p[level])) {
      p[level] = 0;
    }
    p[level] += 1;
    perkRerolls.set(worldOffsetSimple, p);
    infoProvider.updateConfig({ perkRerolls });
  };
  const handleRerollUndoSimple = (e: React.MouseEvent<HTMLButtonElement>, level: number) => {
    e.preventDefault();
    const perkRerolls = new Map(infoProvider.config.perkRerolls);
    if (!perkRerolls.has(worldOffsetSimple)) {
      perkRerolls.set(worldOffsetSimple, []);
    }
    const p = perkRerolls.get(worldOffsetSimple)!;
    if (isNaN(p[level])) {
      p[level] = 0;
    }
    if (p[level] > 0) {
      p[level] -= 1;
    }
    perkRerolls.set(worldOffsetSimple, p);
    infoProvider.updateConfig({ perkRerolls });
  };

  const handleClickPerkAdvanced = (level: number, pos: number) => () => {
    const action: ISelectAction = {
      type: IPerkChangeStateType.select,
      data: {
        row: level,
        pos,
      },
    };

    if (pickedPerks[level] && pickedPerks[level][pos]) {
      return;
    }
    setPerkStacks([...perkStacks, [...perkStack, action]]);
  };
  const handleClickPerkSimple = (level: number, id: string) => () => {
    const pickedPerks = new Map(infoProvider.config.pickedPerks);
    if (!pickedPerks.has(worldOffsetSimple)) {
      pickedPerks.set(worldOffsetSimple, []);
    }
    const p = pickedPerks.get(worldOffsetSimple)!;
    if (p[level]?.includes(id)) {
      // if gamble, remove the gamble ones
      if (id === "GAMBLE") {
        const perkIds = simplePerks[level].map(p => p.id);
        const gamblePerks = perkIds.slice(-2);
        removeFromArr(p[level], gamblePerks[0]);
        removeFromArr(p[level], gamblePerks[1]);
      }
      removeFromArr(p[level], id);
    } else {
      if (!p[level]) {
        p[level] = [];
      }
      p[level].push(id);
    }
    pickedPerks.set(worldOffsetSimple, p);
    infoProvider.updateConfig({ pickedPerks });
  };

  const handleResetAdvanced = () => {
    setPerkStacks([[]]);
  };
  const handleResetSimple = () => {
    const pickedPerks = new Map();
    const perkRerolls = new Map();
    infoProvider.updateConfig({ pickedPerks, perkRerolls, perkWorldOffset: 0 });
  };

  const handleBackAdvanced = () => {
    if (perkStacks.length > 1) {
      perkStacks.pop();
      setPerkStacks([...perkStacks]);
    }
  };

  const perkMethods = {
    handleReroll: advanced ? handleRerollAdvanced : handleRerollSimple,
    handleRerollUndo: advanced ? false : handleRerollUndoSimple,
    handleClickPerk: advanced ? handleClickPerkAdvanced : handleClickPerkSimple,
    handleReset: advanced ? handleResetAdvanced : handleResetSimple,
    handleBack: advanced ? handleBackAdvanced : false,
    handleOffset: advanced ? handleOffsetAdvanced : handleOffsetSimple,
    handleGenRowAdvanced: advanced ? handleGenRowAdvanced : false,
  };

  // For basic mode.
  // If gamble is picked in a row, we need to add the last 2 perks from the row
  // to the pickedPerks.
  const pickedPerksWithGambles = () => {
    const pickedPerks = cloneDeep(infoProvider.config.pickedPerks || new Map());
    for (const [offset, pp] of pickedPerks) {
      if (offset !== worldOffsetSimple) {
        continue;
      }
      for (let i = 0; i < pp.length; i++) {
        if (pp[i]?.includes("GAMBLE")) {
          const perkRow = props.perks[i];
          const p1 = perkRow[perkRow.length - 2].id;
          const p2 = perkRow[perkRow.length - 1].id;
          pp[i].push(p1, p2);
        }
      }
    }
    return pickedPerks;
  };

  const currentPickedPerks = advanced ? pickedPerks : pickedPerksWithGambles().get(worldOffsetSimple) || [];
  const lotteriesSimple = [...pickedPerksWithGambles().values()].reduce((c, n) => {
    return c + n.filter(p => p?.includes("PERKS_LOTTERY")).length;
  }, 0);

  // Adjusting the structure of perkData provided by the context
  const contextOutputPerkData: IPerkData = {
    perks: perks, // This is pd.perks (advanced view perks from provideStateless)
    pickedPerks: currentPickedPerks, // Already mode-aware
    perkRerolls: advanced
      ? perkRerolls // from pd (advanced)
      : infoProvider.config.perkRerolls.get(worldOffsetSimple) || [], // simple mode
    worldOffset: advanced ? worldOffset : worldOffsetSimple, // mode-aware
    lotteries: advanced ? pd.lotteries : lotteriesSimple, // mode-aware
    nextRerollPrices: advanced ? nextRerollPrices : new Map(), // mode-aware (simple gets empty map)
    
    // Common/shared data
    totalRerolls,
    rerollPrice,
    rerollTotal,
    ...favorites, // rerollsToFavorite, favoritesInNextReroll, isFavorite (perk)
  };

  return (
    <HolyMountainContext.Provider value={{ advanced, setAdvanced: handleAdvancedChange, perkMethods, perkData: contextOutputPerkData }}>
      {props.children}
    </HolyMountainContext.Provider>
  );
};

interface IHolyMountainProps {
  shop: ReturnType<ShopInfoProvider["provide"]>;
  perks: ReturnType<PerkInfoProvider["provide"]>;
  perkDeck: ReturnType<PerkInfoProvider["getPerkDeck"]>;
  infoProvider: GameInfoProvider;
}

const HolyMountain = (props: IHolyMountainProps) => {
  const { shop, infoProvider, perkDeck } = props;

  const { advanced, setAdvanced, perkMethods, perkData: contextPerkData } = useContext(HolyMountainContext);
  const {
    handleReroll,
    handleRerollUndo,
    handleClickPerk,
    handleReset,
    handleBack,
    handleOffset,
    handleGenRowAdvanced,
  } = perkMethods;
  const {
    perks: advancedPerks, // Renaming to avoid conflict with props.perks for SimpleView
    pickedPerks,
    perkRerolls,
    totalRerolls, // This is used by HolyMountainHeader
    rerollPrice,  // Used by HolyMountainHeader
    rerollTotal,  // Used by HolyMountainHeader
    worldOffset,  // This is the mode-aware worldOffset from context
    lotteries,    // Mode-aware lotteries from context
    rerollsToFavorite,
    favoritesInNextReroll,
    isFavorite, // This is perk favorite check
    nextRerollPrices, // Mode-aware from context
  } = contextPerkData;

  const [showInitialLottery] = useLocalStorage("show-initial-lottery", true);
  const [showAlwaysCastRow] = useLocalStorage("show-always-cast-row", false);

  // adjustedLotteries uses lotteries from contextPerkData which is already mode-aware.
  const adjustedLotteries = lotteries === 0 ? Number(showInitialLottery) : lotteries;

  const { isFavorite: isSpellFavoriteFn } = useSpellFavorite(); // Renamed to avoid conflict

  // const offset = infoProvider.config.perkWorldOffset;
  const [shopSelected, setShopSelected] = useState(-1);

  const handleOpenShopInfo = (level: number) => {
    setShopSelected(level);
  };

  const pacifistChestItems = useCallback(
    (l, w) => infoProvider.providers.pacifistChest.provide(l, w),
    [infoProvider.providers.pacifistChest],
  );

  const OffsetText = () => {
    const [clicked, setClicked] = useState(false);
    const formRef = useRef<HTMLInputElement>(null);
    let direction = worldOffset === 0 ? "Main" : worldOffset < 0 ? "West" : "East";

    useEffect(() => {
      if (clicked) {
        formRef.current!.focus();
      }
    }, [clicked]);

    return (
      <div
        className={classNames(!clicked && "border border-dark rounded px-3 py-1")}
        onClick={() => {
          setClicked(true);
        }}
      >
        {!clicked && `${direction} World ${Math.abs(worldOffset) || ""}`}
        <Form.Control
          size="sm"
          style={{ width: "8rem" }}
          hidden={!clicked}
          ref={formRef}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          onBlur={e => {
            setClicked(false);
            const value = parseInt(e.target.value);
            if (isNaN(value)) {
              return;
            }
            handleOffset(value);
          }}
          placeholder={worldOffset}
        />
      </div>
    );
  };

  return (
    <div
      style={{
        padding: 0,
        imageRendering: "pixelated",
      }}
    >
      <HolyMountainHeader
        advanced={advanced}
        setAdvanced={setAdvanced}
        rerolls={totalRerolls}
        canUndo={true}
        price={rerollPrice}
        total={rerollTotal}
        perkDeck={perkDeck}
        handleReset={handleReset}
        handleOffset={handleOffset}
        handleBack={handleBack}
        offsetText={OffsetText}
        isPerkFavorite={isFavorite} // Pass the isFavorite from context (perk favorite)
        lotteries={lotteries} // Pass lotteries from context (mode-aware)
      />
      {advanced ? (
        <HolyMountainAdvancedView
          shopData={props.shop}
          perkData={advancedPerks} 
          pickedPerksData={pickedPerks} 
          perkRerollsData={perkRerolls} 
          worldOffsetData={worldOffset} 
          pacifistChestItemsFn={pacifistChestItems}
          infoProvider={props.infoProvider}
          lotteriesData={adjustedLotteries} 
          favoritesData={{ rerollsToFavorite, favoritesInNextReroll, isFavorite }}
          isSpellFavoriteFn={isSpellFavoriteFn}
          onReroll={(e, level) => handleReroll(e, level)}
          onClickPerk={(level, pos) => handleClickPerk(level, pos)}
          onOpenShopInfo={handleOpenShopInfo}
          onLoadPerkRow={(level) => handleGenRowAdvanced(level)}
          showAlwaysCastRow={showAlwaysCastRow}
          nextRerollPricesData={nextRerollPrices}
        />
      ) : (
        <HolyMountainSimpleView
          shopData={props.shop}
          perkData={props.perks} 
          pickedPerksData={pickedPerks} 
          perkRerollsData={perkRerolls} 
          worldOffsetData={worldOffset} 
          pacifistChestItemsFn={pacifistChestItems}
          infoProvider={props.infoProvider}
          lotteriesData={adjustedLotteries} 
          favoritesData={{ rerollsToFavorite, favoritesInNextReroll, isFavorite }}
          isSpellFavoriteFn={isSpellFavoriteFn}
          onReroll={(e, level) => handleReroll(e, level)}
          onRerollUndo={(e, level) => handleRerollUndo(e, level)} 
          onClickPerk={(level, id) => handleClickPerk(level, id)} 
          onOpenShopInfo={handleOpenShopInfo}
          showAlwaysCastRow={showAlwaysCastRow}
          nextRerollPricesData={nextRerollPrices} 
        />
      )}
      {/* 
      The large commented-out Table block that was here has been removed.
      Any other unused variables specific to that old table structure
      would have been implicitly handled by the previous refactoring steps
      where data sourcing was centralized via context or props.
      */}
      <ShopItems
        shop={shop[shopSelected]}
        show={shopSelected >= 0}
        handleClose={() => handleOpenShopInfo(-1)}
        isFavorite={isSpellFavoriteFn} // Use the renamed spell favorite function
      />
    </div>
  );
};

const HolyMountainWrapper = props => ( // Renamed 'e' to 'HolyMountainWrapper' for clarity
  <HolyMountainContextProvider perkDeck={props.perkDeck} perks={props.perks} infoProvider={props.infoProvider}>
    <HolyMountain {...props} />
  </HolyMountainContextProvider>
);

export default HolyMountainWrapper; // Export the wrapper
