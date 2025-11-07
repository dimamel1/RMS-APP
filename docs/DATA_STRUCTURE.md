# RMS App POC – Data Structure Reference

This document summarizes the mock data assets that power the RMS proof-of-concept. Each JSON file lives in `src/data/mock` and mirrors the payloads that would normally arrive from the RMS back office APIs.

## Data Files

| File | Primary Keys | Description |
| ---- | ------------- | ----------- |
| `themes.json` | `id`, `slug` | Medical specialties used for filtering, coloring, and ordering content sections. |
| `articles.json` | `id` | Core journal articles. Includes subscription flag, issue association, media assets, and ranking metadata. |
| `issues.json` | `id` | Monthly RMS issues with cover artwork and the list of article identifiers contained in the issue. |
| `user.json` | `id` | Logged-in user profile with subscription type, favorites, read history, and personalization preferences. |
| `subscriptionTypes.json` | `id` | Catalog of available subscription plans used for upsell flows and entitlement checks. |
| `infographics.json` | `id` | Patient education cards displayed in carousel format. |
| `appState.json` | _n/a_ | Global configuration for UI theming, feature flags, editorial content, and navigation metadata. |
| `advertisements.json` | `id` | Configurable promotional placements surfaced throughout the experience. |
| `newsletter.json` | _n/a_ | Newsletter CTA configuration surfaced on the menu screen.

## Entity Overview

### Articles
- **Relationships**: `issueId` references `issues.json`, `themeSlug` references `themes.json`.
- **Access control**: `isSubscriberOnly` toggles paywall messaging.
- **Media**: `hasAudio` + `audioUrl` power the Poddle integration; `image` and `thumbnail` render hero and list art respectively.
- **Sorting**: `priority` (lower = more important) combined with `publishedAt` determines front page ordering.

### Issues
- Provide the spine for navigation between releases.
- `articleIds` enables quick lookups for issue detail screens without an expensive filter pass.
- `coverImage` powers hero displays in the issues carousel.

### Themes
- `order` controls the sticky theme bar and reorder drag handles.
- `color` is used for badges, separators, and gradient overlays.

### User
- `subscriptionType` must match an entry in `subscriptionTypes.json`.
- `favorites` and `readArticles` persist local activity; slices consume these arrays to hydrate Redux state.
- `preferences.themeOrder` allows personalization of the theme filter bar.

### Application State
- `featureFlags` toggles features during controlled rollout.
- `editorial.current` feeds the home hero card.
- `menus.bottomTabs` defines the Expo Navigation configuration (labels + icons).

### Advertisements & Newsletter
- Each ad object exposes `placement`, `image`, and `ctaUrl` to drop into predetermined slots across the UI.
- Newsletter copy keeps marketing text centralized and maintainable.

## Consumption Pattern

1. **Redux slices** import JSON using static `require`/`import` statements (optimized by Metro bundler).
2. **Selectors** map file contents into UI-ready shapes (e.g., featured articles vs. latest issue).
3. **Async simulation**: initial load actions wrap mock data in `Promise.resolve` to mimic API calls and keep component code future-proof for network adoption.

For schema details and TypeScript helpers, see `QUICK_REFERENCE.md`.

