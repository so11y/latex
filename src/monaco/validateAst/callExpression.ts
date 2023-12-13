import { ValidateSchemaBase } from "./types";
export type CallExpressionSchemeType = Omit<ValidateSchemaBase, "type"> & {
  type: "CallExpression";
};

const LatexCallConfig = {
  Count: {
    name: "Count",
    alias: "数据量",
  },
  Mean: {
    name: "Mean",
    alias: "平均值",
  },
  Median: {
    name: "Median",
    alias: "中位数",
  },
  Absolute: {
    name: "Absolute",
    alias: "绝对值",
  },
  Min: {
    name: "Min",
    alias: "最小值",
  },
  Max: {
    name: "Max",
    alias: "最大值",
  },
  First: {
    name: "First",
    alias: "第一个点",
  },
  Last: {
    name: "Last",
    alias: "最后一个点",
  },
};

export const CallExpressionSchema: CallExpressionSchemeType = {
  type: "CallExpression",
  validate(node, parent, prop, index) {
    return {
      node,
      through: true,
      message: "",
    };
  },
};

export const LatexNames = Object.keys(LatexCallConfig);
