/**
 * This function attemps to find the offsets of the tokens in sentence, as
 * a sequence of `[start, end]` arrays, given the tokens and also the source
 * string.
 *
 * @param tokens array of strings that are the result of the tokenization
 * @param sentence the original string
 * @returns array of [start, end] points of tokens
 */
export function align_tokens(
  tokens: string[],
  sentence: string
): [number, number][] {
  let point = 0;
  let offsets: [number, number][] = [];
  let start: number;

  for (let token of tokens) {
    start = sentence.indexOf(token, point);
    if (start === -1) {
      throw Error(`substring ${token} not found in "${sentence}"`);
    }
    point = start + token.length;
    offsets.push([start, point]);
  }

  return offsets;
}
