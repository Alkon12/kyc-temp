'use client'

import React from 'react'
import Image from 'next/image'
import JoinUsButton from './JoinUsButton'

interface CardsComponentProps {
  onLoginClick: () => void
}

const CardsComponent: React.FC<CardsComponentProps> = ({ onLoginClick }) => {
  return (
    <div className="desktop-cards container">
      <div className="row bg-pasos">
        <div className="col-lg-3 mb-3">
          <Image
            src="/images/contrata1.png"
            layout="responsive"
            width={800}
            height={600}
            alt="Slide 1"
            className="img-fluid mt-5"
          />
        </div>
        <div className="col-lg-3 mb-3">
          <Image
            src="/images/contrata2.png"
            layout="responsive"
            width={800}
            height={600}
            alt="Slide 2"
            className="img-fluid mt-5"
          />
        </div>
        <div className="col-lg-3 mb-3">
          <Image
            src="/images/contrata3.png"
            layout="responsive"
            width={800}
            height={600}
            alt="Slide 3"
            className="img-fluid mt-5"
          />
        </div>
        <div className="col-lg-3 mb-3">
          <Image
            src="/images/contrata4.png"
            layout="responsive"
            width={800}
            height={600}
            alt="Slide 4"
            className="img-fluid mt-5"
          />
        </div>
      </div>
      <div className="clearfix py-3"></div>
      <center>
        <JoinUsButton onClick={onLoginClick} />
      </center>
    </div>
  )
}

export default CardsComponent
