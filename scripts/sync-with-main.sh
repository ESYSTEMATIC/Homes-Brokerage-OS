#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# sync-with-main.sh
#
# 1. Commits all in-flight work on the current branch (`feet/BRD-1.4`)
# 2. Fetches the latest `origin/main`
# 3. Shows what's new on main since we branched
# 4. Runs a dry-run merge to surface every conflict before you commit it
# 5. Aborts the dry-run so your tree stays clean
#
# Run from the repo root:  bash scripts/sync-with-main.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
echo "▶ Current branch: $CURRENT_BRANCH"

# ─── 1. Commit in-flight work ────────────────────────────────────────────────
if [[ -n "$(git status --porcelain)" ]]; then
  echo ""
  echo "▶ Staging and committing local changes…"
  git add -A
  git commit -m "feat(marketplace): public site, dashboard, blog hero, EREP-style Buy view

- Public Marketplace site (Home/Buy/Sell/Find/Mortgage) at /marketplace/*
  with the blog homes.com.eg banner as hero, Inter font, Popular Reads grid,
  service cards, featured carousel, working dropdowns + CTAs.
- Buy page now matches EREP layout: full-width chrome (breadcrumb, title,
  search, filter pills, type tabs), Map view = paginated 2-col cards left +
  fixed Google-Maps-tile map right, List view = full-width 3-col grid; map
  defaults to active.
- Marketplace Dashboard (Overview/Listings/Leads/Brokerages/Developers/
  Geography/Traffic/Reports/Users/Roles) gated to the marketplaceAdmin role.
- Employee Board exposes a Public Site → Marketplace link for every role.
- Body-lock helper in App.jsx keeps Backoffice/Employee Board/Map view
  viewport-fit while letting public marketplace + List view scroll naturally.
- Favicon set to the Homes brand mark (PNG + ICO bundle), title updated.
- Inter Google Font wired in index.html to mirror EREP's typography."
else
  echo "▶ Nothing to commit, working tree clean."
fi

# ─── 2. Fetch main ───────────────────────────────────────────────────────────
echo ""
echo "▶ Fetching origin/main…"
git fetch origin main

# ─── 3. Diff vs main ─────────────────────────────────────────────────────────
echo ""
echo "▶ Commits on origin/main that are NOT on $CURRENT_BRANCH:"
git log --oneline "$CURRENT_BRANCH..origin/main" || true

echo ""
echo "▶ Files changed on origin/main since our branch point (name + edit type):"
git diff --name-status "$(git merge-base HEAD origin/main)"...origin/main || true

# ─── 4. Dry-run merge to surface conflicts ───────────────────────────────────
echo ""
echo "▶ Dry-running merge of origin/main into $CURRENT_BRANCH…"
if git merge --no-commit --no-ff origin/main; then
  echo "✓ Clean merge — no conflicts."
  git merge --abort 2>/dev/null || true
else
  echo ""
  echo "⚠ Conflicts detected in these files:"
  git diff --name-only --diff-filter=U
  echo ""
  echo "Use this command to abort and inspect manually:"
  echo "    git merge --abort"
fi

echo ""
echo "Done. Review the output above. To finish a real merge later:"
echo "    git merge origin/main"
echo ""
echo "If you'd rather rebase your branch on main:"
echo "    git rebase origin/main"
