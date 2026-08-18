# Automatic deployment for me.su.edu.bd — design

Status: approved for implementation, Phase 1 (in-place build).
Date: 2026-08-18.

Pull-based deployment: the VPS polls its own git remote and deploys when
`origin/main` moves. Nothing is granted to GitHub — no deploy key, no webhook,
no inbound port. The repository is public, which rules out a self-hosted GitHub
Actions runner (a fork PR would execute on the production host) and makes
push-based SSH deployment unattractive (a production private key would have to
live in GitHub Secrets).

Cost of this choice: a deploy lands 0–5 minutes after the push.

---

## 1. Files

### Added to the repository

| Path | Purpose |
|---|---|
| `src/app/api/health/route.ts` | DB-backed health endpoint |
| `deploy/auto-deploy.sh` | Version-controlled reference copy of the deploy script |
| `deploy/me-deploy.service` | systemd oneshot unit |
| `deploy/me-deploy.timer` | 5-minute poll timer |
| `deploy/build.env.example` | Shape of the build credentials file, no real values |
| `deploy/sudoers.me-deploy` | Reference copy of the sudoers rule |
| `docs/superpowers/specs/2026-08-18-me-auto-deploy-design.md` | This document |

### Changed in the repository

| Path | Change |
|---|---|
| `deploy/README.md` | New chapter on automatic deployment; the manual redeploy section stays |

### Installed on the server, not deployed by git

| Path | Owner | Mode |
|---|---|---|
| `/usr/local/bin/me-deploy` | `root:root` | `0755` |
| `/etc/systemd/system/me-deploy.service` | `root:root` | `0644` |
| `/etc/systemd/system/me-deploy.timer` | `root:root` | `0644` |
| `/etc/sudoers.d/me-deploy` | `root:root` | `0440` |
| `/etc/me-platform/` | `root:root` | `0700` |
| `/etc/me-platform/build.env` | `root:root` | `0600` |

The deploy script runs from `/usr/local/bin`, not from the release directory,
for two reasons: `git pull` would rewrite the file while bash is still reading
it, and a root-owned copy cannot be edited by `deploy` to widen its own
privileges.

---

## 2. Health endpoint

`src/app/api/health/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Never prerendered or cached: a cached 200 would keep reporting health long
// after the database stopped answering, which is the one failure this endpoint
// exists to catch.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Cheapest round trip that proves the connection pool works. Deliberately
    // not a row count: any expected number is a fact about the data that has to
    // be maintained, and would start failing for reasons unrelated to health.
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json(
      { ok: true },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    // The error is swallowed on purpose. Connection failures carry the host,
    // database name and sometimes the user in their message, and this route is
    // public. The status code is the signal; the detail belongs in the service
    // log, which journalctl already captures.
    return NextResponse.json(
      { ok: false },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
```

Properties: read-only, mutation-free, real Prisma query, no row-count
assumption, `{"ok":true}` on success, `503` on failure, and no credentials,
schema, table names or stack traces in any response.

---

## 3. systemd units

`deploy/me-deploy.service`:

```ini
[Unit]
Description=Check for new commits and deploy me.su.edu.bd
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
User=deploy
Group=deploy

# Build-time database credentials, and nothing else. systemd reads this file as
# root before dropping to User=, so `deploy` gets the values in its environment
# without ever being able to read the file. Runtime secrets are not here: the
# build has no use for BETTER_AUTH_SECRET, CLOUDINARY_API_SECRET, RESEND_API_KEY
# or INITIAL_SUPER_ADMIN_PASSWORD, so it never sees them.
EnvironmentFile=/etc/me-platform/build.env

Environment=NODE_ENV=production
WorkingDirectory=/var/www/sites/me.su.edu.bd
ExecStart=/usr/local/bin/me-deploy

# /run is not writable by deploy; this creates /run/me-deploy owned by the
# service user, which is where the flock file lives.
RuntimeDirectory=me-deploy
RuntimeDirectoryMode=0700

# A cold npm ci plus a full Next build. Generous, but bounded.
TimeoutStartSec=1800

StandardOutput=journal
StandardError=journal
SyslogIdentifier=me-deploy

# NoNewPrivileges is deliberately NOT set: it blocks the setuid transition sudo
# needs, and the last step of a deployment restarts the service through sudo.
# ProtectHome is deliberately NOT set either: npm's cache lives in /home/deploy
# and the build fails without it. Copying me-platform.service's hardening block
# wholesale breaks this unit on both counts.
PrivateTmp=true
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
LockPersonality=true
RestrictAddressFamilies=AF_INET AF_INET6 AF_UNIX
ProtectSystem=full
```

