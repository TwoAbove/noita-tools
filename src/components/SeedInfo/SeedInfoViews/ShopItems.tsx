import classNames from "classnames";
import { isNull } from "lodash";
import { Modal, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { localizeNumber, ticksToS } from "../../../services/helpers";
import {
  IShopType,
  IItemShop,
  IWandShop,
  ShopInfoProvider,
} from "../../../services/SeedInfo/infoHandler/InfoProviders/Shop";
import { SpellInfoProvider } from "../../../services/SeedInfo/infoHandler/InfoProviders/Spell";

import Icon from "../../Icons/Icon";

const spellInfoProvider = new SpellInfoProvider({} as any);

const Item = (props: { item: IItemShop["items"][number]; className: string; highlight?: boolean }) => {
  const { item, highlight, className } = props;
  const { t } = useTranslation("materials");
  return (
    <div
      className={classNames("m-2 text-center d-flex flex-column justify-content-center align-items-center", className)}
    >
      <Icon
        className={classNames(highlight && "shadow")}
        uri={item.spell.sprite}
        title={t(item.spell.name)}
        background
      />
      {localizeNumber(item.price)}
    </div>
  );
};

const ItemShop = (props: { shop: IItemShop; isFavorite: (id: string) => boolean }) => {
  const { shop, isFavorite } = props;
  return (
    <div>
      <Row className="align-items-end" xs={shop.items.length / 2}>
        {shop.items.map((item, i) => {
          const highlight = isFavorite(item.spell.id);
          return (
            <Col key={i}>
              <Item highlight={highlight} className={classNames(highlight && "mb-3")} item={item} />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

function splitIntoChunk<T>(arr: T[], size: number, pad?: boolean, padWith?) {
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

export const Wand = (props: {
  title?: string;
  item: IWandShop["items"][number];
  isFavorite: (id: string) => boolean;
}) => {
  const { t } = useTranslation("materials");
  const { title, item, isFavorite } = props;
  const spellsPerRow = 10;
  const cards = [
    ...item.cards.cards,
    ...Array(
      // Empty spell slots
      Math.floor(item.gun.deck_capacity) - item.cards.cards.length,
    ).fill(""),
  ];
  const hasFavorite = cards.some(isFavorite);
  const cardsToShow = splitIntoChunk(cards, spellsPerRow, true, null);

  const wandName = title; // || item.ui.name; // This is in the code, but not used in Noita.

  return (
    <div className={classNames(hasFavorite && "border-info", "p-3 card ", wandName && "pt-2")}>
      {wandName && <h5 className="text-center">{wandName}</h5>}
      <Row>
        <Col>
          <table className="table table-sm table-borderless">
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
                    <Icon
                      size="2rem"
                      uri={spellInfoProvider.provide(item.cards.permanentCard).sprite}
                      title={t(spellInfoProvider.provide(item.cards.permanentCard).name)}
                      background
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Col>
        <Col xs="auto">
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
              {cardRow.map((card, i) => {
                let s: any = spellInfoProvider.provide(card);
                if (isNull(card)) {
                  s = null;
                }
                return (
                  <Col className="p-0 mb-1" key={i}>
                    {s && <Icon size="2rem" uri={s.sprite} title={t(s.name)} background />}
                  </Col>
                );
              })}
            </Row>
          );
        })}
      </div>
    </div>
  );
};

const WandShop = (props: { shop: IWandShop; isFavorite: (id: string) => boolean }) => {
  const { shop, isFavorite } = props;
  return (
    <Row md={1} lg={2}>
      {shop.items.map((item, i) => {
        return (
          <Col key={i}>
            <Wand item={item} isFavorite={isFavorite} />
          </Col>
        );
      })}
    </Row>
  );
};

const ShopItems = (props: {
  shop: ReturnType<ShopInfoProvider["spawn_all_shop_items"]>;
  isFavorite: (id: string) => boolean;
}) => {
  const { shop, isFavorite } = props;
  return (
    <>
      {shop.type === IShopType.item ? (
        <ItemShop shop={shop} isFavorite={isFavorite} />
      ) : (
        <WandShop shop={shop} isFavorite={isFavorite} />
      )}
    </>
  );
};

interface IShopProps {
  shop: ReturnType<ShopInfoProvider["spawn_all_shop_items"]>;
  show: boolean;
  handleClose: () => void;
  isFavorite: (id: string) => boolean;
}

const Shop = (props: IShopProps) => {
  const { show, shop, handleClose, isFavorite } = props;
  return (
    <Modal centered fullscreen="sm-down" size="lg" scrollable show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Shop Items</Modal.Title>
      </Modal.Header>
      <Modal.Body>{shop && <ShopItems shop={shop} isFavorite={isFavorite} />}</Modal.Body>
    </Modal>
  );
};

export default Shop;
