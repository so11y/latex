import { parse, Node, Program } from "acorn";
import { walk } from "estree-walker";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
const validateType = {
  Program(node: Program) {},
};

const whiterAst = {
  ExpressionStatement(node: Node, parent: Node) {
    return {
      through: parent.type === "Program",
      message: "-----------",
    };
  },
};

export function validate(value: string) {
  const ast = parse(value, {
    ecmaVersion: "latest",
    sourceType: "script",
  });

  const keys = Object.keys(validateType);
  const whiterKeys = Object.keys(whiterAst);
  const diagnosisNodes: Array<Node> = [];
  const markers: Array<monaco.editor.IMarkerData> = [];
  //@ts-ignore
  walk(ast, {
    enter(node, parent, prop, index) {
      if (whiterKeys.includes(node.type)) {
        const isThrough = (whiterAst as any)[node.type](node, parent);
        if (!isThrough.through) {
          //TODO 把错误转为markers 添加到markers
        }
      }
      if (!keys.includes(node.type)) {
        diagnosisNodes.push(node as Node);
      }
    },
  });
  console.log(diagnosisNodes);
}
