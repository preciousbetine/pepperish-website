import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import store from './redux/store';
import { setProductAmounts } from './redux/cartSlice';
import App from './App';
import { fetchImagesAsync } from './redux/imageSlice';

store.dispatch(fetchImagesAsync());
const root = ReactDOM.createRoot(document.getElementById('root'));
const product1Amount = Number(localStorage.getItem('product1'));
const product2Amount = Number(localStorage.getItem('product2'));
store.dispatch(setProductAmounts([product1Amount, product2Amount]));

root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
