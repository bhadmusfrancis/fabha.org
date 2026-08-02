# Admin access to `/demos/`

`https://fabha.org/demos/` (the directory listing) is private.

Individual preview URLs stay public so outreach recipients can open them:

`https://fabha.org/demos/<slug>/`

## Unlock the index

1. Cloudflare Dashboard → **Workers & Pages** → your fabha.org project  
2. **Settings** → **Environment variables** → **Production**  
3. Add:
   - `DEMOS_ADMIN_USER` = `admin` (optional; this is the default)
   - `DEMOS_ADMIN_PASSWORD` = a strong password only you know  
4. Save and retry the latest deployment (or push any commit) so the variable is live  
5. Open `https://fabha.org/demos/` and sign in with those credentials when the browser prompts

Until `DEMOS_ADMIN_PASSWORD` is set, the index returns **404**.
