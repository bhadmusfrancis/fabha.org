# Admin-only demo listing

| URL | Access |
|---|---|
| `https://fabha.org/demos/<slug>/` | Public (for outreach recipients) |
| `https://fabha.org/demos/` | No listing (404) |
| `https://fabha.org/admin/demos/` | **Admin only** — protect with Cloudflare Access |

## Protect `/admin/*` with Cloudflare Access

1. Open [Zero Trust Dashboard](https://one.dash.cloudflare.com/)  
2. **Access** → **Applications** → **Add an application** → **Self-hosted**  
3. Configure:
   - **Application name:** Fabha Admin  
   - **Session duration:** e.g. 24 hours  
   - **Public hostname:** `fabha.org`  
   - **Path:** `admin` (or `admin/*` if shown)  
4. **Add a policy**
   - Action: **Allow**  
   - Include → **Emails** → your admin email (e.g. `hello@fabha.org`)  
5. Login method: enable **One-time PIN** (email code)  
6. Save

After that, opening `https://fabha.org/admin/demos/` prompts for your email + code. Everyone else is blocked.

Do **not** put Access on `/demos/*` — that would lock the preview links you send to businesses.

## Publish updates

```bash
python scripts/publish_demos.py --push
```
