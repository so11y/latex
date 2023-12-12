import { Node } from "acorn"

export interface ValidateTypeResult {
  node: Node,
  through: boolean,
  message: string | null
}

export function throwNode(node: Node): ValidateTypeResult {
  return {
    node,
    through: true,
    message: null
  }
}

export function extractTokenAndNumbers(str: string) {
  // 匹配 "(1:22)" 格式的模式
  const regex = /\((\d+):(\d+)\)/;

  // 使用正则表达式进行匹配
  const match = str.match(regex);

  // 如果匹配成功，则返回提取的内容，包括两个数字
  if (match) {
    const extracted = {
      token: match[0], // 完整匹配的字符串
      firstNumber: parseInt(match[1]), // 第一个数字
      secondNumber: parseInt(match[2]) // 第二个数字
    };
    return extracted;
  } else {
    return null;
  }
}
