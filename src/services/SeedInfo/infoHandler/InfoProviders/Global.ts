
export class Global {

  _G = {};
  GetValue(varname: string, defaultvalue?: string | number | undefined) {
    return this._G[varname] || defaultvalue;
  }
  SetValue(varname: string, varvalue: string | number) {
    this._G[varname] = varvalue
  }
  GameAddFlagRun(flag: string) {
    this._G["FLAG_" + flag] = true
  }
  GameHasFlagRun(flag: string) {
    return this._G["FLAG_" + flag] != null
  }
}
