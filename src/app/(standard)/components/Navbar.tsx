'use client'

import React, { useEffect } from 'react'
import $ from 'jquery'
import Image from 'next/image'

const Navbar = () => {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min')

    const handleScroll = () => {
      if (window.scrollY >= 300) {
        $('#header').removeClass('bg-transparente').addClass('bg-rent')
      } else {
        $('#header').removeClass('bg-rent').addClass('bg-transparente')
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <nav id="header" className="navbar navbar-expand-lg navbar-light bg-transparente sticky">
      <div className="container py-3">
        <a className="navbar-brand" href="#">
          <Image
            src="/images/autofinrent-logo.svg"
            className="img-fluid logo-header"
            width={200}
            height={100}
            alt="Logo"
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link text-white" aria-current="page" href="#somos">
                SOMOS
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#incluye">
                LA RENTA INCLUYE
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#tarifa">
                TARIFA SEMANAL DINÁMICA
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#contrata">
                ¡CONTRATA YA!
              </a>
            </li>
          </ul>
          <a href="elige.html" className="rounded-pill px-5 py-3">
            ¡ÚNETE AHORA!
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
