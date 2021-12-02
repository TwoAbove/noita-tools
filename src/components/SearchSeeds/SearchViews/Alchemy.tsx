import React, { useState } from 'react';
import { ButtonGroup, Container, Row, Col, Button } from 'react-bootstrap';

import { MaterialPicker } from '../../../services/Calculator2';
import { IRule } from '../../../services/SeedInfo/infoHandler';
import ListSelect from '../../ListSelect';

interface IRecipeIngredientsPickerProps {
  enoughLiquids: boolean;
  enoughAlchemy: boolean;

  selected: Set<string>;
  onUpdate: (selected: Set<string>) => void;
  onSelectAll: (part: string) => void;
  onDeselectAll: (part: string) => void;
}

const RecipeIngredientsPicker = (props: IRecipeIngredientsPickerProps) => {
  const {
    selected,
    onSelectAll,
    onDeselectAll,
    onUpdate,
    enoughLiquids,
    enoughAlchemy
  } = props;
  const ColProps = {
    xs: 6,
    lg: 6,
    className: 'mb-2 mt-3'
  };
  return (
    <Row className="pb-3">
      <Col {...ColProps}>
        <Row className="justify-content-center pb-2">
          <Row>
            <Col>
              <p {...(!enoughAlchemy ? { className: 'text-danger' } : {})}>
                Select none or at least one (1) of:
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <ButtonGroup size="sm">
                <Button
                  variant="outline-primary"
                  onClick={() => onSelectAll('ALCHEMY')}
                >
                  Select All
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => onDeselectAll('ALCHEMY')}
                >
                  Deselect All
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Row>
        <ListSelect
          items={MaterialPicker.ALCHEMY}
          selected={selected}
          onUpdate={selected => onUpdate(selected)}
        />
      </Col>
      <Col {...ColProps}>
        <Row className="justify-content-center pb-2">
          <Row>
            <Col>
              <p {...(!enoughLiquids ? { className: 'text-danger' } : {})}>
                Select none or at least two (2) of:{' '}
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <ButtonGroup size="sm">
                <Button
                  variant="outline-primary"
                  onClick={() => onSelectAll('LIQUIDS')}
                >
                  Select All
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => onDeselectAll('LIQUIDS')}
                >
                  Deselect All
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Row>
        <ListSelect
          items={MaterialPicker.LIQUIDS}
          selected={selected}
          onUpdate={selected => onUpdate(selected)}
        />
      </Col>
    </Row>
  );
};

const enoughLiquids = (selected: Set<string>) => {
  const liquids = MaterialPicker.LIQUIDS.filter(value => selected.has(value));
  return liquids.length === 0 || liquids.length >= 2;
};
const enoughAlchemy = (selected: Set<string>) => {
  const alchemy = MaterialPicker.ALCHEMY.filter(value => selected.has(value));
  return alchemy.length === 0 || alchemy.length >= 1;
};

interface IAlchemyProps {
  onUpdateConfig: (config: IRule) => void;
}

const Alchemy = (props: IAlchemyProps) => {
  const { onUpdateConfig } = props;

  const [firstRender, setFirstRender] = useState(true);

  const [apIngredientsSelected, setApIngredientsSelected] = useState<
    Set<string>
  >(new Set());
  const [lcIngredientsSelected, setLcIngredientsSelected] = useState<
    Set<string>
  >(new Set());

  React.useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
    }
    if (firstRender) {
      return;
    }
    onUpdateConfig({
      type: 'alchemy',
      path: '',
      params: [],
      val: {
        LC: lcIngredientsSelected,
        AP: apIngredientsSelected
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apIngredientsSelected, lcIngredientsSelected]);

  const handleSelectAll = (update: any, set: Set<string>) => (type: string) => {
    let newSet = new Set(...set);
    const materials =
      type === 'ALCHEMY' ? MaterialPicker.ALCHEMY : MaterialPicker.LIQUIDS;
    newSet = new Set([...set, ...materials]);
    update(newSet);
  };

  const handleDeselectAll = (update: any, set: Set<string>) => (
    type: string
  ) => {
    let newSet = new Set(...set);
    const materials =
      type === 'ALCHEMY' ? MaterialPicker.ALCHEMY : MaterialPicker.LIQUIDS;
    newSet = new Set([...set].filter(x => !materials.includes(x)));
    update(newSet);
  };

  // const hasEnoughLiquids =
  //   enoughLiquids(lcIngredientsSelected) &&
  //   enoughLiquids(apIngredientsSelected);
  // const hasEnoughAlchemy =
  //   enoughAlchemy(lcIngredientsSelected) &&
  //   enoughAlchemy(apIngredientsSelected);
  // const hasEnoughAll = hasEnoughLiquids && hasEnoughAlchemy;
  return (
    <Container>
      <Row>
        <p>
          Lists can be left blank if any combination will do. <br />
          The resulting seed's LC and AP ingredients will be from the selected
          values. <br />
          Do keep in mind that some combinations may not be possible, or unuseful.
        </p>
      </Row>
      <Row>
        <Col>
          <Row className="ms-2 me-2 ps-2 sticky-top bg-white rounded shadow-sm">
            Lively Concoction:
          </Row>
          <RecipeIngredientsPicker
            selected={lcIngredientsSelected}
            onUpdate={setLcIngredientsSelected}
            enoughLiquids={enoughLiquids(lcIngredientsSelected)}
            enoughAlchemy={enoughAlchemy(lcIngredientsSelected)}
            onSelectAll={handleSelectAll(
              setLcIngredientsSelected,
              lcIngredientsSelected
            )}
            onDeselectAll={handleDeselectAll(
              setLcIngredientsSelected,
              lcIngredientsSelected
            )}
          />
        </Col>
        <Col>
          <Row className="ms-2 me-2 ps-2 sticky-top bg-white rounded shadow-sm">
            Alchemic Precursor:
          </Row>
          <RecipeIngredientsPicker
            selected={apIngredientsSelected}
            onUpdate={setApIngredientsSelected}
            enoughLiquids={enoughLiquids(apIngredientsSelected)}
            enoughAlchemy={enoughAlchemy(apIngredientsSelected)}
            onSelectAll={handleSelectAll(
              setApIngredientsSelected,
              apIngredientsSelected
            )}
            onDeselectAll={handleDeselectAll(
              setApIngredientsSelected,
              apIngredientsSelected
            )}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Alchemy;
