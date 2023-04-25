import { basename } from "node:path";
import { suite } from "uvu";
import * as assert from "uvu/assert";

export const test = suite(basename(import.meta.url));

export function compileVoidLang(code) {
  if (code === "") {
    return [0, 97, 115, 109, 1, 0, 0, 0];
  } else {
    throw new Error(`Expected empty code, got: "${code}"`);
  }
}
