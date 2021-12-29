import TreebankTokenizer from "../src/index";

test("TreebankTokenizer.tokenize", () => {
  const t = new TreebankTokenizer();
  expect(
    t.tokenize(
      "Good muffins cost $3.88\nin New York.  Please buy me\ntwo of them.\nThanks."
    )
  ).toStrictEqual([
    "Good",
    "muffins",
    "cost",
    "$",
    "3.88",
    "in",
    "New",
    "York.",
    "Please",
    "buy",
    "me",
    "two",
    "of",
    "them.",
    "Thanks",
    ".",
  ]);

  expect(t.tokenize("They'll save and invest more.")).toStrictEqual([
    "They",
    "'ll",
    "save",
    "and",
    "invest",
    "more",
    ".",
  ]);

  expect(t.tokenize("hi, my name can't hello,")).toStrictEqual([
    "hi",
    ",",
    "my",
    "name",
    "ca",
    "n't",
    "hello",
    ",",
  ]);

  var s =
    "Good muffins cost $3.88 (roughly 3,36 euros)\nin New York.  Please buy me\ntwo of them.\nThanks.";

  expect(t.tokenize(s)).toStrictEqual([
    "Good",
    "muffins",
    "cost",
    "$",
    "3.88",
    "(",
    "roughly",
    "3,36",
    "euros",
    ")",
    "in",
    "New",
    "York.",
    "Please",
    "buy",
    "me",
    "two",
    "of",
    "them.",
    "Thanks",
    ".",
  ]);

  expect(t.tokenize(s, true)).toStrictEqual([
    "Good",
    "muffins",
    "cost",
    "$",
    "3.88",
    "-LRB-",
    "roughly",
    "3,36",
    "euros",
    "-RRB-",
    "in",
    "New",
    "York.",
    "Please",
    "buy",
    "me",
    "two",
    "of",
    "them.",
    "Thanks",
    ".",
  ]);
});
