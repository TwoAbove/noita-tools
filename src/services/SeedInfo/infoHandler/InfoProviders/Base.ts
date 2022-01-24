import { IRandom } from '../../random';
import { IRule } from "../IRule";

export abstract class InfoProvider {
  randoms: IRandom;

  constructor(randoms: IRandom) {
    this.randoms = randoms;
  }
  abstract provide(...args: any[]): any;

  abstract test(rule: IRule): boolean;
  //  {
  //   let info = this.provide(...rule.params)
  //   if (rule.path) {
  //     info = get(info, rule.path);
  //   }
  //   info = Array.isArray(info) ? new Set(info) : info;
  //   console.log('info', info);
  //   console.log('rule.val', rule.val);
  //   return isEqual(rule.val, info);
  // }
}
