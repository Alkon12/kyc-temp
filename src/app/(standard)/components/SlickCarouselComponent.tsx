'use client'

import React from 'react'
import Slider from 'react-slick'
import Image from 'next/image'

interface SlickCarouselComponentProps {
  onLoginClick: () => void
}

const SlickCarouselComponent: React.FC<SlickCarouselComponentProps> = ({ onLoginClick }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  return (
    <div className="mobile-carousel container" style={{ padding: '0 90px' }}>
      <Slider {...settings} className="owl-carousel bg-pasos">
        <div className="item">
          <Image src="/images/contrata1.png" width={800} height={600} alt="Regístrate" className="img-fluid mt-5" />
        </div>
        <div className="item">
          <Image
            src="/images/contrata2.png"
            width={800}
            height={600}
            alt="Inicia tu solicitud"
            className="img-fluid mt-5"
          />
        </div>
        <div className="item">
          <Image
            src="/images/contrata3.png"
            width={800}
            height={600}
            alt="Realiza tu videollamada"
            className="img-fluid mt-5"
          />
        </div>
        <div className="item">
          <Image src="/images/contrata4.png" width={800} height={600} alt="Recibe tu auto" className="img-fluid mt-5" />
        </div>
      </Slider>
      <div className="clearfix py-3"></div>
      <center>
        <button onClick={onLoginClick} className="btn btn-success border border-white rounded-pill px-5 py-3">
          ¡ÚNETE AHORA!
        </button>
      </center>
    </div>
  )
}

export default SlickCarouselComponent
