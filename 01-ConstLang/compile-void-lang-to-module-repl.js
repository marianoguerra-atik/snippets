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

export async function run() {
  const { instance, module } = await instantiateModule(compileVoidLang(""));

  assert.is(instance instanceof WebAssembly.Instance, true);
  assert.is(module instanceof WebAssembly.Module, true);
}
