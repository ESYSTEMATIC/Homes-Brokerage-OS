# EREP UX Spec — Advanced Search, Login, Compare, Favorites, Mortgage Result

## 1. Advanced Search
- **Trigger / route**: On the home hero search card, the trigger is a compact button with sliders icon and label `Advanced`, placed to the right of the main keyword input. It toggles local state, not a route or modal. Search submits to `/buy` with path slug for selected type and query params for keyword/area, price, beds, baths, payment, and area.
- **Layout pattern**: Inline expanding panel under the primary search/filter row. Primitive is custom React state plus custom dropdowns; no modal/drawer library.
- **Sections / fields**: Main row: keyword autocomplete grouped by `Cities` and `Compounds`, free “Search for …” row; `Property Type`; dependent `Sub Type`; `Price Range (EGP)` with min/max; `Beds & Baths` with `Number of Bedrooms`, `Number of Bathrooms`, `Use exact match`, `Apply`; desktop Search button. Advanced row: `Payment` dropdown, then `Area Range (m²)` / `Area (m²)` min/max.
- **Actions**: `Search` builds `/buy[/<type-for-sale>]?keyword|area=&min_price=&max_price=&bedrooms=&bathrooms=&listing_term=&area_min=&area_max=`. Changing property type fetches sub-types and resets sub-type.
- **Empty state**: Not implemented in EREP for the advanced panel itself.
- **Auth behavior**: No auth gate.
- **Mobile behavior**: Same inline expansion; search submit button moves below the filters as full-width mobile button.
- **Files in EREP**: `src/app/[locale]/(home)/components/SearchCard.tsx:167`, `src/app/[locale]/(home)/components/SearchCard.tsx:229`, `src/app/[locale]/(home)/components/SearchCard.tsx:309`, `src/app/[locale]/(home)/components/SearchCard.tsx:477`, `src/app/[locale]/(home)/components/SearchCard.tsx:488`, `src/app/[locale]/(home)/components/SearchCard.tsx:558`, `src/locales/en.json:143`, `src/locales/en.json:252`.
- **Concrete fix in Homes**:
  1. file: `src/pages/MarketplaceSite/Home.jsx` — replace modal-based Advanced with an inline expandable row below the existing filters.
  2. file: `src/pages/MarketplaceSite/Buy.jsx` — accept the same query param names EREP emits.

## 2. Consumer Login
- **Trigger / route**: Login is a dedicated `/auth/login` route. EREP has no Microsoft 365 button. The exposed order is: back button/language switcher, logo, heading `Log In`, `Continue with Google`, divider `or continue by email`, Email, Password, `Forgot your password?`, reCAPTCHA if enabled, `Log In`, and `Don't have an account? Register`.
- **Layout pattern**: Full-page centered auth form. Form library is Formik + Yup; reCAPTCHA hook is optional. Signup is a dedicated `/auth/signup` route, not modal/inline.
- **Sections / fields**: Login: email + password. Signup: `Continue with Google`, divider, First Name, Last Name, Email, Mobile Number, Password, Confirm Password, terms/privacy checkbox, `Registration`, and `Log In` link. OTP route shows 6 digit input using `input-otp`, submit `Send`, resend link, and timer. Forgot password route collects Email, sends to OTP reset flow, then reset password route collects New Password and Confirm New Password.
- **Actions**: Email/password POSTs `/auth/users/login`; success either redirects to OTP if `requires_otp`, or stores token and routes home. Google calls `useGoogleAuth`. Forgot password POSTs reset request, stores email, routes to `/auth/verify-otp?flow=reset-password`; valid OTP routes to `/auth/reset-password?code=...`.
- **Empty state**: Not implemented in EREP.
- **Auth behavior**: Unauth prompts appear inside gated actions: Save Search shows login-required plus login link; favorite click raises auth-required toast; inquiry and schedule-tour modals show login-required panels with login CTA.
- **Mobile behavior**: Same full-page form, narrower width; signup switches mixed grids to single-column where defined.
- **Files in EREP**: `src/app/[locale]/auth/login/page.tsx:23`, `src/app/[locale]/auth/login/page.tsx:51`, `src/app/[locale]/auth/login/page.tsx:125`, `src/app/[locale]/auth/login/page.tsx:169`, `src/app/[locale]/auth/login/page.tsx:212`, `src/apis.ts:160`, `src/services/handleResponse.ts:42`, `src/app/[locale]/auth/signup/page.tsx:31`, `src/app/[locale]/auth/signup/page.tsx:171`, `src/app/[locale]/auth/signup/page.tsx:217`, `src/app/[locale]/auth/forget-password/page.tsx:34`, `src/app/[locale]/auth/verify-otp/page.tsx:72`, `src/app/[locale]/auth/reset-password/page.tsx:53`, `src/components/buy/SaveSearch.tsx:127`, `src/hooks/useFavorite.tsx:39`, `src/components/PropertyCard/InquiryModal.tsx:162`, `src/components/PropertyCard/ScheduleTourModal.tsx:292`.
- **Concrete fix in Homes**:
  1. file: `src/pages/MarketplaceSite/MpAuth.jsx` — model auth as full-page Login/Signup/Profile routes with Google, email/password, OTP, forgot/reset flows; remove Microsoft 365.
  2. file: `src/components/MarketplaceSiteLayout.jsx` — point account popover to consumer auth routes and show gated-action prompts.

