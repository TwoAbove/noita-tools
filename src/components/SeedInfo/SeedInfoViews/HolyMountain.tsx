/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Button, Col, Form, Stack, Modal, Row,
} from 'react-bootstrap';

import GameInfoProvider from '../../../services/SeedInfo/infoHandler';
import WandIcon from '../../Icons/Wand';
import LightBulletIcon from '../../Icons/LightBullet';
import { localizeNumber, removeFromArr } from '../../../services/helpers';
import { IGenRowAction, IPerk, IPerkChangeAction, IPerkChangeStateType, IRerollAction, ISelectAction, IShiftAction, PerkInfoProvider } from '../../../services/SeedInfo/infoHandler/InfoProviders/Perk';
import { IShopItems, IShopType, ShopInfoProvider } from '../../../services/SeedInfo/infoHandler/InfoProviders/Shop';
import { Square } from '../../helpers';
import ShopItems from './ShopItems';
import { useTranslation } from 'react-i18next';
import Perk from '../../Icons/Perk';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, FavoriteType, FavoriteItem } from '../../../services/db';
import useLocalStorage from '../../../services/useLocalStorage';
import { useSpellFavorite, useFavoritePerks } from './helpers';
import classNames from 'classnames';

const perkWidth = '3rem'
const gamblePerkDiff = '-0.8rem'

interface IRerollPaneProps {
  handleRerollUndo?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  loaded: boolean;
  advanced: boolean;
  rerollsForLevel: number;
  rerollsToFavorite?: number;
  favoritesInNextReroll?: number;

  handleReroll: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleLoad: () => void;
}
const RerollPane = (props: IRerollPaneProps) => {
  const { handleRerollUndo, rerollsToFavorite, favoritesInNextReroll, loaded, advanced, rerollsForLevel, handleReroll, handleLoad } = props;

  return (
    <div className='d-flex justify-content-center'>
      {!loaded && advanced ? <Button
        className='mx-auto'
        onClick={handleLoad}
        size="sm"
      >
        Load
      </Button> :
        <>
          {handleRerollUndo && !advanced && <Button
            variant="outline-primary"
            onClick={handleRerollUndo}
            size="sm"
            disabled={!rerollsForLevel}
          >
            {"<"}
          </Button>}
          <span className="m-2">
            {rerollsForLevel || 0}
          </span>
          <Button
            variant="outline-primary"
            onClick={handleReroll}
            size="sm"
          >
            <div
              className='position-relative'
            >
              {">"}
              {rerollsToFavorite &&
                <div className='position-absolute top-0 start-100 text-info translate-middle'>
                  {rerollsToFavorite || ''}
                </div>
              }
            </div>
          </Button>
        </>
      }
    </div>
  )
};

interface IPerkRowProps {
  pickedPerks: string[];
  perkRerolls: number;
  shop: IShopItems;
  perks?: IPerk[];
  advanced: boolean;
  rerollsToFavorite?: number;
  favoritesInNextReroll?: number;

