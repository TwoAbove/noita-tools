/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { IRule } from "../IRule";
import { InfoProvider } from "./Base";

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

  entities;

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

  test(rule: IRule): boolean {
    return true;
  }
}

export default EntityInfoProvider;
