'use client'

import React from 'react'
import Image from 'next/image'

const Footer = () => {
  return (
    <div id="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <Image
              src="/images/autofinrent-logo.svg"
              width={100}
              height={50}
              alt="Logo"
              className="img-fluid logo mb-3"
            />
            <hr className="w-100" style={{ height: '2px' }} />
            <div className="d-block d-sm-block d-md-none mb-3">
              <p className="text-white mb-2">Descarga la App:</p>
              <Image
                src="/images/google-play.png"
                width={100}
                height={50}
                alt="Google Play"
                className="img-fluid w-50"
              />
              <br />
              <Image src="/images/appstore.png" width={100} height={50} alt="App Store" className="img-fluid w-50" />
            </div>
            <div className="row align-items-center">
              <div className="col-6">
                <p className="mb-0 text-white">Síguenos en:</p>
                <Image src="/images/facebook.png" width={30} height={30} alt="Facebook" className="img-fluid p-1" />
                <Image src="/images/instagram.png" width={30} height={30} alt="Instagram" className="img-fluid p-1" />
              </div>
              <div className="col-6">
                <p className="mb-0 text-white text-end">
                  <a href="#" className="text-white text-decoration-none">
                    Aviso de Privacidad
                  </a>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <a href="#" className="text-white text-decoration-none">
                    Términos y Condiciones
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 offset-lg-1">
            <div className="d-none d-sm-none d-md-block">
              <p className="text-white mb-2">Descarga la App:</p>
              <Image
                src="/images/google-play.png"
                width={100}
                height={50}
                alt="Google Play"
                className="img-fluid w-50"
              />
              <br />
              <Image src="/images/appstore.png" width={100} height={50} alt="App Store" className="img-fluid w-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
