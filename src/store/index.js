import { configureStore } from '@reduxjs/toolkit';

import patientsReducer from './patientSlice';

export const store = configureStore({
  reducer: {
    patients: patientsReducer,
  },
});

export default store;

