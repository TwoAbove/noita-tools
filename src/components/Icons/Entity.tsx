import { FC, useContext, useEffect, useMemo, useState, memo } from "react";

import Icon from "./Icon";
import NoitaTexture from "./normals/noitaTexture";
import Spell from "./Spell";
import { GameInfoContext } from "../SeedInfo/SeedDataOutput";
import { Wand } from "../SeedInfo/SeedInfoViews/Wand";
import { Button, Modal } from "react-bootstrap";
import { Square } from "../helpers";
import { useSpellFavorite } from "../SeedInfo/SeedInfoViews/helpers";
import { GeneratedPotion } from "../SeedInfo/SeedInfoViews/Potion";
import PotionSecret from "../SeedInfo/SeedInfoViews/PotionSecret";
import PotionRandomMaterial from "../SeedInfo/SeedInfoViews/PotionRandomMaterial";
import PowderStash from "../SeedInfo/SeedInfoViews/PowderStash";
import { useTranslation } from "react-i18next";
import { MaterialInfoProvider } from "../../services/SeedInfo/infoHandler/InfoProviders/Material";
import { EntityInfoProvider } from "../../services/SeedInfo/infoHandler/InfoProviders/Entity";
import { getWikiUrl } from "../../services/helpers";

import { MeditationCube, HourGlass, BuriedEye } from "./EntityIcons";
import MemoizedNormalMapRenderer from "./normals/NormalMapRender";
import Clickable from "./Clickable";

const materials = new MaterialInfoProvider({} as any);
const entities = new EntityInfoProvider({} as any);

let entitiesLoaded = false;
Promise.all([materials.ready(), entities.ready()]).then(() => {
  entitiesLoaded = true;
});

const questionMark =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAIAAABvrngfAAAABnRSTlMAAAAAAABupgeRAAAAJ0lEQVR4nGNkYGB4O+EhAwMDAwODcIE8AzIfjY1N6O2Eh1iU4NMCAGxKETbGzzNZAAAAAElFTkSuQmCC";

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
    [gameInfoProvider, x, y, cost, level, force_unshuffle, unshufflePerk],
  );
  const favoriteSpells = ([wand.cards.permanentCard, ...wand.cards.cards].filter(Boolean) as string[]).filter(id =>
    isSpellFavorite(id),
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
        <Modal.Body className="d-flex flex-wrap justify-content-around gap-3">
          <Wand item={wand} isFavorite={() => false} />
        </Modal.Body>
      </Modal>
    </>
  );
};

const NonPreview = ({ id, action, ...rest }) => {
  const [t] = useTranslation("materials");
  const entity = entities.provide(id);
  const name = entity.name;
  const animations = entity.animations as any;
  const image = animations.actions[action || animations.default || "default"]?.src[0];
  const wikiUrl = getWikiUrl(id, t(name, { lng: "en" }));

  return (
    <Clickable wikiUrl={wikiUrl}>
      <Icon uri={image} title={t(name)} {...rest} />
    </Clickable>
  );
};

interface EntityProps {
  id: string;
  action?: string;
  entityParams?: any;
  preview?: boolean;

  className?: string;
  style?: React.CSSProperties;

  size?: string;
  width?: string;
  height?: string;

  onClick?: () => unknown;
}

export const Entity: FC<EntityProps> = ({ id, action, entityParams = {}, preview = false, ...rest }) => {
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

  if (id === "data/entities/misc/custom_cards/bomb.xml") {
    if (!preview) {
      return <NonPreview id={id} action={action} {...rest} />;
    }
    return <Spell id="BOMB" {...rest} />;
  }

  if (id === "data/biome_impl/excavationsite/meditation_cube_visual.png") {
    return <MeditationCube />;
  }

  if (id === "data/particles/image_emitters/hourglass.png") {
    return <HourGlass />;
  }

  if (id === "data/biome_impl/snowcave/buried_eye_visual.png") {
    return <BuriedEye />;
  }

  const entity = entities.provide(id);

  if (!entity) {
    return <Icon uri={questionMark} title={id} />;
  }

  if (id.includes("goldnugget")) {
    const material = materials.provide(entity.physicsImage.material);
    return (
      <MemoizedNormalMapRenderer
        materialColor={material.graphics.color}
        imageSrc={entity.physicsImage.image.src}
        {...rest}
      />
    );
  }

  if (id === "data/entities/items/pickup/powder_stash.xml") {
    if (!preview) {
      const name = entity.name;
      const animations = entity.animations;
      const image = animations.actions[action || animations.default || "default"]?.src[0];
      return <Icon uri={image} title={t(name)} {...rest} />;
    }
    const { x, y } = entityParams;
    return <PowderStash x={x} y={y} />;
  }

  if (entity.itemImage && entity.itemImage.image) {
    const name = entity.itemImage.item_name;
    const image = entity.itemImage.image.src;
    const wikiUrl = getWikiUrl(entity.name, t(name));

    return (
      <Clickable wikiUrl={wikiUrl}>
        <Icon uri={image} title={t(name)} {...rest} />
      </Clickable>
    );
  }

  if (entity.animations) {
    const animations = entity.animations;
    const image = animations.actions[action || animations.default || "default"]?.src[0];
    const name = entity.ui_name || entity.name || entity.itemImage.item_name;
    const wikiUrl = getWikiUrl(entity.name, t(name));

    return (
      <Clickable wikiUrl={wikiUrl}>
        <Icon uri={image} title={t(name)} {...rest} />
      </Clickable>
    );
  }

  if (entity.physicsImage) {
    const material = materials.provide(entity.physicsImage.material);
    return (
      <MemoizedNormalMapRenderer
        materialColor={material.graphics.color}
        imageSrc={entity.physicsImage.image.src}
        {...rest}
      />
    );
  }
  return <Icon uri={questionMark} title={id} />;
};

export default Entity;
