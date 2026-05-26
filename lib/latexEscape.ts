const replacements: Record<string, string> = {
  "\\": "\\textbackslash{}",
  "%": "\\%",
  "$": "\\$",
  "#": "\\#",
  "&": "\\&",
  "_": "\\_",
  "{": "\\{",
  "}": "\\}",
  "~": "\\textasciitilde{}",
  "^": "\\textasciicircum{}"
};

export function latexEscape(input: string | null | undefined): string {
  if (!input) {
    return "";
  }

  return input.replace(/[\\%$#&_{}~^]/g, (character) => replacements[character]);
}
