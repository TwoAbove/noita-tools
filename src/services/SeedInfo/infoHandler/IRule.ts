// Ideally we use a JSON schema validator, but it doesn't handle sparse arrays well.
// Is there something to get deep sparse inclusion between js objects???
export interface IRule<T = any> {
  id: string;
  type: string;
  params?: any;
  path?: string;
  strict?: boolean;
  // val should be a supported type by the structured clone algorithm:
  // https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
  val?: T;
}

export enum RuleType {
  AND = "and",
  OR = "or",
  NOT = "not",
  RULES = "rules",
}

export interface ILogicRules {
  id: string;
  type: RuleType.AND | RuleType.OR | RuleType.NOT;
  rules: IRules[];
  selectedRule?: string; // used only in UI
}

export interface IRuleRules {
  id: string;
  type: RuleType.RULES;
  rules: IRule[];
}

export type IRules = IRuleRules | ILogicRules;
