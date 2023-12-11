/* eslint-disable @typescript-eslint/no-unused-vars */

import Clickable from "./Clickable";
import Icon from "./Icon";
import { useTranslation } from "react-i18next";
import { PerkInfoProvider } from "../../services/SeedInfo/infoHandler/InfoProviders/Perk";
import classNames from "classnames";
import { SpellInfoProvider } from "../../services/SeedInfo/infoHandler/InfoProviders/Spell";

const PERKS_LOTTERY_ICON =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAABe0lEQVR4AY3BMWsaUQDA8f/dPbV6RGiWlDqFUq4lFEpBsRwc7hksWTKZD+A3CF0kkK+QXXFxKQ2S8cCKhnC3dAnJW3qgCA1uMVqUlquP5sERAs3vZ7BWr5Tjye2cpyjkbU56F4ZRr5Tjr9+v2drYQEnnMjxmtVii3MxmfHr/Buvl5vPGn98x6VwGKyXQal2fZ6/fMvnmo1gpgZUSZE0LU1gIHqh1fTSnWMLp+sgwIDg6JMmofngX/5z/otb1SfrS+Iyy1zhGk2FAcHTICzuL4J4MAxSnWELZaxyTNGg3SRIkXJ6dojnFEsqg3USRwz6O66GZJOzsVtFkGDBoN5HDPorjeiSZ/Ifjeihy2CfJ5N5UXqFdnp2iyWEfxXE9puMRmmBttVgSdVpEwPb+ATu7VTTH9ZiOR9yd91BWiyXYWQQPRJ0WEbC9f8B0POLuvMdjRCFvE/4Ys8U/6VwGJeq0SFotlig3sxkfXxUwWKtXyvHkds5TFPI2J70L4y9nDYAGbLbEVwAAAABJRU5ErkJggg==";

interface IPerkProps {
  className?: string | false;
  highlight?: boolean;
  rerollable?: boolean;
  alwaysCast?: string;
  clicked?: boolean;
  width?: string;
  perk: PerkInfoProvider["perksArr"][number];
  onClick?: () => void;
}

const spells = new SpellInfoProvider({} as any);

const Perk = (props: IPerkProps) => {
  const { className, clicked, rerollable, perk, width, highlight, alwaysCast, onClick } = props;
  const [t] = useTranslation("materials");

  const item = alwaysCast ? spells.provide(alwaysCast) : null;

  return (
    <div onClick={onClick} className={classNames(className, "position-relative")}>
      <Clickable clicked={clicked}>
        {alwaysCast && item && (
          <Icon
            backgroundStyle={{
              marginLeft: "5px",
              marginTop: "2px",
            }}
            className={classNames("position-absolute top-0 translate-middle", highlight && "shadow")}
            width="1.4rem"
            uri={item.sprite}
            title={t(item.name)}
            background
          />
        )}
        <Icon
          className={classNames(highlight && "shadow")}
          uri={perk.perk_icon}
          alt={t(perk.ui_description)}
          title={t(perk.ui_name)}
          width={width}
        />
        {rerollable && (
          <Icon
            style={{
              marginRight: "5px",
              marginTop: "2px",
            }}
            className="position-absolute top-0 translate-middle"
            width="1.5rem"
            uri={PERKS_LOTTERY_ICON}
          />
        )}
      </Clickable>
    </div>
  );
};

export default Perk;
