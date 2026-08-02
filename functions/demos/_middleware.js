import { requireAdmin } from "./_auth.js";

/**
 * Block direct public access to the private listing file.
 * Slug previews under /demos/<slug>/ stay public.
 */
export async function onRequest(context) {
  const path = new URL(context.request.url).pathname.replace(/\/+$/, "") || "/";
  if (path === "/demos/_private_index.html") {
    const denied = requireAdmin(context.request, context.env);
    if (denied) return denied;
  }
  return context.next();
}
