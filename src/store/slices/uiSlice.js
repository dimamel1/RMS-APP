import { createSlice } from '@reduxjs/toolkit';

import appState from '../../data/mock/appState.json';
import advertisements from '../../data/mock/advertisements.json';
import infographics from '../../data/mock/infographics.json';
import newsletter from '../../data/mock/newsletter.json';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    featureFlags: appState.featureFlags,
    theme: appState.ui.defaultTheme,
    editorial: appState.editorial,
    menus: appState.menus,
    advertisements,
    infographics,
    newsletter,
  },
  reducers: {
    setUiTheme(state, action) {
      state.theme = action.payload;
    },
  },
});

export const { setUiTheme } = uiSlice.actions;

export const selectUiState = (state) => state.ui;
export const selectEditorial = (state) => state.ui.editorial.current;
export const selectAdvertisements = (state) => state.ui.advertisements;
export const selectNewsletter = (state) => state.ui.newsletter;
export const selectBottomTabs = (state) => state.ui.menus.bottomTabs;
export const selectInfographics = (state) => state.ui.infographics;

export default uiSlice.reducer;