  handleReroll: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleRerollUndo?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleClickPerk: (pos: number | string) => void;
  isRerollable: (i: number, perks: number) => boolean;
  handleOpenShopInfo: () => void;
  handleLoad: () => void;
  isPerkFavorite: (id: string) => boolean;
  isSpellFavorite: (id: string) => boolean;
  getAlwaysCast: (i: number, perks: number) => string;
};
const PerkRow = (props: IPerkRowProps) => {
  const { rerollsToFavorite, favoritesInNextReroll, advanced, pickedPerks, perkRerolls, shop, perks, handleReroll, handleRerollUndo, handleClickPerk, isRerollable, getAlwaysCast, handleOpenShopInfo, handleLoad, isPerkFavorite, isSpellFavorite } = props;
  const numberOfGambles = pickedPerks?.filter(p => p === 'GAMBLE').length;
  const type = shop.type;
  const rerollsForLevel = perkRerolls ? perkRerolls : 0;
  const perksToShow = (numberOfGambles > 0 ? perks?.slice(0, -2 * numberOfGambles) : perks) || [];
  const gamblePerks = perks?.slice(-2 * numberOfGambles) || [];

  const spellIds: string[] = shop.type === IShopType.wand ?
    shop.items.flatMap(i => [i.cards.permanentCard, ...i.cards.cards].filter(Boolean) as string[]) :
    // not yet - spell gen needs debugging. shop.items.flatMap(i => [i.cards.permanentCard, ...i.cards.cards].filter(Boolean)) as string[] :
    shop.items.map(i => i.spell.id);
  const favoriteSpells = spellIds.filter(id => isSpellFavorite(id));
  const Shop = () => {
    const Icon = type === IShopType.wand ? WandIcon : LightBulletIcon;
    return (
      <Button
        className='position-relative'
        onClick={handleOpenShopInfo}
        variant={favoriteSpells.length ? "outline-info" : "outline-primary"}
        size="sm"
      >
        <Square>
          <Icon />
          {favoriteSpells.length ?
            <div className='position-absolute top-0 end-0 pe-1'>{favoriteSpells.length}</div> :
            ''
          }
        </Square>
      </Button>
    )
  };

  return (
    <Stack direction="horizontal">
      <Col xs={2}>
        <Shop />
      </Col>
      <Col>
        <Stack direction="horizontal" className="justify-content-center" gap={3} >
          {perksToShow && perksToShow.map((perk, i) => {
            const rerollable = isRerollable(i, perksToShow.length);
            const alwaysCast = perk.id === 'ALWAYS_CAST' ? getAlwaysCast(i, perksToShow.length) : undefined;
            const fav = isPerkFavorite(perk.id);
            return <Perk
              className={fav && 'mb-2'}
              highlight={fav}
              rerollable={rerollable}
              key={perk.ui_name + i}
              onClick={() => handleClickPerk(advanced ? i : perk.id)}
              clicked={!advanced ? pickedPerks?.includes(perk.id) : pickedPerks && !!pickedPerks[i]}
              perk={perk}
              alwaysCast={alwaysCast}
            />
          })}
          {!!numberOfGambles && new Array(numberOfGambles).fill('').map((_, i) => {
            return (
              <div key={i} className="d-flex ms-4 position-relative" style={{ width: '2rem' }}>
                {/* Hard coded to make it more pretty */}
                <div
                  className='position-absolute top-0 start-0 translate-middle'
                  style={{ marginRight: '-1rem', marginTop: '-0.25rem', zIndex: 1 }}>
                  <Perk
                    width={`calc(${perkWidth} + ${gamblePerkDiff})`}
                    key={gamblePerks[i * 2].ui_name}
                    perk={gamblePerks[i * 2]}
                  />
                </div>
                <div
                  className='position-absolute top-50 start-100 translate-middle'
                  style={{ marginTop: '0.25rem' }}>
                  <Perk
                    width={`calc(${perkWidth} + ${gamblePerkDiff})`}
                    key={gamblePerks[i * 2 + 1].ui_name}
                    perk={gamblePerks[i * 2 + 1]}
                  />
                </div>
              </div>
            )
          })}
        </Stack>
      </Col>
      <Col xs={3}>
        <RerollPane rerollsToFavorite={rerollsToFavorite} favoritesInNextReroll={favoritesInNextReroll} handleReroll={handleReroll} handleRerollUndo={handleRerollUndo} loaded={!!perks?.length} advanced={advanced} rerollsForLevel={rerollsForLevel} handleLoad={handleLoad} />
      </Col>
    </Stack>
  )
};

const PerkDeckModal = props => {
  const { perkDeck, show, handleClose, isPerkFavorite } = props;
  const [t] = useTranslation('materials');

  return (
    <Modal size="lg" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Perk Deck</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="p-3 justify-content-center align-items-center row-cols-auto">
          {perkDeck.map((perk, i) => {
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
          }).filter(Boolean)}
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
  setAdvanced: (boolean) => void;
  handleOffset: (type: '+' | '-') => void;
  offsetText: () => string;
  handleReset: () => void;
  handleBack: () => void;
  isPerkFavorite: (string) => boolean;
}
const HolyMountainHeader = (props: IHolyMountainHeaderProps) => {
  const { canUndo, advanced, rerolls, price, total, perkDeck, setAdvanced, handleOffset, handleReset, handleBack, offsetText, isPerkFavorite } = props;

  const [showDeck, setShowDeck] = useState(false);
  const favoritePerks = perkDeck.map(p => p?.id).filter(isPerkFavorite);

  return (
    <>
      <Stack gap={2} direction="horizontal">
        <Stack gap={3} direction="horizontal">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handleOffset('-')}
          >
            &lt;
          </Button>
          <span className="block capitalize">{offsetText()}</span>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handleOffset('+')}
          >
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
        {advanced ? <Button disabled={!canUndo} onClick={handleBack}>Undo</Button> : <div className="ms-auto" />}
        <div className="ms-auto" />
        <Button onClick={() => handleReset()}>Reset</Button>
        <div className="ms-auto" />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignSelf: 'stretch',
        }}>
          <span> Rerolls: {rerolls}</span>
          <span> Next: {localizeNumber(price)}</span>
          <span> Total: {localizeNumber(total)}</span>
        </div>
        <div className="ms-auto" />
        <Button
          className='position-relative'
          size='sm'
          variant="outline-secondary"
          onClick={() => setShowDeck(true)}
          style={{
            whiteSpace: 'normal',
            wordWrap: 'break-word',
          }}>Show <br /> perk deck
          {favoritePerks.length ?
            <div className='position-absolute text-info top-0 end-0 pe-1'>{favoritePerks.length}</div> :
            ''
          }
        </Button>
        <div className="ms-auto" />
      </Stack>
      <PerkDeckModal
        perkDeck={perkDeck}
        show={showDeck}
        isPerkFavorite={isPerkFavorite}
        handleClose={() => setShowDeck(false)}
      />
    </>
  )
};

