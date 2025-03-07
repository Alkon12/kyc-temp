import React, { FC } from 'react'
import { IOffer } from '@/types/IOffer'
import { IUser } from '@type/IUser'
import Offer from './Offer'
import './offers.css'

export interface OffersProps {
  offers?: IOffer[]
  currentUser: IUser
}

const Offers: FC<OffersProps> = ({ currentUser, offers = [] }) => {
  return (
    <>
      {offers.length > 0 ? (
        <div className="container my-5">
          <p className="lead text-center mb-5">
            <strong>Nos alegra que nos visites. </strong>
            <br />
            Basándonos en tu perfil, hemos seleccionado estos autos para ti:
          </p>
          <div className="ofers-container">
            {offers.map((offer) => (
              <Offer key={offer.id} currentUser={currentUser} offer={offer} />
            ))}
          </div>
        </div>
      ) : (
        <div className="contenido">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 offset-lg-3">
                <div className="border p-3 rounded mb-4 center">
                  <center>
                    <img src="/images/icono-check.png" className="img-fluid mb-4" alt="Check Icon" />
                  </center>
                  <p className="lead text-center mb-4">
                    <strong>Estamos evaluando los detalles de tu solicitud</strong>
                    <br />
                    y queremos asegurarnos de ofrecerte
                    <br />
                    la mejor opción de auto.
                  </p>
                  <p className="lead text-center mb-4">
                    Mientras tanto, por favor, selecciona cómo prefieres
                    <br />
                    que nos pongamos en contacto contigo:
                  </p>
                  <div className="row align-items-center">
                    <div className="col-3 offset-2">
                      <div className="px-5">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault1"
                          />
                          <label className="form-check-label" htmlFor="flexRadioDefault1">
                            Llamada
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-1">
                      <center>
                        <img src="/images/divisor.png" className="img-fluid" alt="Divider" />
                      </center>
                    </div>
                    <div className="col-3">
                      <div className="px-0">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault2"
                            defaultChecked
                          />
                          <label className="form-check-label" htmlFor="flexRadioDefault2">
                            WhatsApp
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Offers
