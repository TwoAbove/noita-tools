import { useState, useContext, useMemo, useEffect } from "react";
import { Modal, Form, Container, Stack, Button, Row, Col } from "react-bootstrap";
import MultiRangeSlider from "./misc/MultiRangeSlider";
import SpellSelect from "./SpellSelect";
import Icon from "./Icons/Icon";
import { GameInfoContext } from "./SeedInfo/SeedDataOutput";
import { useTranslation } from "react-i18next";
import Entity from "./Icons/Entity";
import { ticksToS } from "../services/helpers";

interface IWandSelectProps {
  level?: number;
  show: boolean;
  handleClose: () => void;
  onParamsChange?: (params: IWandSearchParams) => void;
  initialParams?: IWandSearchParams;
}

interface IWandSearchParams {
  gun: {
    deck_capacity: [number, number];
    actions_per_round: [number, number];
    reload_time: [number, number];
    shuffle_deck_when_empty: [number, number];
    fire_rate_wait: [number, number];
    spread_degrees: [number, number];
    mana_charge_speed: [number, number];
    mana_max: [number, number];
  };
  cards: string[];
  cardsStrict: boolean;
  permanentCard?: string | null | true;
}

const sliderConfigs: Record<string, ISliderConfig> = {
  deck_capacity: {
    min: 2,
    max: 26,
    step: 1,
    format: val => Math.floor(val).toString(),
  },
  actions_per_round: {
    min: 1,
    max: 26,
    step: 1,
    format: val => Math.floor(val).toString(),
  },
  fire_rate_wait: {
    min: -14,
    max: 45,
    format: val => `${ticksToS(val)} s`,
  },
  reload_time: {
    min: 1,
    max: 240,
    format: val => `${ticksToS(val)} s`,
  },
  spread_degrees: {
    min: -35,
    max: 35,
    format: val => `${Math.round(val * 10) / 10}°`,
  },
  mana_charge_speed: {
    min: 10,
    max: 3500,
    step: 10,
    format: val => Math.round(val).toString(),
  },
  mana_max: {
    min: 50,
    max: 6000,
    step: 50,
    format: val => Math.round(val).toString(),
  },
};

const defaultParams: IWandSearchParams = {
  gun: {
    deck_capacity: [sliderConfigs.deck_capacity.min, sliderConfigs.deck_capacity.max],
    actions_per_round: [sliderConfigs.actions_per_round.min, sliderConfigs.actions_per_round.max],
    reload_time: [sliderConfigs.reload_time.min, sliderConfigs.reload_time.max],
    fire_rate_wait: [sliderConfigs.fire_rate_wait.min, sliderConfigs.fire_rate_wait.max],
    spread_degrees: [sliderConfigs.spread_degrees.min, sliderConfigs.spread_degrees.max],
    mana_charge_speed: [sliderConfigs.mana_charge_speed.min, sliderConfigs.mana_charge_speed.max],
    mana_max: [sliderConfigs.mana_max.min, sliderConfigs.mana_max.max],
    shuffle_deck_when_empty: [0, 1],
  },
  cards: [],
  cardsStrict: false,
  permanentCard: undefined,
};

const paramTranslations = {
  shuffle_deck_when_empty: "$inventory_shuffle",
  deck_capacity: "$inventory_capacity",
  actions_per_round: "$inventory_actionspercast",
  fire_rate_wait: "$inventory_castdelay",
  reload_time: "$inventory_rechargetime",
  mana_max: "$inventory_manamax",
  mana_charge_speed: "$inventory_manachargespeed",
  spread_degrees: "$inventory_spread",
  always_cast: "$inventory_alwayscasts",
};

const StatDisplay = ({ label, value, t }: { label: string; value: string | number; t: (key: string) => string }) => (
  <div className="d-flex justify-content-between px-2 py-1" style={{ fontSize: "0.9em" }}>
    <span className="text-muted">{t(paramTranslations[label] || label)}:</span>
    <span>
      {typeof value === "string"
        ? value
        : label === "fire_rate_wait" || label === "reload_time"
          ? `${ticksToS(Number(value))} s`
          : label === "spread_degrees"
            ? `${Math.round(Number(value) * 10) / 10}°`
            : label === "deck_capacity" || label === "actions_per_round"
              ? Math.floor(Number(value))
              : label === "mana_max"
                ? Math.round(Number(value))
                : value}
    </span>
  </div>
);

const SPELL_SIZE = "2.5rem";

