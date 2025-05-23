import { FC } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

import Icon from "./Icon";
import Clickable from "./Clickable";
import { SpellInfoProvider } from "../../services/SeedInfo/infoHandler/InfoProviders/Spell";
import { getWikiUrl } from "../../services/helpers";

const ggnames: { [spellid: string]: string } = {
  "KANTELE_A": "Note_spells",
  "KANTELE_D": "Note_spells",
  "KANTELE_DIS": "Note_spells",
  "KANTELE_E": "Note_spells",
  "KANTELE_G": "Note_spells",
  "OCARINA_B": "Note_spells",
  "OCARINA_C": "Note_spells",
  "OCARINA_D": "Note_spells",
  "OCARINA_E": "Note_spells",
  "OCARINA_F": "Note_spells",
  "OCARINA_GSHARP": "Note_spells",
  "OCARINA_A2": "Note_spells",
  "X_RAY": "All-Seeing_Eye",
  "LONG_DISTANCE_CAST": "Long-Distance_Cast",
  "HITFX_CRITICAL_WATER": "Critical_on_Wet_(Water)_Enemies",
  "PINGPONG_PATH": "Ping-Pong_Path",
  "FIREBALL_RAY_LINE": "Two-Way_Fireball_Thrower",
  "CHAOS_POLYMORPH_FIELD": "Circle_of_Unstable_Metamorphosis",
  "LEVITATION_FIELD": "Circle_of_Buoyancy",
  "TELEPORTATION_FIELD": "Circle_of_Displacement",
  "BERSERK_FIELD": "Circle_of_Fervour",
  "SHIELD_FIELD": "Circle_of_Shielding",
  "FREEZE_FIELD": "Circle_of_Stillness",
  "POLYMORPH_FIELD": "Circle_of_Transmogrification",
  "ELECTROCUTION_FIELD": "Circle_of_Thunder",
  "ALCOHOL_BLAST": "Explosion_of_Spirits",
  "POISON_BLAST": "Explosion_of_Poison",
  "THUNDER_BLAST": "Explosion_of_Thunder",
  "FUNKY_SPELL": "%3F%3F%3F_(Spell)"
};

interface ISpellProps {
  id: string;
  className?: string | false;
  highlight?: boolean;
  width?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const spells = new SpellInfoProvider({} as any);

const Spell: FC<ISpellProps> = ({ id, className, width, highlight, onClick, style, ...rest }) => {
  const [t] = useTranslation("materials");

  const item = spells.provide(id);
  const wikiUrl = ggnames[id as keyof typeof ggnames] ? `https://noita.wiki.gg/wiki/${ggnames[id as keyof typeof ggnames]}` : getWikiUrl(t(item.name, { lng: "en" }));

  return (
    <Clickable useHover wikiUrl={wikiUrl} onClick={onClick}>
      <Icon
        className={classNames(className, highlight && "shadow" && "icon-spell")}
        width={width || "2rem"}
        uri={item.sprite}
        title={t(item.name)}
        background
        style={style}
        {...rest}
      />
    </Clickable>
  );
};

export default Spell;
