import { FC, useContext, useState } from "react";
import { Stack, Form, Tooltip, OverlayTrigger, Table } from "react-bootstrap";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import { GameInfoProvider } from "../../../services/SeedInfo/infoHandler";
import { FungalInfoProvider } from "../../../services/SeedInfo/infoHandler/InfoProviders/Fungal";
import { MaterialInfoProvider } from "../../../services/SeedInfo/infoHandler/InfoProviders/Material";
import { AlchemyConfigContext } from "../../AlchemyConfigContext";
import { capitalize } from "../../../services/helpers";
import { useTranslation } from "react-i18next";
import { useMaterialFavorite } from "./helpers";
import classNames from "classnames";
import i18n from "../../../i18n";

const materialProvider = new MaterialInfoProvider(i18n);

enum Direction {
  From,
  To,
}

const HeldMaterial = ({
  highlight,
  className,
  ...rest
}: {
  highlight: boolean;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <FungalMaterial id="held material" className={classNames(highlight ? "text-info" : "", className)} {...rest} />
  );
};

interface IFungalMaterialProps {
  id: string | string[];
  size?: string;
  showColor?: boolean;
  className?: string;
}

export const FungalMaterial: React.FC<IFungalMaterialProps> = ({ id, showColor = true, className, size = 1 }) => {
  const ids = [id].flat();
  const [showId] = useContext(AlchemyConfigContext);
  const { isFavorite } = useMaterialFavorite();
  const name = materialProvider.translate(ids[0]);
  const material = materialProvider.provide(ids[0]);

  const calculatedSize = `calc(1rem * ${size})`;
  const fontSize = `calc(0.85rem * ${size})`;
  const questionSize = `calc(0.75rem * ${size})`;

  return (
    <div
      className={classNames(ids.some(isFavorite) && "text-info", "d-flex align-items-center text-center", className)}
      style={{
        fontSize,
      }}
    >
      {showColor && (
        <div
          className={"d-flex align-center rounded-3 me-1 border border-light align-items-center justify-content-center"}
          style={{
            width: calculatedSize,
            height: calculatedSize,
            backgroundColor: "#" + (material.color || "00000000"),
          }}
        >
          <span style={{ fontSize: questionSize }}>{material.color ? "" : "?"}</span>
        </div>
      )}
      {capitalize(name)} {showId && <span className="text-muted fw-light">{`(${ids.join(", ")})`}</span>}
    </div>
  );
};

const DirectionalMaterial: React.FC<{ id: string; toId: string }> = ({ id, toId }) => {
  return (
    <div style={{ marginBottom: "1px" }} className="d-flex flex-nowrap text-nowrap text-muted">
      <FungalMaterial size="0.75" id={id} />{" "}
      <span
        style={{
          fontSize: "0.75rem",
        }}
        className="mx-2"
      >
        &rarr;
      </span>{" "}
      <FungalMaterial size="0.75" id={toId} />
    </div>
  );
};

interface IFungalMaterialListProps {
  materials: Map<string, string>;
  direction?: Direction;
  heldMaterial?: boolean;
  gold_to_x?: string;
  grass_to_x?: string;
}

export const FungalMaterialList: React.FC<IFungalMaterialListProps> = ({
  materials,
  direction,
  gold_to_x,
  grass_to_x,
  heldMaterial,
}) => {
  /*
  Var 'materials' may contain multiple materials with the same display name.
  This is because some materials like 'Flammable Gas' have static variants that are
  pre-rendered in a scene. Static materials have their own material ID.

  These materials should not be displayed twice.

  To solve this, materials will be sorted in a new `Map` where the key is the material
  name acts as the key and the material ids are stored in the value as an array.
  */

  const materialsByName = new Map();
  materials.forEach((name, id) => {
    const ids = materialsByName.get(name) ?? [];
    ids.push(id);
    materialsByName.set(name, ids);
  });

  // The logic that returns a JSX component requires an `Array`
  const materialsByNameArray = Array.from(materialsByName);

  return (
    <Stack>
      {heldMaterial && direction === Direction.From && <HeldMaterial highlight={false} />}
      {heldMaterial && direction === Direction.To && (
        <div className="lh-1 mb-1">
          <div style={{ marginBottom: "2px" }}>
            <HeldMaterial highlight={gold_to_x === "gold" || grass_to_x === "grass_holy"} className="mb-1" />
          </div>
          {gold_to_x && <DirectionalMaterial id="gold" toId={gold_to_x} />}
          {grass_to_x && <DirectionalMaterial id="grass_holy" toId={grass_to_x} />}
        </div>
      )}
      {materialsByNameArray.map(([name, ids]) => (
        <FungalMaterial key={name} id={ids} />
      ))}
    </Stack>
  );
};

