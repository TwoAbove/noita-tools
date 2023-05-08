import { FC, useContext, useEffect, useMemo, useState, memo } from "react";

import entities from "../../services/SeedInfo/data/obj/entities.json";
import materials from "../../services/SeedInfo/data/materials.json";
import Icon from "./Icon";
import NoitaTexture from "./normals/noitaTexture";
import Spell from "./Spell";
import { GameInfoContext } from "../SeedInfo/SeedDataOutput";
import { Wand } from "../SeedInfo/SeedInfoViews/ShopItems";
import { Button, Modal } from "react-bootstrap";
import { Square } from "../helpers";
import { useSpellFavorite } from "../SeedInfo/SeedInfoViews/helpers";
import { GeneratedPotion } from "../SeedInfo/SeedInfoViews/Potion";
import PotionSecret from "../SeedInfo/SeedInfoViews/PotionSecret";
import PotionRandomMaterial from "../SeedInfo/SeedInfoViews/PotionRandomMaterial";
import PowderStash from "../SeedInfo/SeedInfoViews/PowderStash";
import { useTranslation } from "react-i18next";

const questionMark =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAIAAABvrngfAAAABnRSTlMAAAAAAABupgeRAAAAJ0lEQVR4nGNkYGB4O+EhAwMDAwODcIE8AzIfjY1N6O2Eh1iU4NMCAGxKETbGzzNZAAAAAElFTkSuQmCC";

interface INormalMapRendererProps {
  material: any;
  animations: any;
}
const NormalMapRenderer = ({ material, animations, ...rest }: INormalMapRendererProps) => {
  const color = material.graphics.color;
  const [texture, setTexture] = useState<string | null>();
  useEffect(() => {
    (() => {
      NoitaTexture(color, animations.actions[animations.default].src[0])
        .then(texture => {
          setTexture(texture);
        })
        .catch(e => {
          console.error(e);
        });
      return null;
    })();
  }, [material, animations, color]);

  if (!texture) {
    return <>loading</>;
  }
  return <Icon uri={texture} {...rest} />;
};
const MemoizedNormalMapRenderer = memo(
  NormalMapRenderer,
  (p, n) => p.material === n.material && p.animations === n.animations
);

interface IWandModalProps {
  x: number;
  y: number;
  cost: number;
  level: number;
  force_unshuffle?: boolean;
}

const WandModal: FC<IWandModalProps> = ({ x, y, cost, level, force_unshuffle }) => {
  const { gameInfoProvider } = useContext(GameInfoContext);
  const { isFavorite: isSpellFavorite } = useSpellFavorite();

  const [wandOpen, setWandOpen] = useState(false);

  const unshufflePerk = !![...gameInfoProvider!.config.pickedPerks.values()]
    .flat(2)
    .filter(p => p === "NO_MORE_SHUFFLE").length;

  const wand = useMemo(
    () => gameInfoProvider!.providers.wand.provide(x, y, cost, level, !!force_unshuffle, !!unshufflePerk),
    [gameInfoProvider, x, y, cost, level, force_unshuffle, unshufflePerk]
  );
  const favoriteSpells = ([wand.cards.permanentCard, ...wand.cards.cards].filter(Boolean) as string[]).filter(id =>
    isSpellFavorite(id)
  );

  return (
    <>
      <Button
        className="position-relative"
        onClick={() => setWandOpen(true)}
        variant={favoriteSpells.length ? "outline-info" : "outline-primary"}
        size="sm"
      >
        <Square>
          <Icon uri={wand.ui.file} />
        </Square>
      </Button>
      <Modal centered scrollable show={!!wandOpen} onHide={() => setWandOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Wand</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wand item={wand} isFavorite={() => false} />
        </Modal.Body>
      </Modal>
    </>
  );
};

const NonPreview = ({ id, action, ...rest }) => {
  const [t] = useTranslation("materials");
  const entity = entities[id];
  const name = entity.name;
  const animations = entity.animations as any;
  const image = animations.actions[action || animations.default || "default"]?.src[0];
  return <Icon uri={image} title={t(name)} {...rest} />;
};

interface EntityProps {
  id: string;
  action?: string;
  entityParams?: any;
  preview?: boolean;

  size?: string;
  width?: string;
  height?: string;

  onClick?: () => unknown;
}

const Entity: FC<EntityProps> = ({ id, action, entityParams = {}, preview = false, ...rest }) => {
  const [t] = useTranslation("materials");

  // TODO: maybe ENUM is better?
  if (id === "Spell") {
    if (!entityParams.extra) {
      return <Spell id="LIGHT_BULLET" width="2.5rem" {...rest} />;
    }
    return <Spell id={entityParams.extra} {...rest} />;
  }

  if (id.startsWith("data/entities/items/wand_")) {
    if (!preview) {
      return <Entity id="data/entities/items/starting_wand.xml" {...rest} />;
    }
    const {
      x,
      y,
      extra: { cost, level, force_unshuffle },
    } = entityParams;
    // TODO: Handle unshuffle perk
    // const unshufflePerk = gameInfoProvider.config.pickedPerks
    return <WandModal x={x} y={y} cost={cost} level={level} force_unshuffle={force_unshuffle} />;
  }

  if (id === "data/entities/items/pickup/potion.xml") {
    const { x, y } = entityParams;
    if (!preview) {
      return <NonPreview id={id} action={action} {...rest} />;
    }
    return <GeneratedPotion x={x} y={y} />;
  }
  if (id === "data/entities/items/pickup/potion_secret.xml") {
    const { x, y } = entityParams;
    if (!preview) {
      return <NonPreview id={id} action={action} {...rest} />;
    }
    return <PotionSecret x={x} y={y} />;
  }
  if (id === "data/entities/items/pickup/potion_random_material.xml") {
    const { x, y } = entityParams;
    if (!preview) {
      return <NonPreview id={id} action={action} {...rest} />;
    }
    return <PotionRandomMaterial x={x} y={y} />;
  }

  if (id === "data/entities/items/pickup/powder_stash.xml") {
    if (!preview) {
      const entity = entities[id];
      const name = entity.name;
      const animations = entity.animations as any;
      const image = animations.actions[action || animations.default || "default"]?.src[0];
      return <Icon uri={image} title={t(name)} {...rest} />;
    }
    const { x, y } = entityParams;
    return <PowderStash x={x} y={y} />;
  }

  const entity = entities[id];

  if (!entity) {
    return <Icon uri={questionMark} title={id} />;
  }

  // TODO: animate
  const animations = entity.animations;
  const image = animations.actions[action || animations.default || "default"]?.src[0];

  if (animations?.config?.material) {
    const material = materials[animations?.config?.material];
    // if (material.graphics?.normal_mapped) {
    return <MemoizedNormalMapRenderer material={material} animations={animations} {...rest} />;
    // }
  }

  const name = entity.ui_name || entity.name;

  return <Icon uri={image} title={t(name)} {...rest} />;
};

export default Entity;
