# Branch sync notes — feet/BRD-1.4 ← origin/main

## What's about to be committed on `feet/BRD-1.4`

### Modified files (10)

| File | Why it changed (this session) |
| ---- | ----------------------------- |
| `index.html` | Switched favicon to the Homes brand mark (PNG + ICO + apple-touch-icon), wired Inter Google Font, renamed page title to “Homes — Brokerage Operating System”. |
| `src/App.jsx` | Added route-aware `useBodyLock` so public marketplace + Buy List view scroll the page naturally while every other surface stays viewport-locked; new public marketplace routes (`/marketplace/*`) and the role-gated Marketplace Dashboard route (`/system/marketplace-dashboard/*`). |
| `src/components/AgentLayout.jsx` | Renamed to “Employee Board”; added Federated Systems · SSO section (CRM / Marketplace Dashboard / Matrix EGMLS / Backoffice Admin) and a Public Site → Marketplace link visible to every role. |
| `src/components/BackofficeLayout.jsx` | Removed Help, Payroll, Products & Services modules per BRD V1.4. |
| `src/data/staticData.js` | Persona / role data tweaks for the Marketplace Admin role. |
| `src/index.css` | +1.2 K lines: brand tokens, Marketplace Dashboard chrome, public marketplace site (header/footer/hero/cards), Buy page split layout, popular-reads cards, Google-tile-map markers, body-lock guards. |
| `src/pages/EmployeeBoardDashboard.jsx` | Surface launchers + Public Marketplace tile. |
| `src/pages/ExternalSystem.jsx` | CRM federated placeholders (Leads / Deals / Tasks). |
| `src/pages/MarketplaceDashboard.jsx` | Re-export shim so legacy imports still resolve to the new folder module. |
| `.gitignore` | Ignore `vite.config.tmp.js` (sandbox build helper). |

### New files

```
public/blog-hero-compound.jpg          (blog Palm Hills photo, used as hero asset)
public/blog-hero-shape.svg             (Group.svg from blog, no longer referenced)
public/favicon.ico                     (Homes brand favicon, multi-size)
public/homes-favicon.png               (192×192)
public/homes-favicon-32.png            (32×32)
src/components/MarketplaceLayout.jsx   (Marketplace Dashboard chrome)
src/components/MarketplaceSiteLayout.jsx (Public marketplace chrome — header, footer, WhatsApp)
src/data/marketplaceData.js            (Dashboard seed data: brokerages, developers, geography, traffic, reports)
src/data/publicMarketplaceData.js      (Public site seed: listings + lat/lng, areas, FAQ, mortgage features, popular reads)
src/pages/MarketplaceSite/             (Home, Buy, Sell, Find, Mortgage)
src/pages/MarketplaceDashboard/        (Overview, Listings, LeadsRequests, Brokerages, Developers,
                                        Geography, Traffic, Reports, ReportDetail, Users, RolesAccess,
                                        Charts, Pager, useMarketplaceTable)
```

## Likely collision zones with `origin/main`

We have no network here so we can't see exactly what main pushed. Based on your last release on main (`91e6f2e feat: add Help page and RBAC`), main is most likely to touch these files — these are the **high-risk merge points**:

| Path | Risk | Notes |
| ---- | ---- | ----- |
| `src/App.jsx` | **HIGH** | If main added new top-level routes you'll get clashes around the `<Routes>` block. Resolution: keep both — paste main's new `<Route>` lines next to the `/marketplace/*`, `/board/*`, `/system/marketplace-dashboard/*`, `/backoffice/*` blocks already there. |
| `src/components/AgentLayout.jsx` | **HIGH** | We renamed it to “Employee Board” and rewrote the sidebar. If main added Help/RBAC links, prefer ours and re-add main's new entries under the **Account** or **Federated Systems** sections. |
| `src/components/BackofficeLayout.jsx` | **MEDIUM** | We **removed** Help, Payroll, Products & Services — main's "add Help page" commit probably added them back. Resolution: keep our removals (BRD §3 explicitly drops them) unless the user says otherwise. |
| `src/index.css` | **MEDIUM** | Big file, both branches likely appended new selectors. Conflicts are usually just sequential additions; merge by accepting both blocks. |
| `src/data/staticData.js` | **MEDIUM** | If main added persona entries for new RBAC roles, we have to merge by union (keep all roles + our new `marketplaceAdmin`). |
| `src/context/AppContext.jsx` | **LOW** | We didn't edit it; main may have. Should be a clean fast-forward of main's version. |
| `src/pages/RolesPermissions.jsx` | **LOW** | We didn't edit it; main probably did. Take main's version. |
| `src/pages/MarketplaceDashboard.jsx` (the shim file at the top level) | **LOW** | We turned it into a one-liner re-export. If main rewrote it, take ours and verify the import still resolves. |

## Files that are 100% safe (we created them, main can't have them)

```
public/blog-hero-*.svg|.jpg
public/homes-favicon-*.png|.ico
src/components/MarketplaceLayout.jsx
src/components/MarketplaceSiteLayout.jsx
src/data/marketplaceData.js
src/data/publicMarketplaceData.js
src/pages/MarketplaceSite/**
src/pages/MarketplaceDashboard/**
```

If they show up as conflicts during merge, it's almost certainly because main also created a file at the same path — inspect the diff and rename if needed.

## Recommended sequence

```bash
# from repo root
bash scripts/sync-with-main.sh
```

That script:
1. Commits all the work above with a clean message.
2. Fetches `origin/main`.
3. Lists the new commits on main and the files they touched.
4. Dry-runs a merge so you can see every conflict path **before** the merge actually happens.
5. Aborts the dry-run so your tree stays clean.

After the dry-run, decide between:
- `git merge origin/main` (keeps merge commit history)
- `git rebase origin/main` (linear history, replay your commit on top of main)

If conflicts appear, the table above tells you which side to prefer for each file.
