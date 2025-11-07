import { configureStore } from '@reduxjs/toolkit';

import articlesReducer from './slices/articlesSlice';
import issuesReducer from './slices/issuesSlice';
import themesReducer from './slices/themesSlice';
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    articles: articlesReducer,
    issues: issuesReducer,
    themes: themesReducer,
    ui: uiReducer,
    user: userReducer,
  },
});

export default store;
export const AppDispatch = store.dispatch;
export const RootState = store.getState;

