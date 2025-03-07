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
              <div className="d-flex justify-content-between">
                <div className="w-50 p-2">
                  <a href="https://bit.ly/4joqEiP" style={{ textDecoration: 'none' }}>
                    <Image
                      src="/images/google-play.png"
                      width={209}
                      height={64}
                      className="img-fluid"
                      alt="Google Play"
                    />
                  </a>
                </div>
                <div className="w-50 p-2">
                  <a href="https://apple.co/4h3MMgU" style={{ textDecoration: 'none' }}>
                    <Image src="/images/appstore.png" width={209} height={64} className="img-fluid" alt="App Store" />
                  </a>
                </div>
              </div>
            </div>
            <div className="d-flex flex-column flex-sm-row justify-content-between">
              <div className="d-flex flex-row flex-sm-column">
                <p className="mb-0 text-white">Síguenos en:</p>
                <div className="d-flex">
                  <a href="https://bit.ly/4jobnyE" style={{ textDecoration: 'none' }}>
                    <Image src="/images/facebook.png" width={50} height={50} alt="Facebook" className="img-fluid p-1" />
                  </a>
                  <a href="https://bit.ly/4gYjpN2" style={{ textDecoration: 'none' }}>
                    <Image
                      src="/images/instagram.png"
                      width={50}
                      height={50}
                      alt="Instagram"
                      className="img-fluid p-1"
                    />
                  </a>
                </div>
              </div>
              <div className="d-flex flex-column mt-3 mb-3 text-white text-sm-end">
                <a href="/noticeofPrivacy" className="text-white text-decoration-none">
                  Aviso de Privacidad
                </a>
                <a href="/termsandConditions" className="text-white text-decoration-none">
                  Términos y Condiciones
                </a>
                <a href="/legal" className="text-white text-decoration-none">
                  Legales
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-3 offset-lg-1">
            <div className="d-none d-sm-none d-md-block">
              <p className="text-white mb-2">Descarga la App:</p>
              <a href="https://bit.ly/4joqEiP" style={{ textDecoration: 'none' }}>
                <Image
                  src="/images/google-play.png"
                  width={100}
                  height={50}
                  alt="Google Play"
                  className="img-fluid w-50"
                />
              </a>
              <br />
              <a href="https://apple.co/4h3MMgU" style={{ textDecoration: 'none' }}>
                <Image src="/images/appstore.png" width={100} height={50} alt="App Store" className="img-fluid w-50" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
