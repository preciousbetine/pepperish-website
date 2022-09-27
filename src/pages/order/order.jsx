/* global bootstrap */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { images } from '../../redux/imageSlice';
import {
  product1Amount,
  product2Amount,
  decreaseProduct1Amount,
  increaseProduct1Amount,
  decreaseProduct2Amount,
  increaseProduct2Amount,
} from '../../redux/cartSlice';
import './order.css';

export default function Order() {
  const amount1 = useSelector(product1Amount);
  const amount2 = useSelector(product2Amount);
  const item = useLocation().pathname.split('/')[2];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pictures = useSelector(images);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 250);
  }, []);

  return (
    <div id="orderPage" className="width-100">
      <div className="w-100 toast-container text-center position-fixed bottom-0 p-3 d-flex justify-content-center toast-sm">
        <div
          id="emptyCartToast"
          className="toast m-0 width-max-content bg-none border-0"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="font-size-7-sm toast-body d-flex align-items-center bg-yellow font-size-3 color-black fw-bold w-100 p-3 ">
            Your cart is empty!
          </div>
        </div>
      </div>
      <header className="z-index-11 bg-white padding-style-1-sm align-items-center-sm width-100 d-flex justify-content-between flex-style-0 align-items-start padding-style-10 border-pack-2 border-none-sm position-sticky-sm top-0">
        <LinkContainer to="/">
          <div className="d-flex cursor-pointer">
            <img
              alt=""
              className="height-9vw-sm width-auto height-5"
              src={pictures.favicon}
            />
            <img
              alt=""
              className="height-9vw-sm margin-left-1-sm width-auto height-5 margin-left-1"
              src={pictures.logo}
            />
          </div>
        </LinkContainer>
        <div className="d-flex align-items-center">
          <button
            type="button"
            className="btn border-0"
            onClick={() => {
              if (amount1 + amount2 === 0) {
                const toast = new bootstrap.Toast(document.getElementById('emptyCartToast'));
                toast.show();
              } else {
                navigate('/checkout');
              }
            }}
          >
            <span
              className="width-10vw-sm height-10vw-sm position-relative rounded-circle d-flex align-items-center justify-content-center padding-0 width-3 height-6 fw-bold bg-light-gray-on-hover"
              role="button"
              title="Go to cart"
            >
              <svg className="height-30p-sm width-30p-sm height-4 width-2" viewBox="0 0 500 500">
                <g>
                  <path fill="#a98165" d="m464.5,301.1l36.5-178h-359.7l-12.5-59.2-108.4-52.9-9.4,18.7 99,47.8 50,238.8h289c0,0 28.5,17.9 17.5,40.5-4.9,7-12.5,15.6-26.1,15.6h-287.6v20.6h287.7c19.8,0 36.5-10.4 45.9-27 18.4-34.4-21.9-64.9-21.9-64.9zm-286.7-5.7l-32.3-151.6h330.5l-31.3,151.6h-266.9z" />
                  <path fill="#a98165" d="m212.2,422.1c-21.9,0-39.6,17.6-39.6,39.4s17.7,39.4 39.6,39.4 39.6-17.6 39.6-39.4-17.7-39.4-39.6-39.4zm0,58.1c-10.4,0-18.8-8.3-18.8-18.7s8.3-18.7 18.8-18.7 18.8,8.3 18.8,18.7-8.4,18.7-18.8,18.7z" />
                  <path fill="#a98165" d="m424.9,422.1c-21.9,0-39.6,17.6-39.6,39.4s17.7,39.5 39.6,39.5 40.7-17.6 39.6-39.4c0-21.8-17.7-39.5-39.6-39.5zm18.8,39.5c0,10.4-8.3,18.7-18.8,18.7s-18.8-8.3-18.8-18.7 8.3-18.7 18.8-18.7 19.8,8.3 18.8,18.7z" />
                </g>
              </svg>
              <span className="height-5vw-sm width-5vw-sm font-size-3-sm padding-style-7-sm position-absolute top-0 right-0 bg-red width-1 height-1 font-size-1 padding-style-3 color-white d-flex justify-content-center align-items-center rounded-circle">
                {amount1 + amount2}
              </span>
            </span>
          </button>
        </div>
      </header>
      <main className="height-max-content-sm flex-column-sm d-flex height100-10 font-sora overflow-y-auto">
        <div className="padding-style-3-sm height-max-content-sm width-100-sm width-50vw height-100 bg-yellow d-flex flex-column align-items-center justify-content-center padding-style-10 position-relative">
          {
            item === '1' ? (
              <>
                <h2 className="font-size-12-sm fw-600 color-dark-brown mb-1 font-size-5">Pepcool</h2>
                <div className="width-100vw-sm height-50vw-sm width-60 height-15 d-flex justify-content-center align-items-center">
                  <img
                    alt=""
                    className="width-100 height-auto order-page-image"
                    src={pictures.pepcool}
                  />
                </div>
                <span className="margin-top-6 d-flex z-index-11">
                  <button type="button" className="font-size-4-sm height-12vw-sm width-15vw-sm border-width-2 border-solid border-color-yellow width-7 bg-red color-white height-12 font-size-6 fw-bold rounded-left-2">
                    <i className="fa fa-naira-sign me-1" />
                    1500
                    <br />
                    per pack
                  </button>
                  <button type="button" className="font-size-9-sm height-12vw-sm width-15vw-sm border-width-2 border-solid border-color-yellow width-7 bg-red color-white height-12 font-size-4 fw-bold btn-change-quantity" onClick={() => { dispatch(decreaseProduct1Amount()); }}>-</button>
                  <button type="button" className="font-size-9-sm height-12vw-sm width-15vw-sm border-width-2 border-solid border-color-yellow width-7 bg-red color-white height-12 font-size-4 fw-bold">{amount1}</button>
                  <button type="button" className="font-size-9-sm height-12vw-sm width-15vw-sm border-width-2 border-solid border-color-yellow width-7 bg-red color-white height-12 font-size-4 fw-bold btn-change-quantity" onClick={() => { dispatch(increaseProduct1Amount()); }}>+</button>
                  <button
                    type="button"
                    className="font-size-5-sm height-12vw-sm width-15vw-sm border-width-2 border-solid border-color-yellow width-7 bg-red color-white height-12 font-size-4 fw-bold rounded-right-2 btn-cart"
                    onClick={() => {
                      if (amount1 + amount2 === 0) {
                        const toast = new bootstrap.Toast(document.getElementById('emptyCartToast'));
                        toast.show();
                      } else {
                        navigate('/checkout');
                      }
                    }}
                  >
                    <svg className="height-7vw-sm width-7vw-sm height-3 width-2" viewBox="0 0 500 500">
                      <g>
                        <path fill="white" d="m464.5,301.1l36.5-178h-359.7l-12.5-59.2-108.4-52.9-9.4,18.7 99,47.8 50,238.8h289c0,0 28.5,17.9 17.5,40.5-4.9,7-12.5,15.6-26.1,15.6h-287.6v20.6h287.7c19.8,0 36.5-10.4 45.9-27 18.4-34.4-21.9-64.9-21.9-64.9zm-286.7-5.7l-32.3-151.6h330.5l-31.3,151.6h-266.9z" />
                        <path fill="white" d="m212.2,422.1c-21.9,0-39.6,17.6-39.6,39.4s17.7,39.4 39.6,39.4 39.6-17.6 39.6-39.4-17.7-39.4-39.6-39.4zm0,58.1c-10.4,0-18.8-8.3-18.8-18.7s8.3-18.7 18.8-18.7 18.8,8.3 18.8,18.7-8.4,18.7-18.8,18.7z" />
                        <path fill="white" d="m424.9,422.1c-21.9,0-39.6,17.6-39.6,39.4s17.7,39.5 39.6,39.5 40.7-17.6 39.6-39.4c0-21.8-17.7-39.5-39.6-39.5zm18.8,39.5c0,10.4-8.3,18.7-18.8,18.7s-18.8-8.3-18.8-18.7 8.3-18.7 18.8-18.7 19.8,8.3 18.8,18.7z" />
                      </g>
                    </svg>
                  </button>
                </span>
                <LinkContainer to="/order/2">
                  <button
                    type="button"
                    className="d-flex-sm align-items-center justify-content-center font-size-7-sm height-17vw-sm width-10vw-sm d-none border-0  top-50 translateYMInus50 bg-browner btn-change-product position-absolute right-0"
                  >
                    <i className="fa fa-arrow-right" />
                  </button>
                </LinkContainer>
              </>
            ) : (
              <>
                <LinkContainer to="/order/1">
                  <button
                    type="button"
                    className="z-index-11 d-flex-sm align-items-center justify-content-center font-size-7-sm height-17vw-sm width-10vw-sm d-none border-0  top-50 translateYMInus50 bg-browner btn-change-product position-absolute left-0"
                  >
                    <i className="fa fa-arrow-left" />
                  </button>
                </LinkContainer>
                <h2 className="font-size-12-sm fw-600 color-dark-brown mb-1 font-size-5">Pepchill</h2>
                <div className="width-100vw-sm height-50vw-sm width-60 height-15 d-flex justify-content-center align-items-center">
                  <img
                    alt=""
                    className="width-100 height-auto order-page-image"
                    src={pictures.pepchill}
                  />
                </div>
                <span className="margin-top-6 d-flex z-index-11">
                  <button type="button" className="font-size-4-sm height-12vw-sm width-15vw-sm width-12vw-sm border-width-2 border-solid border-color-yellow width-7 bg-red color-white height-12 font-size-6 fw-bold rounded-left-2">
                    <i className="fa fa-naira-sign me-1" />
                    2000
                    <br />
                    per pack
                  </button>
                  <button type="button" className="font-size-9-sm height-12vw-sm width-15vw-sm border-width-2 border-solid border-color-yellow width-7 bg-red color-white height-12 font-size-4 fw-bold btn-change-quantity" onClick={() => { dispatch(decreaseProduct2Amount()); }}>-</button>
                  <button type="button" className="font-size-9-sm height-12vw-sm width-15vw-sm border-width-2 border-solid border-color-yellow width-7 bg-red color-white height-12 font-size-4 fw-bold">{amount2}</button>
                  <button type="button" className="font-size-9-sm height-12vw-sm width-15vw-sm border-width-2 border-solid border-color-yellow width-7 bg-red color-white height-12 font-size-4 fw-bold btn-change-quantity" onClick={() => { dispatch(increaseProduct2Amount()); }}>+</button>
                  <button
                    type="button"
                    className="font-size-5-sm height-12vw-sm width-15vw-sm border-width-2 border-solid border-color-yellow width-7 bg-red color-white height-12 font-size-4 fw-bold rounded-right-2 btn-cart"
                    onClick={() => {
                      if (amount1 + amount2 === 0) {
                        const toast = new bootstrap.Toast(document.getElementById('emptyCartToast'));
                        toast.show();
                      } else {
                        navigate('/checkout');
                      }
                    }}
                  >
                    <svg className="height-7vw-sm width-7vw-sm height-3 width-2" viewBox="0 0 500 500">
                      <g>
                        <path fill="white" d="m464.5,301.1l36.5-178h-359.7l-12.5-59.2-108.4-52.9-9.4,18.7 99,47.8 50,238.8h289c0,0 28.5,17.9 17.5,40.5-4.9,7-12.5,15.6-26.1,15.6h-287.6v20.6h287.7c19.8,0 36.5-10.4 45.9-27 18.4-34.4-21.9-64.9-21.9-64.9zm-286.7-5.7l-32.3-151.6h330.5l-31.3,151.6h-266.9z" />
                        <path fill="white" d="m212.2,422.1c-21.9,0-39.6,17.6-39.6,39.4s17.7,39.4 39.6,39.4 39.6-17.6 39.6-39.4-17.7-39.4-39.6-39.4zm0,58.1c-10.4,0-18.8-8.3-18.8-18.7s8.3-18.7 18.8-18.7 18.8,8.3 18.8,18.7-8.4,18.7-18.8,18.7z" />
                        <path fill="white" d="m424.9,422.1c-21.9,0-39.6,17.6-39.6,39.4s17.7,39.5 39.6,39.5 40.7-17.6 39.6-39.4c0-21.8-17.7-39.5-39.6-39.5zm18.8,39.5c0,10.4-8.3,18.7-18.8,18.7s-18.8-8.3-18.8-18.7 8.3-18.7 18.8-18.7 19.8,8.3 18.8,18.7z" />
                      </g>
                    </svg>
                  </button>
                </span>
              </>
            )
          }
        </div>
        <div className="height-max-content-sm width-100-sm fw-bold width-50vw height-100 bg-light-brown position-relative">
          <div className="d-none-sm width-5vw translateXMinus50 position-absolute height-100 d-flex flex-column align-items-center justify-content-center">
            <LinkContainer to="/order/1">
              <button type="button" className="rounded-top-1 padding-style-5 outline-0 border-width-0 bg-browner btn-change-product">
                <i className="fa fa-arrow-up font-size-3" />
              </button>
            </LinkContainer>
            <LinkContainer to="/order/2">
              <button type="button" className="rounded-bottom-1 padding-style-5 outline-0 border-width-0 bg-browner btn-change-product">
                <i className="fa fa-arrow-down font-size-3" />
              </button>
            </LinkContainer>
          </div>
          <div className="padding-style-12-sm padding-style-15 d-flex flex-column">
            <h2 className="font-size-8-sm fw-600 color-dark-brown font-size-5">Content</h2>
            <div className="padding-0-sm padding-style-22 d-flex flex-column">
              <div className="width-3vw-sm height-50vw-sm d-flex height-11 align-items-center position-relative">
                <div className="width-50vw-sm width-10vw ">
                  <img
                    alt=""
                    className="width-50vw-sm width-100 height-auto rotate-5deg"
                    src={pictures.plate}
                  />
                </div>
                <div className="width-3vw-sm left-46vw-sm d-flex flex-column align-items-center width-1 position-absolute translateYPlus45 left-11vw height-110">
                  <span className="height-3vw-sm width-100-sm width-1 height-1 rounded-circle bg-browner" />
                  <span className="width-20 height-90 bg-browner" />
                  <span className="height-3vw-sm width-100-sm width-1 height-1 rounded-circle bg-browner" />
                </div>
                <span className="font-size-8-sm padding-style-23 fw-normal font-size-3">One plate of ponmo</span>
              </div>
              <div className="height-50vw-sm d-flex height-11 align-items-center position-relative">
                {
                  item === '1' ? (
                    <div className="width-50vw-sm width-10vw ">
                      <img
                        alt=""
                        className="width-50vw-sm width-100 height-auto rotate-356deg"
                        src={pictures.coke}
                      />
                    </div>
                  ) : null
                }
                {
                  item === '2' ? (
                    <div className="width-50vw-sm width-10vw ">
                      <img
                        alt=""
                        className="width-50vw-sm width-100 height-auto"
                        src={pictures.heineken}
                      />
                    </div>
                  ) : null
                }
                {
                  item === '1' ? (
                    <span className="font-size-8-sm padding-style-23 fw-normal font-size-3">One can of coke</span>
                  ) : null
                }
                {
                  item === '2' ? (
                    <span className="font-size-8-sm padding-style-23 fw-normal font-size-3">Two cans of heineken</span>
                  ) : null
                }
              </div>
            </div>
          </div>
          <div className="width-auto-sm padding-style-2-sm position-relative-sm d-flex justify-content-between align-items-center margin-type-2 border-pack-5 padding-style-9 position-absolute bottom-10 width-90">
            <span className="font-size-7-sm font-size-2">Done selecting your package ?</span>
            <button
              type="button"
              className="padding-style-8-sm font-size-7-sm font-size-2 btn bg-red color-white padding-style-13 rounded-pill"
              onClick={() => {
                if (amount1 + amount2 === 0) {
                  const toast = new bootstrap.Toast(document.getElementById('emptyCartToast'));
                  toast.show();
                } else {
                  navigate('/checkout');
                }
              }}
            >
              Checkout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
