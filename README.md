# Treebank Tokenizer

This is a JavaScript port of the Treebank Tokenizer from the Python [NLTK library](https://www.nltk.org/index.html).


## Description

* The code is written in TypeScript and tests are written in JavaScript using Jest.
* Uses ESBuild for compiling it into a library

## Usage

### 1. Tokenization of a sentence

```js
const TreebankTokenizer =  require("treebank-tokenizer");

t = new TreebankTokenizer();

t.tokenize("This is a sentence.");
```

**Output**

```
['This', 'is', 'a', 'sentence', '.']
```

### 2. Getting the position of the tokens

```js
const TreebankTokenizer = require("treebank-tokenizer");

t = new TreebankTokenizer();

t.span_tokenize("This is a sentence.");
```

**Output**

```js
[ [ 0, 4 ], [ 5, 7 ], [ 8, 9 ], [ 10, 18 ], [ 18, 19 ] ]
```


## Development

Clone and install dependencies using NPM

```
npm install
```

Running tests and coverage

```
npm run test
npm run test-coverage
```

## Contribution

Kindly open issues, fork and provide pull requests where improvements are possible.

