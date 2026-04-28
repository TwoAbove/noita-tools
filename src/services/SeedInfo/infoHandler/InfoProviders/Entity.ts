/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { IRule } from "../IRule";
import { InfoProvider } from "./Base";

type EntityData = {
  ui_name?: string;
  name?: string;
  itemImage?: {
    item_name?: string;
    image?: any;
    [key: string]: any;
  };
  animations?: any;
  physicsImage?: any;
  [key: string]: any;
};

type EntityNameTranslator = (key: string, options?: any) => string;

export class EntityInfoProvider extends InfoProvider {
  entityPromise = import("../../data/obj/entities.json")
    .catch(e => {
      console.error(e);
      return {};
    })
    .then((entityData: any) => {
      this.entities = entityData.default;
    });

  async ready(): Promise<void> {
    await this.entityPromise;
    return;
  }

  entities: Record<string, EntityData> = {};

  provide(id: string) {
    return this.entities[id];
  }

  getDisplayNameKey(id: string) {
    const entity = this.provide(id);
    if (!entity) {
      return undefined;
    }

    if (entity.ui_name) {
      return entity.ui_name;
    }

    if (entity.name && entity.name !== "unknown") {
      return entity.name;
    }

    return entity.itemImage?.item_name || entity.name;
  }

  getDisplayName(id: string, t?: EntityNameTranslator, options?: any) {
    const name = this.getDisplayNameKey(id);
    if (!name) {
      return id;
    }
    return t ? t(name, options) : name;
  }

  test(rule: IRule): boolean {
    return true;
  }
}

export default EntityInfoProvider;
