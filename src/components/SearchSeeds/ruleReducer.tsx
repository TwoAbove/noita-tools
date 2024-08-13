import { ILogicRules, RuleType } from "../../services/SeedInfo/infoHandler/IRule";

import cloneDeep from "lodash/cloneDeep.js";

import { getTreeTools } from "./node";
import { RuleConstructors } from "./RuleConstructor";

const treeTools = getTreeTools("id", "rules");

interface IState extends ILogicRules {
  selectedRule: string;
}

interface IAddAction {
  action: "add";
  data: {
    type: string;
    target: string;
  };
}
interface ISelectAction {
  action: "select";
  data: string;
}
interface IUpdateAction {
  action: "update";
  data: {
    id: string;
    config: any;
  };
}
interface IDeleteAction {
  action: "delete";
  data: string;
}
interface IMoveAction {
  action: "move";
  data: {
    source: string;
    dest: string;
  };
}
interface IImportAction {
  action: "import";
  data: string;
}

type IActions = IAddAction | ISelectAction | IUpdateAction | IDeleteAction | IMoveAction | IImportAction;

export const initialRuleState = {
  id: "root",
  type: RuleType.AND,
  rules: [],
  selectedRule: "search",
};

export const ruleReducer = (state: IState, action: IActions) => {
  const newState = cloneDeep(state);
  switch (action.action) {
    case "add": {
      newState.rules.push({
        id: self.crypto.randomUUID(),
        type: action.data.type,
        ...RuleConstructors[action.data.type].defaultConfig,
      });
      return newState;
    }
    case "select": {
      newState.selectedRule = action.data;
      return newState;
    }
    case "update": {
      const { id, config } = action.data;
      const node = treeTools.getById(newState, id);
      if (!node) {
        return state;
      }
      Object.assign(node, config);
      return newState;
    }
    case "delete": {
      const id = action.data;
      treeTools.deleteById(newState, id);
      return newState;
    }
    case "move": {
      const { source, dest } = action.data;
      treeTools.move(newState, source, dest);
      return newState;
    }
    case "import": {
      try {
        const str = action.data;
        return JSON.parse(atob(str));
      } catch (e) {
        console.error(e);
      }
    }
  }
  return state;
};
