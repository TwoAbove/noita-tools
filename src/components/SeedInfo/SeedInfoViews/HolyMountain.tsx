/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, FC, memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button, Col, Form, Stack, Modal, Row, Table } from "react-bootstrap";

import GameInfoProvider from "../../../services/SeedInfo/infoHandler";
import WandIcon from "../../Icons/Wand";
import LightBulletIcon from "../../Icons/LightBullet";
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
import { IShopItems, IShopType, ShopInfoProvider } from "../../../services/SeedInfo/infoHandler/InfoProviders/Shop";
import { Square } from "../../helpers";
import ShopItems from "./ShopItems";
import { useTranslation } from "react-i18next";
import Perk from "../../Icons/Perk";
import { useLiveQuery } from "dexie-react-hooks";
import { db, FavoriteType, FavoriteItem } from "../../../services/db";
import useLocalStorage from "../../../services/useLocalStorage";
import { useSpellFavorite, useFavoritePerks } from "./helpers";
import classNames from "classnames";
import Entity from "../../Icons/Entity";
import { IItem } from "../../../services/SeedInfo/infoHandler/InfoProviders/ChestRandom";
import { cloneDeep } from "lodash";

const perkWidth = "3rem";
const gamblePerkDiff = "-0.8rem";

interface IRerollPaneProps {
  handleRerollUndo?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  loaded: boolean;
  advanced: boolean;
  rerollsForLevel: number;
  nextRerollPrices: number;
  rerollsToFavorite?: number;
  favoritesInNextReroll?: number;

  handleReroll: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleLoad: () => void;
}
const RerollPane = (props: IRerollPaneProps) => {
  const {
    handleRerollUndo,
    rerollsToFavorite,
    favoritesInNextReroll,
    loaded,
    advanced,
    rerollsForLevel,
    nextRerollPrices,
    handleReroll,
    handleLoad,
  } = props;
  return (
    <div className="d-flex justify-content-center">
      {!loaded && advanced ? (
        <Button className="mx-auto" onClick={handleLoad} size="sm">
          Load
        </Button>
      ) : (
        <>
          {handleRerollUndo && !advanced && (
            <Button variant="outline-primary" onClick={handleRerollUndo} size="sm" disabled={!rerollsForLevel}>
              {"<"}
            </Button>
          )}
          {advanced && <div>Next: {nextRerollPrices}</div>}
          <span className="m-2">{rerollsForLevel || 0}</span>
          <Button variant="outline-primary" onClick={handleReroll} size="sm">
            <div className="position-relative">
              {">"}
              {rerollsToFavorite && (
                <div className="position-absolute top-0 start-100 text-info translate-middle">
                  {rerollsToFavorite || ""}
                </div>
              )}
            </div>
          </Button>
        </>
      )}
    </div>
  );
};

interface IPacifistChestProps {
  items: IItem[];
}
// TODO: Extract this into it's own file to decouple
const PacifistChest: FC<IPacifistChestProps> = ({ items }) => {
  const goldReward = items.filter(r => r.entity.includes("goldnugget"));
  const nonGoldReward = items.filter(r => !r.entity.includes("goldnugget"));
  let goldSumm = goldReward.reduce<number>((c, r) => {
    // either goldnugget or goldnugget_x
    const gn = r.entity.split("/")[4].split(".")[0];
    if (gn === "goldnugget") {
      return c + 10;
    }
    const number = gn.replace("goldnugget_", "");
    return c + parseInt(number, 10);
  }, 0);
  return (
    <>
      {goldSumm > 0 && (
        <div className="d-flex m-2 flex-column align-content-center justify-content-center align-items-center">
          <Entity width="1rem" height="1rem" id="data/entities/items/pickup/goldnugget.xml" />
          {goldSumm}
        </div>
      )}
      {nonGoldReward.map((r, i) => (
        <Entity preview key={`${r.entity} - ${i}`} id={r.entity} entityParams={{ extra: r.extra, x: r.x, y: r.y }} />
      ))}
    </>
  );
};

// TODO: Extract this into it's own file to decouple
const Shop = ({ type, handleOpenShopInfo, favoriteSpells }) => {
  const Icon = type === IShopType.wand ? WandIcon : LightBulletIcon;
  return (
    <Button
      className="position-relative"
      onClick={handleOpenShopInfo}
      variant={favoriteSpells.length ? "outline-info" : "outline-primary"}
      size="sm"
    >
      <Square>
        <Icon />
        {favoriteSpells.length ? <div className="position-absolute top-0 end-0 pe-1">{favoriteSpells.length}</div> : ""}
      </Square>
    </Button>
  );
};

interface IPerkRowProps {
  pickedPerks: string[];
  perkRerolls: number;
  nextRerollPrices: number;
  shop: IShopItems;
  perks: IPerk[];
  advanced: boolean;
  rerollsToFavorite?: number;
  favoritesInNextReroll?: number;
  showAllAlwaysCast?: boolean;
  infoProvider: GameInfoProvider;
  pacifistChestItems: IItem[];

