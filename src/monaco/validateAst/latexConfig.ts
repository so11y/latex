import { BinaryExpressionSchema } from "./binaryExpression";
export interface LatexCallConfig {
  name: string;
  alias: string;
  astName?: string;
  readonly config?: {
    readonly accept: Array<{
      type?: string;
      notCheck?: boolean;
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
          type: BinaryExpressionSchema.type,
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

export const LatexNames = Object.keys(LatexCallConfig);
