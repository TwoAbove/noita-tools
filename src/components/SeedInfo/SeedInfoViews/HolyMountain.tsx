import React, { useEffect, useState } from 'react';
import { Button, Col, Stack } from 'react-bootstrap';

import GameInfoProvider from '../../../services/SeedInfo/infoHandler';
import WandIcon from '../../Icons/Wand';
import LightBulletIcon from '../../Icons/LightBullet';
import Clickable from '../../Icons/Clickable';
import { localizeNumber, removeFromArr } from '../../../services/helpers';
import Icon from '../../Icons/Icon';
import { PerkInfoProvider } from '../../../services/SeedInfo/infoHandler/InfoProviders/Perk';
import { ShopInfoProvider } from '../../../services/SeedInfo/infoHandler/InfoProviders/Shop';
import { Square } from '../../helpers';
import ShopItems from './ShopItems';

const lotteryPerk = new PerkInfoProvider({} as any).getPerk('PERKS_LOTTERY');

interface IPerkProps {
  rerollable?: boolean;
  clicked?: boolean;
  width?: string;
  perk: IHolyMountainProps['perks'][number][number];
  onClick?: () => void;
}

const Perk = (props: IPerkProps) => {
  const { clicked, rerollable, perk, width, onClick } = props;
  return (
    <div onClick={onClick} className='position-relative'>
      <Clickable
        clicked={clicked}
      >
        <Icon
          uri={`data:image/png;base64,${perk.ui_icon}`}
          alt={`${perk.ui_name}`}
          title={`${perk.ui_name}`}
          width={width}
        />
        {rerollable &&
          <Icon
            className='position-absolute top-0 start-100 translate-middle'
            width='1.5rem'
            uri={`data:image/png;base64,${lotteryPerk.ui_icon}`}
          />
        }
      </Clickable>
    </div>
  );
}

interface IPerkRowProps {
  pickedPerks: any;
  perkRerolls: any;
  shop: any;
  perks: any[];