## 3. Compare Page
- **Trigger / route**: Lives at `/compare`. Properties are added from listing/detail cards via compare icon.
- **Layout pattern**: Page header with breadcrumb, count, `Clear all`; sticky/horizontal card strip on mobile and responsive card grid on desktop; then scrollable attribute table. If fewer than three items, an “Add a Property” dashed card links to `/buy`.
- **Sections / fields**: Attribute table sections: `Listing Details` rows: Property Type, Sub Type, MLS ID, Payment Terms, Furnished. `Specifications` rows: Bedrooms, Bathrooms, Gross Area, Year Built, Floor Number. `Project Info` rows: Developer, Compound, Price. Numeric rows mark the max value with a best indicator.
- **Actions**: Compare state is persisted Zustand local storage, max 3. Card compare toggles add/remove; full state disables adding above max. Popover preview fetches compare preview by MLS IDs and allows item removal. Page `Clear all` empties the store.
- **Empty state**: Centered icon, title `No Units Available to Compare`, description, and browse-properties CTA to `/buy`.
- **Auth behavior**: Not auth-gated in EREP.
- **Mobile behavior**: Selected cards become sticky and horizontally scrollable; table has horizontal overflow.
- **Files in EREP**: `src/app/[locale]/compare/page.tsx:21`, `src/app/[locale]/compare/page.tsx:79`, `src/app/[locale]/compare/page.tsx:103`, `src/app/[locale]/compare/page.tsx:106`, `src/components/compare/CompareTable.tsx:46`, `src/components/compare/CompareTable.tsx:120`, `src/store/propertyStore.ts:5`, `src/store/propertyStore.ts:19`, `src/hooks/useCompare.tsx:5`, `src/components/PropertyCard/index.tsx:46`, `src/components/PropertyCard/index.tsx:86`, `src/components/compare/CompareDropdownContent.tsx:69`, `src/components/compare/EmptyState.tsx:8`, `src/components/compare/UploadProperty.tsx:7`, `src/locales/en.json:88`.
- **Concrete fix in Homes**:
  1. file: `src/pages/MarketplaceSite/Buy.jsx` — use a persisted compare store with max 3 and disable add when full.
  2. file: `src/pages/MarketplaceSite/MpAuth.jsx` or new route — add `/marketplace/compare` page with card strip, add slot, clear all, and table rows above.
  3. file: `src/components/MarketplaceSiteLayout.jsx` — make compare header counter read the persisted store.

