# RMS App POC – Quick Reference

Use this page as your grab-and-go guide for wiring the RMS proof-of-concept in Expo.

## Project Commands

```bash
# Start Metro bundler
npx expo start

# Launch Android emulator (from Metro prompt)
# press the "a" key once Metro is running

# Lint / formatting
npm run lint
npm run format
```

## Directory Layout

```
src/
  components/
  navigation/
  screens/
  store/
    hooks.js
    index.js
    slices/
  data/
    mock/
      *.json
```

## Key Imports

```js
// Redux store provider
import { Provider } from 'react-redux';
import store from './src/store';

// Mock data usage in slices
import articles from '../data/mock/articles.json';

// Hook helpers (typed wrappers for dispatch/select)
import { useAppDispatch, useAppSelector } from '../store/hooks';
```

## Suggested TypeScript Interfaces

```ts
export interface Article {
  id: number;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  issueId: string;
  themeSlug: string;
  isSubscriberOnly: boolean;
  isFeatured: boolean;
  priority: number;
  duration: number;
  hasAudio: boolean;
  audioUrl: string | null;
  image: string;
  thumbnail: string;
  publishedAt: string;
}

export interface Issue {
  id: string;
  issueNumber: number;
  title: string;
  publishedAt: string;
  year: number;
  month: number;
  coverImage: string;
  articleIds: number[];
}

export interface Theme {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  order: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profession: string;
  subscriptionType: string;
  organization: string;
  favorites: number[];
  readArticles: number[];
  preferences: {
    language: string;
    receiveNewsletter: boolean;
    darkMode: boolean;
    themeOrder: string[];
  };
}
```

## Loading Mock Data

- Import JSON once per slice; Metro automatically inlines the data.
- Use async thunks to simulate network latency and keep components future-proof.
- Memoize selectors for derived views (e.g., featured articles vs. latest issue).

## Navigation IDs

Bottom tab keys match `menus.bottomTabs[*].key` in `appState.json`. Use the same strings when configuring React Navigation to keep docs and UI aligned.

## Styling Tokens

- Base colors in `appState.json > ui`.
- Theme-specific badge colors in `themes.json`.
- Use `StatusBar` style `light` on dark backgrounds defined by the UI config.

For Redux scaffolding, review `REDUX_SETUP.md`.

