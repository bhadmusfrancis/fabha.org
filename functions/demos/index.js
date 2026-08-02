import { requireAdmin } from "./_auth.js";

/**
 * Handles /demos and /demos/ — admin-only directory listing.
 * Individual /demos/<slug>/ previews remain static public assets.
 */
export async function onRequest(context) {
  const denied = requireAdmin(context.request, context.env);
  if (denied) return denied;

  const listingUrl = new URL("/demos/_private_index.html", context.request.url);
  const asset = await context.env.ASSETS.fetch(listingUrl);
  if (asset.status === 404) {
    return new Response("Demo listing is missing. Re-run publish_demos.py --push.", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const headers = new Headers(asset.headers);
  headers.set("Cache-Control", "no-store");
  headers.set("X-Robots-Tag", "noindex, nofollow");
  return new Response(asset.body, { status: asset.status, headers });
}
