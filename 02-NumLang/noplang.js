import { basename } from "node:path";
import * as ohm from "ohm-js";
import { suite } from "uvu";
import * as assert from "uvu/assert";

export const test = suite(basename(import.meta.url));

export const grammarDef = `
  NopLang {
    Program = ""
  }
`;

export const nopLang = ohm.grammar(grammarDef);

export const matchResult = nopLang.match("");

assert.is(matchResult.succeeded(), true);
assert.is(nopLang.match("3").succeeded(), false);

test.run();
