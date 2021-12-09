/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import deepEqual from 'fast-deep-equal/es6';

import {
  ButtonGroup,
  Tab,
  ListGroup,
  Container,
  Button,
  Row,
  Col,
  Nav,
  Stack
} from 'react-bootstrap';
import { Trash2, Plus } from 'react-feather';

import { IRule } from '../../services/SeedInfo/infoHandler';

import Alchemy from './SearchViews/Alchemy';
import Shop from './SearchViews/Shop';
import StartingFlask from './SearchViews/StartingFlask';
import StartingSpell from './SearchViews/StartingSpell';
import StartingBombSpell from './SearchViews/StartingBomb';

const genRules = (config: IConfig): IRule[] => {
  return Object.values(config);
};

interface IConfig {
  [type: string]: IRule;
}
interface IAction {
  action: string;
  type: string;
  data?: IRule;
}
const configReducer = (state: IConfig, action: IAction): IConfig => {
  switch (action.action) {
    case 'update':
      if (!deepEqual(state[action.type], action.data)) {
        return { ...state, [action.type]: action.data! };
      }
      return state;
    case 'delete':
      const newState = { ...state };
      delete newState[action.type];
      return newState;
    case 'add':
      return { ...state, [action.type]: { type: action.type, val: {} } };
    default:
  }
  return state;
};

interface IRuleConstructorProps {
  onSubmit: (config: IRule[]) => void;
}

const RuleConstructors = {
  alchemy: {
    Title: () => 'Alchemy',
    active: true,
    Component: Alchemy
  },
  shop: {
    Title: () => 'Shop',
    active: true,
    Component: Shop
  },
  rain: {
    Title: () => 'Rain',
    active: false,
    Component: Shop
  },
  startingFlask: {
    Title: () => 'Starting Flask',
    active: true,
    Component: StartingFlask
  },
  startingSpell: {
    Title: () => 'Starting Spell',
    active: true,
    Component: StartingSpell
  },
  startingBombSpell: {
    Title: () => 'Starting Bomb Spell',
    active: true,
    Component: StartingBombSpell
  },
  perk: {
    Title: () => 'Perks',
    active: false,
    Component: Shop
  },
  fungalShift: {
    Title: () => 'Fungal Shifts',
    active: false,
    Component: Shop
  },
  biomeModifier: {
    Title: () => 'Biome Modifiers',
    active: false,
    Component: Shop
  },
};

const RuleConstructor = (props: IRuleConstructorProps) => {
  const { onSubmit } = props;
  const [selected, setSelected] = React.useState<keyof typeof RuleConstructors>(
    '' as any
  );
  const [configState, dispatch] = React.useReducer(configReducer, {});

  React.useEffect(() => {
    onSubmit(genRules(configState));
  }, [configState, onSubmit]);

  const Component = RuleConstructors[selected]?.Component;
  const handleUpdate = (data) => {
    if (!selected) {
      return;
    }
    dispatch({
      action: 'update',
      type: selected,
      data
    })
  };

  // There should be a better way to have tab and pane parts. Maybe HOC?
  return (
    <Container fluid id="tab-config">
      <ListGroup horizontal className="row-cols-auto flex-wrap justify-content-center mb-4">
        {Object.entries(RuleConstructors).map(([type, r]) => {
          const activatedConfig = !!configState[type];
          const listVariant = activatedConfig ? 'success' : 'secondary';
          return (
            <ListGroup.Item
              className="d-flex border"
              disabled={!r.active}
              onClick={() => { setSelected(type as any); }}
              variant={listVariant}
              as={Col}
              eventKey={type}
              key={type}
            >
              <Row className="align-items-center row-cols-auto">
                <Col className="">{r.Title()}</Col>
                <Col className="">
                  {r.active && configState[type] && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation(); // So that ListGroup.Item is not triggered
                        setSelected('' as any);
                        dispatch({ action: 'delete', type });
                      }}
                    >
                      <Trash2 size={18} />
                    </Button>
                  )}
                  {r.active && !configState[type] && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation(); // So that ListGroup.Item is not triggered
                        dispatch({ action: 'add', type })
                      }}
                    >
                      <Plus size={18} />
                    </Button>
                  )}
                </Col>
              </Row>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
      <Row>
        <Col>
          {selected && <Component onUpdateConfig={handleUpdate} />}
        </Col>
      </Row>
    </Container>
  );
};

export default RuleConstructor;