const HolyMountainContext = createContext<any>({});

interface IHolyMountainContextProviderProps {
  infoProvider: GameInfoProvider;
  perks: ReturnType<PerkInfoProvider['provide']>;
  perkDeck: ReturnType<PerkInfoProvider['getPerkDeck']>;
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

  const favorites = useFavoritePerks(advanced ? infoProvider.providers.statelessPerk : infoProvider.providers.perk, perkDeck);
  const getPerkData = () => {
    const perk = infoProvider.providers.statelessPerk;
    const data = perk.provideStateless(perkStack);
    const hydrated = perk.hydrate(data.perks);
    return {
      ...data, perks: hydrated
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
    perkRerolls: []
  });
  const {
    worldOffset,
    pickedPerks,
    perks,
    perkRerolls
  } = pd;

  useEffect(() => {
    const newData = getPerkData();
    infoProvider.updateConfig({ perkWorldOffset: +newData.worldOffset, perkStacks });
    setPerkData(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perkStack]);

  const totalRerolls = advanced ? perkStack.reduce(
    (c, n) => {
      return c + (n.type === IPerkChangeStateType.reroll ? 1 : 0)
    },
    0
  ) : [...infoProvider.config.perkRerolls.entries()].reduce(
    (c, [, n]) => {
      return c + n.reduce((cc, nn) => cc + nn, 0)
    },
    0
  );

  const lotteries = advanced ? pd.lotteries : [...infoProvider.config.pickedPerks.values()].reduce((c, r) => {
    const l = r.filter(p => p.includes('PERKS_LOTTERY')).length;
    return c + l;
  }, 0);

  const worldOffsetSimple = +infoProvider.config.perkWorldOffset;

  const handleOffsetAdvanced = (dir: '+' | '-') => {
    const action: IShiftAction = {
      type: IPerkChangeStateType.shift,
      data: dir === '+' ? 1 : -1,
    };
    setPerkStacks([...perkStacks, [...perkStack, action]]);
  };
  const handleOffsetSimple = (dir: '+' | '-') => {
    if (dir === '+') {
      infoProvider.updateConfig({ perkWorldOffset: +worldOffsetSimple + 1 });
    }
    if (dir === '-') {
      infoProvider.updateConfig({ perkWorldOffset: +worldOffsetSimple - 1 });
    }
  };

  const handleGenRowAdvanced = (level: number) => {
    const action: IGenRowAction = {
      type: IPerkChangeStateType.genRow,
      data: level
    }
    setPerkStacks([...perkStacks, [...perkStack, action]]);
  }

  const handleRerollAdvanced = (e: React.MouseEvent<HTMLButtonElement>, level: number) => {
    e.preventDefault();
    const actions: IPerkChangeAction[] = []
    actions.push({
      type: IPerkChangeStateType.reroll,
      data: level
    })
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
        pos
      }
    }

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
      if (id === 'GAMBLE') {
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
      perkStacks.pop()
      setPerkStacks([...perkStacks]);
    }
  }

  const perkMethods = {
    handleReroll: advanced ? handleRerollAdvanced : handleRerollSimple,
    handleRerollUndo: advanced ? false : handleRerollUndoSimple,
    handleClickPerk: advanced ? handleClickPerkAdvanced : handleClickPerkSimple,
    handleReset: advanced ? handleResetAdvanced : handleResetSimple,
    handleBack: advanced ? handleBackAdvanced : false,
    handleOffset: advanced ? handleOffsetAdvanced : handleOffsetSimple,
    handleGenRowAdvanced: advanced ? handleGenRowAdvanced : false,
  };

  const perkData = {
    perks: advanced ? perks : props.perks,
    pickedPerks: advanced ? pickedPerks : infoProvider.config.pickedPerks.get(infoProvider.config.perkWorldOffset) || [],
    perkRerolls: advanced ? perkRerolls : infoProvider.config.perkRerolls.get(infoProvider.config.perkWorldOffset) || [],
    totalRerolls,
    worldOffset: advanced ? worldOffset : infoProvider.config.perkWorldOffset,
    lotteries,

    ...favorites
  };

  return (
    <HolyMountainContext.Provider value={{ advanced, setAdvanced, perkMethods, perkData }}>
      {props.children}
    </HolyMountainContext.Provider>
  );
};

