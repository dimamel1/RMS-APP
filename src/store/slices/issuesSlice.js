import { createSelector, createSlice } from '@reduxjs/toolkit';

import issuesData from '../../data/mock/issues.json';

const issuesSlice = createSlice({
  name: 'issues',
  initialState: {
    items: issuesData,
  },
  reducers: {},
});

export const selectIssues = (state) => state.issues.items;
export const selectLatestIssue = createSelector(selectIssues, (issues) => issues[0]);
export const selectIssueById = (id) => (state) => state.issues.items.find((issue) => issue.id === id);

export default issuesSlice.reducer;

