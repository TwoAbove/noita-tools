import React, { useEffect } from 'react';
import { Button, Col, Stack } from 'react-bootstrap';

import { PerkInfoProvider, ShopInfoProvider } from '../../../services/SeedInfo/infoHandler';
import GameInfoProvider from '../../../services/SeedInfo/infoHandler';
import WandIcon from '../../Icons/Wand';
import LightBulletIcon from '../../Icons/LightBullet';
import Clickable from '../../Icons/Clickable';
import { localizeNumber } from '../../../services/helpers';
import Icon from '../../Icons/Icon';

const lotteryPerk = new PerkInfoProvider({} as any).getPerk('PERKS_LOTTERY');

interface IPerkProps {
  rerollable?: boolean;
  clicked?: boolean;
  width?: string;
  perk: IPerksProps['perks'][number][number];
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

interface IPerksProps {
  shop: ReturnType<ShopInfoProvider['provide']>;
  perks: ReturnType<PerkInfoProvider['provide']>;
  infoProvider: GameInfoProvider;
}

const Perks = (props: IPerksProps) => {
  const { perks, shop, infoProvider } = props;
  const offset = infoProvider.config.perkWorldOffset;
  const totalRerolls = Object.entries(infoProvider.config.perkRerolls).reduce(
    (c, [, n]) => {
      return c + n.reduce((cc, nn) => cc + nn, 0)
    },
    0
  );

  const lotteries = infoProvider.config.pickedPerks.reduce((c, r) => {
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

  const handleReroll = (level: number) => (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const perkRerolls = infoProvider.config.perkRerolls;
    if (!perkRerolls[offset]) {
      perkRerolls[offset] = [];
    }
    if (isNaN(perkRerolls[offset][level])) {
      perkRerolls[offset][level] = 0;
    }
    perkRerolls[offset][level] += 1;
    infoProvider.updateConfig({ perkRerolls });
  };

  const handleRerollUndo = (level: number) => (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const perkRerolls = [...infoProvider.config.perkRerolls];
    if (!perkRerolls[offset]) {
      perkRerolls[offset] = [];
    }
    if (isNaN(perkRerolls[offset][level])) {
      perkRerolls[offset][level] = 0;
    }
    if (perkRerolls[offset][level] > 0) {
      perkRerolls[offset][level] -= 1;
    }
    infoProvider.updateConfig({ perkRerolls });
  };

  const handleClickPerk = (level: number, id: string) => () => {
    const pickedPerks = [...infoProvider.config.pickedPerks];
    if (!pickedPerks[offset]) pickedPerks[offset] = [];
    if (pickedPerks[offset][level]?.includes(id)) {
      const i = pickedPerks[offset][level].indexOf(id);
      if (i !== -1) {
        pickedPerks[offset][level].splice(i, 1);
      }
    } else {
      if (!pickedPerks[offset][level]) {
        pickedPerks[offset][level] = [];
      }
      pickedPerks[offset][level].push(id);
    }
    infoProvider.updateConfig({ pickedPerks });
  };

  useEffect(() => {
    // Handle GAMBLE select where we need to also
    // automatically add and remove the extra perks
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
      } else {
        if (picked.includes(gamblePerks[0])) {
          handleClickPerk(i, gamblePerks[0])();
        }
        if (picked.includes(gamblePerks[1])) {
          handleClickPerk(i, gamblePerks[1])();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoProvider.config.pickedPerks, offset, perks]);

  const handleReset = () => {
    const pickedPerks = [];
    const perkRerolls = [];
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
          <span> Rerolls: {totalRerolls}</span>
          <span> Next: {localizeNumber(getPrice(totalRerolls))}</span>
          <span> Total: {localizeNumber(getTotal(totalRerolls))}</span>
        </div>
        <div className="ms-auto" />
      </Stack>
      <div className="mb-3" />
      <Stack gap={3}>
        {perks.map((row, level) => {
          const selectedGamble = infoProvider.config.pickedPerks[offset]?.[level]?.includes('GAMBLE');
          const type = shop[level].type;
          const rerollsForLevel = infoProvider.config.perkRerolls[offset] ? infoProvider.config.perkRerolls[offset][level] : 0;
          const perksToShow = selectedGamble ? row.slice(0, -2) : row;
          const lastTwoPerks = row.slice(-2);
          return (
            <Stack direction="horizontal" key={`${offset}-${level}`}>
              <Col xs={2}>
                {type === 'wand' ? <WandIcon /> : <LightBulletIcon />}
              </Col>
              <Col>
                <Stack direction="horizontal" className="justify-content-center" gap={2} >
                  {perksToShow.map((perk, i) => {
                    const rerollable = infoProvider.providers.lottery.provide(level, i, perksToShow.length, offset, lotteries);
                    return <Perk
                      rerollable={rerollable}
                      key={perk.ui_name}
                      onClick={handleClickPerk(level, perk.id)}
                      clicked={infoProvider.config.pickedPerks[offset]?.[level]?.includes(perk.id)}
                      perk={perk}
                    />
                  })}
                  {selectedGamble && <div className="d-flex ms-4 position-relative" style={{width: '2rem'}}>
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
                  onClick={handleRerollUndo(level)}
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
                  onClick={handleReroll(level)}
                  size="sm"
                >
                  {">"}
                </Button>
              </Col>
            </Stack>
          );
        })}
      </Stack>
    </div>
  );
};

export default Perks;
