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

The build prerenders pages that read the database, so `DATABASE_URL` and
`DIRECT_URL` have to be present *again* for every rebuild. The build-time
`.env` is deliberately not left on the server between releases, so recreate it
and remove it as part of the deploy.

Runtime secrets are not involved here: they stay in the root-owned
`.env.production`, which systemd re-reads when the service restarts.

```bash
cd /var/www/sites/me.su.edu.bd
git pull

# Only needed when package-lock.json changed.
npm ci

# Build-time database credentials, removed again below.
cat > .env <<'EOF'
DATABASE_URL="postgresql://...pooler...neon.tech/...?sslmode=require"
DIRECT_URL="postgresql://...neon.tech/...?sslmode=require"
EOF
chmod 600 .env

npm run build
rm .env

# .next was rebuilt, so restore the ISR cache symlink from step 5:
ln -sfn /var/www/sites/me-platform-cache .next/standalone/.next/cache

# .next was rebuilt, so the server/ tree is deploy:deploy again and the service
# account cannot write the ISR pages it has to regenerate. See "Why server/
# needs group write". Skipping this gives EACCES at runtime, not at deploy time,
# so the site looks fine until the first revalidation.
SERVER=/var/www/sites/me.su.edu.bd/.next/standalone/.next/server
find "$SERVER" -type d -exec chgrp me-web {} + -exec chmod g+rwx,g+s {} +
find "$SERVER" -type f -exec chgrp me-web {} + -exec chmod g+w {} +

sudo systemctl restart me-platform
```

Nothing from steps 1-7 above is repeated: the `me-web` user, `.env.production`,
the cache directory, the systemd unit, the Nginx vhost, the certificate and the
DNS record are all one-time setup.

## Automatic deployment

Optional, and independent of everything above: the manual redeploy keeps working
whether or not this is installed. A systemd timer polls `origin/main` every five
minutes and deploys when it moves, so a push goes live 0–5 minutes later.

Nothing is granted to GitHub — no deploy key, no webhook, no inbound port. The
repository is public, which rules out a self-hosted Actions runner (a fork's
pull request would execute on this host) and makes storing a production SSH key
in GitHub Secrets unattractive. Design notes and the rejected alternatives are
in `docs/superpowers/specs/2026-08-18-me-auto-deploy-design.md`.

### What it does, in order

Lock (`flock`) → refuse if the working tree is dirty → `git fetch` → stop if
`origin/main` has not moved → refuse anything that is not a fast-forward →
`git pull --ff-only` → `npm ci` only if `package-lock.json` changed →
`npm run build` → restore the ISR cache symlink → restart → three health checks.

Any failure before the restart aborts without touching the service. The ISR
symlink is restored only after a successful build, and the restart happens only
after that.

The script never runs a database migration, `db push`, or a seed. `npm run
build` invokes `prisma generate`, which reads the schema file and generates
TypeScript; it does not connect to the database. Schema changes stay a
deliberate human action.

### Install

Automatic deployment runs as **`me-build`**, an account that exists only to
build this one site — never as `deploy`. `deploy` owns
`/var/www/sites/su.edu.bd` and belongs to `su-web`, so a build running as
`deploy` could rewrite the main university site. Moving the automation to its
own account, plus `ProtectSystem=strict` in the unit, closes that path without
altering SU's files, permissions or service in any way.