`deploy/me-deploy.timer`:

```ini
[Unit]
Description=Poll for new me.su.edu.bd commits

[Timer]
OnBootSec=5min
OnUnitActiveSec=5min
# Small jitter so the poll does not land on the same second as other timers.
RandomizedDelaySec=30
# Persistent is left off on purpose: after downtime we want one poll, not a
# catch-up burst.
Unit=me-deploy.service

[Install]
WantedBy=timers.target
```

---

## 4. Sudoers rule

`/etc/sudoers.d/me-deploy`, mode `0440`:

```
deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart me-platform.service
```

Exactly one command, written as the absolute path verified on the host
(`command -v systemctl` returns `/usr/bin/systemctl`). No wildcards, no
`nginx`, no `apt`, no shell, no filesystem commands, no second unit name.

This is the entire privilege boundary, and sudo enforces it rather than
convention: even if the deploy script were replaced outright, this grant cannot
restart or stop `su-platform.service`, cannot reload Nginx, and cannot install
anything.

---

## 5. Deployment state transitions

| # | State | Action | On success | On failure |
|---|---|---|---|---|
| 1 | LOCK | `flock -n` on `/run/me-deploy/deploy.lock` | → 2 | log "skipped", exit 0 |
| 2 | CLEAN | is `git status --porcelain` empty? | → 3 | abort, print the dirty paths |
| 3 | FETCH | `git fetch origin main` | → 4 | abort |
| 4 | COMPARE | `HEAD` against `origin/main` | differs → 5; equal → log, exit 0 | — |
| 5 | ANCESTRY | `git merge-base --is-ancestor HEAD origin/main` | → 6 | abort, force-push or divergence |
| 6 | PULL | `git pull --ff-only origin main` | → 7 | abort |
| 7 | DEPS | `package-lock.json` changed, so `npm ci` | → 8 | abort |
| 8 | BUILD | `npm run build` | → 9 | abort, service is NOT restarted |
| 9 | SYMLINK | restore the ISR cache symlink | → 10 | abort |
| 10 | PERMS | regroup `.next/standalone/.next/server` to `me-web` | → 11 | abort |
| 11 | RESTART | `sudo -n systemctl restart me-platform.service` | → 12 | abort |
| 12 | READY | poll `127.0.0.1:3002` for up to 60 s | → 13 | abort |
| 13 | HEALTH | three checks, all must pass | log success, exit 0 | exit non-zero |

Everything up to and including state 4 leaves the working tree untouched.
`git fetch` writes only to `.git`, in the remote-tracking refs; no tracked file
changes until state 6.

States 9 and 10 both exist because `next build` deletes and recreates `.next`.
That destroys the ISR cache symlink, and it recreates the `server/` tree owned
`deploy:deploy`, which the service account cannot write to. Both run only after
a successful build, and both must run before the restart — see section 5a.

---

## 5a. Runtime write access to `server/` (the EACCES correction)

Next.js's filesystem incremental cache does not keep ISR output in
`.next/cache`. It writes the regenerated page back into the server bundle, as
`{serverDistDir}/app/<route>.html`, `.rsc` and `.meta` — which is why the
running service failed with:

```
EACCES: permission denied, open
/var/www/sites/me.su.edu.bd/.next/standalone/.next/server/app/index.html
```

The cache symlink from state 9 does not cover this. `next build` runs as
`deploy` and recreates the whole tree as `deploy:deploy`, mode 775 on
directories and 664 on files:

