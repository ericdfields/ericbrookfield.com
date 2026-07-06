/**
 * Convert post markup to a plain-text string for feeds and OG images.
 *
 * Tags are stripped with an iterate-until-stable loop rather than a single
 * `.replace(/<[^>]*>/g, "")` pass. A single pass is an incomplete sanitizer:
 * nested or overlapping markup such as `<scr<script>ipt>` can reconstruct a
 * tag after one removal. Looping until the string stops changing closes that
 * gap (CodeQL: js/incomplete-multi-character-sanitization).
 */
export function toPlainText(input: string | null | undefined): string {
  let out = input ?? "";
  let previous: string;
  do {
    previous = out;
    out = out.replace(/<[^>]*>/g, "");
  } while (out !== previous);
  return out.replace(/\n+/g, " ").trim();
}
