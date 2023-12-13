import { BinaryExpressionSchema } from "./binaryExpression";
import { BinaryExpression } from "acorn"
import { operators } from "../util"
import { LogicalExpressionSchema } from "./logicalExpression";
export interface LatexCallConfig {
  name: string;
  alias: string;
  astName?: string;
  readonly config?: {
    readonly accept: Array<{
      type?: string;
      notCheck?: boolean;
      validate: (node: any, parent: any) => boolean
      literalType?: "string" | "number";
    }>;
  };
}

export const LatexCallConfig = {
  Count: {
    name: "Count",
    alias: "数据量",
  } as LatexCallConfig,
  Mean: {
    name: "Mean",
    alias: "平均值",
  } as LatexCallConfig,
  Median: {
    name: "Median",
    alias: "中位数",
  } as LatexCallConfig,
  Absolute: {
    name: "Absolute",
    alias: "绝对值",
  } as LatexCallConfig,
  Min: {
    name: "Min",
    alias: "最小值",
  } as LatexCallConfig,
  Max: {
    name: "Max",
    alias: "最大值",
  } as LatexCallConfig,
  First: {
    name: "First",
    alias: "第一个点",
  } as LatexCallConfig,
  Last: {
    name: "Last",
    alias: "最后一个点",
  } as LatexCallConfig,
  Conditional: {
    name: "If",
    astName: "Conditional",
    alias: "条件",
    config: {
      accept: [
        {
          validate(node: BinaryExpression) {
            if (node.type !== BinaryExpressionSchema.type) {
              return false;
            }
            if (operators[node.operator as keyof typeof operators].name !== LogicalExpressionSchema.type) {
              return false
            }
            return true;
          }
        },
        {
          notCheck: true,
        },
        {
          notCheck: true,
        },
      ],
    },
  } as LatexCallConfig,
};
export const SpecialLatexNames = [
  LatexCallConfig.Conditional.astName
]
export const LatexNames = Object.keys(LatexCallConfig);

