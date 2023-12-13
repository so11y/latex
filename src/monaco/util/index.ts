export function extractTokenAndNumbers(str: string) {
  const regex = /\((\d+):(\d+)\)$/;
  const match = str.match(regex);
  if (match) {
    const extracted = {
      token: match[0],
      line: parseInt(match[1]),
      column: parseInt(match[2]),
    };
    return extracted;
  } else {
    return null;
  }
}


export function NOOP(){
  return undefined
}
