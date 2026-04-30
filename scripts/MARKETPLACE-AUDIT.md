# EREP -> Homes Marketplace · Logic Gap Audit

## Snapshot
- EREP marketplace stack: Next.js App Router, React 18, localized routes under `src/app/[locale]/*`, server actions/API wrappers in `src/apis.ts`.
- State management: Zustand persisted compare store in `src/store/propertyStore.ts`; user/favorites via `userStore`, hooks, and server endpoints.
- Map provider: Google Maps via `@vis.gl/react-google-maps` in `src/components/Map/GoogleMap.tsx`.
- Form lib: Formik + Yup in sell, inquiry, mortgage, bank, and profile forms.
- i18n: `next-intl`, locale route prefix `[locale]`, locale-aware navigation wrappers.

## Findings

### 1. Search bar + filter dropdowns
- **EREP behavior**: Buy search is URL-driven. `src/app/[locale]/buy/[[...slugs]]/page.tsx` resolves type/governorate/city slugs, builds query strings with `buildQueryString`, and renders `AutoCompleteInput`, `SortSelect`, and `Filter`. `src/components/buy/Filter.tsx` reads `useSearchParams`, pushes params, clears `page`, fetches sub-types with `GET_PROPERTY_SUB_TYPES`, and opens `SaveSearch`; `src/components/buy/AppliedFilters.tsx` renders chips and `clearAll`.
- **Homes behavior**: `src/pages/MarketplaceSite/Home.jsx` sends `q`, `type`, `sub`, `price`, `beds`, `baths` into `/marketplace/buy`. `src/pages/MarketplaceSite/Buy.jsx` initializes some values from URL, but later filter changes only update component state; type/sub are not applied, save search is an alert, and clear does not rewrite the URL.
- **Gap**: Homes cannot deep-link or refresh reliably after applying filters, and saved-search/clear-all are demo actions.
- **Fix**: Centralize Buy filters in URL params. On apply, update `location.search`, reset `page=1`, render applied chips, and persist Save Search to localStorage until a backend exists.
- **Files to touch in Homes**: `src/pages/MarketplaceSite/Home.jsx`, `src/pages/MarketplaceSite/Buy.jsx`, `src/data/publicMarketplaceData.js`.

### 2. Buy page Map view <-> List view sync
- **EREP behavior**: `src/hooks/useMapPanel.ts` persists map/list state and feeds `serverQueryString` into `MapView`. `src/hooks/useMapData.ts` fetches `/properties/filter` with `north/south/east/west`, `per_page=6`, and `with_pins=1`; map cards are `mapProperties`, so panning/zooming changes the list. Cluster clicks call `/properties/by-location`; pagination uses `mapMeta`.
- **Homes behavior**: `Buy.jsx` filters static `PM_LISTINGS`, paginates `pageItems`, but calls `useLeafletMap(mapRef, filtered)`, so the map shows all filtered results while the cards show the current page. Map pan/zoom never filters the list; marker clicks only open a popup.
- **Gap**: Markers do not map 1:1 to visible cards, map bounds do not drive list results, and pagination does not affect marker set.
- **Fix**: Track Leaflet bounds in state, filter listings after `moveend`, paginate that bounded set, and pass the same set to cards and markers.
- **Files to touch in Homes**: `src/pages/MarketplaceSite/Buy.jsx`.

### 3. Listing card -> detail page navigation
- **EREP behavior**: `src/components/PropertyCard/index.tsx` wraps cards in `getPropertyHref`, and `src/app/[locale]/buy/[[...slugs]]/page.tsx` detects three-slug MLS detail routes, fetches `GET_PROPERTY_DETAILS` and `GET_SIMILAR_PROPERTIES`, then renders `propertyDetailsClient.tsx`. Detail includes gallery, favorite/compare/share, mortgage calculator, map, inquiry, schedule tour, QR/verification, and similar listings.
- **Homes behavior**: Cards in `Home.jsx` and `Buy.jsx` are not links. Tour/call/favorite/compare are alerts or local toggles; `src/App.jsx` has no `/marketplace/listings/:id` or property detail route.
- **Gap**: Users cannot inspect a listing, share it, estimate mortgage from it, contact from a detail page, or navigate to similar listings.
- **Fix**: Add a public detail route backed by `PM_LISTINGS`. Link cards to it, and include carousel, specs, location, tour/inquiry forms, share/favorite/compare, mortgage estimate, and similar listings.
- **Files to touch in Homes**: `src/App.jsx`, `src/pages/MarketplaceSite/Buy.jsx`, `src/pages/MarketplaceSite/Home.jsx`, new detail page, `src/data/publicMarketplaceData.js`.

