import React from 'react';
import { Button, Col, Container, Stack } from 'react-bootstrap';

import { PerkInfoProvider, ShopInfoProvider } from '../../../services/SeedInfo/infoHandler';
import GameInfoProvider from '../../../services/SeedInfo/infoHandler';
import WandIcon from '../../Icons/Wand';
import LightBulletIcon from '../../Icons/LightBullet';

interface IPerksProps {
  shop: ReturnType<ShopInfoProvider['provide']>;
  perks: ReturnType<PerkInfoProvider['provide']>;
  infoProvider: GameInfoProvider;
}

const Perks = (props: IPerksProps) => {
  const { perks, shop, infoProvider } = props;
  const offset = infoProvider.config.perkWorldOffset;
  const totalRerolls = infoProvider.config.perkRerolls.reduce(
    (c, n) => c + n.reduce((cc, nn) => cc + nn, 0),
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
    const perks = [...infoProvider.config.perkRerolls];
    if (!perks[offset]) {
      perks[offset] = [];
    }
    if (isNaN(perks[offset][level])) {
      perks[offset][level] = 0;
    }
    perks[offset][level] += 1;
    infoProvider.updateConfig({ perkRerolls: perks });
  };
  const handleRerollUndo = (level: number) => (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const perks = [...infoProvider.config.perkRerolls];
    if (!perks[offset]) {
      perks[offset] = [];
    }
    if (isNaN(perks[offset][level])) {
      perks[offset][level] = 0;
    }
    if (perks[offset][level] > 0) {
      perks[offset][level] -= 1;
    }
    infoProvider.updateConfig({ perkRerolls: perks });
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
          <span> Next: {getPrice(totalRerolls)}</span>
          <span> Total: {getTotal(totalRerolls)}</span>
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
              <Col xs={2} style={{marginRight: "-1rem"}}>
                {type === 'wand' ? <WandIcon /> : <LightBulletIcon />}
              </Col>
              {row.map(perk => {
                return (
                  <Col
                    key={perk.ui_name}
                    onClick={handleClickPerk(level, perk.id)}
                  >
                    <img
                      className={`${infoProvider.config.pickedPerks[offset]?.[level] === perk.id ? 'border border-3 p-1' : ''}`}
                      src={`data:image/png;base64,${perk.ui_icon}`}
                      alt={`${perk.ui_name}`}
                      style={{ width: '3rem', imageRendering: 'crisp-edges' }}
                    />
                  </Col>
                );
              })}
              <Col xs={3} style={{margin: "-1rem"}}>
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
