'use client' // Añadir esta línea

import React from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

const OwlCarousel = dynamic(() => import('react-owl-carousel'), { ssr: true })

const OwlCarouselComponent = () => {
  const options = {
    loop: true,
    margin: 10,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        nav: true,
      },
      600: {
        items: 3,
        nav: false,
      },
      1000: {
        items: 4,
        nav: true,
        loop: false,
      },
    },
  }

  return (
    <div className="container">
      <OwlCarousel className="owl-theme" {...options}>
        <div className="item">
          <div className="img-fluid mt-5">
            <Image src="/images/contrata1.png" layout="responsive" width={800} height={600} alt="Slide 1" />
          </div>
        </div>
        <div className="item">
          <div className="img-fluid mt-5">
            <Image src="/images/contrata2.png" layout="responsive" width={800} height={600} alt="Slide 2" />
          </div>
        </div>
        <div className="item">
          <div className="img-fluid mt-5">
            <Image src="/images/contrata3.png" layout="responsive" width={800} height={600} alt="Slide 3" />
          </div>
        </div>
        <div className="item">
          <div className="img-fluid mt-5">
            <Image src="/images/contrata4.png" layout="responsive" width={800} height={600} alt="Slide 4" />
          </div>
        </div>
      </OwlCarousel>
      <div className="clearfix py-3"></div>
      <center>
        <button className="btn btn-success border border-white rounded-pill px-5 py-3">¡ÚNETE AHORA!</button>
      </center>
    </div>
  )
}

export default OwlCarouselComponent