### 4. Saved searches, favorites, comparison
- **EREP behavior**: Favorites are server-backed via `TOGGLE_FAVORITE` and `GET_FAVORITE_PROPERTIES` in `src/apis.ts`; `src/hooks/useFavorite.tsx` gates unauth users and dispatches `favorites-updated`, while `FavoritesPopover.tsx` refreshes header counters. Compare lives in persisted Zustand `propertyStore.ts` with max 3 and powers `ComparePopover.tsx` plus `src/app/[locale]/compare/page.tsx`, which fetches `/properties/compare`. Saved searches POST `/saved-searches` from `SaveSearch.tsx` and are managed in `SavedSearchesTab.tsx`.
- **Homes behavior**: `Buy.jsx` stores `favs` and `compare` in local component `Set`s. Header buttons in `MarketplaceSiteLayout.jsx` navigate to query params that no component handles; counts are absent.
- **Gap**: State disappears on navigation, header counters are wrong, and there is no saved-search or compare screen.
- **Fix**: Introduce a small marketplace state store persisted to localStorage. Header counters should subscribe to it; Buy cards should toggle it; add simple saved/compare views or query-driven sections that render the stored listings.
- **Files to touch in Homes**: `src/components/MarketplaceSiteLayout.jsx`, `src/pages/MarketplaceSite/Buy.jsx`, new marketplace store/view.

### 5. Lead capture forms
- **EREP behavior**: Sell uses Formik/Yup in `src/components/sell/sellForm.tsx`, dependent sub-type/city fetching, agreement validation, and POST `/sell-property-requests`. Inquiry uses Formik/Yup in `InquiryModal.tsx` and `inquiryCard.tsx`, POST `/inquiry/add`. Schedule tour uses `ScheduleTourModal.tsx`, requires sign-in, allows up to 3 slots, POST `/schedule-tours`. Mortgage bank form uses `BankForm.tsx`, POST `/mortgage/create-request`. Recaptcha fields exist in API types but no captcha UI was found.
- **Homes behavior**: Sell and Mortgage forms are native HTML forms with `required` and `alert(...)`. Schedule tour and call are alerts; there is no detail-page interest form.
- **Gap**: No structured validation, no dependent selects, no loading/error/success state beyond alerts, no durable lead payloads, and no auth-aware flow.
- **Fix**: Replace alerts with reusable form handlers, local validation, and a mock `createLead` service. Store submissions locally, show inline errors/loading/success, and standardize lead payloads.
- **Files to touch in Homes**: `src/pages/MarketplaceSite/Sell.jsx`, `src/pages/MarketplaceSite/Mortgage.jsx`, `src/pages/MarketplaceSite/Buy.jsx`, new detail page/service.

### 6. Mortgage calculator math
- **EREP behavior**: `src/components/shared/calculateMortgageComp.tsx` collects mortgage amount, down payment, and term; validates positive amount, minimum 15% down, down payment less than price, and term 1-15 years. It POSTs `/mortgage/calculator`; exact formula is not client-side. `ResultsStep.tsx` displays monthly payment, loan amount, interest, total cost, chart, and opens/scrolls to `BankForm`.
- **Homes behavior**: `Mortgage.jsx` steps through down payment, annual income, and term but does not store or validate values, calculate, show results, check eligibility, or pass values into the bank form.
- **Gap**: Calculator is only a wizard shell.
- **Fix**: Implement demo formula: loan = price - downPayment; monthly = P*r*(1+r)^n / ((1+r)^n - 1), with configurable annual rate and `n=years*12`. Show interest/cost, prefill the bank form, and add income eligibility.
- **Files to touch in Homes**: `src/pages/MarketplaceSite/Mortgage.jsx`.