```
drwxrwxr-x 15 deploy deploy  .next/standalone/.next/server/app
-rw-rw-r--  1 deploy deploy  .next/standalone/.next/server/app/index.html
```

`me-web` is in no group other than its own, so it matches "other" — `r-x` on
the directories and `r--` on the files. It can read the tree and cannot write a
byte of it. Every build recreates this state, so a one-off manual `chmod` fixes
the site only until the next deployment.

### The fix

Group membership, not ownership. `deploy` keeps owning every file; the group is
moved to `me-web` and the group bits are opened, separately for directories and
files.

One-time, as root:

```bash
sudo usermod -aG me-web deploy
```

`deploy` must belong to `me-web` for `chgrp me-web` to be permitted at all —
changing a file's group requires membership of the target group. systemd builds
the supplementary group list when it starts the unit, so `me-deploy.service`
picks this up on its next run; an SSH session that was already open does not.

Then, in state 10 of every deployment:

```bash
SERVER="$RELEASE/.next/standalone/.next/server"

# Directories: group needs write to create entries and execute to traverse.
# setgid so anything me-web creates inside inherits group me-web instead of
# me-web's primary group -- and so new subdirectories inherit setgid in turn,
# which is what keeps this working as Next.js creates route directories at
# runtime.
find "$SERVER" -type d -exec chgrp me-web {} + -exec chmod g+rwx,g+s {} +

# Regular files: group write, nothing else. `chmod g+w` adds only the write
# bit; no execute permission is granted to anything that did not already have
# it. This is the reason for splitting by type rather than running a single
# `chmod -R g+w`, which would leave directories without the +x they need.
find "$SERVER" -type f -exec chgrp me-web {} + -exec chmod g+w {} +
```

`find` is restricted to `-type d` and `-type f`, so symlinks are never
followed or altered. The scope is the `server/` subtree only: the rest of the
release keeps `deploy:deploy`, and `.next/standalone/.next/cache` — a symlink
that is a sibling of `server/`, not a descendant — is untouched.

### Resulting permission model

| Path | Owner | Group | Mode | `me-web` can |
|---|---|---|---|---|
| release root and everything else | `deploy` | `deploy` | unchanged | read |
| `.next/standalone/.next/server` (dirs) | `deploy` | `me-web` | `2775` | read, write, traverse |
| `.next/standalone/.next/server/**` (files) | `deploy` | `me-web` | `664` | read, write |
| `.next/standalone/.next/cache` → `me-platform-cache` | `deploy` | `me-web` | `2775` | read, write |
| `.env.production` | `root` | `root` | `0600` | nothing |

What this deliberately does not do: no `chown`, so ownership never moves to
`me-web`; no recursion over the release tree; no execute bit added to any
regular file; no change to the cache symlink, `.env.production`, Nginx,
`su-platform`, port 3001, or `/var/www/sites/su.edu.bd`.

`me-platform.service` keeps `User=me-web` and `Group=me-web`. No new sudo
privilege is involved — `chgrp` and `chmod` here are performed by `deploy` on
files `deploy` already owns, which is exactly why the `usermod` step is the
only privileged part.

---

## 6. Deploy script

`deploy/auto-deploy.sh`, installed as `/usr/local/bin/me-deploy`:

