import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import roleReducer from 'modules/admin/role/redux'
import userReducer from 'modules/admin/user/redux'
import storeReducer from 'modules/organize/store/redux'
import sharedReducer from 'shared/redux'
import categoryReducer from 'modules/organize/category/redux'
import brandReducer from 'modules/organize/brand/redux'
import productReducer from 'modules/organize/product/redux'
import reservationReducer from 'modules/sale/reservation/redux'
import stockReducer from 'modules/sale/stock/redux'

export const store = configureStore({
  reducer: {
    role: roleReducer,
    store: storeReducer,
    product: productReducer,
    category: categoryReducer,
    brand: brandReducer,
    user: userReducer,
    stock: stockReducer,
    reservation: reservationReducer,
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
