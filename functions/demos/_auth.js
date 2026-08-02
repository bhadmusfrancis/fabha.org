export function unauthorized() {
  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Fabha demos admin"',
      "Cache-Control": "no-store",
    },
  });
}

export function notFound() {
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

/** @returns {Response | null} null when credentials are valid */
export function requireAdmin(request, env) {
  const expectedUser = env.DEMOS_ADMIN_USER || "admin";
  const expectedPass = env.DEMOS_ADMIN_PASSWORD || "";

  // Fail closed: hide the index until a password is configured.
  if (!expectedPass) return notFound();

  const creds = parseBasicAuth(request.headers.get("Authorization") || "");
  if (
    !creds ||
    !timingSafeEqual(creds.user, expectedUser) ||
    !timingSafeEqual(creds.pass, expectedPass)
  ) {
    return unauthorized();
  }
  return null;
}