  handleReroll: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleRerollUndo?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleClickPerk: (pos: number | string) => void;
  isRerollable: (i: number, perks: number) => boolean;
  handleOpenShopInfo: () => void;
  handleLoad: () => void;
  isPerkFavorite: (id: string) => boolean;
  isSpellFavorite: (id: string) => boolean;
  getAlwaysCast: (i: number, perks: number) => string;
}
const PerkRow: FC<IPerkRowProps> = props => {
  const {
    pacifistChestItems,
    rerollsToFavorite,
    favoritesInNextReroll,
    advanced,
    pickedPerks,
    perkRerolls,
    nextRerollPrices,
    shop,
    perks,
    showAllAlwaysCast,
    infoProvider,
    handleReroll,
    handleRerollUndo,
    handleClickPerk,
    isRerollable,
    getAlwaysCast,
    handleOpenShopInfo,
    handleLoad,
    isPerkFavorite,
    isSpellFavorite,
  } = props;
  const numberOfGambles = pickedPerks?.filter(p => p === "GAMBLE").length;
  const type = shop.type;
  const rerollsForLevel = perkRerolls ? perkRerolls : 0;
  const perksToShow = (numberOfGambles > 0 ? perks?.slice(0, -2 * numberOfGambles) : perks) || [];
  const gamblePerks = perks?.slice(-2 * numberOfGambles) || [];
  const spellIds: string[] =
    shop.type === IShopType.wand
      ? shop.items.flatMap(i => [i.cards.permanentCard, ...i.cards.cards].filter(Boolean) as string[])
      : shop.items.map(i => i.spell.id);
  const favoriteSpells = spellIds.filter(id => isSpellFavorite(id));

  const rowHasAlwaysCast = perks.find(p => p.id === "ALWAYS_CAST");

  return (
    <tr>
      <td>
        <Shop type={type} handleOpenShopInfo={handleOpenShopInfo} favoriteSpells={favoriteSpells} />
      </td>
      <td style={{ height: "4rem" }} className="d-flex align-content-center justify-content-around align-items-center">
        <PacifistChest items={pacifistChestItems} />
      </td>
      <td className="w-100">
        <Stack direction="horizontal" className="justify-content-center" gap={3}>
          {perksToShow &&
            perksToShow.map((perk, i) => {
              const rerollable = isRerollable(i, perksToShow.length);
              const alwaysCast =
                perk.id === "ALWAYS_CAST" || (rowHasAlwaysCast && showAllAlwaysCast)
                  ? getAlwaysCast(i, perksToShow.length)
                  : undefined;
              const fav = isPerkFavorite(perk.id);
              return (
                <Perk
                  className={fav && "border border-info border-3"}
                  highlight={fav}
                  rerollable={rerollable}
                  key={perk.ui_name + i}
                  onClick={() => handleClickPerk(advanced ? i : perk.id)}
                  clicked={!advanced ? pickedPerks?.includes(perk.id) : pickedPerks && !!pickedPerks[i]}
                  perk={perk}
                  alwaysCast={alwaysCast}
                />
              );
            })}
          {!!numberOfGambles &&
            new Array(numberOfGambles).fill("").map((_, i) => {
              return (
                <div key={i} className="d-flex ms-4 position-relative" style={{ width: "2rem" }}>
                  {/* Hard coded to make it more pretty */}
                  <div
                    className="position-absolute top-0 start-0 translate-middle"
                    style={{
                      marginRight: "-1rem",
                      marginTop: "-0.25rem",
                      zIndex: 1,
                    }}
                  >
                    <Perk
                      width={`calc(${perkWidth} + ${gamblePerkDiff})`}
                      key={gamblePerks[i * 2].ui_name}
                      perk={gamblePerks[i * 2]}
                    />
                  </div>
                  <div className="position-absolute top-50 start-100 translate-middle" style={{ marginTop: "0.25rem" }}>
                    <Perk
                      width={`calc(${perkWidth} + ${gamblePerkDiff})`}
                      key={gamblePerks[i * 2 + 1].ui_name}
                      perk={gamblePerks[i * 2 + 1]}
                    />
                  </div>
                </div>
              );
            })}
        </Stack>
      </td>
      <td>
        <RerollPane
          rerollsToFavorite={rerollsToFavorite}
          favoritesInNextReroll={favoritesInNextReroll}
          handleReroll={handleReroll}
          handleRerollUndo={handleRerollUndo}
          loaded={!!perks?.length}
          advanced={advanced}
          rerollsForLevel={rerollsForLevel}
          nextRerollPrices={nextRerollPrices}
          handleLoad={handleLoad}
        />
      </td>
    </tr>
  );
};

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
  offsetText: () => JSX.Element;
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
          <span>Lottery chance: {Math.floor(Math.pow(0.5, lotteries) * 100)}%</span>
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
  const [advanced, setAdvanced] = useState(false);

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
    const pickedPerks = cloneDeep(infoProvider.config.pickedPerks.get(infoProvider.config.perkWorldOffset)) || [];
    for (let i = 0; i < pickedPerks.length; i++) {
      if (pickedPerks[i]?.includes("GAMBLE")) {
        const perkRow = props.perks[i];
        const p1 = perkRow[perkRow.length - 2].id;
        const p2 = perkRow[perkRow.length - 1].id;
        pickedPerks[i].push(p1, p2);
      }
    }
    return pickedPerks;
  };

  const perkData: IPerkData = {
    perks: advanced ? perks : props.perks,
    pickedPerks: advanced ? pickedPerks : pickedPerksWithGambles(),
    perkRerolls: advanced
      ? perkRerolls
      : infoProvider.config.perkRerolls.get(infoProvider.config.perkWorldOffset) || [],
    nextRerollPrices: advanced ? nextRerollPrices : new Map(),
    totalRerolls,
    rerollPrice,
    rerollTotal,
    lotteries: 0,
    worldOffset: advanced ? worldOffset : infoProvider.config.perkWorldOffset,
    ...favorites,
  };

  const lotteries = advanced
    ? pd.lotteries
    : perkData.pickedPerks.reduce((c, r) => {
        const l = (r || []).filter(p => p === "PERKS_LOTTERY").length;
        return c + l;
      }, 0);

  perkData.lotteries = lotteries;

  return (
    <HolyMountainContext.Provider value={{ advanced, setAdvanced, perkMethods, perkData }}>
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

  const { advanced, setAdvanced, perkMethods, perkData } = useContext(HolyMountainContext);
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
    perks,
    pickedPerks,
    perkRerolls,
    totalRerolls,
    rerollPrice,
    rerollTotal,
    worldOffset,
    lotteries,
    rerollsToFavorite,
    favoritesInNextReroll,
    isFavorite,
    nextRerollPrices,
  } = perkData;
  const [showInitialLottery] = useLocalStorage("show-initial-lottery", true);
  const [showAlwaysCastRow] = useLocalStorage("show-always-cast-row", false);

  const adjustedLotteries = lotteries === 0 ? Number(showInitialLottery) : lotteries;

  const { isFavorite: isSpellFavorite } = useSpellFavorite();

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
        isPerkFavorite={isFavorite}
        lotteries={lotteries}
      />
      <Table borderless responsive="xs" size="sm">
        <thead className="text-center text-nowrap">
          <tr>
            <th>Shop</th>
            <th>Pacifist Chest</th>
            <th>Perks</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {Array(7 - Number(!!worldOffset))
            .fill("")
            .map((_, level) => {
              const row = perks[level] || [];
              return (
                <PerkRow
                  key={`${worldOffset}-${level}`}
                  advanced={advanced}
                  pickedPerks={pickedPerks[level]}
                  perkRerolls={perkRerolls[level]}
                  perks={row}
                  shop={shop[level]}
                  rerollsToFavorite={rerollsToFavorite}
                  favoritesInNextReroll={favoritesInNextReroll}
                  nextRerollPrices={
                    nextRerollPrices.get(worldOffset) ? nextRerollPrices.get(worldOffset)[level] : undefined
                  }
                  isPerkFavorite={isFavorite}
                  showAllAlwaysCast={showAlwaysCastRow}
                  infoProvider={infoProvider}
                  isSpellFavorite={isSpellFavorite}
                  handleRerollUndo={e => handleRerollUndo(e, level)}
                  handleReroll={e => handleReroll(e, level)}
                  handleClickPerk={id => handleClickPerk(level, id)()}
                  pacifistChestItems={pacifistChestItems(level, worldOffset)}
                  isRerollable={(i, l) =>
                    infoProvider.providers.lottery.provide(level, i, l, worldOffset, adjustedLotteries)
                  }
                  getAlwaysCast={(i, l) => infoProvider.providers.alwaysCast.provide(level, i, l, worldOffset)}
                  handleOpenShopInfo={() => handleOpenShopInfo(level)}
                  handleLoad={() => handleGenRowAdvanced(level)}
                />
              );
            })}
        </tbody>
      </Table>
      <ShopItems
        shop={shop[shopSelected]}
        show={shopSelected >= 0}
        handleClose={() => handleOpenShopInfo(-1)}
        isFavorite={isSpellFavorite}
      />
    </div>
  );
};

const e = props => (
  <HolyMountainContextProvider perkDeck={props.perkDeck} perks={props.perks} infoProvider={props.infoProvider}>
    {" "}
    <HolyMountain {...props} />
  </HolyMountainContextProvider>
);

export default e;
