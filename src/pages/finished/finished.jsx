/* global html2pdf */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  PRICE1,
  PRICE2,
  transactionRef,
  transactionError,
  transactionErrorMessage,
  setProductAmounts,
} from '../../redux/cartSlice';
import { images } from '../../redux/imageSlice';

export default function OrderPlaced() {
  const [messageToDisplay, setMessageToDisplay] = useState('');
  const [subMessage, setSubMessage] = useState('');
  const reference = useSelector(transactionRef);
  const error = useSelector(transactionError);
  const errorMessage = useSelector(transactionErrorMessage);
  const dispatch = useDispatch();
  const pictures = useSelector(images);

  const firstName = localStorage.getItem('form-first-name');
  const lastName = localStorage.getItem('form-last-name');
  const name = `${firstName} ${lastName}`;
  const address = localStorage.getItem('form-address');

  const amount1 = localStorage.getItem('amount1');
  const amount2 = localStorage.getItem('amount2');

  const product1Price = useSelector(PRICE1);
  const product2Price = useSelector(PRICE2);

  const totalAmount = amount1 * product1Price + amount2 * product2Price;
  const date = new Date();

  useEffect(() => {
    if (errorMessage === 'duplicateOrder') {
      setMessageToDisplay('This transaction is a duplicate.');
      setSubMessage(`Please contact support with Transaction Reference ${reference}`);
    }
    dispatch(setProductAmounts([0, 0]));
  }, []);

  const print2pdf = () => {
    const element = document.getElementById('finishedPage');
    const clone = element.cloneNode(true);
    const opt = {
      margin: 0,
      filename: 'pepperish_receipt.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' },
    };
    html2pdf(clone, opt);
  };

  return (
    <div id="finishedPage" className="height-100vh width-100">
      {
        (reference === null) ? (
          <Navigate replace to="/" />
        ) : (
          <div>
            {
              error ? (
                <>
                  <i className="font-size-8 margin-bottom-1 fa-solid fa-circle-exclamation" />
                  <span>
                    {messageToDisplay}
                    <br />
                    {subMessage}
                  </span>
                </>
              ) : (
                <div className="padding-style-5 d-flex flex-column align-items-center">
                  <LinkContainer to="/">
                    <div className="cursor-pointer d-flex flex-column align-items-center">
                      <img alt="" src={pictures.favicon} className="margin-top-2-sm height-17vw-sm height-7 width-auto margin-right-2" />
                      <img alt="" src={pictures.logo} className="height-9vw-sm height-4 width-auto" />
                    </div>
                  </LinkContainer>
                  <div className="font-size-6-sm margin-type-3 fw-bold d-flex align-items-center font-size-2">
                    <i className="fa-solid fa-star color-red" />
                    <span className="font-size-9-sm margin-type-0 font-size-7">RECEIPT</span>
                    <i className="fa-solid fa-star color-red" />
                  </div>
                  <div className="padding-style-16-sm flex-column-sm font-size-7-sm border-pack-6 padding-style-9 font-size-3 d-flex width-80 justify-content-between">
                    <span className="d-flex-sm">
                      <p className="fw-bold margin-right-2-sm">BILL&nbsp;TO:</p>
                      <p>{name}</p>
                    </span>
                    <span className="d-flex-sm padding-0-sm padding-style-22">
                      <p className="fw-bold margin-right-2-sm">SHIP&nbsp;TO:</p>
                      <p>{address}</p>
                    </span>
                    <span className="d-flex flex-column">
                      <span className="justify-content-start-sm d-flex justify-content-between">
                        <p className="fw-bold margin-right-2">RECEIPT&nbsp;NO:</p>
                        <p>{reference}</p>
                      </span>
                      <span className="d-flex">
                        <p className="fw-bold margin-right-2">RECEIPT&nbsp;DATE:</p>
                        <p>{date.toLocaleString()}</p>
                      </span>
                    </span>
                  </div>
                  <div className="margin-top-1-sm d-flex-sm justify-content-between p-2 fw-bold color-white d-none bg-green2 width-80">
                    <span className="d-inline-block text-center">DESCRIPTION</span>
                    <span className="d-inline-block text-end">AMOUNT</span>
                  </div>
                  <div className="d-none-sm bg-green2 margin-top-1 font-size-3 padding-style-3 fw-bold color-white width-80">
                    <span className="d-inline-block width-25">QTY</span>
                    <span className="d-inline-block width-25">DESCRIPTION</span>
                    <span className="d-inline-block width-25 text-center">UNIT PRICE</span>
                    <span className="d-inline-block width-25 text-end">AMOUNT</span>
                  </div>
                  {
                    amount1 > 0 ? (
                      <>
                        <div className="d-none-sm font-size-3 padding-style-3 width-80 fw-bold font-size-4">
                          <span className="d-inline-block width-25">{amount1}</span>
                          <span className="d-inline-block width-25">Pepcool</span>
                          <span className="d-inline-block width-25 text-center">
                            <i className="fa fa-naira-sign me-1" />
                            {Number(product1Price).toLocaleString()}
                          </span>
                          <span className="d-inline-block width-25 text-end">
                            <i className="fa fa-naira-sign me-1" />
                            {Number(product1Price * amount1).toLocaleString()}
                          </span>
                        </div>
                        <div className="d-flex-sm justify-content-between d-none width-80 fw-bold p-2">
                          <span>
                            Pepcool(
                            {amount1}
                            )
                          </span>
                          <span>
                            {Number(product1Price * amount1).toLocaleString()}
                          </span>
                        </div>
                        <div className="d-block-sm mt-2 border-pack-6 width-80 d-none height-4" />
                      </>
                    ) : null
                  }
                  {
                    amount2 > 0 ? (
                      <>
                        <div className="d-none-sm font-size-3 padding-style-3 width-80 fw-bold font-size-4">
                          <span className="d-inline-block width-25">{amount2}</span>
                          <span className="d-inline-block width-25">Pepchill</span>
                          <span className="d-inline-block width-25 text-center">
                            <i className="fa fa-naira-sign me-1" />
                            {Number(product2Price).toLocaleString()}
                          </span>
                          <span className="d-inline-block width-25 text-end">
                            <i className="fa fa-naira-sign me-1" />
                            {Number(product2Price * amount2).toLocaleString()}
                          </span>
                        </div>
                        <div className="d-flex-sm justify-content-between d-none width-80 fw-bold p-2">
                          <span>
                            Pepchill(
                            {amount2}
                            )
                          </span>
                          <span>
                            {Number(product2Price * amount2).toLocaleString()}
                          </span>
                        </div>
                        <div className="d-block-sm mt-2 border-pack-6 width-80 d-none height-4" />
                      </>
                    ) : null
                  }
                  <div className="d-none-sm width-80 padding-style-3 color-green2 fw-bold font-size-4">
                    <span className="d-inline-block width-25" />
                    <span className="d-inline-block width-25" />
                    <span className="d-inline-block width-25 text-center">
                      TOTAL
                    </span>
                    <span className="d-inline-block width-25 text-end">
                      <i className="fa fa-naira-sign me-1" />
                      {Number(totalAmount).toLocaleString()}
                    </span>
                  </div>
                  <div className="d-block-sm d-none width-80 color-green2 fw-bold font-size-9-sm">
                    <span className="d-inline-block width-25" />
                    <span className="d-inline-block width-25 text-center">
                      TOTAL
                    </span>
                    <span className="d-inline-block width-50 text-end">
                      <i className="fa fa-naira-sign me-1" />
                      {Number(totalAmount).toLocaleString()}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { print2pdf(); }}
                    className="margin-top-1-sm font-size-9-sm padding-style-18-sm btn rounded-pill font-size-4 padding-style-2 bg-green2 color-white"
                  >
                    Print
                  </button>
                </div>
              )
            }
          </div>
        )
      }
    </div>
  );
}
