# Admin access to `/demos/`

`https://fabha.org/demos/` (directory listing) is **admin-only**.

Individual preview URLs stay public for outreach:

`https://fabha.org/demos/<slug>/`

## 1. Set admin credentials (Pages Functions)

1. Cloudflare Dashboard → **Workers & Pages** → fabha.org project  
2. **Settings** → **Environment variables** → **Production**  
3. Add:
   - `DEMOS_ADMIN_USER` = `admin` (optional)
   - `DEMOS_ADMIN_PASSWORD` = a strong password  
4. **Settings** → **Runtime** → **Fail open / closed** → **Fail closed**  
5. Retry the latest deployment  
6. Open `https://fabha.org/demos/` and sign in when prompted

Until the password is set, `/demos/` returns **404**.

## 2. Backup: Cloudflare Access (Zero Trust)

If the browser never asks for a password (Functions not running), protect the path with Access:

1. [Zero Trust Dashboard](https://one.dash.cloudflare.com/) → **Access** → **Applications** → **Add an application** → **Self-hosted**  
2. Application domain: `fabha.org` path `/demos` (exact index; do **not** use `/demos/*` or individual previews will lock)  
   - If path matching is prefix-only in your account, use Access on a separate admin host instead (e.g. `admin.fabha.org`) and keep previews on `fabha.org/demos/<slug>/`  
3. Policy: **Allow** your admin email (One-time PIN)  
4. Save

## Publish

```bash
python scripts/publish_demos.py --push
```
