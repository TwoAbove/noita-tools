import { Modal, Row, Col } from 'react-bootstrap';
import { localizeNumber, ticksToS } from '../../../services/helpers';
import {
  IItemShop,
  IWandShop,
  ShopInfoProvider
} from '../../../services/SeedInfo/infoHandler/InfoProviders/Shop';
import { SpellInfoProvider } from '../../../services/SeedInfo/infoHandler/InfoProviders/Spell';
import Icon from '../../Icons/Icon';

const Item = (props: { item: IItemShop['items'][number] }) => {
  const { item } = props;
  return (
    <div className="m-2 text-center">
      <Icon uri={item.spell.sprite} title={item.spell.name} />
      {localizeNumber(item.price)}
    </div>
  );
};

// 660419835
const ItemShop = (props: { shop: IItemShop }) => {
  const { shop } = props;
  return (
    <div>
      <Row xs={shop.items.length / 2}>
        {shop.items.map((item, i) => {
          return (
            <Col key={i}>
              <Item item={item} />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

// 153761947
const Wand = (props: { item: IWandShop['items'][number] }) => {
  const { item } = props;
  return (
    <div className="">
      <div className="p-3 d-flex flex-row justify-content-center">
        <div className="">
          <table className="table table-borderless">
            <tbody>
              <tr>
                <th scope="row">Shuffle</th>
                <td>{item.gun.shuffle_deck_when_empty ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <th scope="row">Spells/Cast</th>
                <td><b>~</b>{item.gun.actions_per_round}</td>
              </tr>
              <tr>
                <th scope="row">Cast delay</th>
                <td>{ticksToS(item.gun.fire_rate_wait)}</td>
              </tr>
              <tr>
                <th scope="row">Rechrg. Time</th>
                <td>{ticksToS(item.gun.reload_time)}</td>
              </tr>
              <tr>
                <th scope="row">Mana max</th>
                <td>{Math.round(item.gun.mana_max)}</td>
              </tr>
              <tr>
                <th scope="row">Mana chg. Spd</th>
                <td>{item.gun.mana_charge_speed}</td>
              </tr>
              <tr>
                <th scope="row">Capacity</th>
                <td><b>~</b> {Math.floor(item.gun.deck_capacity)}</td>
              </tr>
              <tr>
                <th scope="row">Spread</th>
                <td>{Math.round(item.gun.spread_degrees)}&#176;</td>
              </tr>
              {/* {item.cards.permanentCard &&
                <tr>
                  <th scope="row">Always casts</th>
                  <td><Icon size='2rem' uri={spell.provide(item.cards.permanentCard).sprite} /></td>
                </tr>
              } */}
            </tbody>
          </table>
          <div><i>Spells coming soon</i></div>
          {/* <div className='d-flex flex-wrap'>
            {item.cards.cards.map((card, i) => {
              const s = spell.provide(card);
              return (<Col key={i}><Icon size='2rem' uri={s.sprite} /></Col>)
            })}
          </div> */}
        </div>
        <div className="d-flex flex-column justify-content-center">
          <div>
            <Icon
              style={{ transform: 'rotate(-90deg)' }}
              uri={item.ui.file}
            />
          </div>
          <div className="mt-3 text-center">
            {localizeNumber(item.gun.cost)}
          </div>
        </div>
      </div>
    </div>
  );
};

const WandShop = (props: { shop: IWandShop }) => {
  const { shop } = props;
  return (
    <div>
      <Row xs={1} md={2}>
        {shop.items.map((item, i) => {
          return (
            <Col key={i}>
              <Wand item={item} />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

const ShopItems = (props: {
  shop: ReturnType<ShopInfoProvider['spawn_all_shop_items']>;
}) => {
  const { shop } = props;
  return (
    <>
      {' '}
      {shop.type === 'item' ? (
        <ItemShop shop={shop} />
      ) : (
        <WandShop shop={shop} />
      )}
    </>
  );
};

interface IShopProps {
  shop: ReturnType<ShopInfoProvider['spawn_all_shop_items']>;
  show: boolean;
  handleClose: () => void;
}

const Shop = (props: IShopProps) => {
  const { show, handleClose, shop } = props;
  return (
    <Modal
      centered
      fullscreen="sm-down"
      scrollable
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Shop Items</Modal.Title>
      </Modal.Header>
      <Modal.Body>{shop && <ShopItems shop={shop} />}</Modal.Body>
    </Modal>
  );
};

export default Shop;
