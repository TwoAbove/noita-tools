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

  test(rule: IRule): boolean {
    return true;
  }
}

export default EntityInfoProvider;
