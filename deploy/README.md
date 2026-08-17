# Deploying me.su.edu.bd to the university VPS

Target host: `187.52.118.124` (`srv1905813`, Ubuntu 24.04, Node v24.19.0).

This site runs beside the main `su.edu.bd` site on the same box. Nothing here
touches that deployment: separate service user, separate port, separate release
directory, separate Nginx vhost.

| | su.edu.bd (existing) | me.su.edu.bd (this site) |
|---|---|---|
| Release dir | `/var/www/sites/su.edu.bd` | `/var/www/sites/me.su.edu.bd` |
| Service user | `su-web` | `me-web` |
| Port | `127.0.0.1:3001` | `127.0.0.1:3002` |
| systemd unit | `su-platform.service` | `me-platform.service` |
| Nginx vhost | `su-platform` | `me-platform` |
| Database | local Postgres | Neon (managed, off-host) |
| CMS media | local disk `/uploads/` | Cloudinary |

Steps marked **(sudo)** need root. Steps marked **(deploy)** run as the
unprivileged `deploy` account over SSH.

---

## 1. DNS — do this first

Add an A record in the `su.edu.bd` zone:

```
me.su.edu.bd.   A   187.52.118.124
```

Certbot's HTTP-01 challenge only works once this resolves to the VPS, so the
certificate step below will fail until it has propagated. Check with:

```bash
dig +short me.su.edu.bd
```

> Note: `su.edu.bd` itself currently resolves to `192.46.224.64`, i.e. the older
> host — the main site has not been cut over to this VPS yet. That does not
> block this subdomain; `me.su.edu.bd` can point here independently.

## 2. Service user (sudo)

A dedicated account that owns nothing and only runs the process:

```bash
sudo useradd --system --no-create-home --shell /usr/sbin/nologin me-web
```

## 3. Clone and build (deploy)

The repository is public, so no deploy key or token is needed.

```bash
git clone https://github.com/Databrandix/Mechanical-Engineering.git \
  /var/www/sites/me.su.edu.bd
cd /var/www/sites/me.su.edu.bd
npm ci
```

`/var/www/sites` is owned by `deploy`, so none of this needs sudo.

The build prerenders pages that read the database, so `DATABASE_URL` and
`DIRECT_URL` must be present *at build time*. Put a build-time `.env` in the
project root with just those two keys:

```bash
cat > /var/www/sites/me.su.edu.bd/.env <<'EOF'
DATABASE_URL="postgresql://...pooler...neon.tech/...?sslmode=require"
DIRECT_URL="postgresql://...neon.tech/...?sslmode=require"
EOF
chmod 600 /var/www/sites/me.su.edu.bd/.env
```

Then build:

```bash
npm run build
```

The `postbuild` step (`scripts/link-standalone-assets.mjs`) symlinks
`.next/static` and `public/` into the standalone tree, and **deletes the copy of
`.env` that Next.js places inside `.next/standalone/`** — runtime secrets come
from step 4 instead, and a copy inside the release would be readable by the
service user. Confirm it is gone:

```bash
test ! -e .next/standalone/.env && echo "clean"
```

## 4. Runtime secrets (sudo)

Root-owned, mode 600, so neither `deploy` nor `me-web` can read it. systemd
reads it as root and only then drops privileges.

```bash
sudo install -o root -g root -m 600 /dev/null \
  /var/www/sites/me.su.edu.bd/.env.production
sudo nano /var/www/sites/me.su.edu.bd/.env.production
```

Required keys — see `.env.example` for the full list:

```
DATABASE_URL=...
DIRECT_URL=...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=https://me.su.edu.bd
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_UPLOAD_FOLDER=...
RESEND_API_KEY=...
INITIAL_SUPER_ADMIN_EMAIL=...
INITIAL_SUPER_ADMIN_PASSWORD=...
```

Two things to get right:

- **`BETTER_AUTH_URL` must be `https://me.su.edu.bd`.** Better Auth builds
  callback and cookie URLs from it; a stale value breaks login and sessions in
  ways that look like random logouts rather than a config error.
- **Plain `KEY=value` lines only.** systemd does not evaluate `export`, shell
  expansion, or multi-line values, and treats a trailing `# comment` after a
  value as part of the value. Do not quote unless the quotes belong to the value.

## 5. ISR cache directory (sudo)

Pages in this site use `revalidate`, so the server writes regenerated pages to
`.next/cache` at runtime. The release is owned by `deploy` and the service runs
as `me-web`, which cannot write there — so the cache goes in a group-writable
directory outside the release, symlinked into place:

```bash
sudo install -d -o deploy -g me-web -m 2775 /var/www/sites/me-platform-cache
sudo usermod -aG me-web deploy
ln -sfn /var/www/sites/me-platform-cache \
  /var/www/sites/me.su.edu.bd/.next/standalone/.next/cache
```

`.next` is wiped on every build, so **this symlink must be recreated after each
rebuild** — see [Redeploying](#redeploying).

## 6. systemd (sudo)

```bash
sudo cp deploy/me-platform.service /etc/systemd/system/me-platform.service
sudo systemctl daemon-reload
sudo systemctl enable --now me-platform
systemctl status me-platform
```

Verify the app answers locally before putting Nginx in front of it:

```bash
curl -I http://127.0.0.1:3002
journalctl -u me-platform -n 50 --no-pager
```

## 7. Nginx and TLS (sudo)

Install the vhost with **only the port 80 block** first — certbot needs it to
answer the ACME challenge and will write the TLS block itself:

```bash
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/me-platform
sudo ln -s /etc/nginx/sites-available/me-platform /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d me.su.edu.bd
```

`nginx -t` must pass before the reload. If it fails, the existing `su.edu.bd`
site keeps running on the old config — reload only applies a valid one.

## 8. Verify

```bash
curl -I https://me.su.edu.bd
curl -sI https://me.su.edu.bd/_next/static/ | head -1
```

Check in a browser that CSS and images load (that is what the `public` and
`.next/static` symlinks are for), then that admin login works (that is
`BETTER_AUTH_URL`).

---

## Database

The database is Neon, managed off-host, shared with whatever environment its
connection string points at. **No migration is run by any step above.** If the
production branch needs schema changes, apply them deliberately:

```bash
npx prisma migrate deploy
```

Point `DATABASE_URL` at the intended Neon branch before running it.

## Redeploying

```bash
cd /var/www/sites/me.su.edu.bd
git pull
npm ci
npm run build
# .next was rebuilt, so restore the ISR cache symlink from step 5:
ln -sfn /var/www/sites/me-platform-cache .next/standalone/.next/cache
sudo systemctl restart me-platform
```

## Rollback

```bash
cd /var/www/sites/me.su.edu.bd
git log --oneline -10
git checkout <previous-sha>
npm ci && npm run build
ln -sfn /var/www/sites/me-platform-cache .next/standalone/.next/cache
sudo systemctl restart me-platform
```

To take the site down without removing it:

```bash
sudo systemctl stop me-platform
sudo rm /etc/nginx/sites-enabled/me-platform
sudo nginx -t && sudo systemctl reload nginx
```
