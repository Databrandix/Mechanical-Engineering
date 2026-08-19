#!/usr/bin/env bash
#
# Pull-based deployment for me.su.edu.bd. Installed to /usr/local/bin/me-deploy;
# this copy is the version-controlled reference.
#
# It runs from /usr/local/bin rather than from the release directory for two
# reasons: `git pull` below would rewrite the script while bash is still reading
# it, and a root-owned copy cannot be edited by `deploy` to widen its own
# privileges. Updating it is therefore a deliberate root action, not something a
# deployment does to itself.
#
# DATABASE_URL and DIRECT_URL arrive from me-deploy.service's EnvironmentFile.
set -Eeuo pipefail

RELEASE=/var/www/sites/me.su.edu.bd
CACHE=/var/www/sites/me-platform-cache
SERVER="$RELEASE/.next/standalone/.next/server"
UNIT=me-platform.service
BRANCH=main
# systemd sets RUNTIME_DIRECTORY from the unit's RuntimeDirectory=, and removes
# that directory when the unit stops. The fallback keeps a hand-run invocation
# working instead of dying on a missing lock path.
LOCKFILE="${RUNTIME_DIRECTORY:-/tmp}/me-deploy.lock"

log() { printf '%s\n' "$*"; }
die() { printf 'ABORT: %s\n' "$*" >&2; exit 1; }

# One deployment at a time. A build outlasts the five-minute timer interval, so
# without this the next tick would start a second build in the same directory.
exec 9>"$LOCKFILE" || die "cannot open lock file $LOCKFILE"
if ! flock -n 9; then
  log "another deployment is already running; skipping this run"
  exit 0
fi

cd "$RELEASE" || die "release directory missing: $RELEASE"

# Build credentials come from the unit's EnvironmentFile
# (/etc/me-platform/build.env, root-owned 0600) and must exist nowhere else. A
# .env in the release is a readable copy of the database credentials sitting on
# disk between builds, which is exactly what this deployment is arranged to
# avoid -- and Next.js would load it in preference to nothing at all, so a stale
# one could also quietly point the build at the wrong database. Fail rather than
# warn: a warning in a journal nobody reads is not a control.
if [ -e "$RELEASE/.env" ]; then
  die "$RELEASE/.env exists; build credentials must come from systemd only. Remove it."
fi

# The working tree must be pristine. Nothing in this script ever discards local
# changes: no reset --hard, no clean, no checkout of arbitrary commits, no
# history rewriting. A dirty tree means somebody edited something on the server,
# and that is a question for a human rather than for a timer.
if [ -n "$(git status --porcelain)" ]; then
  git status --short >&2
  die "working tree is dirty; refusing to deploy"
fi

# Read-only from here until the pull: fetch writes remote-tracking refs inside
# .git and touches no tracked file.
git fetch --quiet origin "$BRANCH" || die "git fetch failed"
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/$BRANCH")

if [ "$LOCAL" = "$REMOTE" ]; then
  log "already at ${LOCAL:0:7}; nothing to deploy"
  exit 0
fi

# Checked before the pull so the failure names the real problem — a force-push
# or a diverged server — instead of leaving git to refuse a merge.
git merge-base --is-ancestor "$LOCAL" "$REMOTE" \
  || die "origin/$BRANCH is not a fast-forward from ${LOCAL:0:7}; refusing to deploy"

log "deploying ${LOCAL:0:7} -> ${REMOTE:0:7}"
git pull --ff-only origin "$BRANCH" || die "git pull --ff-only failed"

# node_modules at the project root is only used to build. The running service
# serves from .next/standalone, which carries its own traced copy, so
# reinstalling here does not disturb it.
if ! git diff --quiet "$LOCAL" "$REMOTE" -- package-lock.json; then
  log "package-lock.json changed; reinstalling dependencies"
  # --ignore-scripts: a dependency's install hook would otherwise run arbitrary
  # code as me-build on every lockfile change. Verified safe for this project --
  # the Prisma query engine, sharp's libvips and esbuild's binary all arrive as
  # platform-specific optional dependencies rather than postinstall downloads,
  # and `prisma generate` is invoked explicitly by `npm run build` below.
  npm ci --no-audit --no-fund --ignore-scripts || die "npm ci failed"
fi

# `npm run build` runs `prisma generate` — code generation from the schema file,
# which never opens a database connection — and then `next build`. No migrate,
# no db push, no seed, here or anywhere else in this script. Schema changes stay
# a deliberate human action.
#
# This is also the point of no return for the live site: next build wipes and
# rewrites .next in place, so a failure here leaves the release degraded until
# the next successful build. See deploy/README.md for what that means.
npm run build || die "build failed; service was NOT restarted"

# next build wiped .next and took this symlink with it. Restored only now,
# because there is no point pointing the cache at a build that never finished.
ln -sfn "$CACHE" "$RELEASE/.next/standalone/.next/cache" \
  || die "could not restore ISR cache symlink"

# The symlink above is not enough. Next.js's filesystem incremental cache writes
# regenerated ISR pages back into the server bundle as server/app/<route>.html,
# .rsc and .meta -- not into .next/cache -- and next build has just recreated
# that whole tree as deploy:deploy, which me-web cannot write. Without this the
# service fails at runtime with:
#
#   EACCES: permission denied, open '.../standalone/.next/server/app/index.html'
#
# Hand the group to me-web and open the group bits. Ownership stays with deploy;
# nothing here is chowned. Directories and files are handled separately because
# they need different bits: a directory needs +x to be traversed at all, while a
# regular file must not gain execute permission it never had. `chmod -R g+w`
# would get both wrong.
#
# The setgid bit is what makes this survive: route directories Next.js creates
# at runtime inherit group me-web and inherit setgid in turn.
#
# Scope is the server/ subtree only. `.next/standalone/.next/cache` is a sibling
# symlink rather than a descendant, so it is left alone, and -type d/-type f
# means symlinks are never followed or altered.
find "$SERVER" -type d -exec chgrp me-web {} + -exec chmod g+rwx,g+s {} + \
  || die "could not set directory permissions under server/"
find "$SERVER" -type f -exec chgrp me-web {} + -exec chmod g+w {} + \
  || die "could not set file permissions under server/"

# The one privileged action, and the only one this account is allowed
# (/etc/sudoers.d/me-deploy). -n so a missing sudoers rule fails immediately
# rather than blocking on a password prompt no timer can answer.
sudo -n /usr/bin/systemctl restart "$UNIT" || die "restart failed"

# Restarting is not instantaneous. Without this wait the first health check
# would be a race rather than a measurement.
for i in $(seq 1 30); do
  if curl -fsS -o /dev/null --max-time 5 http://127.0.0.1:3002/; then break; fi
  [ "$i" -eq 30 ] && die "app did not answer on 127.0.0.1:3002 within 60s"
  sleep 2
done

# All three must pass. The loopback request proves the Node process is up; the
# public URL proves DNS, TLS and Nginx still route to it; /api/health proves the
# process can reach its database, which the other two cannot show.
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
