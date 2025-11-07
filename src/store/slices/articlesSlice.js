import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';

import articlesData from '../../data/mock/articles.json';
import userProfile from '../../data/mock/user.json';

const simulateNetworkDelay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 150));

export const fetchArticles = createAsyncThunk('articles/fetchAll', async () => simulateNetworkDelay(articlesData));

const initialState = {
  items: articlesData,
  favorites: userProfile.favorites,
  read: userProfile.readArticles,
  status: 'idle',
  error: null,
};

const articlesSlice = createSlice({
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
        state.error = null;
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

export const { toggleFavorite, markAsRead } = articlesSlice.actions;

export const selectArticlesState = (state) => state.articles;
export const selectArticles = (state) => state.articles.items;
export const selectArticleById = (id) => (state) => state.articles.items.find((article) => article.id === id);

export const selectFeaturedArticles = createSelector(selectArticles, (items) =>
  items
    .filter((item) => item.isFeatured)
    .slice()
    .sort((a, b) => a.priority - b.priority)
);

export const selectFavorites = (state) =>
  state.articles.items.filter((article) => state.articles.favorites.includes(article.id));

export const selectLatestArticles = createSelector(selectArticles, (items) =>
  items
    .slice()
    .sort((a, b) => new Date(b.publishedAt).valueOf() - new Date(a.publishedAt).valueOf())
);

export default articlesSlice.reducer;