interface IShiftProps {
  data: ReturnType<FungalInfoProvider["provide"]>[number];
  shifted: boolean;
  setShifted: (shifted: boolean) => void;
  materialProvider: MaterialInfoProvider;
}

export const Shift: FC<IShiftProps> = props => {
  const { data, shifted, setShifted, materialProvider } = props;
  const [showId] = useContext(AlchemyConfigContext);
  const { isFavorite } = useMaterialFavorite();
  const [audio] = useState(new Audio("notification-sound-7062.mp3"));

  // TODO: More uniform if data.from and data.to is always an array?
  const from: Array<string> = [data.from].flat();
  const to: Array<string> = [data.to].flat();
  // TODO: Maybe have translate return already capitalized?
  const fromMaterials = new Map(
    from.map(id => {
      return [id, materialProvider.translate(id)];
    }),
  );
  const toMaterials = new Map(
    to.map(id => {
      return [id, materialProvider.translate(id)];
    }),
  );

  const gold_to_x = data.gold_to_x;
  const grass_to_x = data.grass_to_x;

  const [showTimer, setShowTimer] = useState(false);

  const handleTimerExpire = () => {
    [0, 5].forEach(i => setTimeout(() => audio.play(), i * 1000));
    setShowTimer(false);
  };

  const handleSetShiftedClicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShifted(e.target.checked);
    setShowTimer(e.target.checked);
  };

  return (
    <tr className="align-middle">
      <td>
        <FungalMaterialList materials={fromMaterials} direction={Direction.From} heldMaterial={data.flaskFrom} />
      </td>
      <td>&rarr;</td>
      <td>
        <FungalMaterialList
          materials={toMaterials}
          direction={Direction.To}
          heldMaterial={data.flaskTo}
          gold_to_x={gold_to_x}
          grass_to_x={grass_to_x}
        />
      </td>
      <td>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <OverlayTrigger placement="right" key="right" overlay={<Tooltip id={`tooltip-right`}>Shifted</Tooltip>}>
            <Form.Check
              checked={shifted}
              onChange={handleSetShiftedClicked}
              type="checkbox"
              id={`shifted`}
              enterKeyHint="done"
            />
          </OverlayTrigger>
          {shifted && showTimer && (
            <div
              style={{
                fontSize: "0.75rem",
              }}
            >
              <CountdownCircleTimer
                isPlaying
                size={40}
                strokeWidth={5}
                duration={300}
                colors={"#004777"}
                onComplete={() => {
                  handleTimerExpire();
                }}
              >
                {({ remainingTime }) => remainingTime}
              </CountdownCircleTimer>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

interface IFungalShiftsProps {
  fungalData: ReturnType<FungalInfoProvider["provide"]>;
  infoProvider: GameInfoProvider;
}

const FungalShifts = (props: IFungalShiftsProps) => {
  const { fungalData, infoProvider } = props;
  const [t] = useTranslation("materials");

  const handleSetShifted = (i: number) => (shifted: boolean) => {
    const currentShifted = [...infoProvider.config.fungalShifts];
    currentShifted[i] = shifted;
    infoProvider.updateConfig({
      fungalShifts: currentShifted,
    });
  };

  return (
    <Table striped hover borderless size="sm">
      <tbody>
        {fungalData.map((data, i) => {
          return (
            <Shift
              key={i + t("$current_language")}
              data={data}
              shifted={!!infoProvider.config.fungalShifts[i]}
              setShifted={handleSetShifted(i)}
              materialProvider={infoProvider.providers.material}
            />
          );
        })}
      </tbody>
    </Table>
  );
};

export default FungalShifts;
