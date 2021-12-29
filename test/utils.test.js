import { align_tokens } from "../src/utils";
import TreebankTokenizer from "../src/index";

test("align_tokens", () => {
  const t = new TreebankTokenizer();
  const s =
    "The plane, bound for St Petersburg, crashed in Egypt's Sinai desert just 23 minutes after take-off from Sharm el-Sheikh on Saturday.";

  const tokens = t.tokenize(s);
  const expected = [
    [0, 3],
    [4, 9],
    [9, 10],
    [11, 16],
    [17, 20],
    [21, 23],
    [24, 34],
    [34, 35],
    [36, 43],
    [44, 46],
    [47, 52],
    [52, 54],
    [55, 60],
    [61, 67],
    [68, 72],
    [73, 75],
    [76, 83],
    [84, 89],
    [90, 98],
    [99, 103],
    [104, 109],
    [110, 119],
    [120, 122],
    [123, 131],
    [131, 132],
  ];
  const aligned = align_tokens(tokens, s);
  // Check that length of tokens and tuples are the same.
  expect(aligned.length).toEqual(expected.length);
  // Check that the output is as expected.
  expect(aligned).toStrictEqual(expected);

  // Check that the slices of the string corresponds to the tokens.
  const sliced = aligned.map((p) => s.substring(p[0], p[1]));
  expect(sliced).toStrictEqual(tokens);
});
