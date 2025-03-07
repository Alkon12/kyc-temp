'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'

const Carousel = () => {
  /*useEffect(() => {
    const loadBootstrap = async () => {
      if (typeof window !== 'undefined') {
        //const bootstrap = await import('bootstrap/dist/js/bootstrap.bundle.min');
      }
    }
    loadBootstrap()
  }, [])*/

  return (
    <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
      </div>
      <div className="carousel-inner">
        <div className="carousel-item active" data-bs-interval="4000">
          <Image
            src="/images/carrusel/ARENT_Banner_3200.jpg"
            alt="Slide 1"
            layout="responsive"
            width={800}
            height={600}
            className="d-block w-100"
          />
        </div>
        <div className="carousel-item" data-bs-interval="4000">
          <Image
            src="/images/carrusel/ARENT_Banner_3500.jpg"
            alt="Slide 2"
            layout="responsive"
            width={800}
            height={600}
            className="d-block w-100"
          />
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  )
}

export default Carousel