```bash
#!/usr/bin/env bash
set -Eeuo pipefail

RELEASE=/var/www/sites/me.su.edu.bd
CACHE=/var/www/sites/me-platform-cache
SERVER="$RELEASE/.next/standalone/.next/server"
UNIT=me-platform.service
BRANCH=main
LOCKFILE=/run/me-deploy/deploy.lock

log() { printf '%s\n' "$*"; }
die() { printf 'ABORT: %s\n' "$*" >&2; exit 1; }

exec 9>"$LOCKFILE" || die "cannot open lock file $LOCKFILE"
if ! flock -n 9; then
  log "another deployment is already running; skipping this run"
  exit 0
fi

cd "$RELEASE" || die "release directory missing: $RELEASE"

# The working tree must be pristine. Nothing in this script ever discards local
# changes: no reset --hard, no clean, no checkout of arbitrary commits, no
# history rewriting. A dirty tree means a human edited something on the server,
# and that is a question for a human rather than for a timer.
if [ -n "$(git status --porcelain)" ]; then
  git status --short >&2
  die "working tree is dirty; refusing to deploy"
fi

git fetch --quiet origin "$BRANCH" || die "git fetch failed"
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/$BRANCH")

if [ "$LOCAL" = "$REMOTE" ]; then
  log "already at ${LOCAL:0:7}; nothing to deploy"
  exit 0
fi

# Fast-forward only, checked before the pull so the failure message names the
# real problem instead of leaving git to refuse a merge.
git merge-base --is-ancestor "$LOCAL" "$REMOTE" \
  || die "origin/$BRANCH is not a fast-forward from ${LOCAL:0:7}; refusing to deploy"

log "deploying ${LOCAL:0:7} -> ${REMOTE:0:7}"
git pull --ff-only origin "$BRANCH" || die "git pull --ff-only failed"

# node_modules at the project root is only used to build. The running service
# serves from .next/standalone, which carries its own traced copy, so npm ci
# does not disturb it.
if ! git diff --quiet "$LOCAL" "$REMOTE" -- package-lock.json; then
  log "package-lock.json changed; reinstalling dependencies"
  npm ci --no-audit --no-fund || die "npm ci failed"
fi

# DATABASE_URL and DIRECT_URL come from the unit's EnvironmentFile. `npm run
# build` runs `prisma generate`, which is code generation from the schema file
# and never connects to the database, and then `next build`. No migrate, no db
# push, no seed, here or anywhere else in this script.
npm run build || die "build failed; service was NOT restarted"

# next build wiped .next, taking this symlink with it.
ln -sfn "$CACHE" "$RELEASE/.next/standalone/.next/cache" \
  || die "could not restore ISR cache symlink"

# next build also recreated server/ as deploy:deploy, which the service account
# cannot write -- and Next.js's filesystem ISR writes regenerated pages into
# server/app, not into the cache directory above. Hand the group to me-web and
# open the group bits, separately for directories and files. Ownership stays
# with deploy. See section 5a of the design document.
find "$SERVER" -type d -exec chgrp me-web {} + -exec chmod g+rwx,g+s {} + \
  || die "could not set directory permissions under server/"
find "$SERVER" -type f -exec chgrp me-web {} + -exec chmod g+w {} + \
  || die "could not set file permissions under server/"

sudo -n /usr/bin/systemctl restart "$UNIT" || die "restart failed"

# Restarting is not instantaneous; without this wait the first health check
# would be a race rather than a measurement.
for i in $(seq 1 30); do
  if curl -fsS -o /dev/null --max-time 5 http://127.0.0.1:3002/; then break; fi
  [ "$i" -eq 30 ] && die "app did not answer on 127.0.0.1:3002 within 60s"
  sleep 2
done

FAILED=0
check() {
  if curl -fsS -o /dev/null --max-time "$2" "$1"; then
    log "health OK    $1"
  else
    log "health FAIL  $1"
    FAILED=1
  fi
}
check http://127.0.0.1:3002/          10
check https://me.su.edu.bd/           15
check https://me.su.edu.bd/api/health 15

