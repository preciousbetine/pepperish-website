/* global bootstrap */
import React, { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  product1Amount,
  product2Amount,
  PRICE1,
  PRICE2,
  decreaseProduct2Amount,
  increaseProduct2Amount,
  decreaseProduct1Amount,
  increaseProduct1Amount,
} from '../../redux/cartSlice';
import swipeDetect from './swipe';
import './HomePage.css';
import { images } from '../../redux/imageSlice';

function App(props) {
  const price1 = useSelector(PRICE1);
  const price2 = useSelector(PRICE2);
  const amount1 = useSelector(product1Amount);
  const amount2 = useSelector(product2Amount);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const media = useSelector(images);

  const [currentProduct, setCurrentProduct] = useState(1);

  useEffect(
    () => {
      // Check for influencers' code
      const { link } = props;
      if (link) {
        const referralCode = location.pathname.split('/')[2];
        localStorage.setItem('influencerCode', referralCode);
      }

      const faders = document.querySelectorAll('.fade-in');
      const quickFaders = document.querySelectorAll('.fade-in-quick');
      const sliders = document.querySelectorAll('.slide-in');

      const appearOnScroll = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('appear');
          appearOnScroll.unobserve(entry.target);
        });
      }, {
        threshold: 0,
        rootMargin: '0px 0px -100px 0px',
      });

      faders.forEach((fader) => {
        appearOnScroll.observe(fader);
      });
      quickFaders.forEach((fader) => {
        appearOnScroll.observe(fader);
      });
      sliders.forEach((slider) => {
        appearOnScroll.observe(slider);
      });

      const header = document.querySelector('header');
      const topSection = document.getElementById('topSection');
      const resizeHeader = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            header.classList.remove('padding-style-1');
            header.classList.add('padding-style-33');
          } else {
            header.classList.add('padding-style-1');
            header.classList.remove('padding-style-33');
          }
        });
      }, {
        threshold: 0,
        rootMargin: '0px 0px 100px 0px',
      });
      resizeHeader.observe(topSection);

      const product1 = document.getElementById('product1Imgsm');
      swipeDetect(product1, (swipeDir) => {
        if (swipeDir === 'left') {
          product1.classList.add('swipe-left');
          setTimeout(() => {
            setCurrentProduct(2);
            product1.classList.remove('swipe-left');
          }, 250);
        } else if (swipeDir === 'right') {
          product1.classList.add('swipe-right');
          setTimeout(() => {
            setCurrentProduct(2);
            product1.classList.remove('swipe-right');
          }, 250);
        }
      });

      const product2 = document.getElementById('product2Imgsm');
      swipeDetect(product2, (swipeDir) => {
        if (swipeDir === 'right') {
          product2.classList.add('swipe-right');
          setTimeout(() => {
            setCurrentProduct(1);
            product2.classList.remove('swipe-right');
          }, 250);
        } else if (swipeDir === 'left') {
          product2.classList.add('swipe-left');
          setTimeout(() => {
            setCurrentProduct(1);
            product2.classList.remove('swipe-left');
          }, 250);
        }
      });
    },
    [],
  );

  return (
    <div className="width-100">
      <div className="w-100 toast-container text-center position-fixed bottom-0 p-3 d-flex justify-content-center toast-sm">
        <div
          id="emptyCartToast"
          className="width-100-sm toast m-0 width-max-content bg-none border-0"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="font-size-7-sm toast-body d-flex align-items-center justify-content-center bg-red font-size-3 color-white fw-bold w-100 p-3 rounded-2">
            Please add items to cart!
          </div>
        </div>
      </div>
      <header className="z-index-12 bg-white2 padding-style-1-sm align-items-center-sm width-100 d-flex justify-content-between flex-style-0 align-items-start padding-style-1 position-sticky top-0">
        <div className="d-flex cursor-pointer">
          <img
            alt=""
            className="height-9vw-sm width-auto height-5"
            src={media.favicon}
          />
          <img
            alt=""
            className="height-9vw-sm margin-left-1-sm width-auto height-5 margin-left-1"
            src={media.logo}
          />
        </div>
        <div className="d-flex align-items-center">
          <button
            className="btn d-flex border-0 rounded-circle"
            type="button"
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
              className="width-10vw-sm height-10vw-sm position-relative d-flex align-items-center justify-content-center padding-0 width-3 height-6 fw-bold rounded-circle bg-light-gray-on-hover"
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
      <section id="topSection" className="min-height-max-content-sm height-max-content-sm min-height-906vh height-max-content d-flex flex-column">
        <section className="bg-white2 padding-0-sm justify-content-center-sm height-70vh-sm d-flex padding-style-26 flex-style-1">
          <div className="font-size-2-sm flex-column-sm align-items-center-sm text-align-center-sm fade-in-quick padding-0 flex-style-2 font-lexenddeca font-size-7 line-height-1 d-flex flex-column justify-content-center align-items-start">
            <div className="margin-bottom-2-sm text-center-sm fw-bolder">
              <h1 className="d-block-sm d-none font-gilroy font-size-14-sm letter-spacing-0 line-height-3 font-size-7">
                Peppery and tasty
                <br />
                ponmo delivered to you.
                <br />
                Fast delivery.
              </h1>
              <h1 className="d-none-sm font-gilroy font-size-2-sm letter-spacing-0 line-height-3 font-size-7">
                Peppery and tasty
                <br />
                ponmo delivered to you.
                <br />
                Fast delivery.
              </h1>
              <p className="margin-top-1-sm font-size-7-sm text-center-sm text-muted margin-top-1 font-size-2 fw-normal">
                Our peppered ponmo comes with a
                <br />
                can of coke or two cans of heineken,
                <br />
                you choose.
              </p>
            </div>
            <button
              type="button"
              id="orderButton"
              className="font-size-7-sm rounded-1-sm margin-top-1-sm padding-style-14-sm bg-red color-white border-width-0 outline-0 rounded-1 font-size-2 margin-top-1 margin-bottom-1 padding-style-25 d-flex align-items-center"
              onClick={() => {
                navigate('/order/1');
              }}
            >
              Order now
              <i className="fa fa-arrow-right margin-left-1-sm font-size-4-sm margin-left-1 font-size-6" />
            </button>
            <p className="font-size-1-sm margin-top-2-sm padding-style-2-sm border-pack-1-sm margin-top-1 color-black font-size-6 text-left padding-style-9 border-pack-1">
              <i className="fa-solid fa-star margin-right-2 color-light-brown" />
              Delivery is from 11am to 6pm everyday
              <br />
              <i className="fa-solid fa-star me-2 margin-right-2 color-light-brown" />
              Available only in Alimosho and Ikeja.
            </p>
          </div>
          <div className="d-none-sm flex-style-1 d-flex justify-content-end align-items-center">
            <video className="width-9 height-16" muted autoPlay loop>
              <source src={media.ponmovid} type="video/mp4" />
              <track kind="captions" />
            </video>
          </div>
        </section>
        <div className="d-block-sm margin-1-sm width-90vw-sm height-auto-sm d-none">
          <video className="width-100-sm" muted autoPlay loop>
            <source src={media.ponmovid} type="video/mp4" />
            <track kind="captions" />
          </video>
        </div>
      </section>
      <main>
        <section className="height-max-content-sm min-height-max-content-sm padding-style-3-sm position-relative height-max-content bg-light-brown min-height-100vh width-100 d-flex flex-column justify-content-center padding-style-29">
          <div className="margin-3-sm d-flex align-items-baseline z-index-11">
            <h1 className="margin-left-0-sm font-size-10-sm font-gilroy font-size-5 color-white">
              <span className="color-black">Pick your</span>
              <img
                alt=""
                className="margin-type-1-sm height-12vw-sm width-auto height-6 margin-type-0"
                src={media.logo}
              />
            </h1>
            <div className="height-2 ms-2 flex-style-1 bg-black d-none-sm" />
          </div>
          <div className="d-none-sm d-flex justify-content-between margin-top-2">
            <div id="product1" className="box-shadow-style-1 rounded-4 bg-white margin-right-3 flex-style-3 height-max-content width-50 d-flex flex-column justify-content-center align-items-center cursor-pointer rounded-4">
              <LinkContainer to="/order/1">
                <div className="product-image-container width-100 height-8 d-flex justify-content-center align-items-center rounded-4">
                  <img
                    alt=""
                    className="product-img width-100 height-100 image-cover border-pack-8 rounded-4 rounded-bottom-0"
                    src={media.pepcool}
                  />
                </div>
              </LinkContainer>
              <div className="width-100 padding-style-31 d-flex justify-content-between">
                <div className="d-flex flex-column justify-content-between gap-1">
                  <h2 className="font-size-11 font-gilroy ">Pepcool</h2>
                  <div className="font-size-2 font-lexenddeca ">
                    A plate of ponmo and a
                    <br />
                    can of coke
                  </div>
                </div>
                <div className="font-size-2 d-flex flex-column align-items-end justify-content-between gap-1">
                  <div className="font-size-3 fw-bold">
                    <i className="fa fa-naira-sign" />
                    {price1}
                  </div>
                  <div>
                    <p className="text-end">Add to cart</p>
                    <span className="margin-top-5">
                      <button type="button" className="bg-red color-white product-control border-width-2 border-solid border-color-white width-2 height-3 font-size-6 fw-bold rounded-left-1" onClick={() => { dispatch(decreaseProduct1Amount()); }}>-</button>
                      <button type="button" className="border-width-2 border-solid border-color-white width-2 height-3 font-size-6 fw-bold bg-red color-white">{amount1}</button>
                      <button type="button" className="bg-red color-white product-control border-width-2 border-color-white border-solid width-2 height-3 font-size-6 fw-bold rounded-right-1" onClick={() => { dispatch(increaseProduct1Amount()); }}>+</button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div id="product2" className="flex-none-sm width-90-sm bg-white box-shadow-style-1 flex-style-3 height-max-content width-50 d-flex flex-column justify-content-center align-items-center cursor-pointer rounded-4">
              <LinkContainer to="/order/2">
                <div className="product-image-container width-100 height-8 d-flex justify-content-center align-items-center rounded-4">
                  <img
                    alt=""
                    className="product-img width-100 height-100 image-cover border-pack-8 rounded-4 rounded-bottom-0"
                    src={media.pepchill}
                  />
                </div>
              </LinkContainer>
              <div className="width-100 padding-style-31 d-flex justify-content-between">
                <div className="d-flex flex-column justify-content-between gap-1">
                  <h2 className="font-size-11 font-gilroy ">Pepchill</h2>
                  <div className="font-size-2 font-lexenddeca ">
                    A plate of ponmo and two
                    <br />
                    cans of heineken
                  </div>
                </div>
                <div className="font-size-2 d-flex flex-column align-items-end justify-content-between gap-1">
                  <div className="font-size-3 fw-bold">
                    <i className="fa fa-naira-sign" />
                    {price2}
                  </div>
                  <div>
                    <p className="text-end">Add to cart</p>
                    <span className="margin-top-5">
                      <button type="button" className="bg-red color-white product-control border-width-2 border-solid border-color-white width-2 height-3 font-size-6 fw-bold rounded-left-1" onClick={() => { dispatch(decreaseProduct2Amount()); }}>-</button>
                      <button type="button" className="border-width-2 border-solid border-color-white width-2 height-3 font-size-6 fw-bold bg-red color-white">{amount2}</button>
                      <button type="button" className="bg-red color-white product-control border-width-2 border-color-white border-solid width-2 height-3 font-size-6 fw-bold rounded-right-1" onClick={() => { dispatch(increaseProduct2Amount()); }}>+</button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-block-sm d-none margin-top-1 height-130vw-sm position-relative">
            <div
              className="width-90vw-sm rounded-2-sm m-auto bg-white box-shadow-style-2"
              style={{
                display: currentProduct === 1 ? 'block' : 'none',
              }}
              id="product1Imgsm"
            >
              <LinkContainer to="/order/1">
                <img
                  alt=""
                  className="width-90vw-sm height-60vw-sm image-cover rounded-2-sm"
                  src={media.pepcool}
                />
              </LinkContainer>
              <div className="padding-style-19-sm d-flex justify-content-between">
                <div className="d-flex flex-column justify-content-between">
                  <div className="font-size-13-sm font-gilroy pt-2 pb-0">Pepcool</div>
                  <div className="font-size-7-sm font-lexenddeca">
                    A plate of ponmo and
                    <br />
                    a can of coke
                  </div>
                </div>
                <div className="d-flex flex-column justify-content-between gap-3 padding-style-20-sm">
                  <div className="font-size-9-sm font-gilroy text-end">
                    <i className="fa fa-naira-sign" />
                    1500
                  </div>
                  <div className="font-size-7-sm font-lexenddeca">
                    <p className="text-end">Add to cart</p>
                    <span className="margin-top-5">
                      <button type="button" className="width-10vw-sm height-10vw-sm bg-red color-white product-control border-width-2 border-solid border-color-white font-size-7-sm fw-bold rounded-left-3" onClick={() => { dispatch(decreaseProduct1Amount()); }}>-</button>
                      <button type="button" className="width-10vw-sm height-10vw-sm border-width-2 border-solid border-color-white font-size-7-sm fw-bold bg-red color-white">{amount1}</button>
                      <button type="button" className="width-10vw-sm height-10vw-sm bg-red color-white product-control border-width-2 border-color-white border-solid font-size-7-sm fw-bold rounded-right-3" onClick={() => { dispatch(increaseProduct1Amount()); }}>+</button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="width-90vw-sm rounded-2-sm m-auto bg-white box-shadow-style-2"
              style={{
                display: currentProduct === 2 ? 'block' : 'none',
              }}
              id="product2Imgsm"
            >
              <LinkContainer to="/order/2">
                <img
                  alt=""
                  className="width-90vw-sm height-60vw-sm image-cover rounded-2-sm"
                  src={media.pepchill}
                />
              </LinkContainer>
              <div className="padding-style-19-sm d-flex justify-content-between">
                <div className="d-flex flex-column justify-content-between">
                  <div className="font-size-13-sm font-gilroy pt-2 pb-0">Pepchill</div>
                  <div className="font-size-7-sm font-lexenddeca">
                    A plate of ponmo and
                    <br />
                    two cans of heineken
                  </div>
                </div>
                <div className="d-flex flex-column justify-content-between gap-3 padding-style-20-sm">
                  <div className="font-size-9-sm font-gilroy text-end">
                    <i className="fa fa-naira-sign" />
                    2000
                  </div>
                  <div className="font-size-7-sm font-lexenddeca">
                    <p className="text-end">Add to cart</p>
                    <span className="margin-top-5">
                      <button type="button" className="width-10vw-sm height-10vw-sm bg-red color-white product-control border-width-2 border-solid border-color-white font-size-7-sm fw-bold rounded-left-3" onClick={() => { dispatch(decreaseProduct2Amount()); }}>-</button>
                      <button type="button" className="width-10vw-sm height-10vw-sm border-width-2 border-solid border-color-white font-size-7-sm fw-bold bg-red color-white">{amount2}</button>
                      <button type="button" className="width-10vw-sm height-10vw-sm bg-red color-white product-control border-width-2 border-color-white border-solid font-size-7-sm fw-bold rounded-right-3" onClick={() => { dispatch(increaseProduct2Amount()); }}>+</button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="padding-style-21-sm d-flex justify-content-between font-sora position-absolute bottom-0 width-100">
              <button
                type="button"
                className="width-17vw-sm bg-none border-width-0"
                onClick={() => {
                  const product2 = document.getElementById('product2Imgsm');
                  product2.classList.add('swipe-right');
                  setTimeout(() => {
                    setCurrentProduct(1);
                    product2.classList.remove('swipe-right');
                  }, 250);
                }}
                disabled={currentProduct === 1}
              >
                <i className="fa fa-arrow-left-long margin-right-1" />
                <p>Previous</p>
              </button>
              <div className=" d-flex justify-content-end align-items-center">
                <div
                  className="carousel-indicator margin-right-2-sm"
                  style={{
                    backgroundColor: currentProduct === 1 ? 'white' : 'gray',
                  }}
                />
                <div
                  className="carousel-indicator"
                  style={{
                    backgroundColor: currentProduct === 2 ? 'white' : 'gray',
                  }}
                />
              </div>
              <button
                type="button"
                className="width-17vw-sm bg-none border-width-0"
                onClick={() => {
                  const product1 = document.getElementById('product1Imgsm');
                  product1.classList.add('swipe-left');
                  setTimeout(() => {
                    setCurrentProduct(2);
                    product1.classList.remove('swipe-left');
                  }, 250);
                }}
                disabled={currentProduct === 2}
              >
                <i className="fa fa-arrow-right-long margin-left-1" />
                <p>Next</p>
              </button>
            </div>
          </div>
        </section>
        <section className="padding-style-13-sm justify-content-start-sm padding-style-29 font-sora height-max-content min-height-100vh width-100 d-flex flex-column justify-content-center align-items-center">
          <div className="margin-type-2-sm d-flex justify-content-center align-items-center">
            <h2 className="font-size-11-sm font-size-5 fw-bold">How</h2>
            <img
              alt=""
              className="margin-type-1-sm height-10vw-sm width-auto height-6 margin-type-0"
              src={media.logo}
            />
            <h2 className="font-size-11-sm font-size-5 fw-bold">works</h2>
          </div>
          <div className="margin-top-0-sm flex-column-sm align-items-center-sm w-100 margin-top-1 padding-style-3 d-flex">
            <div className="width-50vw-sm width-8 padding-style-3 d-flex flex-column align-items-center">
              <div className="width-35vw-sm height-35vw-sm position-relative rounded-circle padding-style-3 width-15vw height-13 bg-yellow d-flex justify-content-center align-items-center">
                <img className="width-60 height-auto" src={media.as} alt="" />
                <div className="font-size-9-sm height-12vw-sm width-12vw-sm font-size-7 top-0 right-0 position-absolute padding-style-3 bg-red fw-bold color-white rounded-circle height-6 width-3 d-flex justify-content-center align-items-center">
                  1
                </div>
                <div className="d-none-sm translateXPlus100YMinus50 top-50 right-0 position-absolute height-14 width-100 border-pack-7 d-flex align-items-center">
                  <i className="fa-solid fa-greater-than color-red font-size-11 width-83 text-end" />
                </div>
              </div>
              <div className="text-center">
                <h2 className="margin-top-1-sm font-size-13-sm font-size-4 margin-top-1">
                  You order
                  <br />
                  from&nbsp;your&nbsp;device
                </h2>
              </div>
              <div className="d-flex-sm d-none align-items-center width-100 flex-column my-4">
                <div className="height-15vw-sm width-3vw-sm border-pack-9" />
                <i className="fa-solid fa-arrow-down color-red font-size-8-sm" />
              </div>
            </div>
            <div className="width-50vw-sm width-8 padding-style-3 d-flex flex-column align-items-center">
              <div className="width-35vw-sm height-35vw-sm position-relative rounded-circle padding-style-3 width-15vw height-13 bg-yellow d-flex justify-content-center align-items-center">
                <img className="flip-x width-80 height-auto" src={media.as4} alt="" />
                <div className="font-size-9-sm height-12vw-sm width-12vw-sm font-size-7 top-0 right-0 position-absolute padding-style-3 bg-red fw-bold color-white rounded-circle height-6 width-3 d-flex justify-content-center align-items-center">
                  2
                </div>
                <div className="d-none-sm translateXPlus100YMinus50 top-50 right-0 position-absolute height-14 width-100 border-pack-7 d-flex align-items-center">
                  <i className="fa-solid fa-greater-than color-red font-size-11 width-83 text-end" />
                </div>
              </div>
              <div className="text-center">
                <h2 className="margin-top-1-sm font-size-13-sm font-size-4 margin-top-1">
                  Free&nbsp;delivery
                </h2>
              </div>
              <div className="d-flex-sm d-none align-items-center width-100 flex-column my-4">
                <div className="height-15vw-sm width-3vw-sm border-pack-9" />
                <i className="fa-solid fa-arrow-down color-red font-size-8-sm" />
              </div>
            </div>
            <div className="margin-bottom-4-sm width-50vw-sm width-8 padding-style-3 d-flex flex-column align-items-center">
              <div className="width-35vw-sm height-35vw-sm position-relative rounded-circle padding-style-3 width-15vw height-13 bg-yellow d-flex justify-content-center align-items-center">
                <img className="width-60 height-auto" src={media.as2} alt="" />
                <div className="font-size-9-sm height-12vw-sm width-12vw-sm font-size-7 top-0 right-0 position-absolute padding-style-3 bg-red fw-bold color-white rounded-circle height-6 width-3 d-flex justify-content-center align-items-center">
                  3
                </div>
              </div>
              <div className="text-center">
                <h2 className="margin-top-1-sm font-size-13-sm font-size-4 margin-top-1">
                  You enjoy,
                  <br />
                  you repeat
                </h2>
              </div>
            </div>
            <div>
              <button
                type="button"
                id="orderButton"
                className="d-block-sm font-size-7-sm rounded-1-sm margin-top-1-sm padding-style-14-sm bg-red d-none color-white border-width-0 outline-0 rounded-1 font-size-2 margin-top-1 margin-bottom-1 padding-style-25 d-flex align-items-center"
                onClick={() => {
                  navigate('/order/1');
                }}
              >
                Order now
                <i className="fa fa-arrow-right margin-left-1-sm font-size-4-sm margin-left-1 font-size-6" />
              </button>
            </div>
          </div>
          <div>
            <button
              type="button"
              id="orderButton"
              className="d-none-sm font-size-7-sm rounded-1-sm margin-top-1-sm padding-style-14-sm bg-red color-white border-width-0 outline-0 rounded-1 font-size-2 margin-top-1 margin-bottom-1 padding-style-25 d-flex align-items-center"
              onClick={() => {
                navigate('/order/1');
              }}
            >
              Order now
              <i className="fa fa-arrow-right margin-left-1-sm font-size-4-sm margin-left-1 font-size-6" />
            </button>
          </div>
        </section>
        <section className="font-sora bg-light-brown color-white d-flex justify-content-center align-items-center height-100vh width-100 padding-style-1-sm">
          <div className="phone-img height-100 d-flex align-items-center justify-content-end-sm">
            <img
              alt=""
              className="rotate width-30-sm height-auto-sm height-70 width-auto"
              src={media.phone}
            />
          </div>
          <div className="padding-style-17-sm font-size-12-sm color-black fw-bold font-lexenddeca font-size-9 padding-style-27 height-100 d-flex align-items-center">
            Mobile app
            <br />
            coming soon
          </div>
        </section>
      </main>
      <footer className="padding-style-1-sm height-max-content padding-style-33 bg-black-1 d-flex justify-content-between align-items-center width-100">
        <div>
          <img
            alt=""
            className="height-9vw-sm width-auto height-5"
            src={media.favicon}
          />
          <img
            alt=""
            className="height-9vw-sm margin-left-1-sm width-auto height-5 margin-left-1"
            src={media.logo}
          />
        </div>
        <div>
          <nav className="flex-column-sm align-items-end-sm d-flex">
            <LinkContainer to="/contact">
              <button type="button" className="font-size-6-sm margin-right-0-sm hover-green border-width-0 outline-0 bg-none font-size-3 color-white margin-right-2">Contact us</button>
            </LinkContainer>
          </nav>
        </div>
      </footer>
    </div>
  );
}

App.propTypes = {
  link: PropTypes.string,
};

App.defaultProps = {
  link: '',
};

export default App;
