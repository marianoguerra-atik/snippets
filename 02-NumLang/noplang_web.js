export const grammarDef = `
  NopLang {
    Program = ""
  }
`;

export const nopLang = ohm.grammar(grammarDef);

export const matchResult = nopLang.match("");
