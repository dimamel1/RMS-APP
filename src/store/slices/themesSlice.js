import { createSlice } from '@reduxjs/toolkit';

import themesData from '../../data/mock/themes.json';
import userProfile from '../../data/mock/user.json';

const themesSlice = createSlice({
  name: 'themes',
  initialState: {
    items: themesData,
    order: userProfile.preferences.themeOrder ?? themesData.map((theme) => theme.slug),
  },
  reducers: {
    setThemeOrder(state, action) {
      state.order = action.payload;
    },
  },
});

export const { setThemeOrder } = themesSlice.actions;
export const selectThemes = (state) => state.themes.items;
export const selectOrderedThemes = (state) => {
  const slugToTheme = new Map(state.themes.items.map((theme) => [theme.slug, theme]));
  return state.themes.order.map((slug) => slugToTheme.get(slug)).filter(Boolean);
};

export default themesSlice.reducer;