### 7. Find page (developers/brokerages)
- **EREP behavior**: Consumer-facing Find page not found. API helpers exist in `src/apis.ts` for `/corporates/developers-brokers`, counts, corporate detail, developer projects, and broker properties, but no route/page uses them.
- **Homes behavior**: `Find.jsx` has tabs for developers, brokerages, and areas. Developers filter by name from `MP_DEVELOPERS`; brokerages are hard-coded strings. Developer “View Portfolio” is an alert; brokerage “View Listings” goes to unfiltered Buy.
- **Gap**: No drilldown to a developer/broker profile or filtered project/listing list.
- **Fix**: Add a selected developer/broker state or route, and filter listings/projects by that entity. Replace alerts with navigation to `/marketplace/find/:id` or `/marketplace/buy?developer=...`.
- **Files to touch in Homes**: `src/pages/MarketplaceSite/Find.jsx`, `src/pages/MarketplaceSite/Buy.jsx`, data files.

### 8. Internationalization
- **EREP behavior**: `src/i18n/routing.ts` defines locales and default locale; `src/i18n/request.ts` loads JSON messages; `src/i18n/navigation.tsx` wraps Link/router. Routes are prefixed with `[locale]`, and components use `useTranslations`; many controls include RTL classes.
- **Homes behavior**: `MarketplaceSiteLayout.jsx` has an EN/AR toggle that only changes the button label. Text is hard-coded English and layout direction does not flip.
- **Gap**: Language toggle is non-functional.
- **Fix**: Add a translation dictionary, `lang` context, and `dir` on the shell. Replace visible strings with lookups and mirror directional icons/styles.
- **Files to touch in Homes**: `src/components/MarketplaceSiteLayout.jsx`, all MarketplaceSite pages, data files.

### 9. WhatsApp / phone CTAs
- **EREP behavior**: `detailsSectionBar.tsx` shares the current listing via `https://wa.me/?text=<current-url>`. `src/components/WhatsAppButton.tsx` links to `https://wa.me/201225444440?text=...`. I found no click tracking or source attribution on these CTAs.
- **Homes behavior**: `MarketplaceSiteLayout.jsx` links floating WhatsApp to `https://wa.me/201225444440` with no message. Card call buttons use alerts.
- **Gap**: CTAs do not carry listing context or attribution and phone does not deep-link.
- **Fix**: Use `tel:` for phone and WhatsApp URLs with encoded listing/page message plus `utm_source=marketplace`. Log CTA type, listing id, route, and timestamp locally.
- **Files to touch in Homes**: `src/components/MarketplaceSiteLayout.jsx`, `src/pages/MarketplaceSite/Buy.jsx`, `src/pages/MarketplaceSite/Home.jsx`, new detail page.

### 10. Auth gating
- **EREP behavior**: `useFavorite.tsx` blocks favorites without auth. `SaveSearch.tsx`, `InquiryModal.tsx`, `inquiryCard.tsx`, `ScheduleTourModal.tsx`, and `BankForm.tsx` show login-required states or disable actions when `userStore` has no user. Compare is not auth-gated because it is local persisted state.
- **Homes behavior**: Public marketplace is explicitly unauthenticated in `App.jsx`. Header account links to `/login`, but favorites, compare, save search, forms, and tour actions are available as demos or local state.
- **Gap**: No consistent prompt for actions that should belong to a user account.
- **Fix**: Define a lightweight `marketplaceUser` check. Gate save search, favorites, inquiry, tour, and mortgage request with a sign-in prompt; leave compare local.
- **Files to touch in Homes**: `src/App.jsx`, `src/components/MarketplaceSiteLayout.jsx`, MarketplaceSite action handlers.

## Quick wins
- Sync Buy filter state back into `location.search`.
- Add applied-filter chips and a real Clear All.
- Persist favorites/compare/saved searches to localStorage and show header counters.
- Replace card call alerts with `tel:+201225444440`.
- Add WhatsApp messages containing current URL/listing id.
- Make Save Search store the current query locally.
- Make Home and Buy listing cards navigate to a new static detail route.

## Risky / out-of-scope
- Rebuilding EREP’s backend contracts: `/properties/filter`, `/saved-searches`, `/favourites`, `/schedule-tours`, `/inquiry/add`, `/mortgage/calculator`, `/mortgage/create-request`.
- Exact mortgage math parity with EREP, because the formula is backend-owned and not visible client-side.
- Full Arabic/RTL parity across the whole app without a product copy pass.
- Real developer/broker drilldowns if Homes lacks normalized entity/listing relationships.
- Captcha, analytics attribution, and authenticated consumer accounts unless backend/auth scope is approved.
