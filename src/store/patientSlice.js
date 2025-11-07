import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import patientsMock from '../data/mock/patients.json';

export const loadPatients = createAsyncThunk('patients/load', async (_, thunkAPI) => {
  try {
    const storedPatients = await AsyncStorage.getItem('patients');
    if (storedPatients) {
      return JSON.parse(storedPatients);
    }

    await AsyncStorage.setItem('patients', JSON.stringify(patientsMock.patients));
    return patientsMock.patients;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message ?? 'Failed to load patients');
  }
});

const patientSlice = createSlice({
  name: 'patients',
  initialState: {
    items: patientsMock.patients ?? [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setPatients(state, action) {
      state.items = action.payload ?? [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPatients.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadPatients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload ?? [];
      })
      .addCase(loadPatients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error?.message ?? null;
      });
  },
});

export const { setPatients } = patientSlice.actions;

export default patientSlice.reducer;

