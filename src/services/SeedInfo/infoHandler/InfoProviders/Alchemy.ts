/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { includesAll } from '../../../helpers';
import { IRule } from '../IRule';
import { InfoProvider } from './Base';


export class AlchemyInfoProvider extends InfoProvider {
  provide() {
    const res = this.randoms.PickForSeed();
    const [LC, AP] = res.split(';');
    return {
      LC: LC.split(':')[1].split(','),
      AP: AP.split(':')[1].split(',')
    };
  }

  test(rule: IRule): boolean {
    let info = this.provide();
    const allLC = includesAll(rule.val.LC.map(String), info.LC);
    const allAP = includesAll(rule.val.AP.map(String), info.AP);
    return allLC && allAP;
  }
}
