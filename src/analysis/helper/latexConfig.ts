import { ValidateGuardFalseMate } from "../types";
import { StringAccept } from "../callAccept/defaultAccept";

export interface ConfigRecord {
  [key: string]: LatexCallConfigType;
}

export interface LatexValidateCallAccept {
  key: string;
  describe: string;
  validate: (
    this: Omit<LatexCallConfigType["config"], "accept">,
    node: any,
    parent: any,
    index: number
  ) => true | ValidateGuardFalseMate;
}

export interface LatexCallConfigType {
  name: string;
  alias: string;
  astName?: string;
  config: {
    accept: Array<LatexValidateCallAccept>;
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
