import classNames from "classnames";
import { isNull } from "lodash";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { localizeNumber, ticksToS } from "../../../services/helpers";
import { SpellInfoProvider } from "../../../services/SeedInfo/infoHandler/InfoProviders/Spell";

import Icon from "../../Icons/Icon";
import Entity from "../../Icons/Entity";
import type { WandInfoProvider } from "../../../services/SeedInfo/infoHandler/InfoProviders/Wand";

const spellInfoProvider = new SpellInfoProvider({} as any);

function splitIntoChunks<T>(arr: T[], size: number, pad?: boolean, padWith?) {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    const tempArray = arr.slice(i, i + size);
    while (tempArray.length < size) {
      tempArray.push(padWith);
    }
    res.push(tempArray);
  }
  return res;
}

const Wand = (props: {
  title?: string;
  item: ReturnType<WandInfoProvider["provide"]>;
  isFavorite: (id: string) => boolean;
}) => {
  const { t } = useTranslation("materials");
  const { title, item, isFavorite } = props;
  const spellsPerRow = 10; // This is the Noita default in the tooltip.
  const cards = [
    ...item.cards.cards,
    ...(Array(
      // Empty spell slots
      Math.floor(item.gun.deck_capacity) - item.cards.cards.length,
    ).fill("") as string[]),
  ];
  const hasFavorite = cards.some(isFavorite);
  const cardsToShow = splitIntoChunks(cards, spellsPerRow, true, null);

  const wandName = title; // || item.ui.name; // This is in the code, but not used in Noita.

  return (
    <div className={classNames(hasFavorite && "border-info", "p-3 card ", wandName && "pt-2")}>
      {wandName && <h5 className="text-center">{wandName}</h5>}
      <Row>
        <Col className="my-0">
          <table className="table table-responsive lh-sm table-sm table-borderless">
            <tbody>
              <tr>
                <th scope="row">{t("$inventory_shuffle")}</th>
                <td>{item.gun.shuffle_deck_when_empty ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <th scope="row">{t("$inventory_actionspercast")}</th>
                <td>{Math.floor(item.gun.actions_per_round)}</td>
              </tr>
              <tr>
                <th scope="row">{t("$inventory_castdelay")}</th>
                <td>{ticksToS(item.gun.fire_rate_wait)} s</td>
              </tr>
              <tr>
                <th scope="row">{t("$inventory_rechargetime")}</th>
                <td>{ticksToS(item.gun.reload_time)} s</td>
              </tr>
              <tr>
                <th scope="row">{t("$inventory_manamax")}</th>
                <td>{Math.round(item.gun.mana_max)}</td>
              </tr>
              <tr>
                <th scope="row">{t("$inventory_manachargespeed")}</th>
                <td>{item.gun.mana_charge_speed}</td>
              </tr>
              <tr>
                <th scope="row">{t("$inventory_capacity")}</th>
                <td>{Math.floor(item.gun.deck_capacity)}</td>
              </tr>
              <tr>
                <th scope="row">{t("$inventory_spread")}</th>
                <td>{Math.round(item.gun.spread_degrees * 10) / 10}&#176;</td>
              </tr>
              {item.cards.permanentCard && (
                <tr>
                  <th scope="row">{t("$inventory_alwayscasts")}</th>
                  <td>
                    <Entity
                      id="Spell"
                      entityParams={{
                        extra: item.cards.permanentCard,
                      }}
                      size="2rem"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Col>
        <Col className="my-0" xs="auto">
          <div className="d-flex flex-column justify-content-center">
            <div style={{ transform: "rotate(-90deg)" }}>
              <Icon background uri={item.ui.file} />
            </div>
            <div className="text-center">{localizeNumber(item.gun.cost)}</div>
          </div>
        </Col>
      </Row>
      <div className="ps-2">
        {cardsToShow.map((cardRow, ii) => {
          return (
            <Row className="justify-content-start" xs={spellsPerRow} key={ii}>
              {cardRow.map((card, i) => (
                <Col className="p-0 mb-1 me-1" key={i}>
                  {card && (
                    <Entity
                      id="Spell"
                      entityParams={{
                        extra: card,
                      }}
                      size="1.75rem"
                    />
                  )}
                </Col>
              ))}
            </Row>
          );
        })}
      </div>
    </div>
  );
};

export { Wand };
