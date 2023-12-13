export function extractTokenAndNumbers(str: string) {
  const regex = /\((\d+):(\d+)\)$/;
  const match = str.match(regex);
  if (match) {
    const extracted = {
      token: match[0],
      firstNumber: parseInt(match[1]),
      secondNumber: parseInt(match[2]),
    };
    return extracted;
  } else {
    return null;
  }
}
