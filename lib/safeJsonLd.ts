/**
 * Safely serializes a JSON-LD object for injection via dangerouslySetInnerHTML.
 *
 * JSON.stringify alone isn't enough: if any string field in the object ever
 * contains the literal sequence "</script>", it terminates the script tag
 * early and the remainder gets parsed as HTML — a real XSS vector even
 * though the data here is admin-entered rather than public-facing. Escaping
 * "<" to its unicode escape prevents that without changing the JSON's
 * meaning (JSON.parse handles \u003c identically to a literal "<").
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
