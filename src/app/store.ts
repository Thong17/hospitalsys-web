import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import roleReducer from 'modules/admin/role/redux'
import userReducer from 'modules/admin/user/redux'
import sharedReducer from 'shared/redux'

export const store = configureStore({
  reducer: {
    role: roleReducer,
    user: userReducer,
    shared: sharedReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
