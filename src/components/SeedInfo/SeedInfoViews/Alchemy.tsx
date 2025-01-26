import React, { FC, ReactElement, useContext } from "react";
import { Card, CardGroup, Container, ListGroup, ListGroupItem, Stack } from "react-bootstrap";

import GameInfoProvider from "../../../services/SeedInfo/infoHandler";
import { capitalize } from "../../../services/helpers";
import { AlchemyConfigContext } from "../../AlchemyConfigContext";
import { useMaterialFavorite } from "./helpers";
import classNames from "classnames";
import { FungalMaterial } from "./FungalShifts";

interface IAlchemyProps {
  alchemy: {
    LC: string[];
    AP: string[];
  };
  infoProvider: GameInfoProvider;
}

const AlchemyCard: FC<{ materials: string[]; Title: ReactElement }> = ({ materials, Title }) => {
  const { isFavorite } = useMaterialFavorite();
  return (
    <Card style={{ width: "12rem" }}>
      <Card.Title style={{ height: "2rem" }} className="mb-1 text-center m-0 pt-1 fs-5">
        {Title}
      </Card.Title>
      <Card.Body className="p-0 mx-1 mb-1">
        <ListGroup variant="flush">
          {materials.map(l => (
            <ListGroupItem
              key={l}
              style={{ minHeight: "2rem" }}
              className={classNames(isFavorite(l) && "text-info", "text-start m-0 p-0 fs-6")}
            >
              <div className="mt-2">
                <FungalMaterial id={l} className="ms-3" />
              </div>
            </ListGroupItem>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

const Alchemy = (props: IAlchemyProps) => {
  const { alchemy, infoProvider } = props;
  const [showId] = useContext(AlchemyConfigContext);
  return (
    <CardGroup className="border rounded-3">
      <AlchemyCard Title={<>Lively Concoction</>} materials={alchemy.LC} />
      <AlchemyCard Title={<>Alchemic Precursor</>} materials={alchemy.AP} />
    </CardGroup>
  );
};

export default Alchemy;
