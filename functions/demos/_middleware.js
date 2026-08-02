/**
 * Admin-only gate for the demos directory index.
 * Individual previews (/demos/<slug>/...) stay public for outreach recipients.
 *
 * Set in Cloudflare Pages → Settings → Environment variables (Production):
 *   DEMOS_ADMIN_USER     (optional, default: admin)
 *   DEMOS_ADMIN_PASSWORD (required to unlock the index)
 */

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

function isDemosIndex(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  return path === "/demos" || path === "/demos/index.html";
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
  const url = new URL(context.request.url);

  // Only the listing is private. Slug previews + shared CSS remain public.
  if (!isDemosIndex(url.pathname)) {
    return context.next();
  }

  const expectedUser = context.env.DEMOS_ADMIN_USER || "admin";
  const expectedPass = context.env.DEMOS_ADMIN_PASSWORD || "";

  // Fail closed: without a configured password, hide the index entirely.
  if (!expectedPass) {
    return notFound();
  }

  const creds = parseBasicAuth(context.request.headers.get("Authorization") || "");
  if (
    !creds ||
    !timingSafeEqual(creds.user, expectedUser) ||
    !timingSafeEqual(creds.pass, expectedPass)
  ) {
    return unauthorized();
  }

  return context.next();
}
