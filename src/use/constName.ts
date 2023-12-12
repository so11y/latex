export enum ComponentName {
  Logical = "Logical",
}

export const LatexKeys = {
  Number: {
    latexName: "Number",
    alias: "数值",
    _componentName: "NumberContain",
  },
  Count: {
    latexName: "Count",
    alias: "数据量",
    _componentName: "SingleContain",
  },
  Mean: {
    latexName: "Mean",
    alias: "平均值",
    _componentName: "SingleContain",
  },
  Median: {
    latexName: "Median",
    alias: "中位数",
    _componentName: "SingleContain",
  },
  Absolute: {
    latexName: "Absolute",
    alias: "绝对值",
    _componentName: "SingleContain",
  },
  Min: {
    latexName: "Min",
    alias: "最小值",
    _componentName: "SingleContain",
  },
  Max: {
    latexName: "Max",
    alias: "最大值",
    _componentName: "SingleContain",
  },
  First: {
    latexName: "First",
    alias: "第一个点",
    _componentName: "SingleContain",
  },
  Last: {
    latexName: "Last",
    alias: "最后一个点",
    _componentName: "SingleContain",
  },
  Plus: {
    latexName: "Plus",
    alias: "加",
    _componentName: "Binary",
    data: {
      operator: "+",
    },
  },
  Minus: {
    latexName: "Minus",
    alias: "减",
    _componentName: "Binary",
    data: {
      operator: "-",
    },
  },
  Times: {
    latexName: "Times",
    alias: "乘",
    _componentName: "Binary",
    data: {
      operator: "*",
    },
  },
  Div: {
    latexName: "Div",
    alias: "除",
    _componentName: "Binary",
    data: {
      operator: "{\\div}",
    },
  },
  Conditional: {
    latexName: "Conditional",
    alias: "if",
    _componentName: "Conditional",
  },
  Bracket: {
    latexName: "Bracket",
    alias: "括号",
    _componentName: "Bracket",
  },
  Eq: {
    latexName: "Eq",
    alias: "==",
    _componentName: "Logical",
  },
  NEq: {
    latexName: "NEq",
    alias: "!=",
    _componentName: "Logical",
  },
  Gt: {
    latexName: "Gt",
    alias: ">",
    _componentName: "Logical",
  },
  Lt: {
    latexName: "Lt",
    alias: "<",
    _componentName: "Logical",
  },
  EGt: {
    latexName: "EGt",
    alias: ">=",
    _componentName: "Logical",
  },
  ELt: {
    latexName: "ELt",
    alias: "<=",
    _componentName: "Logical",
  },
};

export const keys = Object.keys(LatexKeys);