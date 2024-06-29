import classNames from "classnames";
import { Modal, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { localizeNumber } from "../../../services/helpers";
import {
  IShopType,
  IItemShop,
  IWandShop,
  ShopInfoProvider,
} from "../../../services/SeedInfo/infoHandler/InfoProviders/Shop";

import Icon from "../../Icons/Icon";
import { Wand } from "./Wand";

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

const WandShop = (props: { shop: IWandShop; isFavorite: (id: string) => boolean }) => {
  const { shop, isFavorite } = props;
  return (
    <div className="d-flex flex-wrap justify-content-between gap-3">
      {shop.items.map((item, i) => {
        return (
          <Col xs="auto" key={i}>
            <Wand item={item} isFavorite={isFavorite} />
          </Col>
        );
      })}
    </div>
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
