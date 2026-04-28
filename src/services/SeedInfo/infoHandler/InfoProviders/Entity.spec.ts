import { beforeAll, describe, expect, it } from "vitest";

import { EntityInfoProvider } from "./Entity";

describe("EntityInfoProvider", () => {
  const entities = new EntityInfoProvider({} as any);

  beforeAll(async () => {
    await entities.ready();
  });

  it("uses item image names when entity names are missing or unknown", () => {
    expect(entities.getDisplayNameKey("data/entities/items/pickup/potion.xml")).toBe("$item_potion");
    expect(entities.getDisplayNameKey("data/entities/items/pickup/physics_die.xml")).toBe("$item_die");
  });

  it("uses entity names when they are meaningful", () => {
    expect(entities.getDisplayNameKey("data/entities/animals/illusions/dark_alchemist.xml")).toBe(
      "$animal_dark_alchemist",
    );
    expect(entities.getDisplayNameKey("data/entities/animals/illusions/shaman_wind.xml")).toBe("$animal_shaman_wind");
  });

  it("translates display names with an id fallback", () => {
    const t = (key: string) => `translated:${key}`;

    expect(entities.getDisplayName("data/entities/items/pickup/physics_die.xml", t)).toBe("translated:$item_die");
    expect(entities.getDisplayName("missing/entity.xml", t)).toBe("missing/entity.xml");
  });
});