[ "$FAILED" -eq 0 ] || die "deployed ${REMOTE:0:7} but health checks failed"
log "deployed ${REMOTE:0:7} successfully"
```

---

## 7. Security and permission model

| Principal | Reads | Writes | As root |
|---|---|---|---|
| `deploy` | release directory, its own `$HOME` | release directory, ISR cache | `systemctl restart me-platform.service`, nothing else |
| `me-web` | release directory, read-only | ISR cache, and `server/` via group | nothing |

`deploy` is additionally a member of the `me-web` group (see section 5a), which
is what lets it hand `server/` to that group after a build. The membership is
one-directional in effect: it gives `deploy` write access to anything
group-writable by `me-web`, which is the ISR cache and the `server/` tree — both
of which `deploy` already owns and rewrites on every build. It grants no access
to `.env.production`, which is `root:root` and readable by neither account.
| `me-deploy.service` | build credentials via environment | as `deploy` | through the sudoers rule only |

Secrets are split into two disjoint sets so each principal holds only what it
needs:

| File | Owner | Mode | Contents | Read by |
|---|---|---|---|---|
| `/etc/me-platform/build.env` | `root:root` | `0600` | `DATABASE_URL`, `DIRECT_URL` | systemd as root, injected into the build environment |
| `/var/www/sites/me.su.edu.bd/.env.production` | `root:root` | `0600` | all runtime secrets | systemd as root, injected into `me-platform.service` |

`DATABASE_URL` necessarily appears in both files: the build needs it and so
does the running app. Rotating the database credential therefore means editing
two files, which is recorded in the README.

Three properties worth stating explicitly:

- **No `.env` file on the server.** Next.js and Prisma read `process.env`
  directly; a dotenv file is a convenience, not a requirement. Because
  credentials arrive through systemd, no deploy-readable copy exists on disk.
- **Never `Environment=` for secrets.** Unit files under `/etc/systemd/system`
  are mode `0644` and world-readable. Only `EnvironmentFile` pointing at a
  `0600` file is safe.
- **Never credentials in argv.** `ps` shows every process's command line to
  every user, while `/proc/<pid>/environ` is restricted to the same UID and
  root.

**Residual risk, stated plainly:** during a build, any process running as
`deploy` can read that build's `/proc/<pid>/environ` and recover the database
credentials. The exposure window is the length of a build rather than
permanent, which is the improvement over a persistent deploy-owned `.env`, but
it is not zero. Closing it entirely means building under a separate UID, which
is out of scope here.

---

## 8. Existing production isolation

The deployment system never modifies `su-platform.service`,
`/var/www/sites/su.edu.bd`, port 3001, the `su.edu.bd` Nginx vhost, or the SU
database. Every path and unit name in the script is a literal, and the sudoers
rule makes the restriction enforceable rather than merely intended.

One honest exception: build CPU, memory and disk I/O are shared with
`su-platform` on the same host, so a build can make the other site slower while
it runs. No configuration belonging to either site is touched.

---

## 9. Installation

Steps 1–3 need root; run them as `shanto`.

```bash
# 0. Let deploy hand the server/ tree to the me-web group after each build.
#    Changing a file's group requires membership of the target group, so
#    without this the permission step fails. systemd rebuilds the supplementary
#    group list when it starts the unit, so me-deploy.service picks this up on
#    its next run; an SSH session already open does not.
sudo usermod -aG me-web deploy

# 1. Build credentials
sudo install -d -o root -g root -m 0700 /etc/me-platform
sudo install -o root -g root -m 0600 /dev/null /etc/me-platform/build.env
sudo nano /etc/me-platform/build.env      # DATABASE_URL and DIRECT_URL only

# 2. Sudoers rule. visudo validates before installing: a malformed file here
#    can lock everyone out of sudo.
sudo visudo -c -f /var/www/sites/me.su.edu.bd/deploy/sudoers.me-deploy
sudo install -o root -g root -m 0440 \
  /var/www/sites/me.su.edu.bd/deploy/sudoers.me-deploy /etc/sudoers.d/me-deploy

# 3. Script and units
sudo install -o root -g root -m 0755 \
  /var/www/sites/me.su.edu.bd/deploy/auto-deploy.sh /usr/local/bin/me-deploy
sudo cp /var/www/sites/me.su.edu.bd/deploy/me-deploy.service \
        /var/www/sites/me.su.edu.bd/deploy/me-deploy.timer \
        /etc/systemd/system/
sudo systemctl daemon-reload

# 4. Dry run before enabling the timer
sudo systemctl start me-deploy
journalctl -u me-deploy -n 50 --no-pager

