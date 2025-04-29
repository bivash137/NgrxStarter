import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserState } from '../reducers/user.reducer';

export const selectUserState = createFeatureSelector<UserState>('user');
export const selectUsers = createSelector(selectUserState, (state) => state.users);
/*export const selectUsers = createSelector(
    selectUserState,
    (state: UserState) => Array.isArray(state.users) ? state.users : Object.values(state.users)
  );*/
export const selectLoading = createSelector(selectUserState, (state) => state.loading);
export const selectError = createSelector(selectUserState, (state) => state.error);
  