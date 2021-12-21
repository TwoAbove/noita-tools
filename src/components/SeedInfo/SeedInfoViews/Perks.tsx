import React from 'react';
import { Button, Col, Container, Stack } from 'react-bootstrap';

import { PerkInfoProvider, ShopInfoProvider } from '../../../services/SeedInfo/infoHandler';
import GameInfoProvider from '../../../services/SeedInfo/infoHandler';
import WandIcon from '../../Icons/Wand';
import LightBulletIcon from '../../Icons/LightBullet';
import Clickable from '../../Icons/Clickable';
import { localizeNumber } from '../../../services/helpers';

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
    if (pickedPerks[offset][level] === id) {
      delete pickedPerks[offset][level];
    } else {
      pickedPerks[offset][level] = id;
    }
    infoProvider.updateConfig({ pickedPerks });
  };

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
    <Container
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
          const type = shop[level].type;
          const rerollsForLevel = infoProvider.config.perkRerolls[offset] ? infoProvider.config.perkRerolls[offset][level] : 0;
          return (
            <Stack direction="horizontal" key={`${offset}-${level}`}>
              <Col xs={2}>
                {type === 'wand' ? <WandIcon /> : <LightBulletIcon />}
              </Col>
              <Col>
                <Stack direction="horizontal" className="justify-content-center" gap={2} >
                  {row.map(perk => {
                    return (
                      <div
                        key={perk.ui_name}
                        onClick={handleClickPerk(level, perk.id)}
                      >
                        <Clickable
                          clicked={infoProvider.config.pickedPerks[offset]?.[level] === perk.id}
                        >
                          <img
                            style={{ width: '3rem', imageRendering: 'pixelated' }}
                            src={`data:image/png;base64,${perk.ui_icon}`}
                            alt={`${perk.ui_name}`} />
                        </Clickable>
                      </div>
                    );
                  })}
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
                <span className="m-1">
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
    </Container>
  );
};

export default Perks;
