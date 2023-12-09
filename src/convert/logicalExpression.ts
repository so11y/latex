import { BinaryExpression } from "./binaryExpression";

export class LogicalExpression extends BinaryExpression {
  static type = "LogicalExpression";

  getTypeName() {
    return LogicalExpression.type;
  }
}
