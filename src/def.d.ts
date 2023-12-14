declare module "estree" {
  interface NumberLiteral extends Omit<import("estree").Literal, "type"> {
    type: "NumberLiteral";
  }

  interface NodeMap {
    NumberLiteral: NumberLiteral;
  }
}

export {};
