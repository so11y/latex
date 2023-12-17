import { AstType, ValidateGuardFalseMate } from "../types";
import { StringAccept } from "../callAccept/defaultAccept";
import { Node } from "estree";
import { Latex } from "../latex";

export interface ConfigRecord {
  [key: string]: LatexCallConfigType;
}

export interface LatexValidateAccept {
  key: string;
  describe: string;
  fork?: Array<AstType>;
  data?: Record<string, any>;
  child?: {
    accept: Array<LatexValidateAccept>;
  };
  validate: (
    this: Latex,
    node: Node,
    parent: Node,
    index: number
  ) => true | ValidateGuardFalseMate;
}

export interface LatexCallConfigType {
  name: string;
  alias: string;
  astName?: string;
  config: {
    accept: Array<LatexValidateAccept>;
  };
}

export class LatexConfig {
  LatexCallConfig = {
    Count: cratedDefaultAccept("Count", "数据量"),
    Mean: cratedDefaultAccept("Mean", "平均值"),
    Median: cratedDefaultAccept("Median", "中位数"),
    Absolute: cratedDefaultAccept("Absolute", "绝对值"),
    Min: cratedDefaultAccept("Min", "最小值"),
    Max: cratedDefaultAccept("Max", "最大值"),
    First: cratedDefaultAccept("First", "第一个点"),
    Last: cratedDefaultAccept("Last", "最后一个点"),
  } satisfies ConfigRecord;

  get LatexNames() {
    return Object.values(this.AllLatex).map((latex) => latex.name);
  }

  get AllLatex() {
    return {
      ...this.LatexCallConfig,
      ...macroLatexCallConfig,
    };
  }

  putCallExpression(config: LatexCallConfigType) {
    Reflect.set(this.LatexCallConfig, config.name, config);
  }
}

export const macroLatexCallConfig = {
  Conditional: {
    name: "Conditional",
    alias: "三元表达式",
  },
};

function cratedDefaultAccept(name: string, alias: string) {
  return {
    name,
    alias,
    config: {
      accept: [StringAccept],
    },
  };
}
