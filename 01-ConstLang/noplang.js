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

export function instantiateModule(arrayOfBytes) {
  // flatten the array to allow generating nested arrays
  const flatBytes = arrayOfBytes.flat(Infinity);

  return WebAssembly.instantiate(
    Uint8Array.from(flatBytes),
  );
}

test("compileVoidLang result compiles to a wasm module", async () => {
  const { instance, module } = await instantiateModule(compileVoidLang(""));

  assert.is(instance instanceof WebAssembly.Instance, true);
  assert.is(module instanceof WebAssembly.Module, true);
});

export function stringToBytes(s) {
  return Array.from(s).map((c) => c.charCodeAt(0));
}

export function int32ToBytes(v) {
  return [
    v & 0xff,
    (v >> 8) & 0xff,
    (v >> 16) & 0xff,
    (v >> 24) & 0xff,
  ];
}

export const WASM_MAGIC_NUMBER = "\0asm";
export const WASM_VERSION_NUMBER_V1 = 1;

export function intToULEB128(v) {
  if (v <= 127) {
    return [v];
  } else {
    throw new Error("Not Implemented");
  }
}

export function withLength(array) {
  const flatArray = array.flat(Infinity);
  return [intToULEB128(flatArray.length), flatArray];
}

export function sectionTypeAndCount(type, count, bytes) {
  return [type, withLength([intToULEB128(count), bytes])];
}

export const SECTION_ID_TYPE = 1;
export const SECTION_ID_FUNCTION = 3;
export const SECTION_ID_CODE = 10;

export const TYPE_FUNCTION = 96;

export const END = 11;

export const SECTION_ID_EXPORT = 7;

export const EXPORT_KIND_FUNCTION = 0;

export function preamble() {
  return [
    stringToBytes(WASM_MAGIC_NUMBER),
    int32ToBytes(WASM_VERSION_NUMBER_V1),
  ];
}

export function typeFunctionEntry(paramTypes, returnTypes) {
  return [
    TYPE_FUNCTION,
    withLength(paramTypes),
    withLength(returnTypes),
  ];
}

export function functionEntry(typeIndex) {
  return [typeIndex];
}

export function exportFunctionEntry(name, functionIndex) {
  return [
    withLength(stringToBytes(name)),
    EXPORT_KIND_FUNCTION,
    functionIndex,
  ];
}

export function codeBody(localVars, ...instructions) {
  return withLength([localVars, instructions]);
}

export function sectionTypeAndEntries(type, entries) {
  return sectionTypeAndCount(type, entries.length, entries);
}

export function compileNopLang(code) {
  if (code !== "") {
    throw new Error(`Expected empty code, got: "${code}"`);
  }

  const typeIndex = 0;
  const functionIndex = 0;
  const localsCount = 0;

  return [
    preamble(),
    sectionTypeAndEntries(
      SECTION_ID_TYPE,
      [typeFunctionEntry([], [])],
    ),
    sectionTypeAndEntries(SECTION_ID_FUNCTION, [functionEntry(typeIndex)]),
    sectionTypeAndEntries(
      SECTION_ID_EXPORT,
      [exportFunctionEntry("main", functionIndex)],
    ),
    sectionTypeAndEntries(
      SECTION_ID_CODE,
      [codeBody(localsCount, END)],
    ),
  ];
}
