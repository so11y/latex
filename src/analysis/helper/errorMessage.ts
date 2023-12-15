export function formatterError(_: TemplateStringsArray, ...arg: any[]) {
  const [message, ...temp] = arg;
  return temp.reduce((prev, next, index) => {
    return prev.replace(`$${index}`, next);
  }, message);
}

export const ErrorMessage = {
  Unknown: {
    UnKnownCall: "未知方法调用",
    UnknownSyntax: "未知语法",
    UnknownIdentifier: "未知字符",
    UnknownOperator: "不支持位运算等符号",
  },
  BinaryExpression: {
    EqNumberOrCall: "运算两边需要是数值或者函数调用表达式或者运算",
  },
  CallExpression: {
    ArgLengthExpect: "参数个数不匹配需要 $0 个参数",
  },
  ConditionalExpression: {
    OnlyLogical: `只能是使用三元和逻辑表达式符号 $0`,
    OnlyTrueCall: "真结果需要是函数调用并且不能再返回逻辑表达式了",
    OnlyFalseCall: "假结果需要是函数调用并且不能再返回逻辑表达式了",
    NotNestConditionalExpression:
      "不支持在直接嵌套Conditional函数和三元表达式,但是可以在搭配逻辑表达式使用",
  },
  Expression: {
    RootNotBool: "当前最终运算得出的可能是一个布尔值，请检查",
    NotCanRootAst: "最外层只能是函数调用或者运算或者三元表达在或者是数值",
  },
  Identifier: {
    CallKeyCode: "需要调用函数的方式写$0(word)",
  },
  Literal: {
    OnlyInCall: "字符串只能出现在调用里",
  },
  LogicalExpression: {
    OnlyLogical: "逻辑表达式两边需要是条件表达式 使用 && 或者 || 连接 ",
  },
  NumberLiteral: {
    NeedComposeBinary: "数字需要与运算符号配合",
  },
};
