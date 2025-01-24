import { FC } from "react";

import Icon from "./Icon";
import { useTranslation } from "react-i18next";
import { SpellInfoProvider } from "../../services/SeedInfo/infoHandler/InfoProviders/Spell";
import classNames from "classnames";

interface ISpellProps {
  id: string;
  className?: string | false;
  highlight?: boolean;
  width?: string;
}

const spells = new SpellInfoProvider({} as any);

const Spell: FC<ISpellProps> = ({ id, className, width, highlight, ...rest }) => {
  const [t] = useTranslation("materials");

  const item = spells.provide(id);

  return (
    <Icon
      className={classNames(className, highlight && "shadow" && "spell")}
      width={width || "2rem"}
      uri={item.sprite}
      title={t(item.name)}
      background
      {...rest}
    />
  );
};

export default Spell;