# 5. Enable polling
sudo systemctl enable --now me-deploy.timer
systemctl list-timers me-deploy.timer
```

---

## 10. Rollback limitations

Phase 1 builds in place: `next build` deletes and rewrites `.next` inside the
directory the running service is serving from. The consequences are real and
are accepted for now.

- **During a build, 1–3 minutes,** the old process keeps serving, but the
  hashed files under `.next/static` are replaced. HTML already delivered to a
  browser references chunk filenames that no longer exist, so visitors mid-visit
  can get 404s on assets. The ISR cache symlink is also absent until state 9.
- **If the build fails,** `.next` is left partially rewritten. The service keeps
  running, but the site is degraded rather than intact. This is the most
  important limitation to understand.
- **There is no artifact rollback.** Returning to an earlier commit is a
  rebuild, with the same duration and the same failure modes.

| Guarantee | Phase 1 |
|---|---|
| A failed build never restarts the service | yes |
| No automatic database migration or seed | yes |
| `su-platform` cannot be touched | yes, enforced by sudoers |
| Concurrent deployments impossible | yes, `flock` |
| Destructive git recovery never runs | yes |
| Zero downtime | no |
| Asset integrity during a build | no |
| Automatic recovery from a failed build | no |
| Fast rollback | no |

### Phase 2 — blue/green, not implemented

Build into `releases/<sha>`, health-check it on a scratch port, then swap the
`me.su.edu.bd` symlink and restart. Rollback becomes swapping the symlink back
and restarting: seconds rather than a rebuild. Costs roughly twice the disk,
1.2 GB per release against 187 GB free, and a substantially more complex
script.

Trigger for doing this work: the first time a failed or slow build causes
visible breakage.

---

## 11. Testing plan

Tests 1–5 and 8 are safe on production. Test 6 needs a scratch clone. Tests 7
and 9 change production state briefly and should be run deliberately, not
casually: test 7 stops the site for the length of the check.

| # | Test | Method | Expected |
|---|---|---|---|
| 1 | No-op run | `sudo systemctl start me-deploy` with no new commits | logs "nothing to deploy", exit 0, no build |
| 2 | Dirty tree | append a blank line to a tracked file, run, then `git checkout --` it | aborts, names the dirty path, no fetch or build |
| 3 | Concurrency | start two runs together | second logs "skipping this run", exit 0 |
| 4 | Privilege boundary | as `deploy`: `sudo -n systemctl restart su-platform.service` | denied — proves isolation |
| 5 | Privilege grant | as `deploy`: `sudo -n systemctl restart me-platform.service` | succeeds |
| 6 | Build failure | scratch clone with a deliberate type error | aborts at state 8, service not restarted |
| 7 | Health failure | stop `me-platform`, run the three checks by hand | all three fail, non-zero exit |
| 8 | Health endpoint | `curl -i https://me.su.edu.bd/api/health` | `200 {"ok":true}`, `Cache-Control: no-store`, no database detail |
| 9 | Real deployment | push a trivial commit, wait for the timer | deployed within 5 minutes, all three checks pass |
| 10 | ISR write access | `sudo -u me-web test -w .next/standalone/.next/server/app && echo writable` | `writable` |
| 11 | Ownership unchanged | `stat -c '%U %G %a' .next/standalone/.next/server/app` | `deploy me-web 2775` |
| 12 | Scope not widened | `stat -c '%U %G' .next/standalone/server.js .next/standalone/public` | `deploy deploy` for both |
| 13 | No stray execute bits | `find .next/standalone/.next/server -type f -perm -g+x \| head` | no output |
| 14 | Runtime secret intact | `stat -c '%U %G %a' .env.production` | `root root 600` |
| 15 | Service account unchanged | `systemctl show me-platform -p User -p Group` | `User=me-web`, `Group=me-web` |

Tests 10–13 must be re-run after a deployment, not only after the first manual
setup: the whole point of state 10 is that `next build` undoes it every time.

Test 4 is the important one: it demonstrates that the narrow sudoers rule
actually confines the deployment system to its own service.
