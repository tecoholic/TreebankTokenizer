// @ts-check
import { align_tokens } from "./utils";

class MacIntyreContractions {
  CONTRACTIONS2 = [
    /\b(can)(not)\b/,
    /\b(d)('ye)\b/,
    /\b(gim)(me)\b/,
    /\b(gon)(na)\b/,
    /\b(got)(ta)\b/,
    /\b(lem)(me)\b/,
    /\b(more)('n)\b/,
    /\b(wan)(na)(?=s)/,
  ];
  CONTRACTIONS3 = [/ ('t)(is)\b/, / ('t)(was)\b/];
  CONTRACTIONS4 = [/\b(whad)(dd)(ya)\b/, /\b(wha)(t)(cha)\b/];
}

/**
 *  Copied from NLTK Python documentation
 * 
    The Treebank tokenizer uses regular expressions to tokenize text as in Penn Treebank.

    This tokenizer performs the following steps:

    - split standard contractions, e.g. ``don't`` -> ``do n't`` and ``they'll`` -> ``they 'll``
    - treat most punctuation characters as separate tokens
    - split off commas and single quotes, when followed by whitespace
    - separate periods that appear at the end of line

    >>> from nltk.tokenize import TreebankWordTokenizer
    >>> s = '''Good muffins cost $3.88\nin New York.  Please buy me\ntwo of them.\nThanks.'''
    >>> TreebankWordTokenizer().tokenize(s)
    ['Good', 'muffins', 'cost', '$', '3.88', 'in', 'New', 'York.', 'Please', 'buy', 'me', 'two', 'of', 'them.', 'Thanks', '.']
    >>> s = "They'll save and invest more."
    >>> TreebankWordTokenizer().tokenize(s)
    ['They', "'ll", 'save', 'and', 'invest', 'more', '.']
    >>> s = "hi, my name can't hello,"
    >>> TreebankWordTokenizer().tokenize(s)
    ['hi', ',', 'my', 'name', 'ca', "n't", 'hello', ',']
    
 */
class TreebankTokenizer {
  readonly STARTING_QUOTES: [RegExp, string][] = [
    [/^\"/, "``"],
    [/(``)/, " $1 "],
    [/([ \(\[{<])(\"|\'{2})/, "$1 `` "],
  ];

  readonly PUNCTUATION: [RegExp, string][] = [
    [/([:,])([^\d])/g, " $1 $2"],
    [/([:,])$/g, " $1 "],
    [/\.\.\./g, " ... "],
    [/([;@#$%&])/g, " $1 "],
    [/([^\.])(\.)([\]\)}>\"\']*)\s*$/, "$1 $2$3 "], // Handles the final period.
    [/([?!])/g, " $1 "],
    [/([^'])' /g, "$1 ' "],
  ];

  // Pads parentheses
  readonly PARENS_BRACKETS: [RegExp, string] = [/([\]\[\(\){}<>])/g, " $1 "];

  // Optionally: Convert parentheses, brackets and converts them to PTB symbols.
  readonly CONVERT_PARENTHESES: [RegExp, string][] = [
    [/\(/, "-LRB-"],
    [/\)/, "-RRB-"],
    [/\[/, "-LSB-"],
    [/\]/, "-RSB-"],
    [/{/, "-LCB-"],
    [/}/, "-RCB-"],
  ];

  readonly DOUBLE_DASHES: [RegExp, string] = [/--/, " -- "];

  // ending quotes
  readonly ENDING_QUOTES: [RegExp, string][] = [
    [/''/, " '' "],
    [/\"/, " '' "],
    [/([^' ])('[sS]|'[mM]|'[dD]|') /, "$1 $2 "],
    [/([^' ])('ll|'LL|'re|'RE|'ve|'VE|n't|N'T) /, "$1 $2 "],
  ];

  // List of contractions adapted from Robert MacIntyre's tokenizer.
  _contractions = new MacIntyreContractions();
  CONTRACTIONS2 = this._contractions.CONTRACTIONS2.map(
    (r) => new RegExp(r, "i")
  );
  CONTRACTIONS3 = this._contractions.CONTRACTIONS3.map(
    (r) => new RegExp(r, "i")
  );

  /**
   * Return a tokenized copy of `text`.
   *
   * @param text A string with a sentence or sentences
   * @param convert_parantheses if true, replaces parantheses with PTB symbols,
   * eg., `(` to `-LRB-`. Defaults to false.
   * @returns List of tokens from `text`
   */
  tokenize(text: string, convert_parantheses: boolean = false): string[] {
    for (let quote of this.STARTING_QUOTES) {
      var [regexp, substitution] = [...quote];
      text = text.replace(regexp, substitution);
    }

    for (let punc of this.PUNCTUATION) {
      var [regexp, substitution] = [...punc];
      text = text.replace(regexp, substitution);
    }

    // Handles parentheses.
    var [regexp, substitution] = [...this.PARENS_BRACKETS];
    text = text.replace(regexp, substitution);

    // Optionally convert parentheses
    if (convert_parantheses) {
      for (let paran of this.CONVERT_PARENTHESES) {
        var [regexp, substitution] = [...paran];
        text = text.replace(regexp, substitution);
      }
    }

    // Handles double dash
    var [regexp, substitution] = [...this.DOUBLE_DASHES];
    text = text.replace(regexp, substitution);

    // add extra space to make things easier
    text = " " + text + " ";

    for (let quote of this.ENDING_QUOTES) {
      var [regexp, substitution] = [...quote];
      text = text.replace(regexp, substitution);
    }

    for (let regexp of this.CONTRACTIONS2) {
      text = text.replace(regexp, " $1 $2 ");
    }

    for (let regexp of this.CONTRACTIONS3) {
      text = text.replace(regexp, " $1 $2 ");
    }

    return text.trim().split(/\s+/);
  }

  span_tokenize(text: string): [number, number][] {
    let rawTokens: string[] = this.tokenize(text);
    let tokens: string[];

    // Convert converted quotes back to original double quotes
    // Do this only if original text contains double quote(s) or double
    // single-quotes (because '' might be transformed to `` if it is
    // treated as starting quotes).
    if (text.includes('"') || text.includes("''")) {
      // Find double quotes and converted quotes
      let matched: string[] = [...text.matchAll(/``|'{2}|\"/g)].map(
        (match) => match[0]
      );
      // Replace converted quotes back to double quotes
      // tokens = [
      //     matched.pop(0) if tok in [] else tok
      //     for tok in raw_tokens
      // ]
      tokens = rawTokens.map((tok) =>
        ['"', "``", "''"].indexOf(tok) !== -1 ? matched.splice(0, 1)[0] : tok
      );
    } else {
      tokens = rawTokens;
    }

    return align_tokens(tokens, text);
  }

  tokenize_sents(sentences) {
    return sentences.map((s) => this.tokenize(s));
  }

  *span_tokenize_sents(sentences) {
    for (let s of sentences) {
      yield this.span_tokenize(s);
    }
  }
}

module.exports = TreebankTokenizer;
