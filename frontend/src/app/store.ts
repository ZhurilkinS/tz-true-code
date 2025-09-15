import { configureStore } from "@reduxjs/toolkit";
import productsSlice from "../entities/Products/model/productsSlice";

export const store = configureStore({
  reducer: {
    products: productsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
