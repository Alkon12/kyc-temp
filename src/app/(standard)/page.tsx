'use client'
import './../page.css'

import React, { useState } from 'react'
import Carousel from './components/Carousel'
import SlickCarouselComponent from './components/SlickCarouselComponent'
import CardsComponent from './components/CardsComponent'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { SliderShared } from './components/CarrucelMovil'
import VisitAppointmentModal from './components/VisitAppointmentModal'

const LoginModal = dynamic(() => import('./../../components/modals/LoginModal'), { ssr: false })

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showVisitAppointmentModal, setShowVisitAppointmentModal] = useState(false)
  

  const handleModalOpen = () => {
    setIsModalOpen(true)
    document.body.classList.add('modal-open')
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    document.body.classList.remove('modal-open')
  }

  const handleVisitModalClose = () => {
    setShowVisitAppointmentModal(false)
  }

  const openChatwootBubble = () => {
    console.log('test')

    // window.$chatwoot.setCustomAttributes({
    //   accountId: 1,
    //   pricingPlan: "paid",
    
    //   // Here the key which is already defined in custom attribute
    //   // Value should be based on type (Currently support Number, Date, String and Number)
    // });

    window.$chatwoot.toggle("open");
  }


  return (
    <div>
      <Carousel />
      <SliderShared />
      <div className="promobox my-5">
        <h3 className="text-white mb-3">¡Ven, disfruta de un café y descubre los beneficios financieros <br /> exclusivos para socios conductores Uber!</h3>
        <div className="d-flex justify-content-center">
          <a onClick={() => openChatwootBubble()}>
            <div className="join-button_us">
              Agenda tu Cita
            </div>
          </a>
        </div>
      </div>
      <div className="contenido pb-0">
        <section id="somos" className="container mb-5">
          <div className="row align-items-center">
            <div className="col-lg-5 offset-lg-1">
              <center>
                <Image
                  src="/images/renta-uber1.png"
                  className="img-fluid w-68"
                  width={800}
                  height={600}
                  alt="Renta Uber"
                />
              </center>
            </div>
            <div className="col-lg-6">
              <Image
                src="/images/conoce-autofinrent_1.png"
                className="img-fluid w-50"
                width={400}
                height={300}
                alt="Renta Uber Logo"
              />
              <p className="mt-5">
                Te presentamos un plan de arrendamiento exclusivo para ti, como Socio Conductor de Uber. Este plan ha
                sido diseñado como una solución integral para maximizar tus ganancias y optimizar tu experiencia de
                conducción.
              </p>
              <p className="mt-5">
                Con este esquema TODO INCLUIDO, tendrás acceso a vehículos nuevos, con renovación del auto al terminar
                el plazo, adaptándose a tus necesidades específicas y asegurando flexibilidad, comodidad y un enfoque
                centrado en tu éxito.
              </p>
            </div>
          </div>
        </section>
        <div className="clearfix py-3"></div>
        <section id="incluye" className="incluye contenido linear-gradient">
          <div className="container">
            <div className="titulo">
              La renta <strong className="verde-rent">incluye</strong>
            </div>
            <div className="square-info">
              <div className="mb-3">
                <div className="iconos p-3">
                  <Image
                    src="/images/auto-icono.png"
                    className="img-fluid w-25 mb-3"
                    width={50}
                    height={50}
                    alt="Auto Icono"
                  />
                  <p className="lead verde-rent mb-0">
                    <strong>Auto</strong>
                  </p>
                  <p className="text-white">
                    Nuevo.
                    <br />
                    &nbsp;
                  </p>
                </div>
              </div>
              <div className="mb-3">
                <div className="iconos p-3">
                  <Image
                    src="/images/renovacion-icono.png"
                    className="img-fluid w-25 mb-3"
                    width={50}
                    height={50}
                    alt="Renovación Icono"
                  />
                  <p className="lead verde-rent mb-0">
                    <strong>Renovación</strong>
                  </p>
                  <p className="text-white">de auto, al terminar el plazo.</p>
                  <div className="d-none d-sm-flex">&nbsp;</div>
                </div>
              </div>
              <div className="mb-3">
                <div className="iconos p-3">
                  <Image
                    src="/images/servicios-icono.png"
                    className="img-fluid w-25 mb-3"
                    width={50}
                    height={50}
                    alt="Servicios Icono"
                  />
                  <p className="lead verde-rent mb-0">
                    <strong>Mantenimiento</strong>
                  </p>
                  <p className="text-white">
                    exprés y servicio
                    <br />
                    TODO INCLUIDO.
                  </p>
                </div>
              </div>
              <div className="mb-3">
                <div className="iconos p-3">
                  <Image
                    src="/images/seguro-icono.png"
                    className="img-fluid w-25 mb-3"
                    width={50}
                    height={50}
                    alt="Seguro Icono"
                  />
                  <p className="lead verde-rent mb-0">
                    <strong>Seguro</strong>
                  </p>
                  <p className="text-white">
                    con cobertura amplia <br />
                    para plataforma.
                  </p>
                </div>
              </div>
              <div className="mb-3 max-w-xs">
                <div className="iconos p-3">
                  <Image
                    src="/images/gps-icono.png"
                    className="img-fluid w-25 mb-3"
                    width={50}
                    height={50}
                    alt="GPS Icono"
                  />
                  <p className="lead verde-rent mb-0">
                    <strong>GPS</strong>
                  </p>
                  <p className="text-white">
                    monitoreo y score de <br />
                    conducción.
                  </p>
                </div>
              </div>
              <div className="mb-3  max-w-80 max-h-44">
                <div className="iconos p-3">
                  <Image
                    src="/images/tramites-icono.png"
                    className="img-fluid w-25 mb-3"
                    width={50}
                    height={50}
                    alt="Tramites Icono"
                  />
                  <p className="lead verde-rent mb-0">
                    <strong>Trámites incluidos</strong>
                  </p>
                  <p className="text-white">
                    Tenencia y placas.
                    <br />
                    &nbsp;
                  </p>
                </div>
              </div>
              <div className="mb-3  max-w-80 max-h-44">
                <div className="iconos p-3">
                  <Image
                    src="/images/vial-icono.png"
                    className="img-fluid w-25 mb-3"
                    width={50}
                    height={50}
                    alt="Asistencia Vial Icono"
                  />
                  <p className="lead verde-rent mb-0">
                    <strong>Asistencia vial</strong>
                  </p>
                  <p className="text-white">
                    desde la App 24/7.
                    <br />
                    &nbsp;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="clearfix py-3"></div>
        <section id="tarifa" className="container py-5">
          <div className="fare-info">
            <div className="col-lg-10 offset-lg-1 fare">
              <div className="titulo-black">
                Tarifa semanal <strong className="verde-rent">dinámica</strong>
              </div>
              <p className="text-center">
                En el Plan de arrendamiento de Autofin Rent x Uber pagarás una renta semanal dinámica,
                <br /> basada en el uso del vehículo dentro de la plataforma. Funciona así:
              </p>
            </div>
          </div>
          <div className="fare-info">
            <div className="img-fare">
              <Image src="/images/renta-uber3.png" layout="responsive" width={800} height={600} alt="Renta Uber" />
            </div>
          </div>
        </section>
        <div className="clearfix py-3"></div>
        <section id="contrata" className="incluye contenido">
          <div className="titulos text-center mb-2 text-white lh-1">
            ¡<strong className="verde-rent">Contrata</strong> ya!
          </div>
          <p className="text-white text-center">Proceso de arrendamiento simple y rápido a través de nuestra App:</p>
          <div className="carrusel-card_mobil">
            <SlickCarouselComponent onLoginClick={handleModalOpen} />
          </div>
          <CardsComponent onLoginClick={handleModalOpen} />
        </section>
      </div>
      <LoginModal isOpen={isModalOpen} onClose={handleModalClose} />
      {/* Modal Visit Appointment */}
      {/* <VisitAppointmentModal isOpen={showVisitAppointmentModal} onClose={handleVisitModalClose} /> */}

      
      
      
    </div>
  )
}
