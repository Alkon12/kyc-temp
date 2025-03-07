import React, { useState, useEffect } from 'react'
import { useSwipeable } from 'react-swipeable'
import './slider.css'
import Image from 'next/image'

const images = [
  '/images/carrusel/ARENT_Banner-responsi_3500.jpg',
  '/images/carrusel/ARENT_Banner-responsi_3200.jpg',
]

export const SliderShared = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayTime, setDisplayTime] = useState(3500) // Tiempo que la imagen está mostrada (ajustado a 3 segundos)
  const [transitionTime, setTransitionTime] = useState(1500) // Tiempo de la transición

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, displayTime)

    return () => clearInterval(interval)
  }, [displayTime])

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length),
    onSwipedRight: () => setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length),
    trackMouse: true,
  })

  return (
    <div className="slider" {...handlers}>
      <div
        className="slider-wrapper"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: `transform ${transitionTime}ms ease-in-out`,
        }}
      >
        {images.map((src, index) => (
          <div key={index} className="slide">
            <Image src={src} alt={`Slide ${index + 1}`} width={600} height={700} layout="intrinsic" objectFit="cover" />
          </div>
        ))}
      </div>
    </div>
  )
}
