import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import imagesReducer from './imageSlice';

export default configureStore({
  reducer: {
    cart: cartReducer,
    images: imagesReducer,
  },
});
