/**
 * Admin-only handler for /demos and /demos/
 * Set DEMOS_ADMIN_USER / DEMOS_ADMIN_PASSWORD in Cloudflare Pages env vars.
 */
import { LISTING_HTML } from "./_listing.js";

function unauthorized() {
  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Fabha demos admin"',
      "Cache-Control": "no-store",
    },
  });
}

function notFound() {
  return new Response("Not Found", {
    status: 404,
    headers: { "Cache-Control": "no-store" },
  });
}

function timingSafeEqual(a, b) {
  const enc = new TextEncoder();
  const aa = enc.encode(a);
  const bb = enc.encode(b);
  if (aa.byteLength !== bb.byteLength) return false;
  let out = 0;
  for (let i = 0; i < aa.byteLength; i++) out |= aa[i] ^ bb[i];
  return out === 0;
}

function parseBasicAuth(header) {
  if (!header || !header.startsWith("Basic ")) return null;
  try {
    const decoded = atob(header.slice(6));
    const i = decoded.indexOf(":");
    if (i < 0) return null;
    return { user: decoded.slice(0, i), pass: decoded.slice(i + 1) };
  } catch {
    return null;
  }
}

export async function onRequest(context) {
  const expectedUser = context.env.DEMOS_ADMIN_USER || "admin";
  const expectedPass = context.env.DEMOS_ADMIN_PASSWORD || "";

  if (!expectedPass) return notFound();

  const creds = parseBasicAuth(context.request.headers.get("Authorization") || "");
  if (
    !creds ||
    !timingSafeEqual(creds.user, expectedUser) ||
    !timingSafeEqual(creds.pass, expectedPass)
  ) {
    return unauthorized();
  }

  return new Response(LISTING_HTML, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