```bash
# 0. The build account. No home, no shell: it is reachable only through
#    systemd. Membership of me-web is required — changing a file's group needs
#    membership of the target group, and the post-build step hands the ISR
#    server tree to me-web.
sudo useradd --system --no-create-home --shell /usr/sbin/nologin me-build
sudo usermod -aG me-web me-build

# 1. Hand the ME release to me-build. --no-dereference matters: without it the
#    chown follows .next/standalone/.next/cache out of the tree and strips the
#    me-web group from the shared cache directory, breaking ISR silently.
#    .env.production is root-owned and must be put back immediately afterwards.
sudo chown -R --no-dereference me-build:me-build /var/www/sites/me.su.edu.bd
sudo chown root:root /var/www/sites/me.su.edu.bd/.env.production
sudo chmod 600      /var/www/sites/me.su.edu.bd/.env.production
sudo chown me-build:me-web /var/www/sites/me-platform-cache
sudo chmod 2775            /var/www/sites/me-platform-cache

# 2. Remove the build-time .env. Credentials now arrive from systemd, and the
#    deploy script refuses to run while this file exists.
sudo rm -f /var/www/sites/me.su.edu.bd/.env

# 3. Build credentials: DATABASE_URL and DIRECT_URL only, nothing else.
sudo install -d -o root -g root -m 0700 /etc/me-platform
sudo install -o root -g root -m 0600 /dev/null /etc/me-platform/build.env
sudo nano /etc/me-platform/build.env          # see deploy/build.env.example

# 4. Sudoers rule. Validate BEFORE installing — a malformed file in
#    sudoers.d locks every account out of sudo.
cd /var/www/sites/me.su.edu.bd
sudo visudo -c -f deploy/sudoers.me-deploy
sudo install -o root -g root -m 0440 deploy/sudoers.me-deploy /etc/sudoers.d/me-deploy

# 5. Script and units.
sudo install -o root -g root -m 0755 deploy/auto-deploy.sh /usr/local/bin/me-deploy
sudo cp deploy/me-deploy.service deploy/me-deploy.timer /etc/systemd/system/
sudo systemctl daemon-reload

# 6. Dry run first, with the timer still off. ProtectSystem=strict is the one
#    setting most likely to surface an unanticipated write path, so watch this
#    run before trusting it unattended.
sudo systemctl start me-deploy
journalctl -u me-deploy -n 50 --no-pager

# 7. Enable polling.
sudo systemctl enable --now me-deploy.timer
systemctl list-timers me-deploy.timer
```

After step 1, `deploy` can no longer build this site by hand: it does not own
the release and `git` refuses to work on a repository owned by someone else.
That is the point. Deploy on demand with `sudo systemctl start me-deploy`.

### Where the secrets live

| File | Owner | Mode | Contents | Read by |
|---|---|---|---|---|
| `/etc/me-platform/build.env` | `root:root` | `0600` | `DATABASE_URL`, `DIRECT_URL` | the build, via systemd |
| `.env.production` | `root:root` | `0600` | every runtime secret | `me-platform.service`, via systemd |

systemd reads both as root and only then drops to the service user, so neither
`deploy` nor `me-web` can read either file. The two sets are disjoint on
purpose: the build has no use for the auth, Cloudinary or Resend secrets, so it
never receives them.

`DATABASE_URL` is necessarily in both files. **Rotating the database credential
means editing both.**

To build by hand after this is installed, run `sudo systemctl start me-deploy`
rather than `npm run build` — as `deploy` you no longer have the credentials in
your environment, and that is the point.

### Why `server/` needs group write

Next.js does not keep ISR output in `.next/cache`. When a page with
`revalidate` regenerates, the filesystem incremental cache writes the new
render back into the server bundle:

```
.next/standalone/.next/server/app/<route>.html
.next/standalone/.next/server/app/<route>.rsc
.next/standalone/.next/server/app/<route>.meta
```

So the cache symlink set up in step 5 of the manual guide, which redirects
`.next/cache` to a group-writable directory, covers the fetch cache and nothing
else. It does not make `server/` writable, and without that the running service
fails the first time a page tries to revalidate:

```
EACCES: permission denied, open
/var/www/sites/me.su.edu.bd/.next/standalone/.next/server/app/index.html
```

The build creates that tree owned by whichever account ran it, mode 775 on
directories and 664 on files. `me-web` belongs to no group but its own, so it
matches "other" — read and traverse, no write.

Two accounts appear below. `deploy` is the build account for a manual redeploy;
`me-build` replaces it once automatic deployment is installed, and from that
point `deploy` no longer owns or builds this site. Everything in this section
holds either way — substitute whichever account is building.

