/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  ready: false,
  images: [],
};

function readFileLink(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onloadend = () => {
      resolve({ name: file.name, value: fr.result });
    };
    fr.onerror = reject;
    fetch(file.link).then((response) => response.blob()).then((imageBlob) => {
      fr.readAsDataURL(imageBlob);
    });
  });
}

export const fetchImagesAsync = createAsyncThunk(
  'data/fetchAll',
  async () => {
    const files = [
      { link: 'https://pepperish.com.ng/images/png/logo', name: 'logo' },
      { link: 'https://pepperish.com.ng/images/png/favicon', name: 'favicon' },
      { link: 'https://pepperish.com.ng/images/png/plate', name: 'plate' },
      { link: 'https://pepperish.com.ng/images/png/heineken', name: 'heineken' },
      { link: 'https://pepperish.com.ng/images/png/coke', name: 'coke' },
      { link: 'https://pepperish.com.ng/images/png/pepcool', name: 'pepcool' },
      { link: 'https://pepperish.com.ng/images/png/pepchill', name: 'pepchill' },
      { link: 'https://pepperish.com.ng/images/png/phone', name: 'phone' },
      { link: 'https://pepperish.com.ng/images/png/as', name: 'as' },
      { link: 'https://pepperish.com.ng/images/png/as2', name: 'as2' },
      { link: 'https://pepperish.com.ng/images/png/as4', name: 'as4' },
      { link: 'https://pepperish.com.ng/images/png/bag', name: 'bag' },
      { link: 'https://pepperish.com.ng/images/png/paystack', name: 'paystack' },
      { link: 'https://pepperish.com.ng/images/svg/visa', name: 'visa' },
      { link: 'https://pepperish.com.ng/images/svg/verve', name: 'verve' },
      { link: 'https://pepperish.com.ng/images/svg/mastercard', name: 'mastercard' },
      { link: 'https://pepperish.com.ng/images/svg/flutterwave', name: 'flutterwave' },
      { link: 'https://pepperish.com.ng/video/ponmovid', name: 'ponmovid' },
    ];
    const imagesPromises = files.map((file) => readFileLink(file));

    const result = {};
    await Promise.all(imagesPromises).then((data) => {
      data.forEach((entry) => {
        result[entry.name] = entry.value;
      });
    });
    return result;
  },
);

export const imagesSlice = createSlice({
  name: 'images',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchImagesAsync.fulfilled, (state, action) => {
      state.images = action.payload;
      state.ready = true;
    });
  },
});

export const images = (state) => state.images.images;
export const imagesLoaded = (state) => state.images.ready;

export default imagesSlice.reducer;
