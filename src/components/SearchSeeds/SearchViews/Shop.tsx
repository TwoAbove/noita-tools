import React, { useReducer, useState, useEffect } from "react";
import { Row, Col, Container, Stack, Button, Form } from "react-bootstrap";

import WandIcon from "../../Icons/Wand";
import Clickable from "../../Icons/Clickable";
import LightBulletIcon from "../../Icons/LightBullet";
import { IRule } from "../../../services/SeedInfo/infoHandler/IRule";
import { IShopType } from "../../../services/SeedInfo/infoHandler/InfoProviders/Shop";

import { Square } from "../../helpers";
// import ShopSelect from './ShopSelect';
import SpellSelect from "../../SpellSelect";
import WandSelect from "../../WandSelect";
import cloneDeep from "lodash/cloneDeep.js";
import { ConfigRow } from "../../Settings/helpers";

interface WandAdditionalSettingsProps {
  handleClickModal: () => void;
}

const WandAdditionalSettings = (props: WandAdditionalSettingsProps) => {
  const { handleClickModal } = props;

  return (
    <Button onClick={handleClickModal} className="m-1">
      Advanced Wand Filter
    </Button>
  );
};

interface SpellAdditionalSettingsProps {
  strict: boolean;
  handleClickModal: () => void;
  handleAllSomeToggle: (val: boolean) => void;
}

const SpellAdditionalSettingsProps = (props: SpellAdditionalSettingsProps) => {
  const { handleClickModal, handleAllSomeToggle, strict } = props;
  return (
    <>
      <Button onClick={handleClickModal} className="m-1">
        Advanced Spell Filter
      </Button>
      <div>
        <ConfigRow
          left={<>{strict ? "All" : "Some"}</>}
          right={
            <Form.Switch
              checked={strict}
              onChange={e => {
                handleAllSomeToggle(e.target.checked);
              }}
              label=""
            />
          }
        />
      </div>
    </>
  );
};

interface IShopLevelProps {
  handleClicked: (string) => void;
  handleClickModal: () => void;
  handleAllSomeToggle: (val: boolean) => void;
  shop: any;
  level: number;
  strict: boolean;
}

const ShopLevel = (props: IShopLevelProps) => {
  const { handleClicked, handleClickModal, handleAllSomeToggle, shop, level } = props;
  return (
    <Row>
      <Col>
        <div className="d-flex flex-column">
          <div>Level {level + 1}:</div>
          <Stack gap={3} direction="horizontal">
            <div>{}</div>
            <Clickable onClick={() => handleClicked(IShopType.wand)} clicked={shop.type === IShopType.wand}>
              <Square>
                <WandIcon />
              </Square>
            </Clickable>
            <Clickable onClick={() => handleClicked("")} clicked={!shop.type}>
              <Square>Any</Square>
            </Clickable>
            <Clickable onClick={() => handleClicked(IShopType.item)} clicked={shop.type === IShopType.item}>
              <LightBulletIcon />
            </Clickable>
          </Stack>
          {shop.type === IShopType.wand && <WandAdditionalSettings handleClickModal={handleClickModal} />}
          {shop.type === IShopType.item && (
            <SpellAdditionalSettingsProps
              handleClickModal={handleClickModal}
              handleAllSomeToggle={handleAllSomeToggle}
              strict={shop.strict}
            />
          )}
        </div>
      </Col>
    </Row>
  );
};

type IConfig = Array<{ type: string; items: any[]; strict: boolean }>;
interface IAction {
  action: "type" | "spell-add" | "spell-remove" | "strict";
  level: number;
  data?: any;
}

const shopReducer = (state: IConfig, a: IAction): IConfig => {
  const { action, data, level } = a;
  const newState = cloneDeep(state);
  switch (action) {
    case "type": {
      if (!newState[level]) {
        newState[level] = { type: data, items: [], strict: true };
      } else {
        newState[level].type = data;
      }
      return newState;
    }
    case "spell-add": {
      if (!newState[level].items) {
        newState[level].items = [];
      }
      newState[level].items.push(data);
      return newState;
    }
    case "spell-remove": {
      if (!newState[level].items) {
        newState[level].items = [];
      }
      newState[level].items.splice(newState[level].items.indexOf(data), 1);
      return newState;
    }
    case "strict": {
      newState[level].strict = data;
      return newState;
    }
  }
  return state;
};

interface IShopProps {
  onUpdateConfig: (config: Partial<IRule>) => void;
  config: IRule;
}

const Shop = (props: IShopProps) => {
  const { onUpdateConfig, config } = props;
  const [d, setModal] = useState<[number, number]>([-1, IShopType.item]);
  const level = d[0];
  const shopType = d[1];
  const [shops, dispatch] = useReducer(shopReducer, config.val, () => {
    return config.val.map(shop => shop || { type: "", items: [], strict: true });
  });

  useEffect(() => {
    onUpdateConfig({
      type: "shop",
      path: "",
      params: [],
      val: shops,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shops]);

  const handleItemClickedAdd = (thing: any) => {
    dispatch({ action: "spell-add", level, data: thing });
  };
  const handleItemClickedRemove = (thing: any) => {
    dispatch({ action: "spell-remove", level, data: thing });
  };

  const handleTypeClicked = (l, type) => {
    dispatch({ action: "type", data: type, level: l });
  };

  const handleStrictSet = (l, val) => {
    dispatch({ action: "strict", data: val, level: l });
  };

  const handleOpenAdvancedModal = (i, type) => {
    setModal([i, type]);
  };

  const handleCloseAdvancedModal = () => {
    setModal([-1, 0]);
  };

  return (
    <Container fluid>
      <p>Compute-intensive if used. Use sparingly!</p>
      <Row className="justify-content-md-center">
        <Col xs="auto">
          <Stack gap={3}>
            {shops.map((shop, i) => {
              return (
                <ShopLevel
                  handleClicked={type => handleTypeClicked(i, type)}
                  handleClickModal={() => handleOpenAdvancedModal(i, shop.type)}
                  handleAllSomeToggle={val => handleStrictSet(i, val)}
                  level={i}
                  strict={shop.strict}
                  shop={shop || {}}
                  key={i}
                />
              );
            })}
          </Stack>
        </Col>
      </Row>
      {shopType === IShopType.item ? (
        <SpellSelect
          level={level}
          selected={shops[level]?.items}
          show={level !== -1}
          showSelected
          handleClose={handleCloseAdvancedModal}
          handleOnClick={id => handleItemClickedAdd(id)}
          handleSelectedClicked={item => handleItemClickedRemove(item)}
        />
      ) : (
        <WandSelect
          level={level}
          selected={shops[level]?.items}
          show={level !== -1}
          handleClose={handleCloseAdvancedModal}
          handleOnClick={id => handleItemClickedAdd(id)}
          handleSelectedClicked={item => handleItemClickedRemove(item)}
        />
      )}
    </Container>
  );
};

export default Shop;
