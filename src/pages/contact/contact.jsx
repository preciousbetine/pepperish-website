/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { images } from '../../redux/imageSlice';
import './contact.css';

export default function ContactPage() {
  const pictures = useSelector(images);
  return (
    <div id="contactPage" className="height-100vh width-100">
      <div className="width-100">
        <header className="padding-style-1-sm align-items-center-sm width-100 d-flex justify-content-between flex-style-0 align-items-center padding-style-1 top-0">
          <LinkContainer to="/">
            <div className="d-flex cursor-pointer">
              <img alt="" src={pictures.favicon} className="height-9vw-sm width-auto height-5" />
              <img alt="" src={pictures.logo} className="height-9vw-sm margin-left-1-sm width-auto height-5 margin-left-1" />
            </div>
          </LinkContainer>
          <h5>Contact Us</h5>
        </header>
      </div>
      <div className="padding-style-1 width-100">
        <h2 className="font-size-9-sm font-size-4 margin-bottom-1">Contact us via the following channels</h2>
        <a href="mailto:admin@pepperish.ng" className="text-decoration-none">
          <p className="font-size-7-sm font-size-3 color-black">Send us a mail and we&apos;ll be happy to help</p>
          <h2 className="font-size-7-sm d-flex align-items-center mb-4 font-size-4">
            <i className="fa fa-envelope me-3 text-success" />
            <p className="color-black">admin@pepperish.ng</p>
          </h2>
        </a>
        <p className="font-size-7-sm font-size-3 color-black">Contact us via phone</p>
        <h2 className="font-size-7-sm d-flex align-items-center mb-2 font-size-4">
          <i className="fa-brands fa-whatsapp me-3 text-success" />
          <p>07017160160</p>
        </h2>
        <a href="tel:+2347017160160" className="text-decoration-none">
          <h2 className="font-size-7-sm d-flex align-items-center mb-2 font-size-4">
            <i className="fa fa-phone me-3 text-success" />
            <p className="color-black">07017160160</p>
          </h2>
        </a>

        <p className="font-size-7-sm font-size-3 color-black mt-4">Follow us on social media</p>
        <div className="font-size-8-sm font-size-5 mt-1">
          <a href="https://www.instagram.com/pepperish.ng" target="_blank" rel="noreferrer"><i className="fa-brands color-black fa-instagram margin-right-2" /></a>
          <a href="/"><i className="fa-brands color-black fa-facebook margin-right-2" /></a>
          <a href="/"><i className="fa-brands color-black fa-tiktok margin-right-2" /></a>
        </div>
      </div>
    </div>
  );
}
