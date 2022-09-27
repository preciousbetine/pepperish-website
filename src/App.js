import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useSelector } from 'react-redux';

import './css/utilities.css';
import './css/utilities-sm.css';
import './css/animations.css';

import Order from './pages/order/order';
import HomePage from './pages/homepage/HomePage';
import Checkout from './pages/checkout/checkout';

import { imagesLoaded } from './redux/imageSlice';

function App() {
  const ready = useSelector(imagesLoaded);
  return (
    ready ? (
      <Router>
        <Routes>
          <Route path="/checkout" element={<Checkout />} loading />
          <Route path="/order/*" element={<Order />} loading />
          <Route path="/" element={<HomePage />} loading />
          <Route path="/*" element={<Navigate replace to="/" />} loading />
        </Routes>
      </Router>
    ) : (
      <div className="width-100vw height-100vh d-flex justify-content-center align-items-center">
        <div className="lds-ellipsis">
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    )
  );
}

export default App;
