import { Literal } from "estree";
import { AstType } from "../types";

interface ConfigRecord {
  [key: string]: LatexCallConfig;
}

export interface LatexValidateConfig {
  validate: (
    this: Omit<LatexCallConfig["config"], "accept">,
    node: any,
    parent: any,
    index: number
  ) =>
    | true
    | {
        test: false;
        message: string;
      };
}

export interface LatexCallConfig {
  name: string;
  alias: string;
  astName?: string;
  config: {
    accept: Array<LatexValidateConfig>;
  };
}
const DefaultAccept: Array<LatexValidateConfig> = [
  {
    validate(node: any) {
      const notSameType = node.type !== AstType.Literal;
      if (notSameType) {
        return {
          test: false,
          message: `参数需要是字符串`,
        };
      }
      const isSomeType = typeof (node as Literal).value !== "string";
      if (isSomeType) {
        return {
          test: false,
          message: `参数需要是字符串`,
        };
      }
      return true;
    },
  },
];

export const LatexCallConfig = {
  Count: cratedDefaultAccept("Count", "数据量"),
  Mean: cratedDefaultAccept("Mean", "平均值"),
  Median: cratedDefaultAccept("Median", "中位数"),
  Absolute: cratedDefaultAccept("Absolute", "绝对值"),
  Min: cratedDefaultAccept("Min", "最小值"),
  Max: cratedDefaultAccept("Max", "最大值"),
  First: cratedDefaultAccept("First", "第一个点"),
  Last: cratedDefaultAccept("Last", "最后一个点"),
} satisfies ConfigRecord;

export const macroLatexCallConfig = {
  Conditional: {
    name: "Conditional",
    alias: "三元表达式",
  },
};

export const LatexNames = Object.keys({
  ...LatexCallConfig,
  ...macroLatexCallConfig,
});

export const AllLatex = {
  ...LatexCallConfig,
  ...macroLatexCallConfig,
};

function cratedDefaultAccept(name: string, alias: string) {
  return {
    name,
    alias,
    config: {
      accept: DefaultAccept,
    },
  };
}
