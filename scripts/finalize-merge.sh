#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# finalize-merge.sh
#
# Resolves the conflicts from `git merge origin/main` by taking OUR version
# of the four known conflicting files, while preserving main's versions in
# a scratch folder so you can hand-port the new CRM V2 additions.
#
# Run AFTER `git merge origin/main` has reported the 4 conflicts and BEFORE
# committing the merge.
#
# Usage:  bash scripts/finalize-merge.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# Sanity: must be mid-merge
if [[ ! -f .git/MERGE_HEAD ]]; then
  echo "✗ No merge in progress. Run \`git merge origin/main\` first."
  exit 1
fi

CONFLICT_FILES=(
  "src/App.jsx"
  "src/components/AgentLayout.jsx"
  "src/index.css"
  "src/pages/EmployeeBoardDashboard.jsx"
)

SCRATCH=".merge-scratch"
mkdir -p "$SCRATCH"

echo "▶ Saving main's versions of the 4 conflict files to $SCRATCH/ …"
for f in "${CONFLICT_FILES[@]}"; do
  out="$SCRATCH/$(basename "$f")"
  git show "MERGE_HEAD:$f" > "$out"
  echo "    saved $out  (main's version)"
done

echo ""
echo "▶ Taking OUR version verbatim for each conflict …"
for f in "${CONFLICT_FILES[@]}"; do
  git checkout --ours -- "$f"
  git add -- "$f"
  echo "    resolved $f  (ours)"
done

# Spot-check that no other unresolved conflicts remain
REMAINING="$(git diff --name-only --diff-filter=U || true)"
if [[ -n "$REMAINING" ]]; then
  echo ""
  echo "⚠ Other unresolved conflicts still present — resolve them before committing:"
  echo "$REMAINING"
  exit 2
fi

echo ""
echo "▶ Auto-merge files (the ones git resolved itself) — quick spot-check list:"
git diff --name-only HEAD MERGE_HEAD | grep -vE '^(src/App\.jsx|src/components/AgentLayout\.jsx|src/index\.css|src/pages/EmployeeBoardDashboard\.jsx)$' || true

echo ""
echo "▶ Committing the merge with our resolutions …"
git commit --no-edit

echo ""
echo "✓ Merge committed. Now port main's additions in:"
echo ""
echo "    diff -u $SCRATCH/App.jsx                     src/App.jsx                     | less"
echo "    diff -u $SCRATCH/AgentLayout.jsx             src/components/AgentLayout.jsx  | less"
echo "    diff -u $SCRATCH/index.css                   src/index.css                   | less"
echo "    diff -u $SCRATCH/EmployeeBoardDashboard.jsx  src/pages/EmployeeBoardDashboard.jsx | less"
echo ""
echo "Port checklist (per scripts/SYNC-NOTES.md):"
echo "  • App.jsx          — pull in main's new imports + <Route> blocks under existing /system/crm/*"
echo "  • AgentLayout.jsx  — add main's new CRM V2 nav links as SSO buttons under Federated Systems"
echo "  • index.css        — append main's new .crm-* selectors; drop any 'html, body, #root { overflow: hidden }' line"
echo "  • EmployeeBoard…   — add any new CRM V2 tile to the dashboard card grid"
echo ""
echo "After porting:"
echo "    npm run build     # must be green"
echo "    git add -A && git commit --amend --no-edit   # rolls the ports into the merge commit"
echo "    rm -rf $SCRATCH"
