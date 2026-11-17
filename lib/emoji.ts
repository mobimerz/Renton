/**
 * WordPress (wp-emoji) swaps emoji characters for Twemoji SVG images sized 1em.
 * Doing the same keeps text wrapping identical to the live site.
 * Only the emoji that appear in the site's content are mapped; files live in /public/images/emoji.
 * (✘ U+2718 has no Twemoji image, so WordPress leaves it as text — so do we.)
 */
const EMOJI: Record<string, string> = {
  "✅": "2705",
  "✔": "2714",
  "\u{1F4DE}": "1f4de",
  "\u{1F310}": "1f310",
  "\u{1F4CD}": "1f4cd",
  "\u{1F449}": "1f449",
};

const RE = new RegExp(`(${Object.keys(EMOJI).join("|")})\uFE0F?`, "gu");

export function wpEmoji(html: string): string {
  return html.replace(
    RE,
    (_m, ch: string) => `<img class="emoji" alt="${ch}" role="img" draggable="false" src="/images/emoji/${EMOJI[ch]}.svg">`,
  );
}
