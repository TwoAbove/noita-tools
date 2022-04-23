import parser, {
	AssignmentStatement,
	Expression,
	NumericLiteral,
	StringLiteral,
	TableConstructorExpression
} from 'luaparse';

const getVal = (ex: parser.Expression, state: any): any => {
  switch (ex.type) {
    case 'NumericLiteral': {
      return ex.value;
    }
    case 'StringLiteral': {
      return ex.raw.replaceAll('"', '');
    }
    case 'UnaryExpression': {
      if (ex.operator === '-') {
        if (ex.argument.type !== 'NumericLiteral') {
          console.log('Unhandled type: ', ex);
          break;
        }
        return -ex.argument.value;
      }
      break;
    }
    case 'BooleanLiteral': {
      return ex.value;
    }
    case 'Identifier': {
      return state[ex.name];
    }
    case 'FunctionDeclaration': {
      // Function, don't think I need to handle this
      break;
    }
    case 'TableConstructorExpression': {
      return getTable(ex, state);
    }
    default: {
      console.log('Unhandled type: ', ex);
      return undefined;
    }
  }
}

const getTable = (ex: TableConstructorExpression, state: any) => {
	const res = [];
	for (const e of ex.fields) {
		if (
			e.type === 'TableValue') {
        switch(e.value.type) {
          case "TableConstructorExpression" : {
            const o: any = {};
            for (const field of e.value.fields) {
              if (field.type === 'TableKeyString') {
                const key = field.key.name;
                const val = getVal(field.value, state);
                o[key] = val;
              }
            }
            res.push(o);
            break;
          }
          case "StringLiteral": {
            const val = getVal(e.value, state);
            res.push(val);
            break;
          }
        }
		}
    else {
      console.log(e)
    }
	}
	return res;
};

export const parseAST = (ast: parser.Chunk): any =>{
  const state: any = {};
	for (const statement of ast.body) {
		switch (statement.type) {
			case 'AssignmentStatement': {
        const inits = statement.init.length;
        for (let i = 0; i< inits; i++) {
          const variable = statement.variables[i];
          const init = statement.init[i];
          if (variable.type === 'Identifier') {
            const val = getVal(init, state);
            state[variable.name] = val;
          }
        }
				if (
					statement.init[0].type === 'TableConstructorExpression' &&
					statement.variables[0].type === 'Identifier'
				) {
					// tables
					const name = statement.variables[0].name;
					const table = getTable(statement.init[0], state);
					state[name] = table;
				}
				break;
			}
		}
	}
	return state;
}
