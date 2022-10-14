/* global bootstrap, PaystackPop, FlutterwaveCheckout */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  product1Amount,
  product2Amount,
  PRICE1,
  PRICE2,
  decreaseProduct1Amount,
  increaseProduct1Amount,
  increaseProduct2Amount,
  decreaseProduct2Amount,
  setTransactionRef,
  setTransactionError,
  setTransactionErrorMessage,
  setProductAmounts,
} from '../../redux/cartSlice';
import { images } from '../../redux/imageSlice';
import './checkout.css';

export default function Checkout() {
  const amount1 = useSelector(product1Amount);
  const amount2 = useSelector(product2Amount);
  const price1 = useSelector(PRICE1);
  const price2 = useSelector(PRICE2);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pictures = useSelector(images);

  const [firstName, setFirstName] = useState(localStorage.getItem('form-first-name') || '');
  const [lastName, setLastName] = useState(localStorage.getItem('form-last-name') || '');
  const [phone, setPhone] = useState(localStorage.getItem('form-phone') || '');
  const [influencerCode, setInfluencerCode] = useState(localStorage.getItem('influencerCode') || '');
  const [email, setEmail] = useState(localStorage.getItem('form-email') || '');
  const [address, setAddress] = useState(localStorage.getItem('form-address') || '');
  const [route, setRoute] = useState(localStorage.getItem('form-route') || '');
  const [currentField, setCurrentField] = useState('');
  const [paymentPlatform, setPaymentPlatform] = useState('paystack');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(0);
  const [routes, setRoutes] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(0);

  const alimoshoRoutes = [
    'Akowonjo',
    'Ayobo',
    'Egbe',
    'Egbeda',
    'Idimu',
    'Igando',
    'Ikotun',
    'Isheri',
    'Iyana Ipaja',
  ];
  const ikejaRoutes = [
    'Agidingbi',
    'Akiodo',
    'Alausa',
    'GRA',
    'Magodo',
    'Maryland',
    'Ogba',
    'Ojodu',
    'Opebi',
    'Oregun',
  ];
  const [lga, setLGA] = useState(localStorage.getItem('form-lga') || 'alimosho');

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 250);
    setRoutes(lga === 'alimosho' ? alimoshoRoutes : ikejaRoutes);
  }, []);

  const validateEmail = (e) => String(e)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

  const inputChanged = (e) => {
    switch (e.target.id) {
      case 'firstName': {
        setFirstName(e.target.value);
        break;
      }
      case 'lastName': {
        setLastName(e.target.value);
        break;
      }
      case 'phone': {
        const allowedValues = ['+', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let match = true;
        Array.from(e.target.value).forEach((char) => {
          if (allowedValues.indexOf(char) < 0) match = false;
        });
        if (match) setPhone(e.target.value);
        break;
      }
      case 'email': {
        setEmail(e.target.value);
        break;
      }
      case 'address': {
        setAddress(e.target.value);
        break;
      }
      case 'route': {
        setRoute(e.target.value);
        break;
      }
      case 'influencerCode': {
        setInfluencerCode(e.target.value.toString().toUpperCase());
        break;
      }
      default: break;
    }
  };

  const processPayment = async (res, modal) => {
    setLoading(true);
    let result;
    if (paymentPlatform === 'flutterwave') {
      if (res.status === 'successful') {
        result = await fetch('https://pepperish.com.ng/confirmOrder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            response: res,
            orderId,
            platform: 'flutterwave',
          }),
        });
        modal.close();
      }
    } else if (paymentPlatform === 'paystack') {
      if (res.status === 'success') {
        result = { success: false };
        while (!result.success) {
          // eslint-disable-next-line no-await-in-loop
          result = await fetch('https://pepperish.com.ng/confirmOrder', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              response: res,
              orderId,
              platform: 'paystack',
            }),
          });
          // eslint-disable-next-line no-await-in-loop
          result = await result.json();
          if (result.error) break;
        }
      }
    }

    dispatch(setTransactionRef(res.reference || res.transaction_id));
    if (result.error) {
      dispatch(setTransactionError(true));
      dispatch(setTransactionErrorMessage(result.error));
    } else if (result.success) {
      dispatch(setTransactionError(false));
    }
    localStorage.setItem('amount1', amount1);
    localStorage.setItem('amount2', amount2);
    setLoading(false);
    navigate('/finished');
  };

  const payWithPaystack = () => {
    const handler = PaystackPop.setup({
      key: 'pk_live_ff1bd979ae4915ed4605b98c3046aa5361bfe61e',
      // key: 'pk_test_85e012167787ab43a91b770d075f4c289b92d04c',
      email,
      amount: (amount1 * price1 + amount2 * price2 + deliveryFee) * 100,
      currency: 'NGN',
      metadata: {
        orderId,
      },
      first_name: firstName,
      last_name: lastName,
      phone,
      onClose: () => {
        if (email === 'admin@pepperish.ng') setEmail('');
      },
      callback: (res) => {
        processPayment(res);
      },
    });

    handler.openIframe();
  };

  const payWithFlutterwave = (txNum) => {
    const modal = FlutterwaveCheckout({
      public_key: 'FLWPUBK_TEST-41534f515798c437ec3a158faa779db7-X',
      tx_ref: `pepperish_payment_ref${txNum}`,
      amount: (amount1 * price1 + amount2 * price2 + deliveryFee),
      currency: 'NGN',
      payment_options: 'card, mobilemoneyghana, ussd',
      customer: {
        email,
        phone_number: `234${phone}`,
        name: `${firstName} ${lastName}`,
      },
      customizations: {
        title: 'Pepperish Foods',
        description: 'Distribution of peppery foods',
        logo: 'https://i.im.ge/2022/08/31/OEt2Z4.favicon.png',
      },
      callback: (payment) => {
        processPayment(payment, modal);
      },
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (amount1 === 0 && amount2 === 0) {
      const toast = new bootstrap.Toast(document.getElementById('emptyCartToast'));
      toast.show();
      return;
    }
    if (firstName.trim().length === 0) {
      setCurrentField('First Name');
      const toast = new bootstrap.Toast(document.getElementById('infoToast'));
      toast.show();
      document.getElementById('firstName').parentElement.scrollIntoView();
      setTimeout(() => {
        document.getElementById('firstName').focus();
      }, 1000);
      return;
    }
    if (lastName.trim().length === 0) {
      setCurrentField('Last Name');
      const toast = new bootstrap.Toast(document.getElementById('infoToast'));
      toast.show();
      document.getElementById('lastName').parentElement.scrollIntoView();
      setTimeout(() => {
        document.getElementById('lastName').focus();
      }, 1000);
      return;
    }
    if (phone.trim().length < 10) {
      setCurrentField('Enter a valid phone number');
      const toast = new bootstrap.Toast(document.getElementById('infoToast'));
      toast.show();
      document.getElementById('phone').parentElement.scrollIntoView();
      setTimeout(() => {
        document.getElementById('phone').focus();
      }, 1000);
      return;
    }
    if (route.trim().length === 0) {
      setCurrentField('Route');
      const toast = new bootstrap.Toast(document.getElementById('infoToast'));
      toast.show();
      document.getElementById('route').parentElement.scrollIntoView();
      setTimeout(() => {
        document.getElementById('route').focus();
      }, 1000);
      return;
    }
    if (address.trim().length === 0) {
      setCurrentField('Address');
      const toast = new bootstrap.Toast(document.getElementById('infoToast'));
      toast.show();
      document.getElementById('address').parentElement.scrollIntoView();
      setTimeout(() => {
        document.getElementById('address').focus();
      }, 1000);
      return;
    }
    setInfluencerCode(influencerCode.replaceAll(' ', ''));

    localStorage.setItem('form-first-name', firstName);
    localStorage.setItem('form-last-name', lastName);
    localStorage.setItem('form-route', route);
    localStorage.setItem('form-phone', phone);
    localStorage.setItem('form-email', email);
    localStorage.setItem('form-address', address);
    localStorage.setItem('form-lga', lga);

    setFirstName(firstName.trim());
    setLastName(lastName.trim());
    setRoute(route.trim());
    setPhone(phone.trim());
    setEmail(email.trim());
    setAddress(address.trim());

    if (!validateEmail(email)) {
      setEmail('admin@pepperish.ng');
    }

    setLoading(true);

    fetch('https://pepperish.com.ng/setOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        phone,
        address,
        route,
        influencerCode,
        date: new Date(),
        products: {
          product1: amount1,
          product2: amount2,
        },
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setOrderId(result.id);
        } else {
          if (result.error === 'closed') {
            const toast = new bootstrap.Toast(document.getElementById('shopClosedToast'));
            toast.show();
          }
          if (result.error === 'phone') {
            const toast = new bootstrap.Toast(document.getElementById('phoneErrorToast'));
            document.getElementById('phone').parentElement.focus();
            toast.show();
          }
          setLoading(false);
        }
      }).catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setDeliveryFee(lga === 'ikeja' ? 500 : 0);
  });

  useEffect(() => {
    if (orderId !== 0) {
      setLoading(false);
      if (paymentPlatform === 'paystack') payWithPaystack();
      else if (paymentPlatform === 'flutterwave') payWithFlutterwave(orderId);
    }
  }, [orderId]);

  const goToOrderPage = () => {
    setTimeout(() => {
      document.getElementById('orderButton').click();
    }, 1000);
    navigate('/');
  };

  const routeChanged = (e) => {
    switch (e.target.checked) {
      case true:
        setLGA('ikeja');
        setRoutes(ikejaRoutes);
        setDeliveryFee(500);
        break;
      case false:
        setLGA('alimosho');
        setRoutes(alimoshoRoutes);
        setDeliveryFee(0);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <header className="d-flex-sm position-sticky-sm border-none-sm z-index-12 bg-white2 padding-style-1-sm align-items-center-sm width-100 d-none top-0 justify-content-between flex-style-0 align-items-start padding-style-1 border-pack-2">
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
        </div>
      </header>
      <div id="checkoutPage" className="max-height-max-content-sm min-height-max-content-sm height-max-content-sm width-100 min-height-100vh max-height-100vh overflow-hidden">
        <div className="w-100 toast-container text-center position-fixed bottom-0 p-3 d-flex justify-content-center toast-sm">
          <div
            id="infoToast"
            className="toast m-0 width-max-content"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="font-size-7-sm toast-body d-flex align-items-center bg-yellow font-size-3 color-black fw-bold w-100 p-3 ">
              {`${currentField} - Input is Required!`}
            </div>
          </div>
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
          <div
            id="phoneErrorToast"
            className="toast m-0 width-max-content bg-none border-0"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="font-size-7-sm toast-body d-flex align-items-center bg-yellow font-size-3 color-black fw-bold w-100 p-3 ">
              The phone number provided is invalid!
            </div>
          </div>
          <div
            id="flutterWaveMsgToast"
            className="toast m-0 width-max-content bg-none border-0"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="font-size-7-sm toast-body d-flex align-items-center bg-yellow font-size-3 color-black fw-bold w-100 p-3 ">
              Flutterwave support coming soon
            </div>
          </div>
          <div
            id="shopClosedToast"
            className="toast m-0 width-max-content bg-none border-0"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="font-size-7-sm toast-body d-flex align-items-center bg-yellow font-size-3 color-black fw-bold w-100 p-3 ">
              We are no longer accepting orders for today
              <br />
              Come back tommorow
            </div>
          </div>
        </div>
        {
          loading ? (
            <div className="z-index-12 position-fixed top-0 width-100 height-100vh d-flex justify-content-center align-items-center bg-dimmed">
              <div className="lds-ellipsis">
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
              </div>
            </div>
          ) : null
        }
        <header className="d-none-sm position-sticky-sm border-none-sm z-index-12 bg-white2 padding-style-1-sm align-items-center-sm width-100 d-flex top-0 justify-content-between flex-style-0 align-items-start padding-style-1 border-pack-2">
          <LinkContainer to="/">
            <div className="d-flex cursor-pointer">
              <img
                alt=""
                className="width-auto height-5"
                src={pictures.favicon}
              />
              <img
                alt=""
                className="width-auto height-5 margin-left-1"
                src={pictures.logo}
              />
            </div>
          </LinkContainer>
          <div className="d-flex align-items-center">
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
          </div>
        </header>
        <main id="checkoutMain" className="height-max-content-sm d-flex height100-10">
          <div id="productsDiv" className="d-none-sm width-50vw height-100 bg-white padding-style-12 font-sora">
            <h3 className="padding-style-11 fw-bold font-size-7 margin-bottom-1">Cart</h3>
            {
              amount1 ? (
                <div id="checkoutCartProduct1" className="margin-bottom-1 bg-yellow width-100 padding-style-13 d-flex justify-content-between align-items-center font-size-3 fw-600">
                  <div className="d-flex align-items-center">
                    <button
                      title="Remove item from cart"
                      type="button"
                      className="padding-style-8-sm bg-none border-0 margin-right-2"
                      onClick={() => {
                        dispatch(setProductAmounts([0, amount2]));
                      }}
                    >
                      <i className="fa-solid fa-xmark font-size-8-sm" />
                    </button>
                    <img
                      alt=""
                      className="width-5vw height-auto me-3"
                      src={pictures.bag}
                    />
                    <div className="d-inline-flex flex-column">
                      <span>
                        Pepcool
                      </span>
                      <span className="margin-top-4">
                        <button type="button" className="checkout-control border-width-2 border-solid border-color-yellow width-2 height-3 font-size-1 fw-bold rounded-left-1" onClick={() => { dispatch(decreaseProduct1Amount()); }}>-</button>
                        <button type="button" className="border-width-2 border-solid border-color-yellow width-2 height-3 font-size-1 fw-bold">{amount1}</button>
                        <button type="button" className="checkout-control border-width-2 border-solid border-color-yellow width-2 height-3 font-size-1 fw-bold rounded-right-1" onClick={() => { dispatch(increaseProduct1Amount()); }}>+</button>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <i className="fa-solid fa-naira-sign" />
                    <span className="margin-left-2">{Number(amount1 * price1).toLocaleString()}</span>
                  </div>
                </div>
              ) : null
            }
            {
              amount2 ? (
                <div id="checkoutCartProduct2" className="margin-bottom-1 bg-yellow width-100 padding-style-13 d-flex justify-content-between align-items-center font-size-3 fw-600">
                  <div className="d-flex align-items-center">
                    <button
                      title="Remove item from cart"
                      type="button"
                      className="padding-style-8-sm bg-none border-0 margin-right-2"
                      onClick={() => {
                        dispatch(setProductAmounts([amount1, 0]));
                      }}
                    >
                      <i className="fa-solid fa-xmark font-size-8-sm" />
                    </button>
                    <img
                      alt=""
                      className="width-5vw height-auto me-3"
                      src={pictures.bag}
                    />
                    <div className="d-inline-flex flex-column">
                      <span>
                        Pepchill
                      </span>
                      <span className="margin-top-4">
                        <button type="button" className="checkout-control border-width-2 border-solid border-color-yellow width-2 height-3 font-size-1 fw-bold rounded-left-1" onClick={() => { dispatch(decreaseProduct2Amount()); }}>-</button>
                        <button type="button" className="border-width-2 border-solid border-color-yellow width-2 height-3 font-size-1 fw-bold">{amount2}</button>
                        <button type="button" className="checkout-control border-width-2 border-solid border-color-yellow width-2 height-3 font-size-1 fw-bold rounded-right-1" onClick={() => { dispatch(increaseProduct2Amount()); }}>+</button>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <i className="fa-solid fa-naira-sign" />
                    <span className="margin-left-2">{Number(amount2 * price2).toLocaleString()}</span>
                  </div>
                </div>
              ) : null
            }
            {
              (!amount1 && !amount2) ? (
                <div className="margin-left-3 font-size-3 padding-style-11" id="emptyCartText">
                  Your cart is empty
                  <button
                    type="button"
                    id="cartOrderButton"
                    className="bg-red color-white border-width-0 outline-0 rounded-1 font-size-2 margin-top-1 margin-bottom-1 padding-style-13 d-flex align-items-center"
                    onClick={goToOrderPage}
                  >
                    Order now
                    <i className="fa fa-arrow-right margin-left-3" />
                  </button>
                </div>
              ) : null
            }
          </div>
          <div id="paymentDiv" className="bg-white-sm padding-style-10-sm width-100vw-sm width-50vw padding-style-15 bg-light-brown overflow-y-scroll scroll-smooth">
            <div className="d-flex-sm flex-column d-none">
              <h3 className="font-size-8 padding-style-9 fw-bold margin-type-1 font-sora">Cart</h3>
              {
                amount1 ? (
                  <div className="rounded-2 font-sora margin-bottom-1 width-100 padding-style-10 font-size-3 fw-600">
                    <button
                      type="button"
                      className="padding-style-8-sm margin-bottom-2 rounded-3 border-0 font-size-5 d-flex align-items-center"
                      onClick={() => {
                        dispatch(setProductAmounts([0, amount2]));
                      }}
                    >
                      <i className="fa-solid fa-xmark font-size-8-sm me-2" />
                      remove from cart
                    </button>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <img
                          alt=""
                          className="width-20vw height-auto margin-right-5"
                          src={pictures.bag}
                        />
                        <div className="d-inline-flex flex-column font-size-9">
                          <span>
                            Pepcool
                          </span>
                          <span className="margin-top-4">
                            <button type="button" className="bg-white checkout-control border-width-2 border-solid width-7vw height-7 font-size-5 fw-bold rounded-left-1" onClick={() => { dispatch(decreaseProduct1Amount()); }}>-</button>
                            <button type="button" className="border-width-2 border-solid width-7vw height-7 font-size-5 fw-bold">{amount1}</button>
                            <button type="button" className="bg-white checkout-control border-width-2 border-solid width-7vw height-7 font-size-5 fw-bold rounded-right-1" onClick={() => { dispatch(increaseProduct1Amount()); }}>+</button>
                          </span>
                        </div>
                      </div>
                      <div className="text-right font-size-10">
                        <i className="fa-solid fa-naira-sign" />
                        <span className="margin-left-2">{Number(amount1 * price1).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ) : null
              }
              {
                amount2 ? (
                  <div className="rounded-2 font-sora margin-bottom-1 width-100 padding-style-10 font-size-3 fw-600">
                    <button
                      type="button"
                      className="padding-style-8-sm margin-bottom-2 rounded-3 border-0 font-size-5 d-flex align-items-center"
                      onClick={() => {
                        dispatch(setProductAmounts([amount1, 0]));
                      }}
                    >
                      <i className="fa-solid fa-xmark font-size-8-sm me-2" />
                      remove from cart
                    </button>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <img
                          alt=""
                          className="width-20vw height-auto margin-right-5"
                          src={pictures.bag}
                        />
                        <div className="d-inline-flex flex-column font-size-9">
                          <span>
                            Pepchill
                          </span>
                          <span className="margin-top-4">
                            <button type="button" className="bg-white checkout-control border-width-2 border-solid width-7vw height-7 font-size-5 fw-bold rounded-left-1" onClick={() => { dispatch(decreaseProduct2Amount()); }}>-</button>
                            <button type="button" className="border-width-2 border-solid width-7vw height-7 font-size-5 fw-bold">{amount2}</button>
                            <button type="button" className="bg-white checkout-control border-width-2 border-solid width-7vw height-7 font-size-5 fw-bold rounded-right-1" onClick={() => { dispatch(increaseProduct2Amount()); }}>+</button>
                          </span>
                        </div>
                      </div>
                      <div className="text-right font-size-10">
                        <i className="fa-solid fa-naira-sign" />
                        <span className="margin-left-2">{Number(amount2 * price2).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ) : null
              }
              {
                (!amount1 && !amount2) ? (
                  <div className="padding-style-24 fw-bold d-flex flex-column align-items-center" id="emptyCartText">
                    <i className="fa fa-circle-exclamation font-size-10-sm margin-bottom-2" />
                    <span>Your cart is empty</span>
                    <button
                      type="button"
                      id="cartOrderButton"
                      className="font-size-7-sm rounded-1-sm margin-top-1-sm padding-style-15-sm bg-red color-white border-width-0 outline-0 d-flex align-items-center"
                      onClick={goToOrderPage}
                    >
                      Order now
                      <i className="fa fa-arrow-right margin-left-3" />
                    </button>
                  </div>
                ) : null
              }
            </div>
            <form className="margin-top-2-sm font-size-9-sm font-size-3 fw-700" autoComplete="off" onSubmit={submitForm}>
              <h4 className="fw-bold font-size-8-sm font-size-7 margin-bottom-2 font-sora">Checkout</h4>
              <h6 className="font-size-7-sm margin-bottom-2-sm margin-bottom-1 font-size-4 font-sora">Delivery information</h6>
              <label htmlFor="firstName" className="padding-0-sm padding-style-16 width-100 margin-top-5 padding-style-21">
                First Name *
                <input id="firstName" maxLength={50} className="padding-style-9-sm border-pack-3 outline-0 padding-style-17 margin-top-5 width-100 rounded-3" value={firstName} onChange={inputChanged} />
              </label>
              <label htmlFor="lastName" className="padding-0-sm padding-style-16 width-100 margin-top-5 padding-style-21">
                Last Name *
                <input id="lastName" maxLength={50} className="padding-style-9-sm border-pack-3 outline-0 padding-style-17 margin-top-5 width-100 rounded-3" value={lastName} onChange={inputChanged} />
              </label>
              <label htmlFor="phone" className="padding-style-16 width-100 margin-top-5 padding-style-21">
                Phone number *
                <div className="input-group mb-3 border-pack-3 rounded-3 margin-top-5">
                  <span className="input-group-text px-2 font-size-9-sm font-size-3">+234</span>
                  <input id="phone" value={phone} maxLength={10} onChange={inputChanged} type="text" className="height-100 form-control padding-style-9-sm outline-0 padding-style-17 font-size-9-sm font-size-3" aria-describedby="basic-addon1" />
                </div>
              </label>
              <label htmlFor="email" className="padding-style-16 width-100">
                Email
                <input id="email" value={email} maxLength={50} onChange={inputChanged} className="padding-style-9-sm border-pack-3 outline-0 padding-style-17 margin-top-5 width-100 rounded-3" />
              </label>
              <label htmlFor="route" className="padding-style-16 width-100 margin-top-5 padding-style-21">
                Route *
                <div className="py-3">
                  <div className="d-flex align-items-center">
                    <p className="">Alimosho</p>
                    <label htmlFor="toggleSwitch" className="switch">
                      <input
                        id="toggleSwitch"
                        type="checkbox"
                        onChange={routeChanged}
                        checked={lga === 'ikeja'}
                      />
                      <span className="slider" />
                    </label>
                    <p className="">Ikeja</p>
                  </div>
                </div>
                <select id="route" className="padding-style-9-sm border-pack-3 outline-0 padding-style-17 margin-top-5 width-100 rounded-3" onChange={inputChanged} defaultValue={route || 'none'}>
                  <option value="none" disabled hidden>&nbsp;</option>
                  {
                    routes.map((a) => <option className="padding-style-17" key={a}>{a}</option>)
                  }
                </select>
              </label>
              <label htmlFor="address" className="width-100 margin-top-5 padding-style-21">
                Address *
                <textarea rows={3} id="address" value={address} onChange={inputChanged} className="padding-style-9-sm border-pack-3 outline-0 padding-style-17 margin-top-5 width-100 rounded-3" />
              </label>
              <label htmlFor="influencerCode" className="width-100 margin-top-5 padding-style-21">
                Influencer&apos;s Code
                <input id="influencerCode" placeholder="Optional" value={influencerCode} onChange={inputChanged} className="padding-style-9-sm border-pack-3 outline-0 padding-style-17 margin-top-5 width-100 rounded-3" />
              </label>
              <div className="bg-light-sm padding-style-8-sm margin-top-1-sm font-size-7-sm margin-top-1 padding-style-3 rounded-3 font-size-4 w-100 bg-yellow">
                <div className="d-flex width-100 justify-content-between align-items-center">
                  <span>Total cost</span>
                  <div className="margin-type-0-sm height-9 margin-type-0 bg-black flex-style-1" />
                  <span>
                    <i className="fa-solid fa-naira-sign margin-right-4" />
                  </span>
                  <div>{Number(amount1 * price1 + amount2 * price2).toLocaleString()}</div>
                </div>
                <div className="d-flex width-100 justify-content-between align-items-center">
                  <span>Delivery cost</span>
                  <div className="margin-type-0-sm height-9 margin-type-0 bg-black flex-style-1" />
                  <span>
                    <i className="fa-solid fa-naira-sign margin-right-4" />
                  </span>
                  <div>
                    {deliveryFee}
                  </div>
                </div>
                <div className="d-flex width-100 justify-content-between align-items-center">
                  <span>Amount to pay</span>
                  <div className="margin-type-0-sm height-9 margin-type-0 bg-black flex-style-1" />
                  <span>
                    <i className="fa-solid fa-naira-sign margin-right-4" />
                  </span>
                  <div>
                    {Number(amount1 * price1 + amount2 * price2 + deliveryFee).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column align-items-center justify-content-center padding-style-18">
                <div id="securePaymentContainer" className="border-pack-2-sm padding-style-10-sm border-pack-4 rounded-3 width-max-content font-size-3 padding-style-19">
                  {/* <p id="securePaymentsText" className="font-size-1-sm
                  font-size-2 fw-normal">Payments secured by</p> */}
                  {/* <img alt="" src="https://i.im.ge/2022/08/31/OEtsbp.paystack.png" className="height-5vw-sm height-10 w-auto" /> */}
                  <div className="d-flex">
                    <img alt="" src={pictures.mastercard} className="width-auto-sm height-5vw-sm width-3 height-auto margin-right-5" />
                    <img alt="" src={pictures.visa} className="width-auto-sm height-5vw-sm width-3 height-auto margin-right-5" />
                    <img alt="" src={pictures.verve} className="width-auto-sm height-5vw-sm width-3 height-auto" />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                id="paymentButton"
                className="m-auto font-size-8-sm rounded-1-sm padding-style-14-sm bg-red color-white border-width-0 outline-0 rounded-1 font-size-7 padding-style-25 d-flex align-items-center"
              >
                Pay
              </button>
              <div className="d-flex flex-column align-items-center justify-content-center mt-4">
                <p className="align-self-start mb-2">Choose payment provider</p>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentPlatform('paystack');
                  }}
                  id="paystackPay"
                  className="border-0 outline-0 width-100 py-3 d-flex align-items-center px-3"
                >
                  <input type="checkbox" checked={paymentPlatform === 'paystack'} readOnly />
                  <img alt="" src={pictures.paystack} className="width-35vw-sm ms-3 width-10vw height-auto d-inline-block" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // setPaymentPlatform('flutterwave');
                    const toast = new bootstrap.Toast(document.getElementById('flutterWaveMsgToast'));
                    toast.show();
                  }}
                  id="flutterwavePay"
                  className="border-0 outline-0 width-100 py-3 d-flex align-items-center px-3"
                >
                  <input type="checkbox" checked={paymentPlatform === 'flutterwave'} readOnly />
                  <img alt="" src={pictures.flutterwave} className="width-35vw-sm ms-3 width-10vw height-auto" />
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}
