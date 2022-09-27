/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  PRODUCT1: 0,
  PRODUCT2: 0,
  PRICE1: 1500,
  PRICE2: 2000,
  transactionRef: null,
  transactionErrorMessage: '',
  transactionError: true,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setProductAmounts: (state, action) => {
      const { payload } = action;
      const [product1, product2] = payload;
      state.PRODUCT1 = product1;
      state.PRODUCT2 = product2;
      localStorage.setItem('product1', state.PRODUCT1);
      localStorage.setItem('product2', state.PRODUCT2);
    },
    increaseProduct1Amount: (state) => {
      state.PRODUCT1 += 1;
      localStorage.setItem('product1', state.PRODUCT1);
    },
    decreaseProduct1Amount: (state) => {
      if (state.PRODUCT1 > 0) state.PRODUCT1 -= 1;
      localStorage.setItem('product1', state.PRODUCT1);
    },
    increaseProduct2Amount: (state) => {
      state.PRODUCT2 += 1;
      localStorage.setItem('product2', state.PRODUCT2);
    },
    decreaseProduct2Amount: (state) => {
      if (state.PRODUCT2 > 0) state.PRODUCT2 -= 1;
      localStorage.setItem('product2', state.PRODUCT2);
    },
    setTransactionRef: (state, action) => {
      const { payload } = action;
      state.transactionRef = payload;
    },
    setTransactionError: (state, action) => {
      const { payload } = action;
      state.transactionError = payload;
    },
    setTransactionErrorMessage: (state, action) => {
      const { payload } = action;
      state.transactionErrorMessage = payload;
    },
  },
});

export const product1Amount = (state) => state.cart.PRODUCT1;
export const product2Amount = (state) => state.cart.PRODUCT2;
export const PRICE1 = (state) => state.cart.PRICE1;
export const PRICE2 = (state) => state.cart.PRICE2;
export const transactionRef = (state) => state.cart.transactionRef;
export const transactionError = (state) => state.cart.transactionError;
export const transactionErrorMessage = (state) => state.cart.transactionErrorMessage;

export const {
  setProductAmounts,
  increaseProduct1Amount,
  decreaseProduct1Amount,
  increaseProduct2Amount,
  decreaseProduct2Amount,
  setTransactionRef,
  setTransactionError,
  setTransactionErrorMessage,
} = cartSlice.actions;

export default cartSlice.reducer;
