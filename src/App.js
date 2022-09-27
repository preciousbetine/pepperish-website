import React from 'react';
import { useSelector } from 'react-redux';
import { imagesLoaded } from './redux/imageSlice';

import './css/utilities.css';
import './css/utilities-sm.css';
import './css/animations.css';

function App() {
  const ready = useSelector(imagesLoaded);
  return (
    ready ? (
      <div>
        App
      </div>
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
