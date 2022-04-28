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
import { IShopType, ShopInfoProvider } from '../../../services/SeedInfo/infoHandler/InfoProviders/Shop';
import { Square } from '../../helpers';
import ShopItems from './ShopItems';
import { useTranslation } from 'react-i18next';
import Perk from '../../Icons/Perk';

const perkWidth = '3rem'
const gamblePerkDiff = '-0.8rem'

interface IRerollPaneProps {
  handleRerollUndo?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  loaded: boolean;
  advanced: boolean;
  rerollsForLevel: number;
  handleReroll: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleLoad: () => void;
}
const RerollPane = (props: IRerollPaneProps) => {
  const { handleRerollUndo, loaded, advanced, rerollsForLevel, handleReroll, handleLoad } = props;
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
            {">"}
          </Button>
        </>
      }
    </div>
  )
};

interface IPerkRowProps {
  pickedPerks: string[];
  perkRerolls: number;
  shop: any;
  perks?: IPerk[];
  advanced: boolean;

  handleReroll: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleRerollUndo?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleClickPerk: (pos: number | string) => void;
  isRerollable: (i: number, perks: number) => boolean;
  handleOpenShopInfo: () => void;
  handleLoad: () => void;
};
const PerkRow = (props: IPerkRowProps) => {
  const { advanced, pickedPerks, perkRerolls, shop, perks, handleReroll, handleRerollUndo, handleClickPerk, isRerollable, handleOpenShopInfo, handleLoad } = props;
  const numberOfGambles = pickedPerks?.filter(p => p === 'GAMBLE').length;
  const type = shop.type;
  const rerollsForLevel = perkRerolls ? perkRerolls : 0;
  const perksToShow = (numberOfGambles > 0 ? perks?.slice(0, -2 * numberOfGambles) : perks) || [];
  const gamblePerks = perks?.slice(-2 * numberOfGambles) || [];
  return (
    <Stack direction="horizontal">
      <Col xs={2}>
        {type === IShopType.wand ?
          <Button
            onClick={handleOpenShopInfo}
            variant="outline-primary"
            size="sm"
          >
            <Square>
              <WandIcon />
            </Square>
          </Button>
          :
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleOpenShopInfo}
          >
            <Square>
              <LightBulletIcon />
            </Square>
          </Button>
        }
      </Col>
      <Col>
        <Stack direction="horizontal" className="justify-content-center" gap={2} >
          {perksToShow && perksToShow.map((perk, i) => {
            const rerollable = isRerollable(i, perksToShow.length);
            return <Perk
              rerollable={rerollable}
              key={perk.ui_name + i}
              onClick={() => handleClickPerk(advanced ? i : perk.id)}
              clicked={!advanced ? pickedPerks?.includes(perk.id) : pickedPerks && !!pickedPerks[i]}
              perk={perk}
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
        <RerollPane handleReroll={handleReroll} handleRerollUndo={handleRerollUndo} loaded={!!perks?.length} advanced={advanced} rerollsForLevel={rerollsForLevel} handleLoad={handleLoad} />
      </Col>
    </Stack>
  )
};

const PerkDeckModal = props => {
  const { perkDeck, show, handleClose } = props;
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
						return (
							<Col className="p-0 m-1" key={`${perk.id}-${i}`}>
                  <Perk
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
  perkDeck: string[];
  setAdvanced: (boolean) => void;
  handleOffset: (type: '+' | '-') => void;
  offsetText: () => string;
  handleReset: () => void;
  handleBack: () => void;
}
const HolyMountainHeader = (props: IHolyMountainHeaderProps) => {
  const { canUndo, advanced, rerolls, price, total, perkDeck, setAdvanced, handleOffset, handleReset, handleBack, offsetText } = props;

  const [showDeck, setShowDeck] = useState(false);

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
        <Button size='sm'
          variant="outline-secondary"
          onClick={() => setShowDeck(true)}
          style={{
            whiteSpace: 'normal',
            wordWrap: 'break-word',
          }}>Show <br /> perk deck</Button>
        <div className="ms-auto" />
      </Stack>
      <PerkDeckModal
        perkDeck={perkDeck}
        show={showDeck}
        handleClose={() => setShowDeck(false)}
      />
    </>
  )
};

const HolyMountainContext = createContext<any>({});

interface IHolyMountainContextProviderProps {
  infoProvider: GameInfoProvider;
  perks: ReturnType<PerkInfoProvider['provide']>;
  children: any;
}
// This is messy because there are two ways of generating perks: provide() and provideStateful()
// For refactoring, it should be best to have the stateful provide everything and create a transition function
// from action[] => old config.
const HolyMountainContextProvider = (props: IHolyMountainContextProviderProps) => {
  const { infoProvider, perks: simplePerks } = props;
  const [advanced, setAdvanced] = useState(false);

  const [perkStacks, setPerkStacks] = useState<IPerkChangeAction[][]>(() => infoProvider.config.perkStacks);
  const perkStack = perkStacks[perkStacks.length - 1];

  const getPerkData = () => {
    const perk = infoProvider.providers.perk;
    const data = perk.provideStateful(perkStack);
    const hydrated = perk.hydrate(data.perks);
    return {
      ...data, perks: hydrated
    };
  };

  const [pd, setPerkData] = useState<{
    worldOffset: number;
    pickedPerks: string[][];
    perks: IPerk[][];
    perkRerolls: number[];
  }>({
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

  const lotteries = advanced ? pickedPerks.reduce((c, r, i) => {
    const l = r.filter((p, j) => p && perks[i][j].id === 'PERKS_LOTTERY').length;
    return c + l;
  }, 0) : [...infoProvider.config.pickedPerks.values()].reduce((c, r) => {
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
  useEffect(() => {
    // Handle GAMBLE select where we need to also
    // automatically add the extra perks
    // when we select the GAMBLE perk
    const pickedPerks = infoProvider.config.pickedPerks.get(worldOffsetSimple);
    if (!pickedPerks) {
      return;
    }
    for (let i = 0; i < pickedPerks.length; i++) {
      const picked = pickedPerks[i];
      if (!picked) {
        continue;
      }
      const perkIds = (props.perks[i] || []).map(p => p.id);
      if (!perkIds.includes('GAMBLE')) {
        continue;
      }
      const gamblePerks = perkIds.slice(-2);
      if (picked.includes('GAMBLE')) {
        if (!picked.includes(gamblePerks[0])) {
          handleClickPerkSimple(i, gamblePerks[0])();
        }
        if (!picked.includes(gamblePerks[1])) {
          handleClickPerkSimple(i, gamblePerks[1])();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoProvider.config.pickedPerks, worldOffsetSimple, perks]);

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
  const { perks, pickedPerks, perkRerolls, totalRerolls, worldOffset, lotteries } = perkData;
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
              handleRerollUndo={e => handleRerollUndo(e, level)}
              handleReroll={e => handleReroll(e, level)}
              handleClickPerk={(id) => handleClickPerk(level, id)()}
              isRerollable={(i, l) => infoProvider.providers.lottery.provide(level, i, l, worldOffset, lotteries)}
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
      />
    </div>
  );
};

const e = (props) => <HolyMountainContextProvider perks={props.perks} infoProvider={props.infoProvider}> <HolyMountain {...props} /></HolyMountainContextProvider >;

export default e;