**The build account stays the owner.** It is what builds, rewrites and
replaces this tree on every deployment, and ownership is what lets it do that.
Handing ownership to `me-web` would invert the relationship: the service
account would own files it only ever needs to update in place, and the build
account would need permission to overwrite someone else's tree. Group
membership gives `me-web` exactly the access it needs without moving anything.

**Only `server/` is opened, and only to the group.** The rest of the release —
`server.js`, `public/`, the traced `node_modules` — stays `deploy:deploy` and
read-only to the service. There is no `chown` anywhere, and no recursive
permission change outside this one subtree.

Directories and files are treated differently on purpose. A directory needs
group `+x` to be traversed and `+w` to have entries created in it; a regular
file needs `+w` and must not gain an execute bit it never had. A single
`chmod -R g+w` would leave directories untraversable, and `-R g+wX` would
sprinkle execute bits. Hence the two `find` passes, and the setgid bit, which
makes route directories Next.js creates at runtime inherit both the group and
the setgid bit itself.

**This has to run after every build.** `next build` deletes `.next` and creates
it again from scratch, so the group and mode are reset to `deploy:deploy` every
single time. A one-off manual `chmod` fixes the site only until the next
deployment. `deploy/auto-deploy.sh` therefore repeats it as a step of every run,
after a successful build and before the restart — and the same two commands
belong in any manual rebuild:

```bash
SERVER=/var/www/sites/me.su.edu.bd/.next/standalone/.next/server
find "$SERVER" -type d -exec chgrp me-web {} + -exec chmod g+rwx,g+s {} +
find "$SERVER" -type f -exec chgrp me-web {} + -exec chmod g+w {} +
```

Check it held:

```bash
stat -c '%U %G %a' "$SERVER/app"        # expect: deploy me-web 2775
sudo -u me-web test -w "$SERVER/app" && echo writable
```

### Privilege boundary

```
me-build ALL=(root) NOPASSWD: /usr/bin/systemctl restart me-platform.service
```

Exactly one command, granted to `me-build` alone. No wildcard, because
`systemctl restart *` would also cover `su-platform.service`.

The filesystem boundary is enforced separately, by the unit rather than by
sudo: `ProtectSystem=strict` with `ReadWritePaths=` limited to the ME release
and its cache means the kernel refuses any write elsewhere — including
everything under `/var/www/sites/su.edu.bd` — regardless of what the build
does or who owns the files.

Verify both, as `me-build`:

```bash
sudo -u me-build -H sudo -n systemctl restart su-platform.service   # must be denied
sudo -u me-build test -w /var/www/sites/su.edu.bd && echo writable  # must print nothing
```

### Watching it

```bash
journalctl -u me-deploy -f                # live
journalctl -u me-deploy --since today     # today's runs
systemctl list-timers me-deploy.timer     # when it next fires
sudo systemctl start me-deploy            # deploy now, without waiting
```

A run with nothing to do logs `already at <sha>; nothing to deploy` and exits 0.
A run that collides with another logs `skipping this run` and exits 0. Neither
is a failure.

### Known limitation

`npm run build` rewrites `.next` **in place**, inside the directory the running
service is serving from. For the 1–3 minutes a build takes, the hashed files
under `.next/static` are being replaced, so a visitor who loaded a page just
before the build can get 404s on its assets. If the build fails, `.next` is left
partially rewritten and the site stays degraded until the next successful build
— the service keeps running, but it is not intact.

There is no artifact rollback. Going back to an earlier commit means building
that commit, with the same duration and the same risk.

The fix, when this starts to hurt, is to build into `releases/<sha>` and swap a
symlink after the health checks pass, which makes rollback a symlink swap and a
restart. That is deliberately not built yet; see the spec for the shape of it.

To stop automatic deployment without uninstalling anything:

```bash
sudo systemctl disable --now me-deploy.timer
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