  handleReroll: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleRerollUndo: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleClickPerk: (id: string) => void;
  isRerollable: (i: number, perks: number) => boolean;
  handleOpenShopInfo: () => void;
};
const PerkRow = (props: IPerkRowProps) => {
  const { pickedPerks, perkRerolls, shop, perks, handleReroll, handleRerollUndo, handleClickPerk, isRerollable, handleOpenShopInfo } = props;
  const selectedGamble = pickedPerks?.includes('GAMBLE');
  const type = shop.type;
  const rerollsForLevel = perkRerolls ? perkRerolls : 0;
  const perksToShow = selectedGamble ? perks.slice(0, -2) : perks;
  const lastTwoPerks = perks.slice(-2);
  return (
    <Stack direction="horizontal">
      <Col xs={2}>
        {type === 'wand' ?
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
          {perksToShow.map((perk, i) => {
            const rerollable = isRerollable(i, perksToShow.length);
            return <Perk
              rerollable={rerollable}
              key={perk.ui_name}
              onClick={() => handleClickPerk(perk.id)}
              clicked={pickedPerks?.includes(perk.id)}
              perk={perk}
            />
          })}
          {selectedGamble && <div className="d-flex ms-4 position-relative" style={{ width: '2rem' }}>
            {/* Hard coded to make it more pretty */}
            <div
              className='position-absolute top-0 start-0 translate-middle'
              style={{ marginRight: '-1rem', marginTop: '-0.25rem', zIndex: 1 }}>
              <Perk
                width='2.5rem'
                key={lastTwoPerks[0].ui_name}
                // onClick={handleClickPerk(level, lastTwoPerks[0].id)}
                // clicked={infoProvider.config.pickedPerks[offset]?.[level]?.includes(lastTwoPerks[0].id)}
                perk={lastTwoPerks[0]}
              />
            </div>
            <div
              className='position-absolute top-50 start-100 translate-middle'
              style={{ marginTop: '0.25rem' }}>
              <Perk
                width='2.5rem'
                key={lastTwoPerks[1].ui_name}
                // onClick={handleClickPerk(level, lastTwoPerks[1].id)}
                // clicked={infoProvider.config.pickedPerks[offset]?.[level]?.includes(lastTwoPerks[1].id)}
                perk={lastTwoPerks[1]}
              />
            </div>
          </div>}
        </Stack>
      </Col>
      <Col xs={3}>
        <Button
          variant="outline-primary"
          onClick={handleRerollUndo}
          size="sm"
          disabled={!rerollsForLevel}
        >
          {"<"}
        </Button>
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
      </Col>
    </Stack>
  )
};

interface IHolyMountainHeaderProps {
  rerolls: number;
  price: number;
  total: number;
  handleOffset: (type: string) => void;
  offsetText: () => string;
  handleReset: () => void;
}
const HolyMountainHeader = (props: IHolyMountainHeaderProps) => {
  const { rerolls, price, total, handleOffset, handleReset, offsetText } = props;
  return (
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
    </Stack>
  )
}

interface IHolyMountainProps {
  shop: ReturnType<ShopInfoProvider['provide']>;
  perks: ReturnType<PerkInfoProvider['provide']>;
  infoProvider: GameInfoProvider;
}

const HolyMountain = (props: IHolyMountainProps) => {
  const { perks, shop, infoProvider } = props;
  const offset = infoProvider.config.perkWorldOffset;
  const [shopSelected, setShopSelected] = useState(-1);
  const totalRerolls = [...infoProvider.config.perkRerolls.entries()].reduce(
    (c, [, n]) => {
      return c + n.reduce((cc, nn) => cc + nn, 0)
    },
    0
  );

  const lotteries = [...infoProvider.config.pickedPerks.values()].reduce((c, r) => {
    const l = r.filter(p => p.includes('PERKS_LOTTERY')).length;
    return c + l;
  }, 0);

  const getPrice = (rerolls: number) => 200 * Math.pow(2, rerolls);
  const getTotal = (rerolls = 0) => {
    if (rerolls <= 0) return 0;
    return getTotal(rerolls - 1) + getPrice(rerolls - 1);
  };

  const handleOffset = dir => {
    if (dir === '+') {
      infoProvider.updateConfig({ perkWorldOffset: +offset + 1 });
    }
    if (dir === '-') {
      infoProvider.updateConfig({ perkWorldOffset: +offset - 1 });
    }
  };

  const handleReroll = (e: React.MouseEvent<HTMLButtonElement>, level: number) => {
    e.preventDefault();
    const perkRerolls = new Map(infoProvider.config.perkRerolls);
    if (!perkRerolls.has(offset)) {
      perkRerolls.set(offset, []);
    }
    const p = perkRerolls.get(offset)!;
    if (isNaN(p[level])) {
      p[level] = 0;
    }
    p[level] += 1;
    perkRerolls.set(offset, p);
    infoProvider.updateConfig({ perkRerolls });
  };

  const handleRerollUndo = (e: React.MouseEvent<HTMLButtonElement>, level: number) => {
    e.preventDefault();
    const perkRerolls = new Map(infoProvider.config.perkRerolls);
    if (!perkRerolls.has(offset)) {
      perkRerolls.set(offset, []);
    }
    const p = perkRerolls.get(offset)!;
    if (isNaN(p[level])) {
      p[level] = 0;
    }
    if (p[level] > 0) {
      p[level] -= 1;
    }
    perkRerolls.set(offset, p);
    infoProvider.updateConfig({ perkRerolls });
  };

  const handleClickPerk = (level: number, id: string) => () => {
    const pickedPerks = new Map(infoProvider.config.pickedPerks);
    if (!pickedPerks.has(offset)) {
      pickedPerks.set(offset, []);
    }
    const p = pickedPerks.get(offset)!;
    if (p[level]?.includes(id)) {
      // if gamble, remove the gamble ones
      if (id === 'GAMBLE') {
        const perkIds = perks[level].map(p => p.id);
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
    pickedPerks.set(offset, p);
    infoProvider.updateConfig({ pickedPerks });
  };

  const handleOpenShopInfo = (level: number) => {
    setShopSelected(level);
  };

  useEffect(() => {
    // Handle GAMBLE select where we need to also
    // automatically add the extra perks
    // when we select the GAMBLE perk
    const pickedPerks = infoProvider.config.pickedPerks[offset];
    if (!pickedPerks) {
      return;
    }

    for (let i = 0; i < pickedPerks.length; i++) {
      const picked = pickedPerks[i];
      if (!picked) {
        continue;
      }
      const perkIds = perks[i].map(p => p.id);
      if (!perkIds.includes('GAMBLE')) {
        continue;
      }
      const gamblePerks = perkIds.slice(-2);
      if (picked.includes('GAMBLE')) {
        if (!picked.includes(gamblePerks[0])) {
          handleClickPerk(i, gamblePerks[0])();
        }
        if (!picked.includes(gamblePerks[1])) {
          handleClickPerk(i, gamblePerks[1])();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoProvider.config.pickedPerks, offset, perks]);

  const handleReset = () => {
    const pickedPerks = new Map();
    const perkRerolls = new Map();
    infoProvider.updateConfig({ pickedPerks, perkRerolls, perkWorldOffset: 0 });
  };

  const offsetText = () => {
    let direction = offset === 0 ? 'Main' : offset < 0 ? 'West' : 'East';
    return `${direction} World ${Math.abs(offset) || ''}`;
  };

  return (
    <div
      style={{
        padding: 0,
        imageRendering: 'pixelated'
      }}
    >
      <HolyMountainHeader
        rerolls={totalRerolls}
        price={getPrice(totalRerolls)}
        total={getTotal(totalRerolls)}
        handleReset={handleReset}
        handleOffset={handleOffset}
        offsetText={offsetText}
      />
      <div className="mb-3" />
      <Stack gap={3}>
        {perks.map((row, level) => {
          const pickedPerks = infoProvider.config.pickedPerks.get(offset);
          const perkRerolls = infoProvider.config.perkRerolls.get(offset);
          return (
            <PerkRow
              key={`${offset}-${level}`}
              pickedPerks={pickedPerks?.[level]}
              perkRerolls={perkRerolls?.[level]}
              perks={row}
              shop={shop[level]}
              handleReroll={e => handleReroll(e, level)}
              handleRerollUndo={e => handleRerollUndo(e, level)}
              handleClickPerk={(id) => handleClickPerk(level, id)()}
              isRerollable={(i, l) => infoProvider.providers.lottery.provide(level, i, l, offset, lotteries)}
              handleOpenShopInfo={() => handleOpenShopInfo(level)}
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

export default HolyMountain;