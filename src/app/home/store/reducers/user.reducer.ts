import { createReducer, on } from '@ngrx/store';
import * as UserActions from '../actions/user.actions';
import { User } from '../models/user.model';

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const userReducer = createReducer(
  initialState,
  // Load Users
  on(UserActions.loadUsers, state => ({ ...state, loading: true, error: null })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({ ...state, users, loading: false })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // Update Entire User
  on(UserActions.updateUser, state => ({ ...state, loading: true })),
  on(UserActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map(u => (u.id === user.id ? user : u)),
    loading: false
  })),
  on(UserActions.updateUserFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // Partially Update User
  on(UserActions.patchUser, state => ({ ...state, loading: true })),
  on(UserActions.patchUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map(u => (u.id === user.id ? user : u)),
    loading: false
  })),
  on(UserActions.patchUserFailure, (state, { error }) => ({ ...state, error, loading: false }))
);
