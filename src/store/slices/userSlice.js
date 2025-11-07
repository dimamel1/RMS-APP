import { createSlice } from '@reduxjs/toolkit';

import profileData from '../../data/mock/user.json';
import subscriptionData from '../../data/mock/subscriptionTypes.json';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: profileData,
    subscriptions: subscriptionData,
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

export const { toggleNewsletter, setDarkMode } = userSlice.actions;

export const selectUserProfile = (state) => state.user.profile;
export const selectUserSubscription = (state) =>
  state.user.subscriptions.find((plan) => plan.id === state.user.profile.subscriptionType);
export const selectSubscriptionPlans = (state) => state.user.subscriptions;

export default userSlice.reducer;