## 4. Favorites Page
- **Trigger / route**: Lives at `/favorites`; navbar/popover links to it.
- **Layout pattern**: Server page fetches favorites, maps them to property cards, and renders a client page with breadcrumb, title `My Favorites`, saved count, 3-column responsive grid, and pagination.
- **Sections / fields**: No tabs, collections, sort, or filters inside favorites. Cards are normal property cards with favorite action enabled.
- **Actions**: Removing a favorite refreshes the route; if the last item on a page beyond page 1 is removed, it navigates to the previous page. Header popover shows max 5 favorite preview cards and each has an X remove button.
- **Empty state**: If signed in with no favorites, it uses the shared EmptyState with title/description and CTA to `/buy`.
- **Auth behavior**: Auth-gated. Unauthorized server response renders login-required empty panel with Log In button. Favorite toggles from cards also require auth and show toast.
- **Mobile behavior**: Grid collapses from three columns to two/one; no special tabs.
- **Files in EREP**: `src/app/[locale]/favorites/page.tsx:26`, `src/app/[locale]/favorites/page.tsx:34`, `src/app/[locale]/favorites/page.tsx:37`, `src/app/[locale]/favorites/favoritesClient.tsx:20`, `src/app/[locale]/favorites/favoritesClient.tsx:30`, `src/app/[locale]/favorites/favoritesClient.tsx:61`, `src/app/[locale]/favorites/favoritesClient.tsx:78`, `src/app/[locale]/favorites/favoritesClient.tsx:87`, `src/components/favorites/FavoritesDropdownContent.tsx:14`, `src/components/favorites/FavoritesDropdownContent.tsx:48`, `src/components/ui/PropertyDropdownContent.tsx:45`, `src/components/favorites/FavoritePropertyCard.tsx:26`, `src/hooks/useFavorite.tsx:39`.
- **Concrete fix in Homes**:
  1. file: `src/pages/MarketplaceSite/Buy.jsx` — route favorite toggles through a persisted favorites store plus auth check.
  2. file: `src/pages/MarketplaceSite/MpAuth.jsx` or new route — add `/marketplace/favorites` grid, unauth login panel, empty state, and remove behavior.
  3. file: `src/components/MarketplaceSiteLayout.jsx` — replace query-param shortcuts with favorites popover/count and page link.

## 5. Mortgage Calculator — Results Screen
- **Trigger / route**: On `/mortgage`, clicking final wizard `Next`/calculate after Mortgage Amount, Down Payment, and Mortgage Term submits to `/mortgage/calculator`.
- **Layout pattern**: Inline replacement of the calculator section, not a new page or modal. The same section keeps the step indicator above results; result content is a two-column card layout on desktop and stacked on mobile.
- **Sections / fields**: Results show title `Your Results`, subtitle, Property price you can afford, Estimated monthly repayment, breakdown rows for Mortgage Amount, Down Payment, Mortgage Duration, Total Interest, Total Cost, plus a Chart.js doughnut with Principal and Interest.
- **Actions**: `Start Again` resets results and returns to step 1. Primary CTA uses mortgage page callback to scroll to the bank form and prefill unit price/calculator data; in standalone usage it opens a Radix `BankFormModal`.
- **Empty state**: Not implemented in EREP.
- **Auth behavior**: Calculator itself is not auth-gated. Bank form later disables fields/submission for unauth users.
- **Mobile behavior**: Result cards stack; `Start Again` and contact CTA are inside the results card on mobile, below the results rows.
- **Files in EREP**: `src/components/shared/calculateMortgageComp.tsx:24`, `src/components/shared/calculateMortgageComp.tsx:51`, `src/components/shared/calculateMortgageComp.tsx:131`, `src/components/shared/calculateMortgageComp.tsx:151`, `src/components/shared/calculateMortgageComp.tsx:180`, `src/components/shared/calculateMortgageComp.tsx:203`, `src/components/shared/calculateMortgage/ResultsStep.tsx:31`, `src/components/shared/calculateMortgage/ResultsStep.tsx:86`, `src/components/shared/calculateMortgage/ResultsStep.tsx:100`, `src/components/shared/calculateMortgage/ResultsStep.tsx:116`, `src/components/shared/calculateMortgage/ResultsStep.tsx:181`, `src/components/shared/calculateMortgage/ResultsStep.tsx:222`, `src/app/[locale]/mortgage/mortgageClient.tsx:18`, `src/app/[locale]/mortgage/components/BankFormModal.tsx:25`, `src/locales/en.json:616`.
- **Concrete fix in Homes**:
  1. file: `src/pages/MarketplaceSite/Mortgage.jsx` — store wizard values, calculate/submit, then replace wizard inline with the result card and chart.
  2. file: `src/pages/MarketplaceSite/Mortgage.jsx` — add Start Again and Get in Touch behavior that scrolls/prefills the bank form.