const SpellSlot = ({ onClick }: { onClick?: () => void }) => (
  <div
    onClick={onClick}
    className="border border-secondary rounded me-2"
    style={{
      width: SPELL_SIZE,
      height: SPELL_SIZE,
      cursor: onClick ? "pointer" : "default",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  />
);

const TriStateToggle = ({
  state,
  onChange,
  translationKey,
  t,
  className,
}: {
  state: number;
  onChange: (val: number) => void;
  translationKey: string;
  t: (key: string) => string;
  className?: string;
}) => (
  <Button
    variant="primary"
    className={className}
    onClick={() => {
      if (state === -1) onChange(0);
      else if (state === 0) onChange(1);
      else onChange(-1);
    }}
  >
    {t(translationKey)}: {state === -1 ? "No" : state === 0 ? "Any" : "Yes"}
  </Button>
);

interface ISliderConfig {
  min: number;
  max: number;
  step?: number;
  transform?: (val: number) => number;
  inverse?: (val: number) => number;
  format?: (val: number) => string;
}

const WandSelect = (props: IWandSelectProps) => {
  const { show, handleClose, onParamsChange, initialParams } = props;
  const { gameInfoProvider } = useContext(GameInfoContext);
  const { t } = useTranslation("materials");
  const [params, setParams] = useState<IWandSearchParams>(() => ({
    ...defaultParams,
    ...initialParams,
    gun: {
      ...defaultParams.gun,
      ...(initialParams?.gun || {}),
    },
  }));
  const [spellSelectOpen, setSpellSelectOpen] = useState(false);
  const [alwaysCastOpen, setAlwaysCastOpen] = useState(false);

  const handleParamsChange = (newParams: IWandSearchParams) => {
    setParams(newParams);
    onParamsChange?.(newParams);
  };

  const handleRangeChange = (key: string, values: [number, number]) => {
    handleParamsChange({
      ...params,
      gun: {
        ...params.gun,
        [key]: values,
      },
    });
  };

  const handleSpellAdd = (id: string) => {
    const maxCapacity = params.gun?.deck_capacity?.[1] || sliderConfigs.deck_capacity.max;
    const newCards = [...params.cards, id].slice(0, maxCapacity);
    handleParamsChange({
      ...params,
      cards: newCards,
      gun: {
        ...params.gun,
        deck_capacity: [
          Math.max(params.gun?.deck_capacity?.[0] || sliderConfigs.deck_capacity.min, newCards.length),
          maxCapacity,
        ],
      },
    });
  };

  const handleSpellRemove = (id: string) => {
    handleParamsChange({
      ...params,
      cards: params.cards.filter(s => s !== id),
    });
  };

  const handleAlwaysCastAdd = (id: string) => {
    handleParamsChange({
      ...params,
      permanentCard: id,
    });
    setAlwaysCastOpen(false);
  };

  const handleAlwaysCastRemove = () => {
    handleParamsChange({
      ...params,
      permanentCard: undefined,
    });
  };

  const wandUI = gameInfoProvider.providers.wand.GetWandUI({
    deck_capacity: (params.gun.deck_capacity[0] + params.gun.deck_capacity[1]) / 2,
    actions_per_round: (params.gun.actions_per_round[0] + params.gun.actions_per_round[1]) / 2,
    reload_time: (params.gun.reload_time[0] + params.gun.reload_time[1]) / 2,
    shuffle_deck_when_empty: (params.gun.shuffle_deck_when_empty[0] + params.gun.shuffle_deck_when_empty[1]) / 2,
    fire_rate_wait: (params.gun.fire_rate_wait[0] + params.gun.fire_rate_wait[1]) / 2,
    spread_degrees: (params.gun.spread_degrees[0] + params.gun.spread_degrees[1]) / 2,
    mana_max: (params.gun.mana_max[0] + params.gun.mana_max[1]) / 2,
    mana_charge_speed: (params.gun.mana_charge_speed[0] + params.gun.mana_charge_speed[1]) / 2,
    cost: 0,
    force_unshuffle: 0,
    prob_unshuffle: 0,
    prob_draw_many: 0,
    is_rare: 0,
    speed_multiplier: 1,
  });

  return (
    <Modal fullscreen="sm-down" scrollable show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Wand Search</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-4">
          <Col>
            <div className="d-flex gap-2">
              <TriStateToggle
                state={
                  params.gun.shuffle_deck_when_empty[0] === params.gun.shuffle_deck_when_empty[1]
                    ? params.gun.shuffle_deck_when_empty[0] === 0
                      ? -1
                      : 1
                    : 0
                }
                onChange={val =>
                  setParams(prev => ({
                    ...prev,
                    gun: {
                      ...prev.gun,
                      shuffle_deck_when_empty: val === -1 ? [0, 0] : val === 0 ? [0, 1] : [1, 1],
                    },
                  }))
                }
                translationKey="$inventory_shuffle"
                t={t}
              />
              <TriStateToggle
                state={params.permanentCard === null ? -1 : params.permanentCard === undefined ? 0 : 1}
                onChange={val =>
                  handleParamsChange({
                    ...params,
                    permanentCard: val === -1 ? null : val === 0 ? undefined : true,
                  })
                }
                translationKey="$inventory_alwayscasts"
                t={t}
              />
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={8}>
            {Object.entries(params.gun).map(([key, value]) => {
              if (!Array.isArray(value)) return null;
              const [min, max] = value as [number, number];
              const config = sliderConfigs[key];
              if (!config) return null;

              const displayMin = config.format ? config.format(min) : min;
              const displayMax = config.format ? config.format(max) : max;

              return (
                <div key={key} className="">
                  <StatDisplay label={key} value={min === max ? displayMin : `${displayMin} - ${displayMax}`} t={t} />
                  <MultiRangeSlider
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    value={[min, max]}
                    onChange={vals => handleRangeChange(key, vals)}
                  />
                </div>
              );
            })}
          </Col>
          <Col md={4} className="d-none d-md-flex justify-content-center align-items-start pt-4">
            <div style={{ transform: "rotate(-90deg)" }}>
              <Icon uri={wandUI.file} width="7rem" />
            </div>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            {params.permanentCard !== null && (
              <div className="p-3 border border-secondary rounded mb-3">
                <h6 className="mb-3">Always Cast</h6>
                <div className="d-flex align-items-center">
                  {params.permanentCard && params.permanentCard !== undefined ? (
                    <Entity
                      id="Spell"
                      entityParams={{ extra: params.permanentCard }}
                      onClick={() => setAlwaysCastOpen(true)}
                    />
                  ) : (
                    <SpellSlot onClick={() => params.permanentCard !== null && setAlwaysCastOpen(true)} />
                  )}
                  {params.permanentCard && params.permanentCard !== undefined && (
                    <Button variant="outline-danger" size="sm" className="ms-2" onClick={handleAlwaysCastRemove}>
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="p-3 border border-secondary rounded">
              <div className="d-flex justify-content-between mb-3">
                <h6 className="mb-0">Spell Slots ({params.gun.deck_capacity[1]})</h6>
                <div className="d-flex align-items-center">
                  <Form.Check
                    type="switch"
                    id="spell-strict-mode"
                    label={params.cardsStrict ? "All" : "Some"}
                    checked={params.cardsStrict}
                    onChange={e => setParams(prev => ({ ...prev, cardsStrict: e.target.checked }))}
                    className="me-3"
                  />
                  <Button variant="primary" size="sm" onClick={() => setSpellSelectOpen(true)}>
                    Add Spells
                  </Button>
                </div>
              </div>
              <div>
                {Array.from({ length: params.gun.deck_capacity[1] }).map((_, i) => (
                  <div key={i} style={{ display: "inline-block" }}>
                    {params.cards[i] ? (
                      <Entity
                        id="Spell"
                        entityParams={{ extra: params.cards[i] }}
                        onClick={() => setSpellSelectOpen(true)}
                        width={SPELL_SIZE}
                      />
                    ) : (
                      <SpellSlot onClick={() => setSpellSelectOpen(true)} />
                    )}
                  </div>
                ))}
              </div>
              {params.cards.length ? (
                <div className="mt-2">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => setParams(prev => ({ ...prev, cards: [] }))}
                  >
                    Clear All Spells
                  </Button>
                </div>
              ) : null}
            </div>
          </Col>
        </Row>
      </Modal.Body>

      <SpellSelect
        show={spellSelectOpen}
        selected={params.cards}
        showSelected
        filter={false}
        strict={params.cardsStrict}
        disabled={params.cards.length >= params.gun.deck_capacity[1]}
        handleClose={() => setSpellSelectOpen(false)}
        handleOnClick={handleSpellAdd}
        handleSelectedClicked={handleSpellRemove}
      />

      <SpellSelect
        show={alwaysCastOpen}
        selected={typeof params.permanentCard === "string" ? [params.permanentCard] : []}
        handleClose={() => setAlwaysCastOpen(false)}
        handleOnClick={handleAlwaysCastAdd}
        handleSelectedClicked={handleAlwaysCastRemove}
      />
    </Modal>
  );
};

export default WandSelect;
