import parse from "style-to-js";

const styleToString = (style: Record<string, string>) => {
  return Object.keys(style).reduce(
    (acc, key) =>
      acc +
      key
        .split(/(?=[A-Z])/)
        .join("-")
        .toLowerCase() +
      ":" +
      style[key] +
      ";",
    "",
  );
};

export function parseStyleTag(
  html: string,
): Record<string, Record<string, string>> {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const styleTags = doc.querySelectorAll("style")[0];

  if (!styleTags || !styleTags.sheet?.cssRules?.length) {
    return {};
  }

  const styles: Record<string, Record<string, string>> = {};

  for (let i = 0; i < styleTags.sheet.cssRules.length; i++) {
    const cssRule = styleTags.sheet?.cssRules[i].cssText;
    const match = cssRule.match(/^(.*?)\s*\{\s*(.*?)\s*\}$/);

    if (match && match[1] && match[2]) {
      styles[match[1]] = parse(match[2]);
    }
  }

  return styles;
}

export function styleTagToString(
  styles: Record<string, Record<string, string>>,
): string {
  return Object.keys(styles).reduce(
    (acc, key) => acc + key + "{" + styleToString(styles[key]) + "}",
    "",
  );
}

export function swapStyleTag(html: string, styles: string) {
  return html.replace(/<style>([\s\S]*)<\/style>/g, `<style>${styles}</style>`);
}
