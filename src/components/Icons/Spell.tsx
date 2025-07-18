import { FC } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

import Icon from "./Icon";
import Clickable from "./Clickable";
import { SpellInfoProvider } from "../../services/SeedInfo/infoHandler/InfoProviders/Spell";
import { getWikiUrl } from "../../services/helpers";

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
  const wikiUrl = getWikiUrl(id, t(item.name, { lng: "en" }));

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
