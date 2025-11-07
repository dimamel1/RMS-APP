# RMS App POC – Redux Setup

The Redux Toolkit store centralizes RMS domain state (articles, issues, themes, user, UI). This document contains ready-to-use templates for the slices used in the proof-of-concept.

## 1. Store Bootstrap (`src/store/index.js`)

```js
import { configureStore } from '@reduxjs/toolkit';

import articlesReducer from './slices/articlesSlice';
import issuesReducer from './slices/issuesSlice';
import themesReducer from './slices/themesSlice';
import userReducer from './slices/userSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    articles: articlesReducer,
    issues: issuesReducer,
    themes: themesReducer,
    user: userReducer,
    ui: uiReducer,
  },
});

export default store;
export const AppDispatch = store.dispatch;
export const RootState = store.getState;
```

## 2. Hooks (`src/store/hooks.js`)

```js
import { useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
```

## 3. Articles Slice (`src/store/slices/articlesSlice.js`)

```js
import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit';

import articles from '../../data/mock/articles.json';
import user from '../../data/mock/user.json';

const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 150));

export const fetchArticles = createAsyncThunk('articles/fetchAll', async () => delay(articles));

const initialState = {
  items: articles,
  favorites: user.favorites,
  read: user.readArticles,
  status: 'idle',
  error: null,
};

const slice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    toggleFavorite(state, action) {
      const id = action.payload;
      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter((fav) => fav !== id);
      } else {
        state.favorites.push(id);
      }
    },
    markAsRead(state, action) {
      const id = action.payload;
      if (!state.read.includes(id)) {
        state.read.push(id);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { toggleFavorite, markAsRead } = slice.actions;

export const selectAllArticles = (state) => state.articles.items;
export const selectFeaturedArticles = createSelector(selectAllArticles, (items) =>
  items.filter((item) => item.isFeatured).sort((a, b) => a.priority - b.priority)
);
export const selectMySelection = (state) =>
  state.articles.items.filter((item) => state.articles.favorites.includes(item.id));

export default slice.reducer;
```

## 4. Issues Slice (`src/store/slices/issuesSlice.js`)

```js
import { createSlice } from '@reduxjs/toolkit';

import issues from '../../data/mock/issues.json';

const slice = createSlice({
  name: 'issues',
  initialState: {
    items: issues,
  },
  reducers: {},
});

export const selectLatestIssue = (state) => state.issues.items[0];
export const selectIssues = (state) => state.issues.items;

export default slice.reducer;
```

## 5. Themes Slice (`src/store/slices/themesSlice.js`)

```js
import { createSlice } from '@reduxjs/toolkit';

import themes from '../../data/mock/themes.json';
import appState from '../../data/mock/appState.json';

const slice = createSlice({
  name: 'themes',
  initialState: {
    items: themes,
    order: appState.editorial ? appState.editorial.themeOrder ?? [] : [],
  },
  reducers: {
    reorderThemes(state, action) {
      state.order = action.payload;
    },
  },
});

export const { reorderThemes } = slice.actions;
export const selectThemes = (state) => state.themes.items;

export default slice.reducer;
```

## 6. User Slice (`src/store/slices/userSlice.js`)

```js
import { createSlice } from '@reduxjs/toolkit';

import profile from '../../data/mock/user.json';
import subscriptionTypes from '../../data/mock/subscriptionTypes.json';

const slice = createSlice({
  name: 'user',
  initialState: {
    profile,
    subscriptions: subscriptionTypes,
  },
  reducers: {
    toggleNewsletter(state) {
      state.profile.preferences.receiveNewsletter = !state.profile.preferences.receiveNewsletter;
    },
    setDarkMode(state, action) {
      state.profile.preferences.darkMode = action.payload;
    },
  },
});

export const { toggleNewsletter, setDarkMode } = slice.actions;
export const selectUser = (state) => state.user.profile;
export const selectActiveSubscription = (state) =>
  state.user.subscriptions.find((plan) => plan.id === state.user.profile.subscriptionType);

export default slice.reducer;
```

## 7. UI Slice (`src/store/slices/uiSlice.js`)

```js
import { createSlice } from '@reduxjs/toolkit';

import appState from '../../data/mock/appState.json';
import advertisements from '../../data/mock/advertisements.json';
import newsletter from '../../data/mock/newsletter.json';

const slice = createSlice({
  name: 'ui',
  initialState: {
    featureFlags: appState.featureFlags,
    theme: appState.ui.defaultTheme,
    editorial: appState.editorial,
    menus: appState.menus,
    advertisements,
    newsletter,
  },
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = slice.actions;
export const selectUi = (state) => state.ui;

export default slice.reducer;
```

> ⚠️ Reminder: if you migrate the project to TypeScript, rename files to `.ts`/`.tsx` and replace default exports with typed equivalents.

With the slices in place, wrap `App` in `<Provider store={store}>` and use the `useAppSelector`/`useAppDispatch` helpers throughout screens.