interface IHolyMountainProps {
  shop: ReturnType<ShopInfoProvider['provide']>;
  perks: ReturnType<PerkInfoProvider['provide']>;
  perkDeck: ReturnType<PerkInfoProvider['getPerkDeck']>;
  infoProvider: GameInfoProvider;
}

const HolyMountain = (props: IHolyMountainProps) => {
  const { shop, infoProvider, perkDeck } = props;

  const { advanced, setAdvanced, perkMethods, perkData } = useContext(HolyMountainContext);
  const { handleReroll, handleRerollUndo, handleClickPerk, handleReset, handleBack, handleOffset, handleGenRowAdvanced } = perkMethods;
  const { perks, pickedPerks, perkRerolls, totalRerolls, worldOffset, lotteries, rerollsToFavorite, favoritesInNextReroll, isFavorite } = perkData;

  const { isFavorite: isSpellFavorite } = useSpellFavorite();

  // const offset = infoProvider.config.perkWorldOffset;
  const [shopSelected, setShopSelected] = useState(-1);

  const getPrice = (rerolls: number) => 200 * Math.pow(2, rerolls);
  const getTotal = (rerolls = 0) => {
    if (rerolls <= 0) return 0;
    return getTotal(rerolls - 1) + getPrice(rerolls - 1);
  };

  const handleOpenShopInfo = (level: number) => {
    setShopSelected(level);
  };

  const offsetText = () => {
    let direction = worldOffset === 0 ? 'Main' : worldOffset < 0 ? 'West' : 'East';
    return `${direction} World ${Math.abs(worldOffset) || ''}`;
  };

  return (
    <div
      style={{
        padding: 0,
        imageRendering: 'pixelated'
      }}
    >
      <HolyMountainHeader
        advanced={advanced}
        setAdvanced={setAdvanced}
        rerolls={totalRerolls}
        canUndo={true}
        price={getPrice(totalRerolls)}
        total={getTotal(totalRerolls)}
        perkDeck={perkDeck}
        handleReset={handleReset}
        handleOffset={handleOffset}
        handleBack={handleBack}
        offsetText={offsetText}
        isPerkFavorite={isFavorite}
      />
      <div className="mb-3" />
      <Stack gap={3}>
        {Array(7 - Number(!!worldOffset)).fill('').map((_, level) => {
          const row = perks[level];
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
              isPerkFavorite={isFavorite}
              isSpellFavorite={isSpellFavorite}
              handleRerollUndo={e => handleRerollUndo(e, level)}
              handleReroll={e => handleReroll(e, level)}
              handleClickPerk={(id) => handleClickPerk(level, id)()}
              isRerollable={(i, l) => infoProvider.providers.lottery.provide(level, i, l, worldOffset, lotteries)}
              getAlwaysCast={(i, l) => infoProvider.providers.alwaysCast.provide(level, i, l, worldOffset)}
              handleOpenShopInfo={() => handleOpenShopInfo(level)}
              handleLoad={() => handleGenRowAdvanced(level)}
            />
          );
        })}
      </Stack>
      <ShopItems
        shop={shop[shopSelected]}
        show={shopSelected >= 0}
        handleClose={() => handleOpenShopInfo(-1)}
        isFavorite={isSpellFavorite}
      />
    </div>
  );
};

const e = (props) => <HolyMountainContextProvider perkDeck={props.perkDeck} perks={props.perks} infoProvider={props.infoProvider}> <HolyMountain {...props} /></HolyMountainContextProvider >;

export default e;
